"use client"

import * as React from "react"
import {
  BookOpenIcon,
  CalendarIcon,
  CheckCheckIcon,
  GraduationCapIcon,
  HomeIcon,
  MessageCircleIcon,
  SchoolIcon,
} from "lucide-react"
import { Separator } from "@/components/ui/separator";
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {

  teams: [
    {
      name: "EduConnect Portal",
      logo: SchoolIcon,
      plan: "Communication Portal",
    }
  ],

  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: HomeIcon,
      
    },
    {
      title: "Messages",
      url: "#",
      icon: MessageCircleIcon,
    },
    {
      title: "Grades",
      url: "#",
      icon: GraduationCapIcon,
    },
    {
      title: "Attendance",
      url: "#",
      icon: CheckCheckIcon,
    },
    {
      title: "Events",
      url: "#",
      icon: CalendarIcon,
    },
    {
      title: "Assignments",
      url: "#",
      icon: BookOpenIcon,
    },
  ],

  user: {
    name: "Mr/Mrs Sinday",
    avatar: "/public/images/Profile.jpg",
  },
  
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <Separator orientation="horizontal" className="mr-2 data-[orientation=vertical]:h-4"/>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <Separator orientation="horizontal" className="mr-2 data-[orientation=vertical]:h-4"/>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
