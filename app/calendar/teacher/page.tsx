"use client";

import { useState } from "react";
import { Users, FileText, ShoppingBag, School, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { StatCard } from "@/components/dashboard/StatCard";
import { INITIAL_EVENTS } from "@/hooks/useTeacherCalendar";
import { DayDetailsList, EventRow } from "@/components/calendar/CalendarComponents";

export default function TeacherCalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  return (
    <div className="flex flex-col gap-8 p-8 min-h-screen bg-gray-50/50 dark:bg-black text-foreground font-sans">
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard title="Meeting / Events" value="0" subtitle="upcoming" icon={Users} iconColor="text-orange-500" />
        <StatCard title="Exam" value="0" subtitle="upcoming" icon={FileText} iconColor="text-blue-500" />
        <StatCard title="Holiday" value="0" subtitle="this month" icon={ShoppingBag} iconColor="text-yellow-500" />
        <StatCard title="Academic Events" value="0" subtitle="this month" icon={School} iconColor="text-purple-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[450px]">
        <Card className="col-span-1 p-0 rounded-3xl border-none shadow-sm bg-white dark:bg-neutral-900 flex flex-col overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-neutral-800">
             <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white">Calendar View</h3>
          </div>
          <div className="flex-1 flex justify-center items-center bg-white dark:bg-neutral-900 p-6">
             <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-xl border border-gray-100 dark:border-neutral-800 p-4 shadow-sm" />
          </div>
        </Card>

        <Card className="col-span-2 p-0 rounded-3xl border-none shadow-sm bg-white dark:bg-neutral-900 flex flex-col relative overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-neutral-800 z-10 bg-white dark:bg-neutral-900 flex justify-between items-center">
             <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white">View Details</h3>
             <span className="text-sm font-medium text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-100 dark:bg-neutral-800 dark:border-neutral-700">
                {date ? date.toLocaleDateString() : 'Select a date'}
             </span>
          </div>
          <div className="flex-1 overflow-y-auto p-6 relative z-0">
             <DayDetailsList events={INITIAL_EVENTS} />
          </div>
        </Card>
      </div>

      <Card className="rounded-3xl border-none shadow-sm bg-white dark:bg-neutral-900 p-8">
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-4">
          <div>
            <h3 className="font-serif text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Event Management</h3>
            <p className="text-gray-500 mt-1">Manage your school schedule efficiently</p>
          </div>
          <Button className="rounded-xl h-12 bg-black hover:bg-neutral-800 text-white dark:bg-white dark:text-black shadow-lg shadow-black/5 gap-2 px-6">
            <Plus className="h-5 w-5" /> Add Event
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-dashed border-gray-200 dark:border-neutral-800">
                {["Event Name", "Type", "Date & Time", "Location", "Status", "Created By", "Actions"].map(h => (
                    <th key={h} className={`pb-4 font-medium uppercase text-xs tracking-wider ${h === 'Event Name' ? 'pl-4' : ''} ${h === 'Actions' ? 'text-right pr-4' : ''}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-neutral-800/50">
              {INITIAL_EVENTS.map((event) => (
                <EventRow 
                    key={event.id} 
                    event={event} 
                    onEdit={() => {}} onDelete={() => {}} onPublish={() => {}} onUnpublish={() => {}} 
                />
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}