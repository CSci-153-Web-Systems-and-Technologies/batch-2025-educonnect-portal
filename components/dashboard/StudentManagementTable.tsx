"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Ensure this exists, or use <input className="..." />
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit2, StickyNote } from "lucide-react";

export interface StudentRow {
  id: string;
  name: string;
  email: string;
  status: string;
  notes?: string; // New optional field
}

interface TableProps {
  title: string;
  students: StudentRow[];
  statusOptions: string[];
  statusColorMap?: Record<string, string>;
  withNotes?: boolean; // New prop to enable the notes field
  onUpdateSingle: (id: string, status: string, notes: string) => void; // Updated signature
  onBulkUpdate: (updates: Record<string, string>) => void;
}

export function StudentManagementTable({ 
  title, students, statusOptions, statusColorMap, withNotes = false, onUpdateSingle, onBulkUpdate 
}: TableProps) {
  const [multipleEditMode, setMultipleEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Edit States
  const [editValue, setEditValue] = useState<string>(statusOptions[0]);
  const [editNotes, setEditNotes] = useState<string>(""); // State for notes
  
  const [pendingEdits, setPendingEdits] = useState<Record<string, string>>({});

  const handleApplyBulk = () => {
    onBulkUpdate(pendingEdits);
    setPendingEdits({});
    setMultipleEditMode(false);
  };

  return (
    <Card className="rounded-3xl border border-black dark:border-transparent bg-white dark:bg-neutral-900 p-6 shadow-lg">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
        <div className="flex gap-3">
          <Button 
            variant={multipleEditMode ? "default" : "outline"} 
            className="border-black dark:border-neutral-700"
            onClick={() => { setMultipleEditMode(!multipleEditMode); setEditingId(null); }}
          >
            {multipleEditMode ? "Exit Multiple Edit" : "Multiple Edit"}
          </Button>
          {multipleEditMode && (
            <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={handleApplyBulk}>
              Apply All
            </Button>
          )}
        </div>
      </div>

      {/* ROWS */}
      <div className="flex flex-col gap-4">
        {students.length === 0 && <div className="text-sm opacity-70">No students match filters.</div>}
        
        {students.map((student) => {
          const isInlineEditing = editingId === student.id;
          
          return (
            <div key={student.id} className="flex items-center justify-between border border-black dark:border-neutral-800 rounded-2xl p-3 bg-white dark:bg-neutral-900 shadow-sm">
              
              {/* INFO */}
              <div>
                <p className="font-semibold text-lg text-gray-900 dark:text-white">{student.name}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <span>{student.email}</span>
                  {/* Show note icon if note exists and not editing */}
                  {!isInlineEditing && student.notes && (
                    <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-full">
                      <StickyNote className="h-3 w-3" />
                      <span className="max-w-[150px] truncate">{student.notes}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* CONTROLS */}
              <div className="flex items-center gap-4">
                
                {/* 1. BULK EDIT MODE */}
                {multipleEditMode ? (
                  <Select 
                    value={pendingEdits[student.id] ?? student.status} 
                    onValueChange={(v) => setPendingEdits(prev => ({...prev, [student.id]: v}))}
                  >
                    <SelectTrigger className="w-40 rounded-full border-black dark:border-neutral-700"><SelectValue /></SelectTrigger>
                    <SelectContent>{statusOptions.map(s => <SelectItem key={s} value={s}>{s === " " ? "None" : s}</SelectItem>)}</SelectContent>
                  </Select>
                ) : isInlineEditing ? (
                  
                  // 2. INLINE EDIT MODE (With Notes)
                  <div className="flex items-center gap-2">
                    <Select value={editValue} onValueChange={setEditValue}>
                      <SelectTrigger className="w-36 rounded-full border-black dark:border-neutral-700"><SelectValue /></SelectTrigger>
                      <SelectContent>{statusOptions.map(s => <SelectItem key={s} value={s}>{s === " " ? "None" : s}</SelectItem>)}</SelectContent>
                    </Select>

                    {/* NOTES INPUT SECTION */}
                    {withNotes && (
                      <Input 
                        placeholder="Reason (e.g. Late due to traffic)"
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        className="h-10 w-64 rounded-xl border-black dark:border-neutral-700"
                      />
                    )}

                    <Button onClick={() => { onUpdateSingle(student.id, editValue, editNotes); setEditingId(null); }} size="sm" className="bg-white text-black hover:bg-gray-200">Save</Button>
                    <Button variant="ghost" onClick={() => setEditingId(null)} size="sm">Cancel</Button>
                  </div>
                ) : (
                  
                  // 3. VIEW MODE
                  <>
                    <StatusBadge status={student.status} colorMap={statusColorMap} />
                    <Button 
                      onClick={() => { 
                        setEditingId(student.id); 
                        setEditValue(student.status); 
                        setEditNotes(student.notes || ""); // Load existing note
                      }} 
                      variant="ghost" 
                      className="rounded-lg gap-2"
                    >
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

// Helper for Badge
function StatusBadge({ status, colorMap }: { status: string, colorMap?: Record<string, string> }) {
  const colorClass = colorMap?.[status] || "border-gray-500 text-gray-500";
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${colorClass} bg-transparent`}>
      {status === " " ? "None" : status}
    </span>
  );
}