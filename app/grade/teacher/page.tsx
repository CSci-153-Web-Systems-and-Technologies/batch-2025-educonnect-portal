"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { CalendarIcon, Users, Funnel, Edit } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FilterBar, FilterItem } from "@/components/dashboard/FilterBar";
import { ActionStatsBar, StatItem } from "@/components/dashboard/ActionStatsBar";

// New Modal & Types
import { GradebookModal, StudentFullData, SubjectScore } from "@/components/dashboard/GradebookModal"; 

const generateMockStudents = (): StudentFullData[] => {
  const sections = [
    "Grade 7 - A", "Grade 7 - B", "Grade 7 - C",
    "Grade 8 - A", "Grade 8 - B", "Grade 8 - C",
    "Grade 9 - A", "Grade 9 - B", "Grade 9 - C",
    "Grade 10 - A", "Grade 10 - B", "Grade 10 - C"
  ];

  const subjects = ["Filipino", "English", "Mathematics", "Science", "Aral Pan."];
  const firstNames = ["Ruel", "Maria", "Andres", "Jose", "Emilio", "Apolinario", "Gabriela", "Melchora", "Juan", "Antonio"];
  const lastNames = ["Sinday", "Clara", "Bonifacio", "Rizal", "Aguinaldo", "Mabini", "Silang", "Aquino", "Luna", "Del Pilar"];

  let students: StudentFullData[] = [];
  let idCounter = 1;

  sections.forEach((section, secIdx) => {
    for (let i = 0; i < 5; i++) {
      const fName = firstNames[(idCounter + i) % firstNames.length];
      const lName = lastNames[(secIdx + i) % lastNames.length];
      
      const scores: SubjectScore[] = subjects.map(subj => ({
        name: subj,
        q1: Math.floor(Math.random() * (99 - 75) + 75), 
        q2: "", q3: "", q4: ""
      }));

      students.push({
        id: String(idCounter++),
        name: `${fName} ${lName}`,
        email: `${fName.toLowerCase()}.${lName.toLowerCase()}@student.edu`,
        gradeSection: section,
        scores: scores
      });
    }
  });

  return students;
};
const INITIAL_DATA = generateMockStudents();

// Award Range Values
const getAwardFromAverage = (average: number): string => {
  if (average >= 98) return "Highest Honor";
  if (average >= 95) return "High Honors";
  if (average >= 90) return "With Honors";
  if (average >= 75) return "None";
  return "Failed";
};

export default function TeacherGradePage() {
  const [selectedClass, setSelectedClass] = useState("Grade 7 - A");
  const [selectedQuarter, setSelectedQuarter] = useState("1st Quarter");
  const [selectedStatus, setSelectedStatus] = useState("All Students");
  
  // Use state to hold data
  const [studentsData, setStudentsData] = useState<StudentFullData[]>([]);
  const [modalStudentId, setModalStudentId] = useState<string | null>(null);

  useEffect(() => {
    setStudentsData(INITIAL_DATA);
  }, []);

  const activeQuarterKey = useMemo(() => {
    if (selectedQuarter.includes("1st")) return "q1";
    if (selectedQuarter.includes("2nd")) return "q2";
    if (selectedQuarter.includes("3rd")) return "q3";
    return "q4";
  }, [selectedQuarter]);

  const processedStudents = useMemo(() => {
    return studentsData
      .filter(s => s.gradeSection === selectedClass)
      .map(student => {
        const scores = student.scores
          .map(s => s[activeQuarterKey as keyof SubjectScore])
          .filter(g => g !== "" && typeof g === "number") as number[];

        let average = 0;
        let status = "No Grades";

        if (scores.length > 0) {
          average = scores.reduce((a, b) => a + b, 0) / scores.length;
          status = getAwardFromAverage(average);
        }

        return {
          ...student,
          displayAverage: average > 0 ? average.toFixed(2) + "%" : "-",
          awardStatus: status
        };
      })
      .filter(s => selectedStatus === "All Students" || s.awardStatus === selectedStatus);
  }, [studentsData, selectedClass, activeQuarterKey, selectedStatus]);

  const counts = useMemo(() => ({
    highest: processedStudents.filter(s => s.awardStatus === "Highest Honor").length,
    high: processedStudents.filter(s => s.awardStatus === "High Honors").length,
    honor: processedStudents.filter(s => s.awardStatus === "With Honors").length,
    none: processedStudents.filter(s => s.awardStatus === "None" || s.awardStatus === "No Grades").length,
    failed: processedStudents.filter(s => s.awardStatus === "Failed").length,
  }), [processedStudents]);

  const handleUpdate = useCallback((id: string, newScores: SubjectScore[]) => {
    setStudentsData(prev => prev.map(s => s.id === id ? { ...s, scores: newScores } : s));
  }, []);

  const handlePublish = async () => {
    await new Promise(r => setTimeout(r, 1000));
    alert(`Grades for ${selectedQuarter} have been published!`);
  };

  const filters: FilterItem[] = [
    { id: "q", title: "Quarter Selection", icon: CalendarIcon, iconColor: "text-red-500", type: "select", value: selectedQuarter, onChange: setSelectedQuarter, options: ["1st Quarter", "2nd Quarter", "3rd Quarter", "4th Quarter"] },
    { id: "c", title: "Class Selection", icon: Users, iconColor: "text-white", type: "select", value: selectedClass, onChange: setSelectedClass, options: [
        "Grade 7 - A", "Grade 7 - B", "Grade 7 - C",
        "Grade 8 - A", "Grade 8 - B", "Grade 8 - C",
        "Grade 9 - A", "Grade 9 - B", "Grade 9 - C",
        "Grade 10 - A", "Grade 10 - B", "Grade 10 - C"
    ]},
    { id: "s", title: "Honor Filter", icon: Funnel, iconColor: "text-indigo-500", type: "select", value: selectedStatus, onChange: setSelectedStatus, options: ["All Students", "Highest Honor", "High Honors", "With Honors", "None", "Failed"] }
  ];

  const summaryStats: StatItem[] = [
    { label: "Highest Honor", value: counts.highest, color: "gold" },
    { label: "High Honors", value: counts.high, color: "purple" },
    { label: "With Honors", value: counts.honor, color: "green" },
    { label: "None", value: counts.none, color: "blue" },
    { label: "Failed", value: counts.failed, color: "red" }, 
  ];

  const statusColors: Record<string, string> = {
    "Highest Honor": "border-yellow-600 text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20",
    "High Honors": "border-purple-500 text-purple-600 bg-purple-50 dark:bg-purple-900/20",
    "With Honors": "border-green-500 text-green-600 bg-green-50 dark:bg-green-900/20",
    "None": "border-gray-400 text-gray-500",
    "No Grades": "border-gray-200 text-gray-400 border-dashed",
    "Failed": "border-red-500 text-red-600 bg-red-50 dark:bg-red-900/20"
  };
  
  if (studentsData.length === 0) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-6 p-4 text-foreground">
      <FilterBar filters={filters} />
      
      <ActionStatsBar 
        badges={[selectedQuarter, selectedClass, `${processedStudents.length} Students`]}
        actionLabel="Publish Grades"
        modalTitle="Publish Student Grades"
        modalDescription={`You are about to publish grades for ${selectedQuarter}. Parents will receive notifications immediately.`}
        modalInfoMap={[{ label: "Total Students", value: processedStudents.length }]}
        summaryStats={summaryStats}
        onConfirm={handlePublish}
      />

      <Card className="rounded-3xl border border-black dark:border-neutral-900 p-6 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Grade Management</h2>
            <p className="text-sm text-gray-500">Click &quot;Edit Grades&quot; to set or modify student grades</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {processedStudents.length === 0 && <div className="text-sm opacity-50 p-4">No students found.</div>}
          
          {processedStudents.map((student) => (
            <div key={student.id} className="flex items-center justify-between border border-black dark:border-neutral-800 rounded-2xl p-4 bg-white dark:bg-neutral-900 shadow-sm transition-all hover:shadow-md">
              
              <div>
                <p className="font-bold text-lg text-gray-900 dark:text-white">{student.name}</p>
                <p className="text-sm text-gray-500">{student.email}</p>
              </div>

              <div className="flex items-center gap-6">
                <div className={`px-4 py-1.5 rounded-full text-sm font-bold border ${statusColors[student.awardStatus] || statusColors["None"]}`}>
                  {student.awardStatus}
                </div>

                <Button 
                  onClick={() => setModalStudentId(student.id)}
                  variant="ghost"
                  className="rounded-xl hover:bg-gray-100 dark:hover:bg-neutral-800 h-10 px-4"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {modalStudentId && (
        <GradebookModal 
          student={studentsData.find(s => s.id === modalStudentId)!}
          activeQuarter={
            selectedQuarter.includes("1st") ? "Q1" :
            selectedQuarter.includes("2nd") ? "Q2" :
            selectedQuarter.includes("3rd") ? "Q3" : "Q4"
          }
          onClose={() => setModalStudentId(null)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}