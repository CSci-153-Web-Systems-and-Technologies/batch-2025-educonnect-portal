"use client";

import { useMemo } from "react";
import { PieChart, ScrollText, Award, Trophy } from "lucide-react";
import { RoleGuard } from "@/components/RoleGuard";

// Generic Components
import { StatCard } from "@/components/dashboard/StatCard";
import { DashboardSection } from "@/components/dashboard/DashboardSection"; // Added this import

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
  const { rows, averages, gpa, award } = useMemo(() => {
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
      rows: processedRows, // Needed for the Table
      averages: {
        q1: total.q1 / count,
        q2: total.q2 / count,
        q3: total.q3 / count,
        q4: total.q4 / count,
        final: finalGPA
      },
      gpa: finalGPA.toFixed(2),
      award: getAwardStatus(finalGPA)
    };
  }, [grades]);

  return (
    <RoleGuard allowedRole="parent">
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

      {/* 2. OVERALL GRADES TABLE (NEW SECTION) */}
      <DashboardSection 
          title="Overall Grades" 
          subtitle="Quarterly academic performance breakdown"
      >
          <div className="overflow-x-auto mt-4">
              <table className="w-full text-left border-collapse">
                  <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-800">
                          <th className="py-4 px-4 font-serif text-lg font-medium text-gray-700 dark:text-gray-300 w-1/3">Subjects</th>
                          <th className="py-4 px-4 font-serif font-medium text-gray-600 dark:text-gray-400 text-center">Q1</th>
                          <th className="py-4 px-4 font-serif font-medium text-gray-600 dark:text-gray-400 text-center">Q2</th>
                          <th className="py-4 px-4 font-serif font-medium text-gray-600 dark:text-gray-400 text-center">Q3</th>
                          <th className="py-4 px-4 font-serif font-medium text-gray-600 dark:text-gray-400 text-center">Q4</th>
                          <th className="py-4 px-4 font-serif font-medium text-gray-600 dark:text-gray-400 text-right">Final rating</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {rows.map((row, idx) => (
                          <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors">
                              <td className="py-4 px-4">
                                  <div className="font-serif text-lg text-gray-900 dark:text-white">{row.subject}</div>
                                  <div className="font-serif text-xs text-gray-400">{row.teacher}</div>
                              </td>
                              <td className="py-4 px-4 text-center text-gray-700 dark:text-gray-300">{row.q1}</td>
                              <td className="py-4 px-4 text-center text-gray-700 dark:text-gray-300">{row.q2}</td>
                              <td className="py-4 px-4 text-center text-gray-700 dark:text-gray-300">{row.q3}</td>
                              <td className="py-4 px-4 text-center text-gray-900 dark:text-white font-bold">{row.q4}</td>
                              <td className="py-4 px-4 text-right font-medium text-gray-900 dark:text-white">{row.final.toFixed(1)}</td>
                          </tr>
                      ))}
                  </tbody>
                  {/* Footer: Averages */}
                  <tfoot>
                      <tr className="border-t-2 border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-neutral-900/50">
                          <td className="py-6 px-4 font-serif text-xl font-medium text-gray-900 dark:text-white">General Average</td>
                          <td className="py-6 px-4 text-center text-gray-500">{averages.q1.toFixed(2)}</td>
                          <td className="py-6 px-4 text-center text-gray-500">{averages.q2.toFixed(2)}</td>
                          <td className="py-6 px-4 text-center text-gray-500">{averages.q3.toFixed(2)}</td>
                          <td className="py-6 px-4 text-center text-gray-900 dark:text-white font-bold">{averages.q4.toFixed(2)}</td>
                          <td className="py-6 px-4 text-right text-xl font-bold text-gray-900 dark:text-white">{averages.final.toFixed(2)}</td>
                      </tr>
                  </tfoot>
              </table>
          </div>
      </DashboardSection>
    </div>
    </RoleGuard>
  );
}