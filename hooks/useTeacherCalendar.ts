"use client";

import { useState, useMemo } from "react";
import { EventFormData } from "@/components/calendar/EventModals";
// NEW IMPORT PATH
import { SchoolEvent, INITIAL_EVENTS } from "@/data/calendarData"; 

export function useTeacherCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<SchoolEvent[]>(INITIAL_EVENTS);

  const [modals, setModals] = useState({ create: false, publish: false, unpublish: false, delete: false });
  const [selectedEvent, setSelectedEvent] = useState<SchoolEvent | null>(null);

  const toggleModal = (modal: keyof typeof modals, isOpen: boolean) => setModals(prev => ({ ...prev, [modal]: isOpen }));

  // ... (Keep existing handlers: handleCreateOrUpdate, handleDelete, handlePublish, handleUnpublish) ...
  // ... (Keep logic: handleCreateOrUpdate must parse dates correctly) ...
  
  // Re-pasting the handlers for completeness/ease of copy:
  const handleCreateOrUpdate = (data: EventFormData) => {
    const sDate = new Date(data.startDate); const eDate = new Date(data.endDate);
    if (selectedEvent) {
      setEvents(prev => prev.map(ev => ev.id === selectedEvent.id ? { ...ev, title: data.title, type: data.type, startDate: sDate, endDate: eDate, startTime: data.startTime, endTime: data.endTime, location: data.location, description: data.description } : ev));
    } else {
      setEvents(prev => [...prev, { id: Math.random().toString(), title: data.title, type: data.type, startDate: sDate, endDate: eDate, startTime: data.startTime, endTime: data.endTime, location: data.location, creator: "You", status: "Draft", description: data.description, isSystemEvent: false }]);
    }
    toggleModal("create", false); setSelectedEvent(null);
  };

  const handleDelete = () => { if (selectedEvent) setEvents(prev => prev.filter(ev => ev.id !== selectedEvent.id)); toggleModal("delete", false); setSelectedEvent(null); };
  const handlePublish = () => { if (selectedEvent) setEvents(prev => prev.map(ev => ev.id === selectedEvent.id ? { ...ev, status: "Published" } : ev)); toggleModal("publish", false); setSelectedEvent(null); };
  const handleUnpublish = () => { if (selectedEvent) setEvents(prev => prev.map(ev => ev.id === selectedEvent.id ? { ...ev, status: "Draft" } : ev)); toggleModal("unpublish", false); setSelectedEvent(null); };

  const stats = useMemo(() => {
    const now = new Date(); now.setHours(0,0,0,0);
    const twoWeeks = new Date(now); twoWeeks.setDate(now.getDate() + 14);
    const isUpcoming = (d: Date) => d >= now && d <= twoWeeks;
    const isThisMonth = (d: Date) => d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();

    return {
        meetings: events.filter(e => !["Exam", "Holiday", "Academic"].includes(e.type) && isUpcoming(e.startDate)).length,
        exams: events.filter(e => e.type === "Exam" && isUpcoming(e.startDate)).length,
        holidays: events.filter(e => e.type === "Holiday" && isThisMonth(e.startDate)).length,
        academic: events.filter(e => e.type === "Academic" && isThisMonth(e.startDate)).length,
    };
  }, [events]);

  const viewDetailsEvents = events.filter(e => {
    if (!date) return false;
    const check = new Date(date); check.setHours(0,0,0,0);
    const start = new Date(e.startDate); start.setHours(0,0,0,0);
    const end = new Date(e.endDate); end.setHours(0,0,0,0);
    return check >= start && check <= end && e.status === "Published";
  });

  const tableEvents = events.filter(e => !e.isSystemEvent);

  return { date, setDate, events: tableEvents, viewDetailsEvents, stats, modals, toggleModal, selectedEvent, setSelectedEvent, actions: { handleCreateOrUpdate, handleDelete, handlePublish, handleUnpublish } };
}