"use client";

import { useRouter } from "next/navigation";
import { TrendingUp, UserCheck, MessageSquare, Calendar, AlertCircle } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { RoleGuard } from "@/components/RoleGuard";

export default function ParentDashboard() {
  const router = useRouter();

  return (
    <RoleGuard allowedRole="parent">
    <div className="flex flex-1 flex-col gap-6 p-6 pt-2">
      
      {/* SUMMARY CARDS */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Grades" 
          value="89.60%" 
          subtitle="Current Quarter Average"
          icon={TrendingUp} 
          iconColor="text-purple-500"
          onAction={() => router.push("/grades")}
        />
        <StatCard 
          title="Attendance" 
          value="90%" 
          subtitle="This Quarter"
          icon={UserCheck} 
          iconColor="text-green-500"
          actionLabel="View Records"
          onAction={() => router.push("/attendance/parent")}
        />
        <StatCard 
          title="Unread Messages" 
          value="2" 
          subtitle="From Teachers"
          icon={MessageSquare} 
          iconColor="text-blue-500"
          actionLabel="Read Messages"
          onAction={() => router.push("/messages")}
        />
        <StatCard 
          title="Upcoming Events" 
          value="1" 
          subtitle="This Month"
          icon={Calendar} 
          iconColor="text-pink-500"
          actionLabel="View Events"
          onAction={() => router.push("/events")}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        
        {/* RECENT MESSAGES */}
        <DashboardSection 
            title="Recent Messages" 
            subtitle="Latest communications from teachers"
            onAction={() => router.push("/messages")}
        >
          <div className="flex flex-col gap-6">
            <div className="flex items-start gap-4">
               <Avatar className="h-10 w-10">
                  <AvatarImage src="/images/teacher1.jpg" />
                  <AvatarFallback>MR</AvatarFallback>
               </Avatar>
               <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                     <p className="font-semibold leading-none text-gray-900 dark:text-foreground">Ms. Rodriguez</p>
                     <span className="text-xs text-muted-foreground">1 day ago</span>
                  </div>
                  <div className="flex items-center justify-between">
                     <p className="text-sm text-muted-foreground">Grade Concern</p>
                     <Badge variant="destructive" className="text-[10px] px-1.5 py-0 h-5">New</Badge>
                  </div>
               </div>
            </div>

            <div className="flex items-start gap-4">
               <Avatar className="h-10 w-10">
                  <AvatarFallback>MZ</AvatarFallback>
               </Avatar>
               <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                     <p className="font-semibold leading-none text-gray-900 dark:text-foreground">Mr. Zafico</p>
                     <span className="text-xs text-muted-foreground">2 days ago</span>
                  </div>
                  <div className="flex items-center justify-between">
                     <p className="text-sm text-muted-foreground">Field Trip Permission</p>
                     <Badge variant="destructive" className="text-[10px] px-1.5 py-0 h-5">New</Badge>
                  </div>
               </div>
            </div>

             <div className="flex items-start gap-4">
               <Avatar className="h-10 w-10">
                  <AvatarFallback>MD</AvatarFallback>
               </Avatar>
               <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                     <p className="font-semibold leading-none text-gray-900 dark:text-foreground">Mrs. Duterte</p>
                     <span className="text-xs text-muted-foreground">3 days ago</span>
                  </div>
                  <div className="flex items-center justify-between">
                     <p className="text-sm text-muted-foreground">Science Project Update</p>
                     <Badge variant="destructive" className="text-[10px] px-1.5 py-0 h-5">New</Badge>
                  </div>
               </div>
            </div>
          </div>
        </DashboardSection>

        {/* UPCOMING EVENTS */}
        <DashboardSection 
            title="Upcoming Events" 
            subtitle="School calendar and important dates"
            onAction={() => router.push("/events")}
        >
           <div className="flex flex-col gap-6">
              
              {/* Event 1 */}
              <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full bg-blue-500 shadow-sm" />
                      <div>
                          <p className="font-semibold text-sm text-gray-900 dark:text-foreground">GPTA Meeting</p>
                          <p className="text-xs text-muted-foreground">September 20</p>
                      </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="rounded-full bg-gray-100 dark:bg-muted text-gray-600 dark:text-muted-foreground font-normal">Meeting</Badge>
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  </div>
              </div>

              {/* Event 2 */}
              <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full bg-green-500 shadow-sm" />
                      <div>
                          <p className="font-semibold text-sm text-gray-900 dark:text-foreground">Science Fair</p>
                          <p className="text-xs text-muted-foreground">September 25</p>
                      </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="rounded-full bg-gray-100 dark:bg-muted text-gray-600 dark:text-muted-foreground font-normal">Event</Badge>
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  </div>
              </div>

              {/* Event 3 */}
              <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full bg-red-500 shadow-sm" />
                      <div>
                          <p className="font-semibold text-sm text-gray-900 dark:text-foreground">Bonifacio Day</p>
                          <p className="text-xs text-muted-foreground">November 30</p>
                      </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="rounded-full bg-gray-100 dark:bg-muted text-gray-600 dark:text-muted-foreground font-normal">Holiday</Badge>
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  </div>
              </div>

           </div>
        </DashboardSection>

      </div>
    </div>
    </RoleGuard>
  );
}