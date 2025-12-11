"use client";

import { Trash2, Globe, EyeOff, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: React.ReactNode;
  variant?: "danger" | "warning" | "success" | "info";
  confirmLabel?: string;
  isLoading?: boolean;
}

export function ConfirmationModal({
  isOpen, onClose, onConfirm, title, description, variant = "info", confirmLabel = "Confirm", isLoading = false
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const config = {
    danger: { icon: Trash2, color: "text-red-500", bg: "bg-red-50 dark:bg-red-900/20", btn: "bg-red-600 hover:bg-red-700" },
    warning: { icon: EyeOff, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20", btn: "bg-amber-600 hover:bg-amber-700" },
    success: { icon: Globe, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20", btn: "bg-blue-600 hover:bg-blue-700" },
    info: { icon: CheckCircle, color: "text-gray-600", bg: "bg-gray-50 dark:bg-neutral-800", btn: "bg-gray-900 hover:bg-gray-800" },
  }[variant];

  const Icon = config.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-white dark:bg-neutral-900 rounded-3xl p-8 shadow-2xl border border-gray-100 dark:border-neutral-800 animate-in zoom-in-95">
        <div className="flex flex-col items-center text-center mb-6">
          <div className={`h-14 w-14 ${config.bg} rounded-full flex items-center justify-center mb-4`}>
             <Icon className={`h-7 w-7 ${config.color}`} /> 
          </div>
          <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">{title}</h2>
        </div>
        
        <div className="text-gray-500 dark:text-gray-400 text-center mb-8 leading-relaxed">
          {description}
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose} disabled={isLoading} className="rounded-xl px-6 h-11">
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={isLoading} className={`rounded-xl px-8 h-11 text-white shadow-lg ${config.btn}`}>
            {isLoading ? "Processing..." : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}