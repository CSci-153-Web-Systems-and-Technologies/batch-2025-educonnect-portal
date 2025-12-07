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

  const handleSendNotifications = async () => {
    setSending(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1000));
    setSending(false);
    setIsConfirmOpen(false);
  };

  return (
    <>
      {/* STATUS BAR */}
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
          <div className="flex items-center">
            <Button className="rounded-full" onClick={() => setIsConfirmOpen(true)}>
              Send Notifications
            </Button>
          </div>
        </div>
      </Card>

      {/* SEND NOTIFICATION POP UP */}
      {isConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => !sending && setIsConfirmOpen(false)}
          />

          <div className="relative z-10 w-full max-w-md rounded-2xl bg-card border border-neutral-700 p-6 shadow-2xl">
            <h3 className="text-lg font-bold mb-2">Send Attendance Notifications</h3>
            <p className="text-sm opacity-70 mb-4">
              Review the attendance summary below before sending notifications to parents.
            </p>

            <div className="mb-4 space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Grade / Section</span>
                <span className="opacity-80">{selectedClass}</span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium">Date</span>
                <span className="opacity-80">
                  {date ? date.toLocaleDateString() : "No date selected"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium">Total Students</span>
                <span className="opacity-80">{totalStudents}</span>
              </div>

              {/* SUMMARY STATUS BOXES */}
              <div className="grid grid-cols-2 gap-3 mt-3">

                {/* Present */}
                <div className="rounded-lg border border-green-500 p-3 text-green-700 dark:text-green-400 bg-green-50 dark:bg-transparent">
                  <div className="text-sm font-medium opacity-90">Present</div>
                  <div className="text-2xl font-bold">{counts.present}</div>
                </div>

                {/* Late */}
                <div className="rounded-lg border border-yellow-500 p-3 text-yellow-700 dark:text-yellow-400 bg-yellow-50 dark:bg-transparent">
                  <div className="text-sm font-medium opacity-90">Late</div>
                  <div className="text-2xl font-bold">{counts.late}</div>
                </div>

                {/* Absent */}
                <div className="rounded-lg border border-red-500 p-3 text-red-700 dark:text-red-400 bg-red-50 dark:bg-transparent">
                  <div className="text-sm font-medium opacity-90">Absent</div>
                  <div className="text-2xl font-bold">{counts.absent}</div>
                </div>

                {/* Excused */}
                <div className="rounded-lg border border-blue-500 p-3 text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-transparent">
                  <div className="text-sm font-medium opacity-90">Excused</div>
                  <div className="text-2xl font-bold">{counts.excused}</div>
                </div>
              </div>
            </div>

            <div className="text-sm opacity-70 mb-4">
              Notifications will be sent via:
              <ul className="list-disc ml-5">
                <li>Email to parent&apos;s registered email</li>
                <li>SMS to parent&apos;s registered phone</li>
                <li>Push notification through parent portal app</li>
              </ul>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setIsConfirmOpen(false)} disabled={sending}>
                Cancel
              </Button>
              <Button onClick={handleSendNotifications} disabled={sending}>
                {sending ? "Sending..." : "Send"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Helper
function Badge({ text }: { text: string }) {
  return <span className="px-4 py-2 rounded-full border border-black dark:border-neutral-700 text-sm font-semibold text-gray-700 dark:text-gray-200">{text}</span>;
}