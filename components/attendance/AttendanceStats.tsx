"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface StatsProps {
  date: Date | undefined;
  selectedClass: string;
  totalStudents: number;
  counts: { present: number; late: number; absent: number; excused: number };
}

export function AttendanceStats({ date, selectedClass, totalStudents, counts }: StatsProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    setSending(true);
    await new Promise(r => setTimeout(r, 1000));
    setSending(false);
    setIsConfirmOpen(false);
  };

  return (
    <>
      <Card className="rounded-3xl border border-black dark:border-transparent bg-white dark:bg-neutral-900 p-6 shadow-lg">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Status</h2>
            <div className="flex gap-4 flex-wrap">
              <Badge text={date ? date.toLocaleDateString() : "No Date"} />
              <Badge text={selectedClass} />
              <Badge text={`${totalStudents} Students`} />
            </div>
          </div>
          <Button className="rounded-full" onClick={() => setIsConfirmOpen(true)}>Send Notifications</Button>
        </div>
      </Card>

      {isConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => !sending && setIsConfirmOpen(false)} />
          <div className="relative z-10 w-full max-w-md rounded-2xl bg-card border border-neutral-700 p-6 shadow-2xl">
            <h3 className="text-lg font-bold mb-4">Send Attendance Notifications</h3>
            <div className="grid grid-cols-2 gap-3 mb-6">
               <StatBox label="Present" value={counts.present} color="green" />
               <StatBox label="Late" value={counts.late} color="yellow" />
               <StatBox label="Absent" value={counts.absent} color="red" />
               <StatBox label="Excused" value={counts.excused} color="blue" />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setIsConfirmOpen(false)} disabled={sending}>Cancel</Button>
              <Button onClick={handleSend} disabled={sending}>{sending ? "Sending..." : "Send"}</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Badge({ text }: { text: string }) {
  return <span className="px-4 py-2 rounded-full border border-black dark:border-neutral-700 text-sm font-semibold text-gray-700 dark:text-gray-200">{text}</span>;
}

function StatBox({ label, value, color }: { label: string, value: number, color: string }) {
  const colors: Record<string, string> = {
    green: "border-green-500 text-green-700 dark:text-green-400 bg-green-50 dark:bg-transparent",
    yellow: "border-yellow-500 text-yellow-700 dark:text-yellow-400 bg-yellow-50 dark:bg-transparent",
    red: "border-red-500 text-red-700 dark:text-red-400 bg-red-50 dark:bg-transparent",
    blue: "border-blue-500 text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-transparent",
  };
  return (
    <div className={`rounded-lg border p-3 ${colors[color]}`}>
      <div className="text-sm font-medium opacity-90">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}