"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit2 } from "lucide-react";

export type Student = {
  id: string;
  name: string;
  email: string;
  grade: string;
  status: "Present" | "Late" | "Absent" | "Excused";
};

interface TableProps {
  students: Student[];
  onUpdateStudent: (id: string, status: Student["status"]) => void;
  onBulkUpdate: (updates: Record<string, Student["status"]>) => void;
}

export function AttendanceTable({ students, onUpdateStudent, onBulkUpdate }: TableProps) {
  const [multipleEditMode, setMultipleEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<Student["status"]>("Present");
  const [pendingEdits, setPendingEdits] = useState<Record<string, Student["status"]>>({});

  const handleApplyBulk = () => {
    onBulkUpdate(pendingEdits);
    setPendingEdits({});
    setMultipleEditMode(false);
  };

  return (
    <Card className="rounded-3xl border border-black dark:border-transparent bg-white dark:bg-neutral-900 p-6 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Attendance Management</h2>
        <div className="flex gap-3">
          <Button variant={multipleEditMode ? "default" : "outline"} onClick={() => { setMultipleEditMode(!multipleEditMode); setEditingId(null); }}>
            {multipleEditMode ? "Exit Multiple Edit" : "Multiple Edit"}
          </Button>
          {multipleEditMode && (
            <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={handleApplyBulk}>Apply All</Button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {students.length === 0 && <div className="text-sm opacity-70">No students match the selected filters.</div>}
        
        {students.map((student) => {
          const isInlineEditing = editingId === student.id;
          
          return (
            <div key={student.id} className="flex items-center justify-between border border-black dark:border-neutral-800 rounded-2xl p-3 bg-white dark:bg-neutral-900 shadow-sm">
              <div>
                <p className="font-semibold text-lg text-gray-900 dark:text-white">{student.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{student.email}</p>
              </div>

              <div className="flex items-center gap-4">
                {multipleEditMode ? (
                  <Select value={pendingEdits[student.id] ?? student.status} onValueChange={(v) => setPendingEdits(prev => ({...prev, [student.id]: v as any}))}>
                    <SelectTrigger className="w-40 rounded-full border-black dark:border-neutral-700"><SelectValue /></SelectTrigger>
                    <SelectContent>{["Present", "Late", "Absent", "Excused"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                ) : isInlineEditing ? (
                  <div className="flex items-center gap-2">
                    <Select value={editValue} onValueChange={(v) => setEditValue(v as any)}>
                      <SelectTrigger className="w-36 rounded-full border-black dark:border-neutral-700"><SelectValue /></SelectTrigger>
                      <SelectContent>{["Present", "Late", "Absent", "Excused"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                    <Button onClick={() => { onUpdateStudent(student.id, editValue); setEditingId(null); }} size="sm">Save</Button>
                    <Button variant="ghost" onClick={() => setEditingId(null)} size="sm">Cancel</Button>
                  </div>
                ) : (
                  <>
                    <StatusBadge status={student.status} />
                    <Button onClick={() => { setEditingId(student.id); setEditValue(student.status); }} variant="ghost" className="rounded-lg gap-2">
                      <Edit2 className="h-4 w-4" /> Edit
                    </Button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
    const colors: Record<string, string> = { 
        Present: "border-green-500 text-green-500", 
        Late: "border-yellow-500 text-yellow-500", 
        Absent: "border-red-500 text-red-500", Excused: "border-blue-500 text-blue-500" 
    };
    return <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${colors[status] || ""} bg-transparent`}>{status}</span>;
}