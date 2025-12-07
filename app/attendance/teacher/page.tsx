"use client";

import { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CalendarIcon, Users, Funnel, ChevronDown, Edit2 } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

type Student = {
  id: string;
  name: string;
  email: string;
  grade: string;
  status: "Present" | "Late" | "Absent" | "Excused";
};

export default function TeacherDashboardPage() {
  const [selectedClassList, setSelectedClassList] = useState("Grade 7 - A");
  const [selectedStatusList, setSelectedStatusList] = useState("Present");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [open, setOpen] = useState(false);

  // modal state for send confirmation
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [sending, setSending] = useState(false);

  // single inline edit
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<Student["status"]>("Present");

  // multiple edit mode
  const [multipleEditMode, setMultipleEditMode] = useState(false);
  const [pendingEdits, setPendingEdits] = useState<Record<string, Student["status"]>>({});

  const cards = [
    { title: "Date Selection", icon: CalendarIcon, iconClass: "text-red-500", type: "date" },
    { title: "Class Selection", icon: Users, iconClass: "text-white", type: "class" },
    { title: "Status Filter", icon: Funnel, iconClass: "text-indigo-500", type: "status" },
  ];

  const classList = ["Grade 7 - A", "Grade 8 - A", "Grade 9 - A", "Grade 10 - A"];
  const statusList = ["All Students", "Present", "Absent", "Excused", "Late"] as const;

  // Sample students (mock data) - now stored in state so edits persist locally
  const [students, setStudents] = useState<Student[]>([
    { id: "21-1-02429", name: "Ruel Angelo Sinday", email: "21-102429@vsu.edu.ph", grade: "Grade 7 - A", status: "Present" },
    { id: "21-1-02430", name: "Ruel Angelo Sinday", email: "21-1-02430@vsu.edu.ph", grade: "Grade 7 - A", status: "Excused" },
    { id: "21-1-02431", name: "Ruel Angelo Sinday", email: "21-1-02431@vsu.edu.ph", grade: "Grade 7 - A", status: "Late" },
    { id: "21-1-02432", name: "Ruel Angelo Sinday", email: "21-1-02432@vsu.edu.ph", grade: "Grade 9 - A", status: "Absent" },
    { id: "21-1-02433", name: "Ruel Angelo Sinday", email: "21-1-02433@vsu.edu.ph", grade: "Grade 7 - A", status: "Present" },
    { id: "21-1-02434", name: "Ruel Angelo Sinday", email: "21-1-02434@vsu.edu.ph", grade: "Grade 8 - A", status: "Present" }
  ]);

  // Filter students shown in the Attendance Management list (applies class + status filters)
  const filteredStudents = useMemo(() => {
    return students
      .filter((s) => s.grade === selectedClassList)
      .filter((s) => (selectedStatusList === "All Students" ? true : s.status === selectedStatusList))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [students, selectedClassList, selectedStatusList]);

  // All students in the selected grade (used for summary counts)
  const studentsInGrade = useMemo(() => {
    return students.filter((s) => s.grade === selectedClassList);
  }, [students, selectedClassList]);

  // compute live counts
  const counts = useMemo(() => {
    const present = studentsInGrade.filter((s) => s.status === "Present").length;
    const late = studentsInGrade.filter((s) => s.status === "Late").length;
    const absent = studentsInGrade.filter((s) => s.status === "Absent").length;
    const excused = studentsInGrade.filter((s) => s.status === "Excused").length;
    const total = studentsInGrade.length;
    return { present, late, absent, excused, total };
  }, [studentsInGrade]);

  // Replace this with your real API / Supabase call to dispatch notifications.
  const handleSendNotifications = async () => {
    if (counts.total === 0) {
      alert("No students in the selected class.");
      return;
    }

    setSending(true);
    try {
      // TODO: integrate with your backend (Supabase RPC or API) to send notifications
      await new Promise((r) => setTimeout(r, 800)); // simulate network
      setIsConfirmOpen(false);
      console.log("Notifications sent for", selectedClassList, counts);
    } catch (err) {
      console.error("Failed to send notifications", err);
      alert("Failed to send notifications. Check console for details.");
    } finally {
      setSending(false);
    }
  };
  
  const saveEdit = (id: string) => {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, status: editValue } : s)));
    setEditingId(null);
  };

  const StatusBadge = ({ status }: { status: Student["status"] }) => {
    const base = "px-3 py-1 rounded-full text-sm font-semibold inline-flex items-center gap-2";
    if (status === "Present") {
      return <span className={`${base} border border-green-500 text-green-500 bg-transparent`}>{status}</span>;
    }
    if (status === "Late") {
      return <span className={`${base} border border-yellow-500 text-yellow-500 bg-transparent`}>{status}</span>;
    }
    if (status === "Absent") {
      return <span className={`${base} border border-red-500 text-red-500 bg-transparent`}>{status}</span>;
    }
    return <span className={`${base} border border-blue-500 text-blue-500 bg-transparent`}>{status}</span>;
  };

  return (
    <div className="flex flex-col gap-6 p-4 text-foreground">
      {/* CARDS */}
      <div className="grid auto-rows-min gap-4 md:grid-cols-3 lg:grid-cols-3">
        {cards.map(({ title, icon: Icon, iconClass, type }, i) => (
          <Card key={i} className="rounded-3xl bg-card border border-neutral-700 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between px-6 pt-4">
              <CardTitle className="text-xl font-bold">{title}</CardTitle>
              <Icon className={`h-6 w-6 ${iconClass}`} />
            </CardHeader>

            <CardContent className="flex justify-center pb-6 pt-4">
              {type === "date" && (
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-90 justify-between text-left rounded-xl border border-neutral-600 bg-transparent text-white"
                    >
                      {date ? date.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" }) : "Select date"}
                      <ChevronDown className="ml-2 h-4 w-4 opacity-70" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(d) => {
                        setDate(d);
                        setOpen(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              )}

              {type === "class" && (
                <Select value={selectedClassList} onValueChange={setSelectedClassList}>
                  <SelectTrigger className="w-90 rounded-xl border border-neutral-600 bg-transparent text-white">
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-neutral-900">
                    {classList.map((cl) => (
                      <SelectItem key={cl} value={cl}>{cl}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {type === "status" && (
                <Select value={selectedStatusList} onValueChange={setSelectedStatusList}>
                  <SelectTrigger className="w-90 rounded-xl border border-neutral-600 bg-transparent text-white">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-neutral-900">
                    {statusList.map((st) => (
                      <SelectItem key={st} value={st}>{st}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* STATUS DISPLAY */}
      <Card className="rounded-3xl border border-neutral-700 bg-card p-6 shadow-lg">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold mb-4">Status</h2>
            <div className="flex gap-4 flex-wrap">
              <span className="px-4 py-2 rounded-full border border-neutral-600 text-sm font-semibold">
                {date ? date.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" }) : "No date selected"}
              </span>

              <span className="px-4 py-2 rounded-full border border-neutral-600 text-sm font-semibold">
                {selectedClassList}
              </span>

              <span className="px-4 py-2 rounded-full border border-neutral-600 text-sm font-semibold">
                {counts.total} Students
              </span>
            </div>
          </div>

          <div className="flex items-center">
            <Button className="rounded-full" onClick={() => setIsConfirmOpen(true)}>
              Send Notifications
            </Button>
          </div>
        </div>
      </Card>

      {/* STUDENT LIST */}
      <Card className="rounded-3xl border border-neutral-700 bg-card p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Attendance Management</h2>

          <div className="flex gap-3">
            {/* MULTIPLE EDIT BUTTON */}
            <Button
              className="rounded-lg px-4"
              variant={multipleEditMode ? "default" : "outline"}
              onClick={() => {
                setMultipleEditMode((prev) => !prev);
                setPendingEdits({});
                setEditingId(null);
              }}
            >
              {multipleEditMode ? "Exit Multiple Edit" : "Multiple Edit"}
            </Button>

            {/* APPLY ALL button */}
            {multipleEditMode && (
              <Button
                className="rounded-lg px-4 bg-green-600 hover:bg-green-700"
                onClick={() => {
                  setStudents((prev) =>
                    prev.map((s) =>
                      pendingEdits[s.id] ? { ...s, status: pendingEdits[s.id] } : s
                    )
                  );
                  setPendingEdits({});
                  setMultipleEditMode(false);
                }}
              >
                Apply All
              </Button>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {filteredStudents.length === 0 && (
            <div className="text-sm opacity-70">No students match the selected filters.</div>
          )}

          {filteredStudents.map((student) => {
            const isInlineEditing = editingId === student.id;
            const pendingValue = pendingEdits[student.id];

            return (
              <div
                key={student.id}
                className="flex items-center justify-between border border-neutral-700 rounded-2xl p-3 bg-neutral-900"
              >
                <div>
                  <p className="font-semibold text-lg">{student.name}</p>
                  <p className="text-sm opacity-70">{student.email}</p>
                </div>

                <div className="flex items-center gap-4">
                  {/* MULTIPLE EDIT MODE */}
                  {multipleEditMode ? (
                    <Select
                      value={pendingValue ?? student.status}
                      onValueChange={(v) =>
                        setPendingEdits((prev) => ({ ...prev, [student.id]: v as Student["status"] }))
                      }
                    >
                      <SelectTrigger className="w-40 rounded-full border border-neutral-600 bg-transparent">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-neutral-900">
                        <SelectItem value="Present">Present</SelectItem>
                        <SelectItem value="Late">Late</SelectItem>
                        <SelectItem value="Absent">Absent</SelectItem>
                        <SelectItem value="Excused">Excused</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <>
                      {/* SINGLE EDIT MODE */}
                      {isInlineEditing ? (
                        <div className="flex items-center gap-2">
                          <Select
                            value={editValue}
                            onValueChange={(v) => setEditValue(v as Student["status"])}
                          >
                            <SelectTrigger className="w-36 rounded-full border border-neutral-600 bg-transparent text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="dark:bg-neutral-900">
                              <SelectItem value="Present">Present</SelectItem>
                              <SelectItem value="Late">Late</SelectItem>
                              <SelectItem value="Absent">Absent</SelectItem>
                              <SelectItem value="Excused">Excused</SelectItem>
                            </SelectContent>
                          </Select>

                          <Button onClick={() => saveEdit(student.id)} className="px-3 py-1">
                            Save
                          </Button>
                          <Button variant="ghost" onClick={() => setEditingId(null)}>
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <>
                          <StatusBadge status={student.status} />

                          <Button
                            onClick={() => {
                              if (!multipleEditMode) {
                                setEditingId(student.id);
                                setEditValue(student.status);
                              }
                            }}
                            className="px-3 py-1 rounded-lg inline-flex items-center gap-2"
                          >
                            <Edit2 className="h-4 w-4" />
                            Edit
                          </Button>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* CONFIRMATION MODAL - shows live summary counts (colored boxes) */}
      {isConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => !sending && setIsConfirmOpen(false)} />

          <div className="relative z-10 w-full max-w-md rounded-2xl bg-card border border-neutral-700 p-6 shadow-2xl">
            <h3 className="text-lg font-bold mb-2">Send Attendance Notifications</h3>
            <p className="text-sm opacity-70 mb-4">Review the attendance summary below before sending notifications to parents.</p>

            <div className="mb-4 space-y-2">
              <div className="flex justify-between"><span className="font-medium">Grade / Section</span><span className="opacity-80">{selectedClassList}</span></div>
              <div className="flex justify-between"><span className="font-medium">Date</span><span className="opacity-80">{date ? date.toLocaleDateString() : "No date selected"}</span></div>
              <div className="flex justify-between"><span className="font-medium">Total Students</span><span className="opacity-80">{counts.total}</span></div>

              <div className="grid grid-cols-2 gap-3 mt-3">
                <div className="rounded-lg border border-green-500 p-3 text-green-400">
                  <div className="text-sm font-medium opacity-90">Present</div>
                  <div className="text-2xl font-bold">{counts.present}</div>
                </div>

                <div className="rounded-lg border border-yellow-500 p-3 text-yellow-400">
                  <div className="text-sm font-medium opacity-90">Late</div>
                  <div className="text-2xl font-bold">{counts.late}</div>
                </div>

                <div className="rounded-lg border border-red-500 p-3 text-red-400">
                  <div className="text-sm font-medium opacity-90">Absent</div>
                  <div className="text-2xl font-bold">{counts.absent}</div>
                </div>

                <div className="rounded-lg border border-blue-500 p-3 text-blue-400">
                  <div className="text-sm font-medium opacity-90">Excused</div>
                  <div className="text-2xl font-bold">{counts.excused}</div>
                </div>
              </div>
            </div>

            <div className="text-sm opacity-70 mb-4">
              Notifications will be sent via:
              <ul className="list-disc ml-5">
                <li>Email to parent's registered email</li>
                <li>SMS to parent's registered phone</li>
                <li>Push notification through parent portal app</li>
              </ul>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setIsConfirmOpen(false)} disabled={sending}>Cancel</Button>
              <Button onClick={handleSendNotifications} disabled={sending}>{sending ? "Sending..." : "Send"}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}