"use client"

import * as React from "react"
import {
  BookOpenIcon,
  CalendarIcon,
  CheckCheckIcon,
  GraduationCapIcon,
  HomeIcon,
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
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar"
import { useAuth } from "@/contexts/AuthContext"

const teams = [
  {
    name: "EduConnect Portal",
    logo: SchoolIcon,
    plan: "Communication Portal",
  },
]

const navItemsByRole = {
  teacher: [
    { title: "Dashboard", url: "/dashboard/teacher", icon: HomeIcon },
    { title: "Assignments", url: "/assignment/teacher", icon: BookOpenIcon },
    { title: "Grades", url: "/grade/teacher", icon: GraduationCapIcon },
    { title: "Attendance", url: "/attendance/teacher", icon: CheckCheckIcon },
    { title: "Events", url: "/calendar/teacher", icon: CalendarIcon },
  ],
  parent: [
    { title: "Dashboard", url: "/dashboard/parent", icon: HomeIcon },
    { title: "Assignments", url: "/assignment/parent", icon: BookOpenIcon },
    { title: "Grades", url: "/grade/parent", icon: GraduationCapIcon },
    { title: "Attendance", url: "/attendance/parent", icon: CheckCheckIcon },
    { title: "Events", url: "/calendar/parent", icon: CalendarIcon },
  ],
  public: [
    { title: "Dashboard", url: "/dashboard/parent", icon: HomeIcon },
    { title: "Assignments", url: "/assignment/parent", icon: BookOpenIcon },
    { title: "Grades", url: "/grade/parent", icon: GraduationCapIcon },
    { title: "Attendance", url: "/attendance/parent", icon: CheckCheckIcon },
    { title: "Events", url: "/calendar/parent", icon: CalendarIcon },
  ],
}

const user = {
  name: "Mr/Mrs Sinday",
  avatar: "/public/images/Profile.jpg",
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { role, isLoading } = useAuth()

  const navItems = React.useMemo(() => navItemsByRole[role] ?? navItemsByRole.public, [role])

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
      </SidebarHeader>
      <Separator orientation="horizontal" className="mr-2 data-[orientation=vertical]:h-4"/>
      <SidebarContent>
        {isLoading ? (
          <div className="space-y-2 p-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <SidebarMenuSkeleton key={index} showIcon />
            ))}
          </div>
        ) : (
          <NavMain items={navItems} />
        )}
      </SidebarContent>
      <Separator orientation="horizontal" className="mr-2 data-[orientation=vertical]:h-4"/>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
