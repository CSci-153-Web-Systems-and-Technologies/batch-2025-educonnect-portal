"use client";

import { Calendar as CalendarIcon, Edit, Globe, EyeOff, Trash2, FileText, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

// --- Visual Types for Layout ---
type AssignmentLayoutProps = {
  id: string;
  subject: string;
  type: string;
  startDate: string;
  dueDate: string;
  status: string;
  creator: string;
  description: string;
};

// --- 1. Side Panel List (Visual) ---
export function AssignmentDetailsList({ items = [] }: { items?: AssignmentLayoutProps[] }) {
  // Empty State Design (Matches your screenshot)
  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center text-center h-full">
        <div className="h-16 w-16 bg-gray-50 dark:bg-neutral-800 rounded-2xl flex items-center justify-center mb-4 text-gray-400">
          <CalendarIcon className="h-8 w-10" />
        </div>
        <p className="text-lg font-bold text-gray-900 dark:text-white mb-1">No event schedule</p>
        <p className="text-sm text-gray-500">No events found for this date.</p>
      </div>
    );
  }

  // List State Design
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="flex items-start gap-4 p-4 rounded-2xl border border-gray-100 dark:border-neutral-800 hover:bg-gray-50/50 transition-colors">
          <div className="flex h-14 w-16 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white">{item.subject}</h4>
            <div className="text-sm text-gray-500">{item.type}</div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-400">
                <Clock className="h-3 w-3" />
                <span>Due: {item.dueDate}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// --- 2. Table Row (Visual) ---
export function AssignmentRow({ item }: { item: AssignmentLayoutProps }) {
  return (
    <tr className="group hover:bg-gray-50/80 cursor-pointer border-b border-gray-50 transition-colors">
      <td className="py-5 pl-4">
        <div className="font-bold text-gray-900 dark:text-white">{item.subject}</div>
        <div className="text-xs text-gray-400 mt-0.5 max-w-[200px] truncate">{item.description}</div>
      </td>
      
      <td className="py-5">
        <span className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-neutral-800 text-xs font-medium text-gray-600 dark:text-gray-300">
            {item.type}
        </span>
      </td>
      
      <td className="py-5 text-gray-600 dark:text-gray-400 text-sm">{item.startDate}</td>
      <td className="py-5 text-gray-600 dark:text-gray-400 text-sm">{item.dueDate}</td>
      
      <td className="py-5">
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
            item.status === 'Published' 
            ? 'bg-green-50 border-green-100 text-green-700' 
            : 'bg-amber-50 border-amber-100 text-amber-700'
        }`}>
          {item.status}
        </span>
      </td>
      
      <td className="py-5 text-gray-500 font-medium text-sm">
        <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                {item.creator.charAt(0)}
            </div>
            {item.creator}
        </div>
      </td>
      
      <td className="py-5 text-right pr-4">
        <div className="flex justify-end gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-600">
                <Edit className="h-4 w-4" />
            </Button>
            {item.status === "Draft" ? (
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-green-600">
                    <Globe className="h-4 w-4" />
                </Button>
            ) : (
                <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600 hover:text-amber-600">
                    <EyeOff className="h-4 w-4" />
                </Button>
            )}
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-600">
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
      </td>
    </tr>
  );
}