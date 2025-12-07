"use client";

import { useState, useMemo } from "react";
import { AttendanceFilters } from "@/components/attendance/AttendanceFilters";
import { AttendanceStats } from "@/components/attendance/AttendanceStats";

type Student = {
  id: string;
  name: string;
  email: string;
  grade: string;
  status: "Present" | "Late" | "Absent" | "Excused";
};

export default function TeacherDashboardPage() {
  const [selectedClassList, setSelectedClassList] = useState("Grade 7 - A");
  const [selectedStatusList, setSelectedStatusList] = useState("All Students");
  const [date, setDate] = useState<Date | undefined>(new Date());

  const [students, setStudents] = useState<Student[]>([
    { id: "1", name: "Ruel Angelo Sinday", email: "21-102429@vsu.edu.ph", grade: "Grade 7 - A", status: "Present" },
    { id: "2", name: "Maria Clara", email: "21-1-02430@vsu.edu.ph", grade: "Grade 7 - A", status: "Excused" },
    { id: "3", name: "Jose Rizal", email: "21-1-02431@vsu.edu.ph", grade: "Grade 7 - A", status: "Late" },
  ]);

  const studentsInGrade = useMemo(() => students.filter((s) => s.grade === selectedClassList), [students, selectedClassList]);
  
  const counts = useMemo(() => {
    return {
      present: studentsInGrade.filter((s) => s.status === "Present").length,
      late: studentsInGrade.filter((s) => s.status === "Late").length,
      absent: studentsInGrade.filter((s) => s.status === "Absent").length,
      excused: studentsInGrade.filter((s) => s.status === "Excused").length,
    };
  }, [studentsInGrade]);

  return (
    <div className="flex flex-col gap-6 p-4 text-foreground">
      
      <AttendanceFilters 
        date={date} setDate={setDate}
        selectedClass={selectedClassList} setSelectedClass={setSelectedClassList}
        selectedStatus={selectedStatusList} setSelectedStatus={setSelectedStatusList}
      />

      <AttendanceStats 
        date={date} 
        selectedClass={selectedClassList} 
        totalStudents={studentsInGrade.length} 
        counts={counts}
      />

      <div className="p-4 border rounded-xl">
        Attendance Management
      </div>

    </div>
  );
}