"use client";

import * as React from "react";
import Image from "next/image";
import {
  IconDashboard,
  IconUsers,
  IconCalendarEvent,
  IconCreditCard,
  IconNews,
  IconChartBar,
  IconSettings,
  IconHelp,
  IconSearch,
} from "@tabler/icons-react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "John Zhou",
    email: "johnz@hydrationdevelopment.com",
    avatar: "/my-portfolio.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Members",
      url: "/dashboard/members",
      icon: IconUsers,
    },
    {
      title: "Events",
      url: "/dashboard/events",
      icon: IconCalendarEvent,
    },
    {
      title: "Subscriptions",
      url: "/dashboard/subscriptions",
      icon: IconCreditCard,
    },
    {
      title: "Content",
      url: "/dashboard/content",
      icon: IconNews,
    },
  ],
  navSecondary: [
    {
      title: "Analytics",
      url: "/dashboard/analytics",
      icon: IconChartBar,
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: IconSettings,
    },
    {
      title: "Help",
      url: "/dashboard/help",
      icon: IconHelp,
    },
  ],
  quickActions: [
    {
      name: "New Member",
      url: "/dashboard/members/new",
      action: "register",
    },
    {
      name: "Create Event",
      url: "/dashboard/events/new",
      action: "event",
    },
    {
      name: "Send Message",
      url: "/dashboard/content/new",
      action: "message",
    },
  ],
};

export function AppSidebar({
  userData,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  userData?: { name: string; email: string; avatar: string };
}) {
  // Use provided userData or fallback to default
  const user = userData || data.user;
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <Image
                  src="/logo-hd.svg"
                  alt="Hydration Development"
                  height={24}
                  width={24}
                />
                <span className="text-base font-semibold">Hydration OS</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* Quick Actions could be added here later */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
