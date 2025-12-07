"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, XCircle, Slash, Clock } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";

//Get Accurate Current Month and Week of the Month
const getCurrentDateInfo = () => {
  const now = new Date();
  const monthName = now.toLocaleString('default', { month: 'long' });
  
  // Calculate Week Number (Simple: Day / 7)
  const day = now.getDate();
  const weekNum = Math.ceil(day / 7);
  let weekString = "1st Week";
  if (weekNum === 2) weekString = "2nd Week";
  if (weekNum === 3) weekString = "3rd Week";
  if (weekNum === 4) weekString = "4th Week";
  if (weekNum >= 5) weekString = "5th Week";

  return { month: monthName, week: weekString };
};

// --- MOCK DATA ---
const attendanceData = [
  { id: 1, day: "Monday", date: "09 / 22 / 25", timeIn: "8:15 AM", timeOut: "3:30 PM", status: "Present", notes: "-", month: "September", week: "4th Week" },
  { id: 2, day: "Tuesday", date: "09 / 23 / 25", timeIn: "8:15 AM", timeOut: "1:00 PM", status: "Early Release", notes: "Sick", month: "September", week: "4th Week" },
  { id: 3, day: "Wednesday", date: "09 / 24 / 25", timeIn: "9:00 AM", timeOut: "3:30 PM", status: "Late", notes: "-", month: "September", week: "4th Week" },
  { id: 4, day: "Thursday", date: "09 / 25 / 25", timeIn: "-", timeOut: "-", status: "Absent", notes: "Excuse Letter", month: "September", week: "4th Week" },
  { id: 10, day: "Monday", date: "12 / 01 / 25", timeIn: "7:55 AM", timeOut: "3:30 PM", status: "Present", notes: "-", month: "December", week: "1st Week" },
  { id: 11, day: "Tuesday", date: "12 / 02 / 25", timeIn: "8:00 AM", timeOut: "3:30 PM", status: "Present", notes: "-", month: "December", week: "1st Week" },
  { id: 12, day: "Friday", date: "12 / 05 / 25", timeIn: "8:10 AM", timeOut: "3:30 PM", status: "Late", notes: "Rain", month: "December", week: "1st Week" },
  { id: 20, day: "Monday", date: "12 / 08 / 25", timeIn: "8:00 AM", timeOut: "3:30 PM", status: "Present", notes: "-", month: "December", week: "2nd Week" },
];

export default function AttendanceParentPage() {
  const router = useRouter();

  // Date State
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedWeek, setSelectedWeek] = useState("");

  // Detect Date
  useEffect(() => {
    const { month, week } = getCurrentDateInfo();
    setSelectedMonth(month);
    setSelectedWeek(week);
  }, []);

  const stats = useMemo(() => {
    let present = 0, absent = 0, excused = 0, lates = 0;
    attendanceData.forEach((record) => {
      if (["Present", "Late", "Early Release"].includes(record.status)) present++;
      if (record.status === "Absent") absent++;
      if (["Excuse", "Excused"].includes(record.status)) excused++;
      if (record.status === "Late") lates++;
    });
    return { present, absent, excused, lates };
  }, []);

  // Filter Logic
  const filteredRecords = useMemo(() => {
    if (!selectedMonth || !selectedWeek) return [];
    return attendanceData.filter(record => 
      record.month === selectedMonth && record.week === selectedWeek
    );
  }, [selectedMonth, selectedWeek]);

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 pt-2">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Days Present" value={stats.present} subtitle="This Quarter" icon={CheckCircle2} iconColor="text-green-500" />
        <StatCard title="Days Absent" value={stats.absent} subtitle="This Quarter" icon={XCircle} iconColor="text-red-500" />
        <StatCard title="Days Excused" value={stats.excused} subtitle="This Quarter" icon={Slash} iconColor="text-blue-500" />
        <StatCard title="Times Lates" value={stats.lates} subtitle="This Quarter" icon={Clock} iconColor="text-orange-500" />
      </div>
      <div className="grid gap-6"></div>
    </div>
  );
}