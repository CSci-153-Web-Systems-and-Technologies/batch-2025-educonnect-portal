"use client";

import { useState, useMemo } from "react";
import { X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type SubjectScore = {
  name: string;
  q1: number | "";
  q2: number | "";
  q3: number | "";
  q4: number | "";
};

export type StudentFullData = {
  id: string;
  name: string;
  email: string;
  gradeSection: string;
  scores: SubjectScore[];
};

interface GradebookModalProps {
  student: StudentFullData;
  activeQuarter: "Q1" | "Q2" | "Q3" | "Q4";
  onClose: () => void;
  onUpdate: (id: string, updatedScores: SubjectScore[]) => void;
}

const calculateAwardStatus = (average: number): string => {
  if (average >= 98) return "Highest Honor";
  if (average >= 95) return "High Honors";
  if (average >= 90) return "With Honors";
  if (average >= 75) return "None";
  return "Failed";
};

export function GradebookModal({ student, activeQuarter, onClose, onUpdate }: GradebookModalProps) {
  const [subjectData, setSubjectData] = useState<SubjectScore[]>(JSON.parse(JSON.stringify(student.scores)));
  const [loading, setLoading] = useState(false);
  const activeQuarterKey = activeQuarter.toLowerCase() as keyof SubjectScore;

  // --- Logic: Quarter Average ---
  const quarterStats = useMemo(() => {
    const grades = subjectData.map(s => s[activeQuarterKey]).filter(g => g !== "") as number[];
    
    if (grades.length === 0) return { average: 0, status: "N/A" };

    const total = grades.reduce((acc, curr) => acc + curr, 0);
    const average = total / grades.length;
    const status = calculateAwardStatus(average);

    return { average, status };
  }, [subjectData, activeQuarterKey]);

  const handleGradeChange = (subjectName: string, value: string) => {
    let numValue: number | "" = "";
    if (value !== "") {
      numValue = Math.max(0, Math.min(100, Number(value)));
    }

    setSubjectData(prev => prev.map(s => 
      s.name === subjectName ? { ...s, [activeQuarterKey]: numValue } : s
    ));
  };
  
  const handleSave = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 500)); 
    onUpdate(student.id, subjectData);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={() => !loading && onClose()} />

      {/* Main Container: Wide Width */}
      <div className="relative z-10 w-full max-w-2xl rounded-2xl bg-white dark:bg-neutral-900 p-6 shadow-2xl text-foreground">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b pb-4 mb-4">
          <div>
            <h3 className="text-xl font-bold">Grade Management</h3>
            <p className="text-sm opacity-70">Input grades for all subjects. 0-100% scale.</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-900 dark:hover:text-white"><X className="h-5 w-5" /></button>
        </div>

        {/* Student Info */}
        <div className="mb-6">
          <p className="text-lg font-semibold">{student.name}</p>
          <p className="text-sm text-muted-foreground">Editing: {activeQuarter} Grades</p>
        </div>

        {/* Grade Table */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm text-left border-collapse border border-gray-300 dark:border-neutral-700">
            <thead className="bg-gray-100 dark:bg-neutral-800">
              <tr className="border-b border-gray-300 dark:border-neutral-700">
                <th className="py-3 px-4 font-medium w-3/5">Subject</th>
                <th className="py-3 px-2 text-center font-medium w-2/5">{activeQuarter}</th>
              </tr>
            </thead>
            <tbody>
              {subjectData.map((subject) => (
                <tr key={subject.name} className="border-b border-gray-300 dark:border-neutral-700">
                  <td className="py-2 px-4 font-medium">{subject.name}</td> 
                  <td className="p-2 text-center">
                    <div className="flex justify-center">
                      <Input 
                        type="number" 
                        value={subject[activeQuarterKey]} 
                        onChange={(e) => handleGradeChange(subject.name, e.target.value)}
                        max={100}
                        min={0}
                        className="text-center h-10 w-24 border-gray-300 dark:border-neutral-600 focus:border-blue-500 bg-transparent text-lg font-medium"
                        onFocus={(e) => e.target.select()}
                      />
                    </div>
                  </td>
                </tr>
              ))}
              
              {/* Quarter Stats Row */}
              <tr className="border-t-2 border-gray-400 dark:border-neutral-600 font-bold bg-gray-100 dark:bg-neutral-800">
                 <td className="py-3 px-4">Quarter Average</td>
                 <td className="py-3 px-2 text-center text-xl">
                    {quarterStats.average > 0 ? quarterStats.average.toFixed(2) : "-"}
                 </td>
              </tr>
              {/* Award Status Row */}
              <tr className="border-t border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-900/50">
                 <td className="py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Award Status</td>
                 <td className="py-3 px-2 text-center font-bold text-blue-600 dark:text-blue-400 text-lg">
                    {quarterStats.status}
                 </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 mt-4">
          <Button variant="ghost" onClick={onClose} disabled={loading} className="bg-red-600/5 hover:bg-red-600/10 text-red-600">Cancel</Button>
          <Button onClick={handleSave} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Save className="h-4 w-4 mr-2" />
            {loading ? "Updating..." : "Update"}
          </Button>
        </div>

      </div>
    </div>
  );
}