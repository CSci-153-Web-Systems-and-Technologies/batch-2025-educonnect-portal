"use client";

import { 
  Users, FileText, ShoppingBag, School, Plus 
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

// --- Imports ---
import { useTeacherCalendar } from "@/hooks/useTeacherCalendar";
import { StatCard } from "@/components/dashboard/StatCard";
import { CreateEventModal, PublishEventModal, UnpublishEventModal, DeleteEventModal } from "@/components/calendar/EventModals";
import { DayDetailsList, EventRow } from "@/components/calendar/CalendarComponents";

export default function TeacherCalendarPage() {
  const { 
    date, setDate, 
    events, viewDetailsEvents, stats,
    modals, toggleModal, 
    selectedEvent, setSelectedEvent, 
    actions 
  } = useTeacherCalendar();

  // --- Handlers Wrappers ---
  const openEdit = (e: any) => { setSelectedEvent(e); toggleModal("create", true); };
  const openDelete = (e: any) => { setSelectedEvent(e); toggleModal("delete", true); };
  const openPublish = (e: any) => { setSelectedEvent(e); toggleModal("publish", true); };
  const openUnpublish = (e: any) => { setSelectedEvent(e); toggleModal("unpublish", true); };

  return (
    <div className="flex flex-col gap-8 p-8 min-h-screen bg-gray-50/50 dark:bg-black text-foreground font-sans">
      
      {/* 1. STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
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
        <Card className="col-span-2 p-0 rounded-3xl border-none shadow-sm bg-white dark:bg-neutral-900 flex flex-col relative overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-neutral-800 z-10 bg-white dark:bg-neutral-900 flex justify-between items-center">
             <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white">View Details</h3>
             <span className="text-sm font-medium text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-100 dark:bg-neutral-800 dark:border-neutral-700">
                {date ? date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }) : 'Select a date'}
             </span>
          </div>
          <div className="flex-1 overflow-y-auto p-6 relative z-0">
             <DayDetailsList events={viewDetailsEvents} />
          </div>
        </Card>
      </div>

      {/* 3. MANAGEMENT TABLE */}
      <Card className="rounded-3xl border-none shadow-sm bg-white dark:bg-neutral-900 p-8">
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-4">
          <div>
            <h3 className="font-serif text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Event Management</h3>
            <p className="text-gray-500 mt-1">Manage your school schedule efficiently</p>
          </div>
          <Button onClick={() => { setSelectedEvent(null); toggleModal("create", true); }} className="rounded-xl h-12 bg-black hover:bg-neutral-800 text-white dark:bg-white dark:text-black shadow-lg shadow-black/5 gap-2 px-6">
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
              {events.map((event) => (
                <EventRow 
                    key={event.id} 
                    event={event} 
                    onEdit={openEdit} 
                    onDelete={openDelete} 
                    onPublish={openPublish}
                    onUnpublish={openUnpublish}
                />
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* --- MODALS --- */}
      <CreateEventModal isOpen={modals.create} onClose={() => toggleModal("create", false)} onSave={actions.handleCreateOrUpdate} initialData={selectedEvent ? {
            id: selectedEvent.id, title: selectedEvent.title, type: selectedEvent.type, startDate: selectedEvent.startDate.toISOString(), endDate: selectedEvent.endDate.toISOString(), startTime: selectedEvent.startTime, endTime: selectedEvent.endTime, location: selectedEvent.location, description: selectedEvent.description
      } : null} />
      <DeleteEventModal isOpen={modals.delete} onClose={() => toggleModal("delete", false)} onConfirm={actions.handleDelete} eventTitle={selectedEvent?.title || "Event"} />
      <PublishEventModal isOpen={modals.publish} onClose={() => toggleModal("publish", false)} onConfirm={actions.handlePublish} eventTitle={selectedEvent?.title || "Event"} />
      <UnpublishEventModal isOpen={modals.unpublish} onClose={() => toggleModal("unpublish", false)} onConfirm={actions.handleUnpublish} eventTitle={selectedEvent?.title || "Event"} />
    </div>
  );
}