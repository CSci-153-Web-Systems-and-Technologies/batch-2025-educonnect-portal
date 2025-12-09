"use client";

import { useState, useMemo } from "react";
import { EventFormData } from "@/components/calendar/EventModals";

export type SchoolEvent = {
  id: string;
  title: string;
  type: string;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  location: string;
  creator: string;
  status: "Draft" | "Published";
  description: string;
  isSystemEvent?: boolean;
};

// --- Initial Data ---
const INITIAL_EVENTS: SchoolEvent[] = [
  { 
      id: "1", title: "PTA Meeting", type: "Meeting", 
      startDate: new Date(), endDate: new Date(), 
      startTime: "09:00", endTime: "11:00", location: "Conference Room", creator: "Mrs. Thompson", status: "Draft", description: "Quarterly meeting" 
  },
  { 
      id: "2", title: "Math Exam", type: "Exam", 
      startDate: new Date(new Date().setDate(new Date().getDate() + 1)), 
      endDate: new Date(new Date().setDate(new Date().getDate() + 3)), 
      startTime: "08:00", endTime: "12:00", location: "Room 304", creator: "Mr. Sinday", status: "Published", description: "Grade 7 Math" 
  },
];

export function useTeacherCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<SchoolEvent[]>(INITIAL_EVENTS);

  // --- Modal States ---
  const [modals, setModals] = useState({
    create: false,
    publish: false,
    unpublish: false,
    delete: false,
  });

  // --- Selection States ---
  const [selectedEvent, setSelectedEvent] = useState<SchoolEvent | null>(null);

  // --- Actions ---
  const toggleModal = (modal: keyof typeof modals, isOpen: boolean) => {
    setModals(prev => ({ ...prev, [modal]: isOpen }));
  };

  const handleCreateOrUpdate = (data: EventFormData) => {
    const sDate = new Date(data.startDate);
    const eDate = new Date(data.endDate);

    if (selectedEvent) {
      // Update
      setEvents(prev => prev.map(ev => ev.id === selectedEvent.id ? {
        ...ev,
        title: data.title, type: data.type, startDate: sDate, endDate: eDate,
        startTime: data.startTime, endTime: data.endTime, location: data.location, description: data.description
      } : ev));
    } else {
      // Create
      setEvents(prev => [...prev, {
        id: Math.random().toString(),
        title: data.title, type: data.type, startDate: sDate, endDate: eDate,
        startTime: data.startTime, endTime: data.endTime, location: data.location,
        creator: "You", status: "Draft", description: data.description, isSystemEvent: false
      }]);
    }
    toggleModal("create", false);
    setSelectedEvent(null);
  };

  const handleDelete = () => {
    if (selectedEvent) setEvents(prev => prev.filter(ev => ev.id !== selectedEvent.id));
    toggleModal("delete", false);
    setSelectedEvent(null);
  };

  const handlePublish = () => {
    if (selectedEvent) setEvents(prev => prev.map(ev => ev.id === selectedEvent.id ? { ...ev, status: "Published" } : ev));
    toggleModal("publish", false);
    setSelectedEvent(null);
  };

  const handleUnpublish = () => {
    if (selectedEvent) setEvents(prev => prev.map(ev => ev.id === selectedEvent.id ? { ...ev, status: "Draft" } : ev));
    toggleModal("unpublish", false);
    setSelectedEvent(null);
  };

  // --- Calculations ---
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

  return {
    date, setDate,
    events: tableEvents,
    viewDetailsEvents,
    stats,
    modals, toggleModal,
    selectedEvent, setSelectedEvent,
    actions: { handleCreateOrUpdate, handleDelete, handlePublish, handleUnpublish }
  };
}