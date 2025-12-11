"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Users, Award, MessageSquare, Calendar, Trophy, Medal, GraduationCap, Loader2 } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { useAuth } from "@/contexts/AuthContext";
import { dashboardService, TeacherStats } from "@/services/dashboardService"; // Assuming you kept the TeacherStats interface

// Initial state matching the structure of TeacherStats
const initialStats: TeacherStats = {
    totalStudents: 0,
    honorStudents: 0,
    unreadMessages: 0,
    upcomingEvents: 0,
    academicDist: { highest: 0, high: 0, withHonor: 0, others: 0 }
};

export default function TeacherDashboard() {
  const router = useRouter();
  const { user, role, isLoading: authLoading } = useAuth();
  
  const [stats, setStats] = useState<TeacherStats>(initialStats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      if (user?.id && role === 'teacher') {
        try {
          const data = await dashboardService.getTeacherStats(user.id);
          setStats(data);
        } catch (e) {
          console.error("Error fetching teacher dashboard stats:", e);
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

  // --- Destructure for cleaner access to academic distribution data ---
  const { academicDist } = stats;

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 pt-2">
      <div className="mb-2">
        <h1 className="text-2xl font-bold">Welcome back!</h1>
        <p className="text-gray-500">Here is what's happening in your classes today.</p>
      </div>
      
      {/* 1. TOP SUMMARY CARDS (Matching Screenshot Design) */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        
        {/* Total Students */}
        <StatCard 
          title="Total Students" 
          value={stats.totalStudents} 
          subtitle="Across all sections"
          icon={Users} 
          iconColor="text-blue-500"
          actionLabel="View Details"
          onAction={() => router.push("/attendance/teacher")}
        />
        
        {/* Honor Students */}
        <StatCard 
          title="Honor Students" 
          value={stats.honorStudents} 
          subtitle="This Quarter"
          icon={Award} 
          iconColor="text-yellow-500"
          actionLabel="View Details"
          onAction={() => router.push("/grade/teacher")}
        />
        
        {/* Unread Messages (FIXED: Action Button Re-added) */}
        <StatCard 
          title="Unread Messages" 
          value={stats.unreadMessages} 
          subtitle="From Parents"
          icon={MessageSquare} 
          iconColor="text-blue-500"
          actionLabel="Read Messages" // Added back
          onAction={() => alert("Redirect to Messages page")} // Added action
        />
        
        {/* Upcoming Events */}
        <StatCard 
          title="Upcoming Events" 
          value={stats.upcomingEvents} 
          subtitle="This Month"
          icon={Calendar} 
          iconColor="text-red-500"
          actionLabel="View Details"
          onAction={() => router.push("/calendar/teacher")}
        />
      </div>

      {/* 2. ACADEMIC RECOGNITION SUMMARY */}
      <DashboardSection 
          title="Academic Recognition Summary" 
          subtitle="Students eligible for honor based on current performance"
      >
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
             
             {/* Highest Honor (Gold/Amber) */}
             <div className="flex flex-col items-center justify-center p-6 rounded-2xl gap-2 
                           bg-amber-900/10 text-amber-600 dark:bg-amber-900/20 dark:text-amber-500 
                           border border-amber-200 dark:border-amber-900/50">
                <Trophy className="h-8 w-8 mb-2" />
                <span className="text-3xl font-bold">{academicDist.highest}</span>
                <span className="font-semibold text-sm">Highest Honor</span>
                <span className="text-xs opacity-80">98% - 100%</span>
             </div>

             {/* High Honors (Purple/Indigo) */}
             <div className="flex flex-col items-center justify-center p-6 rounded-2xl gap-2 
                           bg-indigo-100/50 text-indigo-900 dark:bg-indigo-900/20 dark:text-indigo-400 
                           border border-indigo-200 dark:border-indigo-900/50">
                <Medal className="h-8 w-8 mb-2" />
                <span className="text-3xl font-bold">{academicDist.high}</span>
                <span className="font-semibold text-sm">High Honors</span>
                <span className="text-xs opacity-80">95% - 97%</span>
             </div>

             {/* Honors (Green/Emerald) */}
             <div className="flex flex-col items-center justify-center p-6 rounded-2xl gap-2 
                           bg-emerald-100/50 text-emerald-900 dark:bg-emerald-900/20 dark:text-emerald-500 
                           border border-emerald-200 dark:border-emerald-900/50">
                <GraduationCap className="h-8 w-8 mb-2" />
                <span className="text-3xl font-bold">{academicDist.withHonor}</span>
                <span className="font-semibold text-sm">Honors</span>
                <span className="text-xs opacity-80">90% - 94%</span>
             </div>

             {/* Other Students (Blue/Slate) */}
             <div className="flex flex-col items-center justify-center p-6 rounded-2xl gap-2 
                           bg-slate-100 text-slate-900 dark:bg-slate-800/50 dark:text-slate-400 
                           border border-slate-200 dark:border-slate-800">
                <Users className="h-8 w-8 mb-2" />
                <span className="text-3xl font-bold">{academicDist.others}</span>
                <span className="font-semibold text-sm">Other Students</span>
                <span className="text-xs opacity-80">Below 90%</span>
             </div>

         </div>
      </DashboardSection>
    </div>
  );
}