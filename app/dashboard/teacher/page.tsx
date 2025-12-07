"use client";

import { useRouter } from "next/navigation";
import { Users, Award, MessageSquare, Calendar, Trophy, Medal, GraduationCap } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { DashboardSection } from "@/components/dashboard/DashboardSection";

export default function TeacherDashboard() {
  const router = useRouter();

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 pt-2">
      
      {/* SUMMARY CARDS */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Students" 
          value="96" 
          subtitle="Across all sections"
          icon={Users} 
          iconColor="text-blue-500"
          actionLabel="View Details"
          onAction={() => router.push("/attendance/teacher")}
        />
        <StatCard 
          title="Honor Students" 
          value="46" 
          subtitle="This Quarter"
          icon={Award} 
          iconColor="text-yellow-500"
          actionLabel="View Details"
          onAction={() => router.push("/grades")}
        />
        <StatCard 
          title="Unread Messages" 
          value="2" 
          subtitle="From Parents"
          icon={MessageSquare} 
          iconColor="text-blue-400"
          actionLabel="Read Messages"
          onAction={() => router.push("/messages")}
        />
        <StatCard 
          title="Upcoming Events" 
          value="1" 
          subtitle="This Month"
          icon={Calendar} 
          iconColor="text-red-500"
          actionLabel="View Details"
          onAction={() => router.push("/events")}
        />
      </div>

      {/* ACADEMIC RECOGNITION SUMMARY */}
      <div className="grid gap-6">
        <DashboardSection 
            title="Academic Recognition Summary" 
            subtitle="Students eligible for honor based on current performance"
        >
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
             
             {/* 1. Highest Honor (Gold/Brown) */}
             <div className="flex flex-col items-center justify-center p-6 rounded-2xl gap-2 bg-amber-100/50 text-amber-900 dark:bg-yellow-900/20 dark:text-yellow-500 border border-amber-200 dark:border-yellow-900/50">
                <Trophy className="h-8 w-8 mb-2" />
                <span className="text-3xl font-bold">8</span>
                <span className="font-semibold">Highest Honor</span>
                <span className="text-xs opacity-80">98% - 100%</span>
             </div>

             {/* 2. High Honors (Purple) */}
             <div className="flex flex-col items-center justify-center p-6 rounded-2xl gap-2 bg-indigo-100/50 text-indigo-900 dark:bg-indigo-900/20 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/50">
                <Medal className="h-8 w-8 mb-2" />
                <span className="text-3xl font-bold">15</span>
                <span className="font-semibold">High Honors</span>
                <span className="text-xs opacity-80">95% - 97%</span>
             </div>

             {/* 3. Honors (Green) */}
             <div className="flex flex-col items-center justify-center p-6 rounded-2xl gap-2 bg-emerald-100/50 text-emerald-900 dark:bg-emerald-900/20 dark:text-emerald-500 border border-emerald-200 dark:border-emerald-900/50">
                <GraduationCap className="h-8 w-8 mb-2" />
                <span className="text-3xl font-bold">23</span>
                <span className="font-semibold">Honors</span>
                <span className="text-xs opacity-80">90% - 94%</span>
             </div>

             {/* 4. Other Students (Blue/Slate) */}
             <div className="flex flex-col items-center justify-center p-6 rounded-2xl gap-2 bg-slate-100 text-slate-900 dark:bg-slate-800/50 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
                <Users className="h-8 w-8 mb-2" />
                <span className="text-3xl font-bold">50</span>
                <span className="font-semibold">Other Students</span>
                <span className="text-xs opacity-80">Below 90%</span>
             </div>

          </div>
        </DashboardSection>
      </div>
    </div>
  );
}