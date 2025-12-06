<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Command } from 'lucide-vue-next'
import NavMain from '@/components/NavMain.vue'
import NavUser from '@/components/NavUser.vue'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar'
import { useAuth } from '@/composables/useAuth'
import { useSystemMenuStore } from '@/stores/system-menu'

const props = defineProps({
  side: { type: String, required: false },
  variant: { type: String, required: false },
  collapsible: { type: String, required: false, default: 'icon' },
  class: { type: null, required: false },
})

const router = useRouter()

const { authStore } = useAuth()
const { systemMenus } = useSystemMenuStore()

const filterMenusByAccess = (menus, allowed, by = 'code') => {
  const pick = node => {
    const selfAllowed = allowed.has(by === 'id' ? node.id : node.code)
    const filteredChildren = (node.childrens || [])
      .map(pick)
      .filter(Boolean)
      .sort((a, b) => a.order - b.order)

    if (selfAllowed || filteredChildren.length) {
      return { ...node, childrens: filteredChildren }
    }
    return null
  }

  return (menus || [])
    .map(pick)
    .filter(Boolean)
    .sort((a, b) => a.order - b.order)
}

const promoteToFirstChildRoute = items => {
  const mapItem = node => {
    const children = (node.childrens || []).map(mapItem).filter(Boolean)

    const selfHasRoute = !!(node.code && router.hasRoute(node.code))
    let code = selfHasRoute ? node.code : null

    if (!code && children.length) {
      code = children[0].code || null
    }

    if (!code && !children.length) return null

    return { ...node, code, childrens: children }
  }

  return (items || []).map(mapItem).filter(Boolean)
}

const roleMenus = computed(() => authStore?.user?.role?.menus || [])
const allowedCodes = computed(() => new Set(roleMenus.value.map(m => m.code)))
const systemMenusFiltered = computed(() => {
  const filtered = filterMenusByAccess(systemMenus, allowedCodes.value, 'code')
  return promoteToFirstChildRoute(filtered)
})
</script>

<template>
  <Sidebar v-bind="props">
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" as-child>
            <a href="#">
              <div
                class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
              >
                <Command class="size-4" />
              </div>
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-semibold">Tiketux</span>
                <span class="truncate text-xs">PT Trans Berjaya Khatulistiwa</span>
              </div>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
        <NavMain :items="systemMenusFiltered" />
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter>
      <NavUser :user="authStore.user" />
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>
