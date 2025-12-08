"use client";

import { useState, useMemo } from "react";
import { CalendarIcon, Users, Funnel } from "lucide-react";

import { FilterBar, FilterItem } from "@/components/dashboard/FilterBar";
import { ActionStatsBar, StatItem } from "@/components/dashboard/ActionStatsBar";
import { StudentManagementTable, StudentRow } from "@/components/dashboard/StudentManagementTable";

export default function TeacherGradePage() {
  const [selectedClass, setSelectedClass] = useState("Grade 7 - A");
  const [selectedQuarter, setSelectedQuarter] = useState("1st Quarter");
  const [selectedStatus, setSelectedStatus] = useState("All Students");

  // --- MOCK DATA ---
  const [students, setStudents] = useState<StudentRow[]>([
    { id: "1", name: "Ruel Angelo Sinday", email: "21-102429@vsu.edu.ph", status: "Highest Honor", notes: "Top of the class" },
    { id: "2", name: "Maria Clara", email: "21-102430@vsu.edu.ph", status: "Honor", notes: "" },
    { id: "3", name: "Jose Rizal", email: "21-102431@vsu.edu.ph", status: "Highest Honor", notes: "Perfect score in Math" },
    { id: "4", name: "Andres Bonifacio", email: "21-102432@vsu.edu.ph", status: " ", notes: "Needs improvement" }, // " " = None
    { id: "5", name: "Emilio Aguinaldo", email: "21-102433@vsu.edu.ph", status: "Honor", notes: "" },
    { id: "6", name: "Apolinario Mabini", email: "21-102434@vsu.edu.ph", status: "High Honor", notes: "" }
  ]);

  const filteredStudents = useMemo(() => {
    return students
      .filter((s) => (selectedStatus === "All Students" ? true : s.status === selectedStatus))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [students, selectedStatus]);

  const counts = useMemo(() => ({
    highest: students.filter(s => s.status === "Highest Honor").length,
    high: students.filter(s => s.status === "High Honor").length,
    honor: students.filter(s => s.status === "Honor").length,
    none: students.filter(s => s.status === " ").length,
  }), [students]);

  const handleUpdate = (id: string, status: string, notes: string) => 
    setStudents(prev => prev.map(s => s.id === id ? { ...s, status, notes } : s));

  const handleBulk = (updates: Record<string, string>) => 
    setStudents(prev => prev.map(s => updates[s.id] ? { ...s, status: updates[s.id] } : s));

  const handlePublish = async () => { 
    await new Promise(r => setTimeout(r, 1000)); 
    alert("Grades Published to Parents!"); 
  };

  const filters: FilterItem[] = [
    { 
      id: "q", 
      title: "Quarter", 
      icon: CalendarIcon, 
      iconColor: "text-red-500", 
      type: "select", 
      value: selectedQuarter, 
      onChange: setSelectedQuarter, 
      options: ["1st Quarter", "2nd Quarter", "3rd Quarter", "4th Quarter"] 
    },
    { 
      id: "c", 
      title: "Class", 
      icon: Users, 
      iconColor: "text-white", 
      type: "select", 
      value: selectedClass, 
      onChange: setSelectedClass, 
      options: ["Grade 7 - A", "Grade 8 - A", "Grade 9 - A"] 
    },
    { 
      id: "s", 
      title: "Honor Filter", 
      icon: Funnel, 
      iconColor: "text-indigo-500", 
      type: "select", 
      value: selectedStatus, 
      onChange: setSelectedStatus, 
      options: ["All Students", "Highest Honor", "High Honor", "Honor", " "] 
    }
  ];

  const summaryStats: StatItem[] = [
    { label: "Highest Honor", value: counts.highest, color: "yellow" },
    { label: "High Honor", value: counts.high, color: "red" },
    { label: "Honor", value: counts.honor, color: "green" },
    { label: "None", value: counts.none, color: "blue" },
  ];

  const statusColors = {
    "Highest Honor": "border-yellow-600 text-yellow-600",
    "High Honor": "border-red-500 text-red-500",
    "Honor": "border-green-500 text-green-500",
    " ": "border-blue-500 text-blue-500"
  };

  return (
    <div className="flex flex-col gap-6 p-4 text-foreground">
      <FilterBar filters={filters} />

      <ActionStatsBar 
        badges={[selectedQuarter, selectedClass, `${students.length} Students`]}
        actionLabel="Publish Grades"
        modalTitle="Publish Student Grades"
        modalDescription="Are you sure you want to publish these grades? Parents will be able to view them immediately."
        modalInfoMap={[
            { label: "Grade / Section", value: selectedClass },
            { label: "Quarter", value: selectedQuarter },
            { label: "Total Students", value: students.length }
        ]}
        modalFooter={
          <ul className="list-disc ml-5">
            <li>Email to parent&apos;s registered email</li>
            <li>Push notification through parent portal app</li>
          </ul>
        }
        summaryStats={summaryStats}
        onConfirm={handlePublish}
      />

      <StudentManagementTable 
        title="Grade Management"
        students={filteredStudents}
        statusOptions={["Highest Honor", "High Honor", "Honor", " "]}
        statusColorMap={statusColors}
        withNotes={true}
        onUpdateSingle={handleUpdate}
        onBulkUpdate={handleBulk}
      />
    </div>
  );
}