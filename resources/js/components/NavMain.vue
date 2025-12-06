<script setup>
import { useRoute } from 'vue-router'
import { ChevronRight, LayoutDashboard, UserCog, Database, Earth } from 'lucide-vue-next'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from '@/components/ui/sidebar'

defineOptions({ name: 'SidebarRecursive' })

const props = defineProps({
  items: { type: Array, required: true },
})

const route = useRoute()

const iconMap = {
  'layout-dashboard': LayoutDashboard,
  'user-cog': UserCog,
  database: Database,
  earch: Earth,
}

const isItemActive = item => {
  if (item.code && item.code === route.name) return true
  if (item.childrens) return item.childrens.some(isItemActive)
  return false
}
</script>

<template>
  <SidebarMenu>
    <template v-for="item in items" :key="item.name">
      <Collapsible
        v-if="item.childrens && item.childrens.length"
        :default-open="isItemActive(item)"
      >
        <SidebarMenuItem>
          <CollapsibleTrigger as-child>
            <SidebarMenuButton class="group" :tooltip="item.name">
              <component :is="iconMap[item.icon]" v-if="item.icon" />
              <span>{{ item.name }}</span>
              <ChevronRight
                class="ml-auto transition-transform duration-200 group-data-[state=open]:rotate-90"
              />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              <SidebarRecursive :items="item.childrens" />
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
      <SidebarMenuItem v-else>
        <SidebarMenuButton as-child :tooltip="item.name" :is-active="isItemActive(item)">
          <RouterLink :to="{ name: item.code }">
            <component :is="iconMap[item.icon]" v-if="item.icon" />
            <span>{{ item.name }}</span>
          </RouterLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </template>
  </SidebarMenu>
</template>
