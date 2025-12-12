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
  Loader2, // <-- Import Loader Icon
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
} from "@/components/ui/sidebar"
import { useAuth } from "@/contexts/AuthContext"; 

// Define the Menu Structure for TEACHERS
const teacherNav = [
  { title: "Dashboard", url: "/dashboard/teacher", icon: HomeIcon },
  { title: "Assignments", url: "/assignment/teacher", icon: BookOpenIcon },
  { title: "Attendance", url: "/attendance/teacher", icon: CheckCheckIcon },
  { title: "Grades", url: "/grade/teacher", icon: GraduationCapIcon },
  { title: "Events", url: "/calendar/teacher", icon: CalendarIcon },
  { title: "Messages", url: "#", icon: MessageCircleIcon },
];

// Define the Menu Structure for PARENTS
const parentNav = [
  { title: "Dashboard", url: "/dashboard/parent", icon: HomeIcon },
  { title: "Assignments", url: "/assignment/parent", icon: BookOpenIcon },
  { title: "Attendance", url: "/attendance/parent", icon: CheckCheckIcon },
  { title: "Grades", url: "/grade/parent", icon: GraduationCapIcon },
  { title: "Events", url: "/calendar/parent", icon: CalendarIcon },
  { title: "Messages", url: "#", icon: MessageCircleIcon },
];

const teams = [
  {
    name: "EduConnect Portal",
    logo: SchoolIcon,
    plan: "Communication Portal",
  }
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // Get the current user, role, and loading state
  const { user, role, isLoading } = useAuth(); 

  // Select the correct navigation items based on the role
  const navItems = role === 'teacher' ? teacherNav : (role === 'parent' ? parentNav : []);

  // Construct the user object dynamically
  const userData = {
    name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || "User",
    email: user?.email || "No Email",
    avatar: "/images/Profile.jpg", 
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
      </SidebarHeader>
      <Separator orientation="horizontal" className="mr-2 data-[orientation=vertical]:h-4"/>
      
      <SidebarContent>
        {/* CRITICAL FIX: Show a loading spinner if the role hasn't been determined yet */}
        {isLoading ? (
            <div className="flex justify-center items-center h-full pt-4">
                <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
            </div>
        ) : (
            <NavMain items={navItems} />
        )}
      </SidebarContent>
      
      <Separator orientation="horizontal" className="mr-2 data-[orientation=vertical]:h-4"/>
      
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}