"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, Users, Funnel, ChevronDown } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

interface AttendanceFiltersProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  selectedClass: string;
  setSelectedClass: (val: string) => void;
  selectedStatus: string;
  setSelectedStatus: (val: string) => void;
}

export function AttendanceFilters({
  date, setDate,
  selectedClass, setSelectedClass,
  selectedStatus, setSelectedStatus
}: AttendanceFiltersProps) {
  
  const classList = ["Grade 7 - A", "Grade 8 - A", "Grade 9 - A", "Grade 10 - A"];
  const statusList = ["All Students", "Present", "Absent", "Excused", "Late"];

  const cards = [
    { title: "Date Selection", icon: CalendarIcon, iconClass: "text-red-500", type: "date" },
    { title: "Class Selection", icon: Users, iconClass: "text-white", type: "class" },
    { title: "Status Filter", icon: Funnel, iconClass: "text-indigo-500", type: "status" },
  ];

  return (
    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
      {cards.map(({ title, icon: Icon, iconClass, type }, i) => (
        <Card key={i} className="rounded-3xl bg-white dark:bg-neutral-900 border border-black dark:border-transparent shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between px-6 pt-4">
            <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">{title}</CardTitle>
            <Icon className={`h-6 w-6 ${iconClass}`} />
          </CardHeader>
          <CardContent className="flex justify-center pb-6 pt-4">
            {type === "date" && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between rounded-xl border-black dark:border-neutral-700">
                    {date ? date.toLocaleDateString() : "Select date"} <ChevronDown className="ml-2 h-4 w-4 opacity-70" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={date} onSelect={setDate} />
                </PopoverContent>
              </Popover>
            )}
            {type === "class" && (
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="w-full rounded-xl border-black dark:border-neutral-700"><SelectValue /></SelectTrigger>
                <SelectContent>{classList.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            )}
            {type === "status" && (
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full rounded-xl border-black dark:border-neutral-700"><SelectValue /></SelectTrigger>
                <SelectContent>{statusList.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}