"use client";

import { useState } from "react";
import { CalendarIcon, Users, Funnel } from "lucide-react";
import { FilterBar, FilterItem } from "@/components/dashboard/FilterBar";

export default function TeacherGradePage() {
  const [selectedClass, setSelectedClass] = useState("Grade 7 - A");
  const [selectedQuarter, setSelectedQuarter] = useState("1st Quarter");
  const [selectedStatus, setSelectedStatus] = useState("All Students");

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
      options: ["Grade 7 - A", "Grade 8 - A", "Grade 9 - A, Grade 10 - A"] 
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

  return (
    <div className="flex flex-col gap-6 p-4 text-foreground">
      <FilterBar filters={filters} />
      
      <div className="p-10 border-2 border-dashed border-gray-600 rounded-xl text-center text-gray-400">
        
      </div>
    </div>
  );
}