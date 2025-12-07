"use client";

import { useState, ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export type StatItem = {
  label: string;
  value: number;
  color: "green" | "yellow" | "red" | "blue";
};

interface ActionStatsBarProps {
  // Bar Props
  badges: string[]; // Shown on the horizontal bar
  actionLabel: string; // Button Text
  
  // Modal Props
  modalTitle: string;
  modalDescription: string;
  modalInfoMap: { label: string; value: string | number }[]; // The vertical list in the modal
  summaryStats: StatItem[]; // The colored boxes
  modalFooter?: ReactNode; // The bullet points
  onConfirm: () => Promise<void>;
}

export function ActionStatsBar({
  badges,
  actionLabel,
  modalTitle,
  modalDescription,
  modalInfoMap,
  summaryStats,
  modalFooter,
  onConfirm
}: ActionStatsBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm();
    setLoading(false);
    setIsOpen(false);
  };

  return (
    <>
      {/* --- STATUS BAR --- */}
      <Card className="rounded-3xl border border-black dark:border-transparent bg-white dark:bg-neutral-900 p-6 shadow-lg">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Status</h2>
            <div className="flex gap-4 flex-wrap">
              {badges.map((text, i) => (
                <span key={i} className="px-4 py-2 rounded-full border border-black dark:border-neutral-700 text-sm font-semibold text-gray-700 dark:text-gray-200">
                  {text}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center">
            <Button className="rounded-full" onClick={() => setIsOpen(true)}>
              {actionLabel}
            </Button>
          </div>
        </div>
      </Card>

      {/* --- MODAL --- */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => !loading && setIsOpen(false)} />
          <div className="relative z-10 w-full max-w-md rounded-2xl bg-card border border-neutral-700 p-6 shadow-2xl text-white">
            <h3 className="text-lg font-bold mb-2">{modalTitle}</h3>
            <p className="text-sm opacity-70 mb-4">{modalDescription}</p>
            
            {/* Info List (Grade, Date, Total) */}
            <div className="mb-4 space-y-2">
               {modalInfoMap.map((item, i) => (
                 <div key={i} className="flex justify-between">
                    <span className="font-medium">{item.label}</span>
                    <span className="opacity-80">{item.value}</span>
                 </div>
               ))}

               {/* Stats Grid (Colored Boxes) */}
               <div className="grid grid-cols-2 gap-3 mt-4">
                  {summaryStats.map((stat, i) => <StatBox key={i} {...stat} />)}
               </div>
            </div>

            {/* Footer List */}
            {modalFooter && <div className="text-sm opacity-70 mb-6">{modalFooter}</div>}

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setIsOpen(false)} disabled={loading}>
                Cancel
              </Button>
              <Button onClick={handleConfirm} disabled={loading} className="bg-white text-black hover:bg-gray-200">
                {loading ? "Sending..." : "Send"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Helper: Colored Stat Box
function StatBox({ label, value, color }: StatItem) {
  const colors = {
    green: "border-green-500 text-green-400",
    yellow: "border-yellow-500 text-yellow-400",
    red: "border-red-500 text-red-400",
    blue: "border-blue-500 text-blue-400",
  };
  return (
    <div className={`rounded-lg border p-3 ${colors[color]}`}>
      <div className="text-sm font-medium opacity-90">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}