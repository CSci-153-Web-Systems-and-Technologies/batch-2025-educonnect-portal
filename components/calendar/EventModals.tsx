"use client";

import { useState, useEffect } from "react";
import { X, MapPin, AlertTriangle, Trash2, CalendarIcon, Globe, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";

// --- Types (Exported) ---
export type EventFormData = {
  id?: string;
  title: string;
  type: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  location: string;
  description: string;
};

// Create/edit event modal
interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: EventFormData) => void;
  initialData?: EventFormData | null;
}

const STANDARD_TYPES = ["Meeting", "Exam", "Academic"];

export function CreateEventModal({ isOpen, onClose, onSave, initialData }: CreateEventModalProps) {
  const [formData, setFormData] = useState<EventFormData>({
    title: "", type: "", startDate: "", endDate: "", startTime: "", endTime: "", location: "", description: ""
  });

  const [selectedCategory, setSelectedCategory] = useState<string>(""); 
  const [customType, setCustomType] = useState<string>("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData(initialData);
        setDateRange({
            from: initialData.startDate ? new Date(initialData.startDate) : undefined,
            to: initialData.endDate ? new Date(initialData.endDate) : undefined
        });

        if (STANDARD_TYPES.includes(initialData.type)) {
          setSelectedCategory(initialData.type);
          setCustomType("");
        } else {
          setSelectedCategory("Others");
          setCustomType(initialData.type);
        }
      } else {
        setFormData({ title: "", type: "", startDate: "", endDate: "", startTime: "", endTime: "", location: "", description: "" });
        setDateRange(undefined);
        setSelectedCategory("");
        setCustomType("");
      }
    }
  }, [initialData, isOpen]);

  const handleSave = () => {
    const finalType = selectedCategory === "Others" ? customType : selectedCategory;
    const finalStartDate = dateRange?.from ? dateRange.from.toISOString() : "";
    const finalEndDate = dateRange?.to ? dateRange.to.toISOString() : finalStartDate;

    if (!formData.title || !finalType || !finalStartDate) {
        alert("Please fill in title, type, and date range.");
        return;
    }

    onSave({ 
        ...formData, 
        type: finalType,
        startDate: finalStartDate,
        endDate: finalEndDate
    });
  };

  if (!isOpen) return null;
  const isEditing = !!initialData;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200 border border-gray-100 dark:border-neutral-800">
        
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">
              {isEditing ? "Edit Event" : "Create New Event"}
            </h2>
            <p className="text-gray-500 mt-2">
              {isEditing ? "Update event details." : "Add a new event to the calendar."}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Event Title</Label>
            <Input 
              placeholder="e.g., Annual Sports Day" 
              className="rounded-xl h-12 bg-gray-50 border-gray-200 focus:bg-white transition-all"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Event Type</Label>
              <div className="space-y-3">
                <Select 
                  value={selectedCategory} 
                  onValueChange={(val) => {
                    setSelectedCategory(val);
                    if(val !== "Others") setCustomType(""); 
                  }}
                >
                  <SelectTrigger className="rounded-xl h-12 bg-gray-50 border-gray-200">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {STANDARD_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    <SelectItem value="Others" className="font-bold text-blue-600">Others (Customize)</SelectItem>
                  </SelectContent>
                </Select>
                {selectedCategory === "Others" && (
                  <Input 
                    placeholder="Specify event type..." 
                    className="rounded-xl h-12 bg-blue-50 border-blue-200 text-blue-900 placeholder:text-blue-300 focus:bg-white animate-in slide-in-from-top-2"
                    value={customType}
                    onChange={(e) => setCustomType(e.target.value)}
                    autoFocus
                  />
                )}
              </div>
            </div>
            
            <div className="space-y-2 flex flex-col">
              <Label>Date Range</Label>
              <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal h-12 rounded-xl bg-gray-50 border-gray-200 hover:bg-gray-100",
                      !dateRange && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {dateRange.from.toLocaleDateString()} -{" "}
                          {dateRange.to.toLocaleDateString()}
                        </>
                      ) : (
                        dateRange.from.toLocaleDateString()
                      )
                    ) : (
                      <span>Select dates</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                    className="rounded-lg border shadow-sm"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Time Start</Label>
              <Input 
                type="time" 
                className="rounded-xl h-12 bg-gray-50 border-gray-200 appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
                value={formData.startTime}
                onChange={(e) => setFormData({...formData, startTime: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Time End</Label>
              <Input 
                type="time" 
                className="rounded-xl h-12 bg-gray-50 border-gray-200 appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
                value={formData.endTime}
                onChange={(e) => setFormData({...formData, endTime: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Location</Label>
            <div className="relative">
                <Input 
                placeholder="e.g., Main Auditorium" 
                className="rounded-xl h-12 pl-10 bg-gray-50 border-gray-200"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
                <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea 
              placeholder="Add details about the event..." 
              className="rounded-xl min-h-[100px] resize-none bg-gray-50 border-gray-200 focus:bg-white"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-10 pt-6 border-t border-gray-100 dark:border-neutral-800">
          <Button variant="ghost" onClick={onClose} className="rounded-xl px-6 h-12 text-gray-500 hover:text-gray-900 hover:bg-gray-100">
            Cancel
          </Button>
          <Button onClick={handleSave} className="rounded-xl px-8 h-12 bg-black hover:bg-neutral-800 text-white dark:bg-white dark:text-black dark:hover:bg-gray-200 shadow-lg shadow-black/5 transition-all hover:scale-[1.02]">
            {isEditing ? "Save Changes" : "Create Event"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Delete Event Modal
interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    eventTitle: string;
}

export function DeleteEventModal({ isOpen, onClose, onConfirm, eventTitle }: DeleteModalProps) {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        {/* Fixed: changed rounded-[2rem] to rounded-3xl */}
        <div className="relative z-10 w-full max-w-md bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
          <div className="flex flex-col items-center text-center">
            <div className="h-16 w-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
                <Trash2 className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-2">Delete Event?</h2>
            <p className="text-gray-500 mb-8">
              Are you sure you want to delete <span className="font-semibold text-gray-900">"{eventTitle}"</span>? <br/>
              This action cannot be undone.
            </p>
            <div className="grid grid-cols-2 gap-3 w-full">
              <Button variant="outline" onClick={onClose} className="rounded-xl h-12 border-gray-200">Cancel</Button>
              <Button onClick={onConfirm} className="rounded-xl h-12 bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20">Yes, Delete</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

// Publish Event Modal
interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  eventTitle: string;
}

export function PublishEventModal({ isOpen, onClose, onConfirm, eventTitle }: PublishModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      {/* Fixed: changed rounded-[2rem] to rounded-3xl */}
      <div className="relative z-10 w-full max-w-md bg-white dark:bg-neutral-900 rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="h-14 w-14 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
             <Globe className="h-7 w-7 text-blue-600" /> 
          </div>
          <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">Publish Event</h2>
        </div>
        <p className="text-gray-500 text-center mb-6 leading-relaxed">
          Are you sure you want to publish <span className="font-semibold text-gray-900 dark:text-white">"{eventTitle}"</span>? <br/>
          Parents will be able to view this event immediately.
        </p>
        <div className="flex gap-4 p-4 rounded-2xl bg-amber-50 border border-amber-100 text-amber-700 mb-8">
          <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
          <p className="text-sm font-medium">A notification will be sent to all parents.</p>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose} className="rounded-xl px-6 h-11 text-gray-500 hover:text-gray-900">Cancel</Button>
          <Button onClick={onConfirm} className="rounded-xl px-8 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20">Yes, Publish</Button>
        </div>
      </div>
    </div>
  );
}

// Unpublish evennt modal
interface UnpublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  eventTitle: string;
}

export function UnpublishEventModal({ isOpen, onClose, onConfirm, eventTitle }: UnpublishModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      {/* Fixed: changed rounded-[2rem] to rounded-3xl */}
      <div className="relative z-10 w-full max-w-md bg-white dark:bg-neutral-900 rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="h-14 w-14 bg-amber-50 dark:bg-amber-900/20 rounded-full flex items-center justify-center mb-4">
             <EyeOff className="h-7 w-7 text-amber-600" /> 
          </div>
          <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">Unpublish Event</h2>
        </div>
        <p className="text-gray-500 text-center mb-6 leading-relaxed">
          Are you sure you want to unpublish <span className="font-semibold text-gray-900 dark:text-white">"{eventTitle}"</span>? <br/>
          This will hide the event from the parents' view.
        </p>
        <div className="flex gap-4 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-700 mb-8">
          <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
          <p className="text-sm font-medium">Parents will no longer see this event on their calendar.</p>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose} className="rounded-xl px-6 h-11 text-gray-500 hover:text-gray-900">Cancel</Button>
          <Button onClick={onConfirm} className="rounded-xl px-8 h-11 bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-600/20">Yes, Unpublish</Button>
        </div>
      </div>
    </div>
  );
}