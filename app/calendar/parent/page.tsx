"use client";

import { Users, FileText, ShoppingBag, School } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { StatCard } from "@/components/dashboard/StatCard";
import { DayDetailsList, EventRow } from "@/components/calendar/CalendarComponents";
import { useParentCalendar } from "@/hooks/useParentCalendar";
import { RoleGuard } from "@/components/RoleGuard";

export default function ParentCalendarPage() {
    const { 
        date, setDate, 
        stats, 
        viewDetailsEvents, 
        upcomingEvents 
    } = useParentCalendar();

    return (
        <RoleGuard allowedRole="parent">
        <div className="flex flex-col gap-8 p-6 lg:p-8 min-h-screen bg-gray-50/50 dark:bg-black text-foreground font-sans">
        
        {/* 1. STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            <StatCard title="Meeting / Events" value={stats.meetings} subtitle="upcoming (2 weeks)" icon={Users} iconColor="text-orange-500" />
            <StatCard title="Exam" value={stats.exams} subtitle="upcoming (2 weeks)" icon={FileText} iconColor="text-blue-500" />
            <StatCard title="Holiday" value={stats.holidays} subtitle="this month" icon={ShoppingBag} iconColor="text-yellow-500" />
            <StatCard title="Academic Events" value={stats.academic} subtitle="this month" icon={School} iconColor="text-purple-500" />
        </div>

        {/* 2. CALENDAR & DETAILS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[450px]">
            {/* Calendar */}
            <Card className="col-span-1 p-0 rounded-3xl border-none shadow-sm bg-white dark:bg-neutral-900 flex flex-col overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-neutral-800">
                <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white">Calendar View</h3>
            </div>
            <div className="flex-1 flex  justify-center items-center bg-white dark:bg-neutral-900 p-6">
                <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-xl border border-gray-100 dark:border-neutral-800 p-4 shadow-sm" />
            </div>
            </Card>

            {/* View Details */}
            <Card className="col-span-1 lg:col-span-2 p-0 rounded-3xl border-none shadow-sm bg-white dark:bg-neutral-900 flex flex-col relative overflow-hidden min-h-[300px]">
            <div className="p-6 border-b border-gray-100 dark:border-neutral-800 z-10 bg-white dark:bg-neutral-900 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white">View Details</h3>
                <span className="text-sm font-medium text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-100 dark:bg-neutral-800 dark:border-neutral-700">
                    {date ? date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }) : 'Select a date'}
                </span>
            </div>
            <div className="flex-1 overflow-y-auto p-6 relative z-0 max-h-[400px] lg:max-h-none">
                <DayDetailsList events={viewDetailsEvents} />
            </div>
            </Card>
        </div>

        {/* 3. UPCOMING EVENTS (Read Only) */}
        <Card className="rounded-3xl border-none shadow-sm bg-white dark:bg-neutral-900 p-6 lg:p-8">
            <div className="mb-8">
                <h3 className="font-serif text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Upcoming Events</h3>
                <p className="text-gray-500 mt-1">Stay updated with the latest school activities.</p>
            </div>

            <div className="overflow-x-auto -mx-6 lg:mx-0 px-6 lg:px-0">
            <table className="w-full text-left text-sm min-w-[800px]">
                <thead>
                <tr className="text-gray-400 border-b border-dashed border-gray-200 dark:border-neutral-800">
                    {/* Headers match the readOnly EventRow columns */}
                    {["Event Name", "Type", "Date & Time", "Location"].map(h => (
                        <th key={h} className={`pb-4 font-medium uppercase text-xs tracking-wider ${h === 'Event Name' ? 'pl-4' : ''}`}>{h}</th>
                    ))}
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-neutral-800/50">
                {upcomingEvents.map((event) => (
                    <EventRow 
                        key={event.id} 
                        event={event} 
                        readOnly={true} // Hides actions, status, and creator
                    />
                ))}
                </tbody>
            </table>
            </div>
        </Card>
        </div>
        </RoleGuard>
    );
}