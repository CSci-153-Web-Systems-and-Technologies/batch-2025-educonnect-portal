"use client";

import { useState, useEffect } from "react";
import { X, FileText, User, Trash2, ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Assignment, AssignmentFormData } from "@/data/assignmentData";

// --- REUSABLE DATE PICKER 12 (Popover + Time Input) ---
function CalendarPicker12({ label, date, setDate }: { label: string, date: Date | undefined, setDate: (d: Date | undefined) => void }) {
  const [open, setOpen] = useState(false);

  const handleDateSelect = (selected: Date | undefined) => {
    if (!selected) { setDate(undefined); return; }
    const newDate = new Date(selected);
    if (date) { newDate.setHours(date.getHours(), date.getMinutes()); } 
    else { newDate.setHours(9, 0); }
    setDate(newDate);
    setOpen(false);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeStr = e.target.value;
    if (!timeStr) return;
    const [hours, minutes] = timeStr.split(':').map(Number);
    const newDate = date ? new Date(date) : new Date();
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    setDate(newDate);
  };

  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-3 flex-1">
        <Label className="px-1 text-gray-600 font-medium">{label}</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-between font-normal h-12 rounded-xl bg-gray-50 border-gray-200">
              {date ? date.toLocaleDateString() : "Select date"}
              <ChevronDownIcon className="h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar mode="single" selected={date} onSelect={handleDateSelect} />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-col gap-3 w-32">
        <Label className="px-1 text-gray-600 font-medium">Time</Label>
        <Input 
            type="time" 
            step="60" 
            className="bg-gray-50 border-gray-200 h-12 rounded-xl appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
            value={date ? format(date, "HH:mm") : "09:00"}
            onChange={handleTimeChange}
        />
      </div>
    </div>
  );
}

// --- 1. CREATE / EDIT MODAL ---
interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: AssignmentFormData) => void;
  initialData?: Assignment | null;
}

export function CreateAssignmentModal({ isOpen, onClose, onSave, initialData }: CreateModalProps) {
  const [formData, setFormData] = useState<AssignmentFormData>({
    subject: "", type: "Assignment", startDate: "", dueDate: "", description: ""
  });
  const [start, setStart] = useState<Date | undefined>();
  const [due, setDue] = useState<Date | undefined>();

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData(initialData);
        setStart(new Date(initialData.startDate));
        setDue(new Date(initialData.dueDate));
      } else {
        setFormData({ subject: "", type: "Assignment", startDate: "", dueDate: "", description: "" });
        setStart(undefined);
        setDue(undefined);
      }
    }
  }, [initialData, isOpen]);

  const handleSave = () => {
    if (!formData.subject || !start || !due) { alert("Please fill in required fields"); return; }
    onSave({ ...formData, startDate: start.toISOString(), dueDate: due.toISOString() });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 border border-gray-100 dark:border-neutral-800">
        <div className="flex justify-between items-start mb-8">
          <div><h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">{initialData ? "Edit" : "Create"} Assignment</h2></div>
          <button onClick={onClose}><X className="h-6 w-6 text-gray-400" /></button>
        </div>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
             <div className="space-y-2"><Label>Subject Name</Label><Input className="rounded-xl h-12 bg-gray-50 border-gray-200" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} /></div>
             <div className="space-y-2"><Label>Type</Label>
                <Select value={formData.type} onValueChange={(val: any) => setFormData({...formData, type: val})}>
                  <SelectTrigger className="rounded-xl h-12 bg-gray-50 border-gray-200"><SelectValue /></SelectTrigger>
                  <SelectContent>{["Assignment", "Activity", "Group Project", "Quiz"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
             </div>
          </div>
          <CalendarPicker12 label="Start Date" date={start} setDate={setStart} />
          <CalendarPicker12 label="Due Date" date={due} setDate={setDue} />
          <div className="space-y-2"><Label>Description</Label><Textarea className="rounded-xl min-h-[100px] bg-gray-50 border-gray-200 resize-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} /></div>
        </div>
        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
          <Button variant="ghost" onClick={onClose} className="rounded-xl px-6 h-12">Cancel</Button>
          <Button onClick={handleSave} className="rounded-xl px-8 h-12 bg-black text-white hover:bg-neutral-800">{initialData ? "Save Changes" : "Create"}</Button>
        </div>
      </div>
    </div>
  );
}

// --- 2. VIEW DETAIL POPUP ---
export function ViewAssignmentModal({ isOpen, onClose, data }: { isOpen: boolean, onClose: () => void, data: Assignment | null }) {
    if (!isOpen || !data) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
        <div className="relative z-10 w-full max-w-lg bg-white dark:bg-neutral-900 rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in-95">
          <div className="flex justify-between items-start mb-6">
             <div className="flex items-center gap-4">
                <div className="h-14 w-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center"><FileText className="h-7 w-7" /></div>
                <div><h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">{data.subject}</h2><p className="text-gray-500 font-medium">{data.type}</p></div>
             </div>
             <button onClick={onClose}><X className="h-6 w-6 text-gray-400" /></button>
          </div>
          <div className="space-y-6">
             <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-gray-50"><p className="text-xs text-gray-400 font-bold uppercase mb-1">Start Date</p><p className="font-bold text-gray-900">{format(new Date(data.startDate), "MMM d, h:mm a")}</p></div>
                <div className="p-4 rounded-2xl bg-gray-50"><p className="text-xs text-gray-400 font-bold uppercase mb-1">Due Date</p><p className="font-bold text-gray-900">{format(new Date(data.dueDate), "MMM d, h:mm a")}</p></div>
             </div>
             <div className="space-y-2"><Label>Description</Label><div className="p-4 rounded-2xl bg-gray-50 text-gray-600 text-sm leading-relaxed">{data.description}</div></div>
             <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                <div className="flex items-center gap-2"><div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center"><User className="h-4 w-4" /></div><span className="text-sm text-gray-500">By {data.creator}</span></div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${data.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{data.status}</span>
             </div>
          </div>
        </div>
      </div>
    );
}

// --- 3. DELETE MODAL ---
export function DeleteAssignmentModal({ isOpen, onClose, onConfirm, title }: { isOpen: boolean, onClose: () => void, onConfirm: () => void, title: string }) {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        <div className="relative z-10 w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl animate-in zoom-in-95">
          <div className="flex flex-col items-center text-center">
            <div className="h-16 w-16 bg-red-50 rounded-full flex items-center justify-center mb-6"><Trash2 className="h-8 w-8 text-red-500" /></div>
            <h2 className="text-2xl font-bold mb-2">Delete Assignment?</h2>
            <p className="text-gray-500 mb-8">Permanently delete "{title}"?</p>
            <div className="grid grid-cols-2 gap-3 w-full"><Button variant="outline" onClick={onClose} className="rounded-xl h-12">Cancel</Button><Button onClick={onConfirm} className="rounded-xl h-12 bg-red-600 text-white hover:bg-red-700">Delete</Button></div>
          </div>
        </div>
      </div>
    );
}