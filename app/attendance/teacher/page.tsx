"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card"; // Kept for inline Stats/Table
import { Button } from "@/components/ui/button"; // Kept for inline Stats/Table
import { AttendanceFilters } from "@/components/attendance/AttendanceFilters";

// --- TYPES ---
type Student = {
  id: string;
  name: string;
  email: string;
  grade: string;
  status: "Present" | "Late" | "Absent" | "Excused";
};

export default function TeacherDashboardPage() {
  // --- STATE ---
  const [selectedClassList, setSelectedClassList] = useState("Grade 7 - A");
  const [selectedStatusList, setSelectedStatusList] = useState("All Students");
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // --- MOCK DATA ---
  const [students, setStudents] = useState<Student[]>([
    { id: "1", name: "Ruel Angelo Sinday", email: "21-102429@vsu.edu.ph", grade: "Grade 7 - A", status: "Present" },
    { id: "2", name: "Maria Clara", email: "21-102430@vsu.edu.ph", grade: "Grade 7 - A", status: "Excused" },
    { id: "3", name: "Jose Rizal", email: "21-102431@vsu.edu.ph", grade: "Grade 7 - A", status: "Late" },
  ]);

  const studentsInGrade = useMemo(() => students.filter((s) => s.grade === selectedClassList), [students, selectedClassList]);
  const counts = useMemo(() => {
    return {
        total: studentsInGrade.length,
    };
  }, [studentsInGrade]);

  return (
    <div className="flex flex-col gap-6 p-4 text-foreground">
      
      <AttendanceFilters 
        date={date} setDate={setDate}
        selectedClass={selectedClassList} setSelectedClass={setSelectedClassList}
        selectedStatus={selectedStatusList} setSelectedStatus={setSelectedStatusList}
      />

      <Card className="rounded-3xl border border-black dark:border-transparent bg-white dark:bg-neutral-900 p-6 shadow-lg">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold mb-4">Status</h2>
            <div className="flex gap-4"><span className="border p-2 rounded">Total: {counts.total}</span></div>
          </div>
          <Button onClick={() => setIsConfirmOpen(true)}>Send Notifications</Button>
        </div>
      </Card>

      <div className="p-4 border rounded-xl">
        Attendance Management
      </div>

    </div>
  );
}