// Updated React code with summary card and filtered student list
// (User-provided code extended as requested)

"use client";

import { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CalendarIcon, Users, Funnel, ChevronDown } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

export default function ParentDashboardPage() {
  const [selectedClassList, setSelectedClassList] = useState("Grade 7 - A");
  const [selectedStatusList, setSelectedStatusList] = useState("Present");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [open, setOpen] = useState(false);

  const cards = [
    { title: "Date Selection", icon: CalendarIcon, iconClass: "text-red-500", type: "date" },
    { title: "Class Selection", icon: Users, iconClass: "text-white", type: "class" },
    { title: "Status Filter", icon: Funnel, iconClass: "text-indigo-500", type: "status" },
  ];

  const classList = ["Grade 7 - A", "Grade 8 - A", "Grade 9 - A", "Grade 10 - A"]; 
  const statusList = ["All Students", "Present", "Absent", "Excused", "Late"];

  // Sample students (mock data)
  const allStudents = [
    { name: "Ruel Angelo Sinday", email: "21-102429@vsu.edu.ph", grade: "Grade 7 - A", status: "Present" },
    { name: "Ruel Angelo Sinday", email: "21-102429@vsu.edu.ph", grade: "Grade 7 - A", status: "Excused" },
    { name: "Ruel Angelo Sinday", email: "21-102429@vsu.edu.ph", grade: "Grade 7 - A", status: "Late" },
    { name: "Ruel Angelo Sinday", email: "21-102429@vsu.edu.ph", grade: "Grade 7 - A", status: "Absent" },
    { name: "Ruel Angelo Sinday", email: "21-102429@vsu.edu.ph", grade: "Grade 8 - A", status: "Present" }
  ];

  // Filter students based on status selection
  const filteredStudents = useMemo(() => {
    return allStudents
      .filter((s) => s.grade === selectedClassList)
      .filter((s) => (selectedStatusList === "All Students" ? true : s.status === selectedStatusList))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [selectedClassList, selectedStatusList]);

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

      {/* SUMMARY CARD BELOW FILTERS */}
      <Card className="rounded-3xl border border-neutral-700 bg-card p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Status</h2>
        <div className="flex gap-4 flex-wrap">
          <span className="px-4 py-2 rounded-full border border-neutral-600 text-sm font-semibold">
            {date ? date.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" }) : "No date selected"}
          </span>
          <span className="px-4 py-2 rounded-full border border-neutral-600 text-sm font-semibold">
            {selectedClassList}
          </span>
          <span className="px-4 py-2 rounded-full border border-neutral-600 text-sm font-semibold">
            {filteredStudents.length} Students
          </span>
        </div>
      </Card>

      {/* STUDENT LIST */}
      <Card className="rounded-3xl border border-neutral-700 bg-card p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Attendance Management</h2>

        <div className="flex flex-col gap-4">
          {filteredStudents.map((student, idx) => (
            <Card key={idx} className="border border-neutral-700 rounded-2xl p-4 bg-neutral-900">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-lg">{student.name}</p>
                  <p className="text-sm opacity-70">{student.email}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-sm border border-neutral-500">
                  {student.status}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
}
