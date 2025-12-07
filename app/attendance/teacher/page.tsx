"use client";

import { useState, useMemo } from "react";
import { AttendanceFilters } from "@/components/attendance/AttendanceFilters";
import { AttendanceStats } from "@/components/attendance/AttendanceStats";
import { AttendanceTable, Student } from "@/components/attendance/AttendanceTable"; // IMPORTED NEW COMPONENT

export default function TeacherDashboardPage() {
  const [selectedClass, setSelectedClass] = useState("Grade 7 - A");
  const [selectedStatus, setSelectedStatus] = useState("All Students");
  const [date, setDate] = useState<Date | undefined>(new Date());

  const [students, setStudents] = useState<Student[]>([
    { id: "1", name: "Ruel Angelo Sinday", email: "21-102429@vsu.edu.ph", grade: "Grade 7 - A", status: "Present" },
    { id: "2", name: "Maria Clara", email: "21-1-02430@vsu.edu.ph", grade: "Grade 7 - A", status: "Excused" },
    { id: "3", name: "Jose Rizal", email: "21-1-02431@vsu.edu.ph", grade: "Grade 7 - A", status: "Late" },
    { id: "4", name: "Andres Bonifacio", email: "21-1-02432@vsu.edu.ph", grade: "Grade 9 - A", status: "Absent" },
    { id: "5", name: "Emilio Aguinaldo", email: "21-1-02433@vsu.edu.ph", grade: "Grade 7 - A", status: "Present" },
    { id: "6", name: "Apolinario Mabini", email: "21-102434@vsu.edu.ph", grade: "Grade 8 - A", status: "Present" }
  ]);

  const filteredStudents = useMemo(() => {
    return students
      .filter((s) => s.grade === selectedClass)
      .filter((s) => (selectedStatus === "All Students" ? true : s.status === selectedStatus))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [students, selectedClass, selectedStatus]);

  const studentsInGrade = useMemo(() => students.filter((s) => s.grade === selectedClass), [students, selectedClass]);

  const counts = useMemo(() => {
    return {
      present: studentsInGrade.filter((s) => s.status === "Present").length,
      late: studentsInGrade.filter((s) => s.status === "Late").length,
      absent: studentsInGrade.filter((s) => s.status === "Absent").length,
      excused: studentsInGrade.filter((s) => s.status === "Excused").length,
    };
  }, [studentsInGrade]);

  const handleUpdateStudent = (id: string, status: Student["status"]) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  };

  const handleBulkUpdate = (updates: Record<string, Student["status"]>) => {
    setStudents(prev => prev.map(s => updates[s.id] ? { ...s, status: updates[s.id] } : s));
  };

  return (
    <div className="flex flex-col gap-6 p-4 text-foreground">
  
      <AttendanceFilters 
        date={date} setDate={setDate}
        selectedClass={selectedClass} setSelectedClass={setSelectedClass}
        selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus}
      />

      <AttendanceStats 
        date={date} 
        selectedClass={selectedClass} 
        totalStudents={studentsInGrade.length}
        counts={counts}
      />

      <AttendanceTable 
        students={filteredStudents}
        onUpdateStudent={handleUpdateStudent}
        onBulkUpdate={handleBulkUpdate}
      />
    </div>
  );
}