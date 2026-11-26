"use client"

import * as React from "react"
import { SquareAsterisk, Settings } from "lucide-react"
import { Logo } from "@/components/logo"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { ModeToggle } from "./mode-toggle"

import { useAuth } from "@/hooks/use-auth"

const navItems = [
  {
    label: "",
    items: [
      {
        title: "Passwords",
        url: "/",
        icon: SquareAsterisk,
      },
      {
        title: "Settings",
        url: "#",
        icon: Settings,
        items: [
          { title: "User Settings", url: "/settings/user" },
          { title: "Account Settings", url: "/settings/account" },
          { title: "Plans & Billing", url: "/settings/billing" },
          { title: "Appearance", url: "/settings/appearance" },
          { title: "Notifications", url: "/settings/notifications" },
          { title: "Connections", url: "/settings/connections" },
        ],
      },
    ],
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { userInfo } = useAuth() ?? {}

  const displayName = (() => {
    if (!userInfo) return "User"
    const parts = [userInfo.first_name, userInfo.last_name].filter(Boolean)
    return parts.length > 0
      ? parts.join(" ")
      : userInfo.identifier.split("@")[0]
  })()

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Logo size={32} className="text-current" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">PawMan</span>
                <span className="truncate text-xs">Admin Dashboard</span>
              </div>
              <ModeToggle />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {navItems.map((item) => (
          <NavMain key={item.label} label={item.label} items={item.items} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: displayName,
            email: userInfo?.identifier ?? "",
            avatar: "",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  )
}
