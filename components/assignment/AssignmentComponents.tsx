"use client";

import { Calendar as CalendarIcon, Edit, Globe, EyeOff, Trash2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Assignment } from "@/data/assignmentData";
import { format } from "date-fns";

// --- Side Panel List (With Hover Description & Click) ---
export function AssignmentDetailsList({ 
  assignments, 
  onClick 
}: { 
  assignments: Assignment[], 
  onClick?: (item: Assignment) => void 
}) {
  if (assignments.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center text-center h-full">
        <div className="h-16 w-16 bg-gray-50 dark:bg-neutral-800 rounded-2xl flex items-center justify-center mb-4 text-gray-400">
          <CalendarIcon className="h-8 w-8" />
        </div>
        <p className="text-lg font-bold text-gray-900 dark:text-white mb-1">No event schedule</p>
        <p className="text-sm text-gray-500">No events found for this date.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {assignments.map(item => (
        <div 
          key={item.id} 
          onClick={() => onClick?.(item)}
          className={`relative flex items-start gap-4 p-4 rounded-2xl border border-gray-100 dark:border-neutral-800 transition-all duration-300 group ${
            onClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-800/60 hover:shadow-md hover:border-gray-200 dark:hover:border-neutral-700' : ''
          }`}
        >
          {/* Icon Box */}
          <div className="flex h-14 w-16 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 group-hover:scale-105 transition-transform duration-300 shrink-0">
            <FileText className="h-5 w-5" />
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <h4 className="font-bold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {(item as any).title || item.subject}
              </h4>
            </div>
            
            <div className="text-sm text-gray-500 font-medium">{item.type}</div>
            
            {/* FIXED: Added suppressHydrationWarning */}
            <div className="text-xs text-gray-400 mt-1 flex items-center gap-1" suppressHydrationWarning>
                Due: {format(new Date(item.dueDate), "MMM d, HH:mm")}
            </div>

            {/* --- HOVER DESCRIPTION (Expandable) --- */}
            <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-300 ease-out">
              <div className="overflow-hidden">
                <div className="mt-3 pt-3 border-t border-dashed border-gray-200 dark:border-neutral-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

interface AssignmentRowProps {
  item: Assignment;
  onClick: (item: Assignment) => void;
  readOnly?: boolean;
  onEdit?: (e: any, item: Assignment) => void;
  onDelete?: (e: any, item: Assignment) => void;
  onPublish?: (e: any, item: Assignment) => void;
  onUnpublish?: (e: any, item: Assignment) => void;
}

// --- Main Table Row (Supports Read-Only Mode) ---
export function AssignmentRow({ item, onClick, readOnly = false, onEdit, onDelete, onPublish, onUnpublish }: AssignmentRowProps) {
  return (
    <tr 
      className="group hover:bg-white dark:hover:bg-neutral-900 cursor-pointer border-b border-gray-100 dark:border-neutral-800 transition-colors" 
      onClick={() => onClick(item)}
    >
      <td className="py-5 pl-4">
        <div className="font-bold text-gray-900 dark:text-white group-hover:text-black dark:group-hover:text-white transition-colors">
            {(item as any).title || item.subject}
        </div>
        <div className="text-xs text-gray-400 mt-0.5 max-w-[200px] truncate group-hover:text-gray-900 dark:group-hover:text-gray-300 transition-colors">
            {item.description}
        </div>
      </td>
      
      <td className="py-5">
        <span className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-neutral-800 text-xs font-medium text-gray-600 dark:text-gray-300 group-hover:bg-gray-200 dark:group-hover:bg-neutral-700 group-hover:text-black dark:group-hover:text-white transition-colors">
            {item.type}
        </span>
      </td>
      
      {/* FIXED: Added suppressHydrationWarning to Date Columns */}
      <td className="py-5 text-gray-600 dark:text-gray-400 text-sm group-hover:text-black dark:group-hover:text-white transition-colors" suppressHydrationWarning>
        {format(new Date(item.startDate), "MMM d, HH:mm")}
      </td>
      <td className="py-5 text-gray-600 dark:text-gray-400 text-sm group-hover:text-black dark:group-hover:text-white transition-colors" suppressHydrationWarning>
        {format(new Date(item.dueDate), "MMM d, HH:mm")}
      </td>
      
      {/* Status: Hidden in Read-Only Mode */}
      {!readOnly && (
        <td className="py-5">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${item.status === 'Published' ? 'bg-green-50 border-green-100 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400' : 'bg-amber-50 border-amber-100 text-amber-700 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400'}`}>
                {item.status}
            </span>
        </td>
      )}
      
      <td className="py-5 text-gray-500 text-sm font-medium group-hover:text-black dark:group-hover:text-white transition-colors">
        {(item as any).creatorName || item.creator}
      </td>
      
      {/* Actions: Hidden in Read-Only Mode */}
      {!readOnly && (
        <td className="py-5 text-right pr-4">
            <div className="flex justify-end gap-2" onClick={e => e.stopPropagation()}>
                <Button onClick={e => onEdit?.(e, item)} variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-600 group-hover:text-gray-600 group-hover:hover:text-blue-600">
                    <Edit className="h-4 w-4" />
                </Button>
                {item.status === "Draft" ? 
                    <Button onClick={e => onPublish?.(e, item)} variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-green-600 group-hover:text-gray-600 group-hover:hover:text-green-600">
                        <Globe className="h-4 w-4" />
                    </Button> : 
                    <Button onClick={e => onUnpublish?.(e, item)} variant="ghost" size="icon" className="h-8 w-8 text-green-600 hover:text-amber-600">
                        <EyeOff className="h-4 w-4" />
                    </Button>
                }
                <Button onClick={e => onDelete?.(e, item)} variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-600 group-hover:text-gray-600 group-hover:hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </td>
      )}
    </tr>
  );
}