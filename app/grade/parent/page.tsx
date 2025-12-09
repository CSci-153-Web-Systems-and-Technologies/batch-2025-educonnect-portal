"use client";

import { useMemo } from "react";
import { PieChart, ScrollText, Award, Trophy } from "lucide-react";

// Generic Components
import { StatCard } from "@/components/dashboard/StatCard";

// --- TYPES ---
type SubjectGrade = {
  subject: string;
  teacher: string;
  q1: number;
  q2: number;
  q3: number;
  q4: number;
};

// --- HELPER: AWARD LOGIC ---
const getAwardStatus = (gpa: number) => {
  if (gpa >= 98) return "Highest Honor";
  if (gpa >= 95) return "High Honor";
  if (gpa >= 90) return "With Honor";
  return "None";
};

export default function ParentGradePage() {
  
  // --- MOCK DATA ---
  const grades: SubjectGrade[] = [
    { subject: "Mathematics", teacher: "Ms. Riguez", q1: 90, q2: 92, q3: 93, q4: 95 },
    { subject: "Science", teacher: "Mr. Chen", q1: 80, q2: 85, q3: 90, q4: 85 },
    { subject: "English", teacher: "Mrs. Thompson", q1: 75, q2: 88, q3: 78, q4: 88 },
    { subject: "Aral Panlipunan", teacher: "Mr. Santos", q1: 86, q2: 90, q3: 92, q4: 90 },
    { subject: "Physical Education", teacher: "Mr. Sinday", q1: 95, q2: 97, q3: 94, q4: 97 },
    { subject: "Art", teacher: "Ms. Davis", q1: 92, q2: 98, q3: 95, q4: 98 },
  ];

  // --- LOGIC: CENTRALIZED CALCULATIONS ---
  const { averages, gpa, award } = useMemo(() => {
    // 1. Calculate Final Rating per Subject (Row Average)
    const processedRows = grades.map(g => ({
      ...g,
      final: (g.q1 + g.q2 + g.q3 + g.q4) / 4
    }));

    // 2. Calculate Quarterly Averages (Column Averages)
    const total = processedRows.reduce((acc, curr) => ({
      q1: acc.q1 + curr.q1,
      q2: acc.q2 + curr.q2,
      q3: acc.q3 + curr.q3,
      q4: acc.q4 + curr.q4,
      final: acc.final + curr.final
    }), { q1: 0, q2: 0, q3: 0, q4: 0, final: 0 });

    const count = processedRows.length;
    
    // 3. Compute Final GPA and Status
    const finalGPA = total.final / count;

    return {
      averages: {
        q4: total.q4 / count, // We only need Q4 for the stat card right now
      },
      gpa: finalGPA.toFixed(2),
      award: getAwardStatus(finalGPA)
    };
  }, [grades]);

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 pt-2 text-foreground">
      
      {/* 1. TOP SUMMARY CARDS */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Current Quarter" 
          value="4" 
          subtitle="Academic Year 2024-2025" 
          icon={PieChart} 
          iconColor="text-red-500" 
        />
        <StatCard 
          title="Award Status" 
          value={award} 
          subtitle="Based on overall GPA" 
          icon={ScrollText} 
          iconColor="text-green-500" 
        />
        <StatCard 
          title="Quarterly Average" 
          value={`${averages.q4.toFixed(2)} %`} 
          subtitle="4th Quarter Performance" 
          icon={Award} 
          iconColor="text-yellow-500" 
        />
        <StatCard 
          title="Overall GPA" 
          value={`${gpa} %`} 
          subtitle="Cumulative Grade" 
          icon={Trophy} 
          iconColor="text-red-500" 
        />
      </div>

      {/* Placeholder for Part 2 */}
      <div className="p-10 border-2 border-dashed border-gray-300 rounded-xl text-center text-gray-400">
        Grade Table Coming Soon...
      </div>
    </div>
  );
}