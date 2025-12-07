"use client";

import { useRouter } from "next/navigation";
import { TrendingUp, UserCheck, MessageSquare, Calendar } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";

export default function ParentDashboard() {
  const router = useRouter();

  return (
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
      </div>
    </div>
  );
}