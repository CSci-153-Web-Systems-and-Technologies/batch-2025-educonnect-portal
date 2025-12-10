"use client";

import { useParentAssignment } from "@/hooks/useParentAssignment";
import { AssignmentRow, AssignmentDetailsList } from "@/components/assignment/AssignmentComponents";
import { ViewAssignmentModal } from "@/components/assignment/AssignmentModals"; // Only View Modal needed
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar"; 
import { Loader2 } from "lucide-react";

export default function AssignmentParentPage() {
  const { 
    assignments, 
    sidePanelList, 
    date, 
    setDate, 
    loading, 
    isViewModalOpen, 
    selectedItem, 
    openViewModal, 
    closeViewModal 
  } = useParentAssignment();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-gray-50 dark:bg-black p-6 gap-6 overflow-y-auto">
      
      {/* --- TOP ROW: CALENDAR & DETAILS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 shrink-0">
        
        {/* 1. CALENDAR VIEW */}
        <Card className="col-span-1 p-6 rounded-3xl border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm flex flex-col h-[420px]">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white font-serif">Calendar View</h2>
          <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-black/40 rounded-2xl border border-gray-100 dark:border-neutral-800">
             <Calendar 
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border-0 scale-110 transform"
             />
          </div>
        </Card>

        {/* 2. VIEW DETAILS (Filtered by Date) */}
        <Card className="col-span-1 lg:col-span-2 p-6 rounded-3xl border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm flex flex-col h-[420px]">
           <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white font-serif">View Details</h2>
              <span className="text-sm font-medium px-3 py-1 rounded-full bg-gray-100 dark:bg-neutral-800 text-gray-500">
                {date ? date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }) : "Select a date"}
              </span>
           </div>
           
           <div className="flex-1 overflow-y-auto pr-2">
             <AssignmentDetailsList 
               assignments={sidePanelList} 
               onClick={openViewModal}
             />
           </div>
        </Card>
      </div>

      {/* --- BOTTOM ROW: MAIN TABLE --- */}
      <Card className="flex-1 flex flex-col p-6 rounded-3xl border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm min-h-[400px]">
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-serif">View Assignments & Activities</h1>
          <p className="text-gray-500 mt-1">View upcoming tasks and deadlines.</p>
        </div>

        <div className="flex-1 overflow-x-auto">
          {assignments.length === 0 ? (
             <div className="flex h-full items-center justify-center text-gray-400">
                No active assignments found.
             </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="text-gray-400 border-b border-gray-100 dark:border-neutral-800 text-xs font-bold uppercase tracking-wider">
                  <th className="pb-4 pl-4 w-[35%]">Subject Name</th>
                  <th className="pb-4 w-[15%]">Type</th>
                  <th className="pb-4 w-[20%]">Date & Time Start</th>
                  <th className="pb-4 w-[20%]">Date & Time End</th>
                  <th className="pb-4 w-[10%]">Created By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-neutral-800">
                {assignments.map((item) => (
                  <AssignmentRow 
                    key={item.id} 
                    item={item} 
                    readOnly={true} // <--- IMPORTANT: Hides Edit/Delete/Publish buttons
                    onClick={openViewModal}
                  />
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      {/* --- READ ONLY MODAL --- */}
      <ViewAssignmentModal 
        isOpen={isViewModalOpen} 
        onClose={closeViewModal} 
        data={selectedItem} 
      />
      
    </div>
  );
}