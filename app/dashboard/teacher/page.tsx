"use client";

import { useRouter } from "next/navigation";
import { Users, Award, MessageSquare, Calendar } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";

export default function TeacherDashboard() {
  const router = useRouter();

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 pt-2">
      
      {/* --- PART 1: SUMMARY CARDS --- */}
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

      {/* Placeholder for Bottom Sections */}
      <div className="grid gap-6">
      </div>
    </div>
  );
}