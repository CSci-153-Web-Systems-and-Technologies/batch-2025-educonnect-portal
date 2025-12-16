"use client";

import { MapPin, Clock, Calendar as CalendarIcon, Edit, Globe, EyeOff, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SchoolEvent } from "@/data/calendarData";

const formatDateRange = (start: Date, end: Date) => {
  const s = start.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  const e = end.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  return start.toDateString() === end.toDateString() ? s : `${s} - ${e}`;
};

// --- Reusable List for Side Panel ---
export function DayDetailsList({ events }: { events: SchoolEvent[] }) {
  if (events.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center text-center h-full">
        <div className="h-16 w-16 bg-gray-50 dark:bg-neutral-800 rounded-2xl flex items-center justify-center mb-4 text-gray-300">
          <CalendarIcon className="h-8 w-8" />
        </div>
        <p className="text-xl font-medium text-gray-900 dark:text-white mb-2">No event schedule</p>
        <p className="text-gray-400">No events found for this date.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map(event => (
        <div key={event.id} className="group flex items-start gap-4 p-4 rounded-2xl border border-gray-100 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-all">
          <div className={`flex flex-col items-center justify-center h-14 w-16 rounded-xl shrink-0 ${event.isSystemEvent ? 'bg-yellow-50 text-yellow-600' : 'bg-blue-50 text-blue-600'}`}>
            {event.isSystemEvent ? <ShoppingBag className="h-4 w-4 mb-1" /> : <Clock className="h-4 w-4 mb-1" />}
            <span className="text-[10px] font-bold uppercase">{event.isSystemEvent ? "All Day" : event.startTime}</span>
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h4 className="text-lg font-bold text-gray-900 dark:text-white">{event.title}</h4>
              {/* Hide status badge for system events */}
              {!event.isSystemEvent && (
                 <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${event.status === 'Published' ? 'text-green-600 bg-green-50' : 'text-amber-600 bg-amber-50'}`}>
                    {event.status}
                 </span>
              )}
            </div>
            <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
              <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-neutral-800 text-xs font-medium">{event.type}</span>
              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {event.location}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// --- Reusable Row for Main Table ---
interface EventRowProps {
  event: SchoolEvent;
  readOnly?: boolean; // Controls visibility of Admin Actions
  onEdit?: (e: SchoolEvent) => void;
  onDelete?: (e: SchoolEvent) => void;
  onPublish?: (e: SchoolEvent) => void;
  onUnpublish?: (e: SchoolEvent) => void;
}

export function EventRow({ event, readOnly = false, onEdit, onDelete, onPublish, onUnpublish }: EventRowProps) {
  return (
    <tr className="group hover:bg-gray-50/80 dark:hover:bg-neutral-800/30 transition-colors border-b border-gray-50 dark:border-neutral-800/50">
      <td className="py-5 pl-4">
        <div className="font-bold text-gray-900 dark:text-white text-base">{event.title}</div>
        <div className="text-xs text-gray-400 mt-0.5 max-w-[200px] truncate">{event.description}</div>
      </td>
      
      <td className="py-5"><span className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-neutral-800 text-gray-600 font-medium text-xs">{event.type}</span></td>
      
      <td className="py-5 text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-2 font-medium"><CalendarIcon className="h-3 w-3 opacity-70" /> {formatDateRange(event.startDate, event.endDate)}</div>
        {!event.isSystemEvent && <div className="text-xs text-gray-400 mt-1 pl-5">{event.startTime} - {event.endTime}</div>}
      </td>
      
      <td className="py-5 text-gray-600"><div className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-gray-400" />{event.location}</div></td>
      
      {/* Admin Columns (Status & Creator) - Hidden in ReadOnly Mode */}
      {!readOnly && (
        <>
          <td className="py-5">
            <span className={`flex items-center gap-1.5 w-fit px-3 py-1 rounded-full text-xs font-bold border ${event.status === 'Published' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${event.status === 'Published' ? 'bg-green-500' : 'bg-amber-500'}`} />
              {event.status}
            </span>
          </td>
          <td className="py-5 text-gray-500 font-medium">
            <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">{event.creator.charAt(0)}</div>
                {event.creator}
            </div>
          </td>
          {/* Action Buttons */}
          <td className="py-5 text-right pr-4">
            <div className="flex items-center justify-end gap-2">
                <ActionBtn onClick={() => onEdit?.(event)} icon={Edit} color="text-gray-400 hover:text-blue-600" />
                {event.status === "Draft" ? 
                    <ActionBtn onClick={() => onPublish?.(event)} icon={Globe} color="text-gray-400 hover:text-green-600" /> : 
                    <ActionBtn onClick={() => onUnpublish?.(event)} icon={EyeOff} color="text-green-600 hover:text-amber-600" />
                }
                <ActionBtn onClick={() => onDelete?.(event)} icon={Trash2} color="text-gray-400 hover:text-red-600" />
            </div>
          </td>
        </>
      )}
    </tr>
  );
}

const ActionBtn = ({ onClick, icon: Icon, color }: any) => (
  <Button onClick={onClick} variant="ghost" size="icon" className={`h-8 w-8 transition-colors ${color}`}>
    <Icon className="h-4 w-4" />
  </Button>
);