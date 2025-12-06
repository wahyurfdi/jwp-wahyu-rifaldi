<script setup>
import { ref } from 'vue'
import { BadgeCheck, Bell, ChevronsUpDown, LogOut } from 'lucide-vue-next'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import Button from './ui/button/Button.vue'
import { useAuth } from '@/composables/useAuth'
import { getInitials } from '@/lib/utils'

const props = defineProps({
  user: { type: Object, required: false },
})

const { isMobile } = useSidebar()
const { logout, authStore } = useAuth()

const showLogoutDialog = ref(false)
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <SidebarMenuButton
            size="lg"
            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <Avatar class="h-8 w-8 rounded-lg">
              <AvatarImage :src="''" :alt="user?.full_name" />
              <AvatarFallback class="rounded-lg">{{ getInitials(user?.full_name) }}</AvatarFallback>
            </Avatar>
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-medium">{{ user?.full_name }}</span>
              <span class="truncate text-xs">{{ user?.role?.name ?? '' }}</span>
            </div>
            <ChevronsUpDown class="ml-auto size-4" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          class="w-[--reka-dropdown-menu-trigger-width] min-w-56 rounded-lg"
          :side="isMobile ? 'bottom' : 'right'"
          align="end"
          :side-offset="4"
        >
          <DropdownMenuLabel class="p-0 font-normal">
            <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar class="h-8 w-8 rounded-lg">
                <AvatarImage :src="''" :alt="user?.full_name" />
                <AvatarFallback class="rounded-lg">{{
                  getInitials(user?.full_name)
                }}</AvatarFallback>
              </Avatar>
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-semibold">{{ user?.full_name }}</span>
                <span class="truncate text-xs">{{ user?.role?.name ?? '' }}</span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <BadgeCheck />
              Account
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Bell />
              Notifications
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem :variant="'destructive'" @click="showLogoutDialog = true">
            <LogOut />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>

  <AlertDialog v-model:open="showLogoutDialog">
    <AlertDialogContent class="w-[450px] max-w-full">
      <AlertDialogHeader>
        <AlertDialogTitle>Log out of your account?</AlertDialogTitle>
        <AlertDialogDescription>
          You will be signed out and need to log in again to access your account.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <Button :variant="'outline'" @click="showLogoutDialog = false"> Cancel </Button>
        <Button @click="logout" :is-loading="authStore.logout.isLoading"> Continue </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
