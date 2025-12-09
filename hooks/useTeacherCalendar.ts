"use client";

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

export const INITIAL_EVENTS: SchoolEvent[] = [
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