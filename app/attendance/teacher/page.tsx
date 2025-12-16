"use client";

import { useState, useMemo } from "react";
import { CalendarIcon, Users, Funnel } from "lucide-react";
import { RoleGuard } from "@/components/RoleGuard";

// 1. Import Generic Components
import { FilterBar, FilterItem } from "@/components/dashboard/FilterBar";
import { ActionStatsBar, StatItem } from "@/components/dashboard/ActionStatsBar";
import { StudentManagementTable, StudentRow } from "@/components/dashboard/StudentManagementTable";

export default function TeacherAttendancePage() {
  // --- STATE ---
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedClass, setSelectedClass] = useState("Grade 7 - A");
  const [selectedStatus, setSelectedStatus] = useState("All Students");

  // --- MOCK DATA ---
  const [students, setStudents] = useState<StudentRow[]>([
    { id: "1", name: "Ruel Angelo Sinday", email: "21-102429@vsu.edu.ph", status: "Present" },
    { id: "2", name: "Maria Clara", email: "21-102430@vsu.edu.ph", status: "Excused" },
    { id: "3", name: "Jose Rizal", email: "21-102431@vsu.edu.ph", status: "Late" },
    { id: "4", name: "Andres Bonifacio", email: "21-102432@vsu.edu.ph", status: "Absent" },
    { id: "5", name: "Emilio Aguinaldo", email: "21-102433@vsu.edu.ph", status: "Present" },
    { id: "6", name: "Apolinario Mabini", email: "21-102434@vsu.edu.ph", status: "Present" },
  ]);

  const filteredStudents = useMemo(() => {
    return students
      .filter((s) => (selectedStatus === "All Students" ? true : s.status === selectedStatus))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [students, selectedStatus]);

  const counts = useMemo(() => ({
    present: students.filter(s => s.status === "Present").length,
    late: students.filter(s => s.status === "Late").length,
    absent: students.filter(s => s.status === "Absent").length,
    excused: students.filter(s => s.status === "Excused").length,
  }), [students]);

  const handleUpdateStudent = (id: string, status: string) => 
    setStudents(prev => prev.map(s => s.id === id ? { ...s, status } : s));

  const handleBulkUpdate = (updates: Record<string, string>) => 
    setStudents(prev => prev.map(s => updates[s.id] ? { ...s, status: updates[s.id] } : s));

  const handleSendNotification = async () => { 
    await new Promise(r => setTimeout(r, 1000)); // Simulate API call
    alert("Attendance Notifications Sent Successfully!"); 
  };

  const filters: FilterItem[] = [
    { 
      id: "date", 
      title: "Date Selection", 
      icon: CalendarIcon, 
      iconColor: "text-red-500", 
      type: "date", 
      value: date, 
      onChange: setDate 
    },
    { 
      id: "class", 
      title: "Class Selection", 
      icon: Users, 
      iconColor: "text-white", 
      type: "select", 
      value: selectedClass, 
      onChange: setSelectedClass, 
      options: ["Grade 7 - A", "Grade 8 - A", "Grade 9 - A", "Grade 10 - A"] 
    },
    { 
      id: "status", 
      title: "Status Filter", 
      icon: Funnel, 
      iconColor: "text-indigo-500", 
      type: "select", 
      value: selectedStatus, 
      onChange: setSelectedStatus, 
      options: ["All Students", "Present", "Absent", "Late", "Excused"] 
    }
  ];

  const summaryStats: StatItem[] = [
    { label: "Present", value: counts.present, color: "green" },
    { label: "Late", value: counts.late, color: "yellow" },
    { label: "Absent", value: counts.absent, color: "red" },
    { label: "Excused", value: counts.excused, color: "blue" },
  ];

  const statusColors = {
    "Present": "border-green-500 text-green-500",
    "Late": "border-yellow-500 text-yellow-500",
    "Absent": "border-red-500 text-red-500",
    "Excused": "border-blue-500 text-blue-500",
  };

  return (
    <RoleGuard allowedRole="teacher">
    <div className="flex flex-col gap-6 p-4 text-foreground">
      <FilterBar filters={filters} />
      
      <ActionStatsBar 
        badges={[
          date?.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) || "No Date", 
          selectedClass, 
          `${students.length} Students`
        ]}
        actionLabel="Send Notifications"
        modalTitle="Send Attendance Notifications"
        modalDescription="Review the attendance summary below before sending notifications to parents."
        modalInfoMap={[
            { label: "Grade / Section", value: selectedClass },
            { label: "Date", value: date?.toLocaleDateString() || "-" },
            { label: "Total Students", value: students.length }
        ]}
        modalFooter={
          <ul className="list-disc ml-5">
            <li>Email to parent&apos;s registered email</li>
            <li>SMS to parent&apos;s registered phone</li>
            <li>Push notification through parent portal app</li>
          </ul>
        }
        summaryStats={summaryStats}
        onConfirm={handleSendNotification}
      />

      <StudentManagementTable 
        title="Attendance Management"
        students={filteredStudents}
        statusOptions={["Present", "Late", "Absent", "Excused"]}
        statusColorMap={statusColors}
        withNotes={true}
        onUpdateSingle={handleUpdateStudent}
        onBulkUpdate={handleBulkUpdate}
      />
    </div>
    </RoleGuard>
  );
}