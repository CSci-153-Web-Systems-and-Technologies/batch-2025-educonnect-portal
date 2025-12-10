"use client";

import { Calendar as CalendarIcon, Edit, Globe, EyeOff, Trash2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Assignment } from "@/data/assignmentData";
import { format } from "date-fns";

export function AssignmentDetailsList({ assignments }: { assignments: Assignment[] }) {
  // MATCHING YOUR SCREENSHOT DESIGN
  if (assignments.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center text-center h-full">
        {/* Icon Container */}
        <div className="h-16 w-16 bg-gray-50 dark:bg-neutral-800 rounded-2xl flex items-center justify-center mb-4 text-gray-400">
          <CalendarIcon className="h-8 w-8" />
        </div>
        {/* Title */}
        <p className="text-lg font-bold text-gray-900 dark:text-white mb-1">No event schedule</p>
        {/* Subtitle */}
        <p className="text-sm text-gray-500">No events found for this date.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {assignments.map(item => (
        <div key={item.id} className="flex items-start gap-4 p-4 rounded-2xl border border-gray-100 dark:border-neutral-800 hover:bg-gray-50/50 transition-colors">
          <div className="flex h-14 w-16 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><FileText className="h-5 w-5" /></div>
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white">{item.subject}</h4>
            <div className="text-sm text-gray-500">{item.type}</div>
            <div className="text-xs text-gray-400 mt-1">Due: {format(new Date(item.dueDate), "MMM d, h:mm a")}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function AssignmentRow({ item, onClick, onEdit, onDelete, onPublish, onUnpublish }: any) {
  return (
    <tr className="group hover:bg-gray-50/80 cursor-pointer border-b border-gray-50 transition-colors" onClick={() => onClick(item)}>
      <td className="py-5 pl-4"><div className="font-bold text-gray-900 dark:text-white">{item.subject}</div><div className="text-xs text-gray-400 mt-0.5 max-w-[200px] truncate">{item.description}</div></td>
      <td className="py-5"><span className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-neutral-800 text-xs font-medium text-gray-600 dark:text-gray-300">{item.type}</span></td>
      <td className="py-5 text-gray-600 dark:text-gray-400 text-sm">{format(new Date(item.startDate), "MMM d, HH:mm")}</td>
      <td className="py-5 text-gray-600 dark:text-gray-400 text-sm">{format(new Date(item.dueDate), "MMM d, HH:mm")}</td>
      <td className="py-5"><span className={`px-3 py-1 rounded-full text-xs font-bold border ${item.status === 'Published' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-amber-50 border-amber-100 text-amber-700'}`}>{item.status}</span></td>
      <td className="py-5 text-gray-500 text-sm font-medium">{item.creator}</td>
      <td className="py-5 text-right pr-4">
        <div className="flex justify-end gap-2" onClick={e => e.stopPropagation()}>
            <Button onClick={e => onEdit(e, item)} variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-600"><Edit className="h-4 w-4" /></Button>
            {item.status === "Draft" ? 
                <Button onClick={e => onPublish(e, item)} variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-green-600"><Globe className="h-4 w-4" /></Button> : 
                <Button onClick={e => onUnpublish(e, item)} variant="ghost" size="icon" className="h-8 w-8 text-green-600 hover:text-amber-600"><EyeOff className="h-4 w-4" /></Button>
            }
            <Button onClick={e => onDelete(e, item)} variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></Button>
        </div>
      </td>
    </tr>
  );
}