"use client";

import { useState, useMemo } from "react";
import { INITIAL_EVENTS } from "@/data/calendarData";

export function useParentCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  // 1. FILTER: Parents only see "Published" events
  const [events] = useState(INITIAL_EVENTS.filter(e => e.status === "Published"));

  // 2. STATS CALCULATION (Same logic as teacher, but on filtered data)
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

  // 3. VIEW DETAILS FILTER (Selected Date)
  const viewDetailsEvents = events.filter(e => {
    if (!date) return false;
    const check = new Date(date); check.setHours(0,0,0,0);
    const start = new Date(e.startDate); start.setHours(0,0,0,0);
    const end = new Date(e.endDate); end.setHours(0,0,0,0);
    return check >= start && check <= end;
  });

  // 4. UPCOMING EVENTS LIST (Sorted Ascending)
  const upcomingEvents = useMemo(() => {
    return [...events]
      .filter(e => new Date(e.endDate) >= new Date(new Date().setHours(0,0,0,0)))
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  }, [events]);

  return { 
    date, setDate, 
    stats, 
    viewDetailsEvents, 
    upcomingEvents 
  };
}