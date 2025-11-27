"use client"

import { LayoutDashboard, Lock, Workflow, LogOut } from "lucide-react"
import { usePathname } from "next/navigation"

import { useAuth } from "@/app/hooks/useAuth"
import { usePermissions } from "@/app/hooks/usePermissions"
import { PageId } from "@/api-config/types"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar"
import Link from "next/link"

// Menu items.
const items: {
  id: PageId;
  title: string;
  url: string;
  icon: typeof LayoutDashboard;
}[] = [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutDashboard,
      id: "dashboard",
    },
    {
      title: "Workflows",
      url: "/workflows",
      icon: Workflow,
      id: "workflows",
    },
    {
      title: "Access Control",
      url: "/access-control",
      icon: Lock,
      id: "access-control",
    },
  ]

export function AppSidebar() {
  const pathname = usePathname()
  const { currentUserData, logout, isLoggingOut } = useAuth()
  const { canAccessPage, isPermissionsLoading } = usePermissions(currentUserData?.data?.user?.role)

  // Filter items based on permissions
  const visibleItems = items.filter((item) => {
    if (isPermissionsLoading) return true // Show all while loading
    return canAccessPage(item.id)
  })

  const userEmail = currentUserData?.data?.user?.email

  const handleLogout = () => {
    logout()
  }

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleItems.map((item) => {
                const isActive = pathname === item.url
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center justify-between gap-2 px-2 py-4 border-t">
          <div className="flex flex-col flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{userEmail}</p>
          </div>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 w-9"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}