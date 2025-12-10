"use client";

import { useState, useEffect } from "react";
import { X, FileText, User, Trash2, ChevronDownIcon, Globe, AlertTriangle, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Assignment, AssignmentFormData } from "@/data/assignmentData";

// ... [Keep DateTimePicker component as is] ...
function DateTimePicker({ label, date, setDate }: { label: string, date: Date | undefined, setDate: (d: Date | undefined) => void }) {
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
    <div className="flex flex-col gap-2">
      <Label className="px-1 text-gray-400 font-medium text-xs uppercase tracking-wider">{label}</Label>
      <div className="flex gap-3">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex-1 justify-between font-normal h-12 rounded-xl bg-gray-50 dark:bg-neutral-900 border-gray-200 dark:border-neutral-700 text-left">
              {date ? format(date, "MMM d, yyyy") : <span className="text-muted-foreground">Select date</span>}
              <ChevronDownIcon className="h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar mode="single" selected={date} onSelect={handleDateSelect} />
          </PopoverContent>
        </Popover>
        <div className="w-32 relative">
            <Input type="time" step="60" className="bg-gray-50 dark:bg-neutral-900 border-gray-200 dark:border-neutral-700 h-12 rounded-xl appearance-none [&::-webkit-calendar-picker-indicator]:hidden pl-3 pr-8" value={date ? format(date, "HH:mm") : "09:00"} onChange={handleTimeChange}/>
        </div>
      </div>
    </div>
  );
}

// ... [Keep CreateAssignmentModal as is] ...
export function CreateAssignmentModal({ isOpen, onClose, onSave, initialData }: any) {
  const [formData, setFormData] = useState<AssignmentFormData>({ subject: "", type: "Assignment", startDate: "", dueDate: "", description: "" });
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
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl bg-white dark:bg-black rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 border border-gray-100 dark:border-neutral-800 ring-1 ring-white/10">
        <div className="flex justify-between items-start mb-8">
          <div><h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">{initialData ? "Edit" : "Create New"} Assignment</h2><p className="text-gray-500 mt-1">Add a new assignment for the class.</p></div>
          <button onClick={onClose}><X className="h-6 w-6 text-gray-400 hover:text-white transition-colors" /></button>
        </div>
        <div className="space-y-6">
          <div className="space-y-2"><Label className="text-gray-300 font-medium">Assignment Title</Label><Input className="rounded-xl h-12 bg-gray-50 dark:bg-neutral-900 border-gray-200 dark:border-neutral-800 focus:ring-2 focus:ring-blue-500" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} /></div>
          <div className="space-y-2"><Label className="text-gray-300 font-medium">Type</Label><Select value={formData.type} onValueChange={(val: any) => setFormData({...formData, type: val})}><SelectTrigger className="rounded-xl h-12 bg-gray-50 dark:bg-neutral-900 border-gray-200 dark:border-neutral-800"><SelectValue placeholder="Select Type" /></SelectTrigger><SelectContent>{["Assignment", "Activity", "Group Project", "Quiz"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6"><DateTimePicker label="Start Date & Time" date={start} setDate={setStart} /><DateTimePicker label="Due Date & Time" date={due} setDate={setDue} /></div>
          <div className="space-y-2"><Label className="text-gray-300 font-medium">Description</Label><Textarea className="rounded-xl min-h-[120px] bg-gray-50 dark:bg-neutral-900 border-gray-200 dark:border-neutral-800 resize-none p-4" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} /></div>
        </div>
        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100 dark:border-neutral-800"><Button variant="ghost" onClick={onClose} className="rounded-xl px-6 h-12 text-gray-500 hover:text-white hover:bg-neutral-800">Cancel</Button><Button onClick={handleSave} className="rounded-xl px-8 h-12 bg-white text-black hover:bg-gray-200 font-medium shadow-lg">{initialData ? "Save Changes" : "Create Assignment"}</Button></div>
      </div>
    </div>
  );
}

// ... [Keep ViewAssignmentModal as is] ...
export function ViewAssignmentModal({ isOpen, onClose, data }: any) {
    if (!isOpen || !data) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        <div className="relative z-10 w-full max-w-lg bg-white dark:bg-neutral-900 rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in-95 border border-neutral-800">
          <div className="flex justify-between items-start mb-6">
             <div className="flex items-center gap-4"><div className="h-14 w-14 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center"><FileText className="h-7 w-7" /></div><div><h2 className="text-2xl font-serif font-bold text-white">{data.subject}</h2><p className="text-gray-400 font-medium">{data.type}</p></div></div>
             <button onClick={onClose}><X className="h-6 w-6 text-gray-500 hover:text-white transition-colors" /></button>
          </div>
          <div className="space-y-6">
             <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-neutral-800/50 border border-neutral-800"><p className="text-xs text-gray-400 font-bold uppercase mb-1">Start Date</p><p className="font-bold text-white">{format(new Date(data.startDate), "MMM d, yyyy")}</p><p className="text-sm text-gray-400">{format(new Date(data.startDate), "h:mm a")}</p></div>
                <div className="p-4 rounded-2xl bg-neutral-800/50 border border-neutral-800"><p className="text-xs text-gray-400 font-bold uppercase mb-1">Due Date</p><p className="font-bold text-white">{format(new Date(data.dueDate), "MMM d, yyyy")}</p><p className="text-sm text-gray-400">{format(new Date(data.dueDate), "h:mm a")}</p></div>
             </div>
             <div className="space-y-2"><Label className="text-gray-300">Description</Label><div className="p-4 rounded-2xl bg-neutral-800/30 border border-neutral-800 text-gray-300 text-sm leading-relaxed min-h-20">{data.description}</div></div>
             <div className="flex items-center justify-between pt-6 border-t border-neutral-800">
                <div className="flex items-center gap-2"><div className="h-8 w-8 rounded-full bg-neutral-800 flex items-center justify-center text-gray-400"><User className="h-4 w-4" /></div><span className="text-sm text-gray-500">Created by {data.creator}</span></div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${data.status === 'Published' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>{data.status}</span>
             </div>
          </div>
        </div>
      </div>
    );
}

// ... [Keep DeleteAssignmentModal as is] ...
export function DeleteAssignmentModal({ isOpen, onClose, onConfirm, title }: any) {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        <div className="relative z-10 w-full max-w-md bg-neutral-900 rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 border border-neutral-800">
          <div className="flex flex-col items-center text-center">
            <div className="h-16 w-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6"><Trash2 className="h-8 w-8 text-red-500" /></div>
            <h2 className="text-2xl font-bold text-white mb-2">Delete Assignment?</h2>
            <p className="text-gray-400 mb-8">Are you sure you want to delete <span className="font-bold text-white">"{title}"</span>? <br/> This action cannot be undone.</p>
            <div className="grid grid-cols-2 gap-3 w-full"><Button variant="outline" onClick={onClose} className="rounded-xl h-12 border-neutral-700 text-gray-300 hover:bg-neutral-800 hover:text-white">Cancel</Button><Button onClick={onConfirm} className="rounded-xl h-12 bg-red-600 hover:bg-red-700 text-white">Delete</Button></div>
          </div>
        </div>
      </div>
    );
}

// --- 4. PUBLISH ASSIGNMENT MODAL ---
interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
}

export function PublishAssignmentModal({ isOpen, onClose, onConfirm, title }: PublishModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-neutral-900 rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 border border-neutral-800">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="h-14 w-14 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
             <Globe className="h-7 w-7 text-blue-500" /> 
          </div>
          <h2 className="text-2xl font-serif font-bold text-white">Publish Assignment</h2>
        </div>
        <p className="text-gray-400 text-center mb-6 leading-relaxed">
          Are you sure you want to publish <span className="font-semibold text-white">"{title}"</span>? <br/>
          Students will be able to view this assignment immediately.
        </p>
        <div className="flex gap-4 p-4 rounded-2xl bg-amber-50 border border-amber-100 text-amber-700 mb-8">
          <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
          <p className="text-sm font-medium">A notification will be sent to all students.</p>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose} className="rounded-xl px-6 h-11 text-gray-400 hover:text-white hover:bg-neutral-800">Cancel</Button>
          <Button onClick={onConfirm} className="rounded-xl px-8 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20">Yes, Publish</Button>
        </div>
      </div>
    </div>
  );
}

// --- 5. UNPUBLISH ASSIGNMENT MODAL ---
interface UnpublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
}

export function UnpublishAssignmentModal({ isOpen, onClose, onConfirm, title }: UnpublishModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-neutral-900 rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 border border-neutral-800">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="h-14 w-14 bg-amber-500/10 rounded-full flex items-center justify-center mb-4">
             <EyeOff className="h-7 w-7 text-amber-500" /> 
          </div>
          <h2 className="text-2xl font-serif font-bold text-white">Unpublish Assignment</h2>
        </div>
        <p className="text-gray-400 text-center mb-6 leading-relaxed">
          Are you sure you want to unpublish <span className="font-semibold text-white">"{title}"</span>? <br/>
          This will hide the assignment from the students' view.
        </p>
        <div className="flex gap-4 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-700 mb-8">
          <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
          <p className="text-sm font-medium">Students will no longer see this assignment on their list.</p>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose} className="rounded-xl px-6 h-11 text-gray-400 hover:text-white hover:bg-neutral-800">Cancel</Button>
          <Button onClick={onConfirm} className="rounded-xl px-8 h-11 bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-600/20">Yes, Unpublish</Button>
        </div>
      </div>
    </div>
  );
}