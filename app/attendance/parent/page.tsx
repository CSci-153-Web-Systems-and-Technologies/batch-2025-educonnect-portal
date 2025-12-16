"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, XCircle, Slash, Clock, ChevronDown } from "lucide-react";
import { RoleGuard } from "@/components/RoleGuard";
import { StatCard } from "@/components/dashboard/StatCard";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Get Accurate Current Month and Week of the Month
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

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const weeks = ["1st Week", "2nd Week", "3rd Week", "4th Week", "5th Week"];

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

  // --- LOGIC: STATS ---
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
    return attendanceData.filter(record => record.month === selectedMonth && record.week === selectedWeek);
  }, [selectedMonth, selectedWeek]);

  const getBadgeStyle = (status: string) => {
    switch (status) {
      case "Present": return "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/25 border-0";
      case "Late": return "bg-orange-500/15 text-orange-600 dark:text-orange-400 hover:bg-orange-500/25 border-0";
      case "Absent": return "bg-red-500/15 text-red-600 dark:text-red-400 hover:bg-red-500/25 border-0";
      case "Early Release": return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 border-0";
      case "Excuse": return "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300 hover:bg-blue-200 border-0";
      default: return "";
    }
  };

  return (
    <RoleGuard allowedRole="parent">
    <div className="flex flex-1 flex-col gap-6 p-6 pt-2">
      {/* STAT CARDS */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Days Present" value={stats.present} subtitle="This Quarter" icon={CheckCircle2} iconColor="text-green-500" />
        <StatCard title="Days Absent" value={stats.absent} subtitle="This Quarter" icon={XCircle} iconColor="text-red-500" />
        <StatCard title="Days Excused" value={stats.excused} subtitle="This Quarter" icon={Slash} iconColor="text-blue-500" />
        <StatCard title="Times Lates" value={stats.lates} subtitle="This Quarter" icon={Clock} iconColor="text-orange-500" />
      </div>

      {/* ATTENDANCE DETAILS TABLE */}
      <div className="grid gap-6 relative">
        <DashboardSection title="Attendance Details" subtitle="Daily attendance records">
          
          <div className="absolute top-6 right-6 flex gap-3 z-10">
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="rounded-full border-gray-600 text-gray-500 dark:text-gray-400 hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 h-8 text-xs">
                        {selectedMonth || "Month"} <ChevronDown className="ml-2 h-3 w-3" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="max-h-[200px] overflow-y-auto">
                    {months.map(month => (
                        <DropdownMenuItem key={month} onClick={() => setSelectedMonth(month)}>{month}</DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
             </DropdownMenu>

             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="rounded-full border-gray-600 text-gray-500 dark:text-gray-400 hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 h-8 text-xs">
                        {selectedWeek || "Week"} <ChevronDown className="ml-2 h-3 w-3" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {weeks.map(week => (
                        <DropdownMenuItem key={week} onClick={() => setSelectedWeek(week)}>{week}</DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
             </DropdownMenu>
          </div>

          {/* TABLE UI */}
          <div className="overflow-x-auto mt-2">
            <table className="w-full text-sm text-left">
              <thead className="text-gray-500 dark:text-gray-400 font-medium border-b border-gray-200 dark:border-gray-800/50">
                <tr>
                  <th className="pb-4 pl-2 font-medium">Day</th>
                  <th className="pb-4 font-medium">Date</th>
                  <th className="pb-4 font-medium">Time In</th>
                  <th className="pb-4 font-medium">Time Out</th>
                  <th className="pb-4 font-medium">Status</th>
                  <th className="pb-4 font-medium">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((record) => (
                    <tr key={record.id} className="group hover:bg-gray-50 dark:hover:bg-muted/10 transition-colors">
                      <td className="py-4 pl-2 font-medium text-gray-900 dark:text-gray-200">{record.day}</td>
                      <td className="py-4 text-gray-600 dark:text-gray-400">{record.date}</td>
                      <td className="py-4 text-gray-600 dark:text-gray-400">{record.timeIn}</td>
                      <td className="py-4 text-gray-600 dark:text-gray-400">{record.timeOut}</td>
                      <td className="py-4">
                        <Badge className={`font-medium px-3 ${getBadgeStyle(record.status)}`}>{record.status}</Badge>
                      </td>
                      <td className="py-4 text-gray-400">{record.notes}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground">
                        No records found for {selectedMonth} - {selectedWeek}.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </DashboardSection>
      </div>
    </div>
    </RoleGuard>
  );
}