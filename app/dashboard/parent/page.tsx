"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TrendingUp, UserCheck, MessageSquare, Calendar, AlertCircle, Loader2 } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { dashboardService, ParentStats } from "@/services/dashboardService";

export default function ParentDashboard() {
  const router = useRouter();
  const { user, role, isLoading: authLoading } = useAuth();
  
  // Initialize state with default values, matching the ParentStats interface
  const [stats, setStats] = useState<ParentStats>({
    gradeAverage: "Loading...",
    attendancePct: "Loading...",
    unreadMessages: 0,
    upcomingEventsCount: 0,
    upcomingEventsList: []
  });
  
  const [loading, setLoading] = useState(true);

  // --- DATA FETCHING ---
  useEffect(() => {
    async function loadStats() {
      if (user?.id && role === 'parent') {
        try {
          // Fetch data from the service
          const data = await dashboardService.getParentStats(user.id);
          setStats(data);
        } catch (e) {
          console.error("Error fetching parent dashboard stats:", e);
          // Set error/fallback state if fetch fails
          setStats(prev => ({ ...prev, gradeAverage: "N/A", attendancePct: "N/A" }));
        } finally {
          setLoading(false);
        }
      }
    }
    if (!authLoading) loadStats();
  }, [user, role, authLoading]);

  if (authLoading || loading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin h-8 w-8 text-blue-600" /></div>;
  }

  // --- Helper to format date for the event list ---
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { month: 'long', day: 'numeric' });
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 pt-2">
      <div className="mb-2">
         {/* Assuming your AuthContext can give us the user's full name, otherwise use email part */}
        <h1 className="text-2xl font-bold">Hello, {user?.email?.split('@')[0] || "Parent"}!</h1>
        <p className="text-gray-500">Welcome to your student overview.</p>
      </div>
      
      {/* 1. SUMMARY CARDS */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        
        {/* GRADES CARD (Connected to live data) */}
        <StatCard 
          title="Grades" 
          value={stats.gradeAverage} 
          subtitle="Current Quarter Average"
          icon={TrendingUp} 
          iconColor="text-purple-500"
          onAction={() => router.push("/grade/parent")}
        />
        
        {/* ATTENDANCE CARD (Connected to live data) */}
        <StatCard 
          title="Attendance" 
          value={stats.attendancePct} 
          subtitle="Days Present Percentage"
          icon={UserCheck} 
          iconColor="text-green-500"
          actionLabel="View Records"
          onAction={() => router.push("/attendance/parent")}
        />
        
        {/* UNREAD MESSAGES CARD (Placeholder value) */}
        <StatCard 
          title="Unread Messages" 
          value={stats.unreadMessages} 
          subtitle="From Teachers"
          icon={MessageSquare} 
          iconColor="text-blue-500"
          actionLabel="Read Messages"
          onAction={() => alert("Messaging feature is not yet linked.")}
        />
        
        {/* UPCOMING EVENTS CARD (Connected to live data) */}
        <StatCard 
          title="Upcoming Events" 
          value={stats.upcomingEventsCount} 
          subtitle="This Month"
          icon={Calendar} 
          iconColor="text-red-500"
          actionLabel="View Events"
          onAction={() => router.push("/calendar/parent")}
        />
      </div>

      {/* 2. BOTTOM SECTIONS: Messages and Events */}
      <div className="grid gap-6 md:grid-cols-2">
        
        {/* RECENT MESSAGES (STATIC DESIGN - Data not yet implemented) */}
        <DashboardSection 
          title="Recent Messages" 
          subtitle="Latest communications from teachers" 
          actionLabel="View All"
          onAction={() => alert("View All Messages")}
        >
           <div className="space-y-6">
              {/* Message Item 1 (STATIC) */}
              <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-blue-100 text-blue-600">MR</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">Ms. Rodriguez</p>
                      <p className="text-sm text-muted-foreground">Grade Concern - Math Quiz</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                      <span className="text-xs text-muted-foreground">1 day ago</span>
                      <Badge variant="destructive" className="text-[10px] px-1.5 py-0.5 h-auto">New</Badge>
                  </div>
              </div>
              {/* Message Item 2 (STATIC) */}
              <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-orange-100 text-orange-600">MZ</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">Mr. Zafico</p>
                      <p className="text-sm text-muted-foreground">Field Trip Permission Slip</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                      <span className="text-xs text-muted-foreground">2 days ago</span>
                      <Badge variant="destructive" className="text-[10px] px-1.5 py-0.5 h-auto">New</Badge>
                  </div>
              </div>
               {/* Message Item 3 (STATIC) */}
               <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-purple-100 text-purple-600">MD</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">Mrs. Duterte</p>
                      <p className="text-sm text-muted-foreground">Science Project Update</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                      <span className="text-xs text-muted-foreground">3 days ago</span>
                      <Badge variant="destructive" className="text-[10px] px-1.5 py-0.5 h-auto">New</Badge>
                  </div>
              </div>
           </div>
        </DashboardSection>

        {/* UPCOMING EVENTS (DYNAMIC LIST) */}
        <DashboardSection 
            title="Upcoming Events" 
            subtitle="School calendar and important dates" 
            actionLabel="View All" 
            onAction={() => router.push("/calendar/parent")}
        >
           <div className="space-y-6">
              
              {stats.upcomingEventsList.length === 0 ? (
                <div className="text-center text-gray-500 py-4">No upcoming events found for this month.</div>
              ) : (
                stats.upcomingEventsList.map((event: any) => (
                  <div key={event.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                          {/* Dynamic Color dot based on type */}
                          <div className={`h-3 w-3 rounded-full shadow-sm ${event.type === 'Exam' ? 'bg-blue-500' : event.type === 'Holiday' ? 'bg-red-500' : 'bg-green-500'}`} />
                          <div>
                              <p className="font-semibold text-sm text-gray-900 dark:text-foreground">{event.title}</p>
                              <p className="text-xs text-muted-foreground" suppressHydrationWarning>
                                {formatEventDate(event.start_date)}
                              </p>
                          </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* Use event.type for badge */}
                        <Badge variant="secondary" className="rounded-full bg-gray-100 dark:bg-muted text-gray-600 dark:text-muted-foreground font-normal">
                          {event.type}
                        </Badge>
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      </div>
                  </div>
                ))
              )}

           </div>
        </DashboardSection>
      </div>
    </div>
  );
}