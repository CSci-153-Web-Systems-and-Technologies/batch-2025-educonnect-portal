"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useParentAssignment } from "@/hooks/useParentAssignment";
import { AssignmentRow, AssignmentDetailsList } from "@/components/assignment/AssignmentComponents";
import { ViewAssignmentModal } from "@/components/assignment/AssignmentModals";

export default function ParentAssignmentPage() {
  const { 
    date, setDate, assignments, sidePanelList, 
    modals, toggleModal, selectedItem, setSelectedItem 
  } = useParentAssignment();

  // Handler: Open the View Detail Modal
  const openView = (item: any) => { 
    setSelectedItem(item); 
    toggleModal("view", true); 
  };

  return (
    <div className="flex flex-col gap-8 p-6 lg:p-8 min-h-screen bg-gray-50/50 dark:bg-black text-foreground font-sans">
      
      {/* 1. TOP SECTION: Calendar & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[550px]">
        
        {/* Calendar View */}
        <Card className="col-span-1 p-0 rounded-3xl border-none shadow-sm bg-white dark:bg-neutral-900 flex flex-col overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-neutral-800">
             <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white">Calendar View</h3>
          </div>
          <div className="flex-1 flex  justify-center items-center bg-white dark:bg-neutral-900 p-6">
             <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-xl border border-gray-100 dark:border-neutral-800 p-4 shadow-sm" />
          </div>
        </Card>

        {/* View Details */}
        <Card className="col-span-1 lg:col-span-2 p-0 rounded-3xl border-none shadow-sm bg-white dark:bg-neutral-900 flex flex-col relative overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-neutral-800 z-10 bg-white dark:bg-neutral-900 flex justify-between items-center">
             <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white">View Details</h3>
             <span className="text-xs font-medium text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100 dark:bg-neutral-800 dark:border-neutral-700">
                {date ? date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }) : 'Select a date'}
             </span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 relative z-0">
             <AssignmentDetailsList assignments={sidePanelList} onClick={openView} />
          </div>
        </Card>
      </div>

      {/* 2. READ-ONLY TABLE */}
      <Card className="rounded-3xl border-none shadow-sm bg-white dark:bg-neutral-900 p-6 lg:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h3 className="font-serif text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Assignments & Activities</h3>
            <p className="text-gray-500 mt-1">View upcoming tasks and deadlines.</p>
          </div>
        </div>

        <div className="overflow-x-auto -mx-6 lg:mx-0 px-6 lg:px-0">
          <table className="w-full text-left text-sm min-w-[800px]">
            <thead>
              <tr className="text-gray-400 border-b border-dashed border-gray-200 dark:border-neutral-800">
                {/* UPDATED: Removed "Status" & "Actions" from headers */}
                {["Subject Name", "Type", "Date & Time Start", "Date & Time End", "Created By"].map(h => (
                    <th key={h} className={`pb-4 font-medium uppercase text-xs tracking-wider text-gray-500 ${h === 'Subject Name' ? 'pl-4' : ''}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-neutral-800/50">
              {assignments.map((item) => (
                <AssignmentRow 
                    key={item.id} 
                    item={item} 
                    onClick={openView} 
                    readOnly={true} // Hides Status and Actions
                />
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* VIEW MODAL */}
      <ViewAssignmentModal 
        isOpen={modals.view} 
        onClose={() => toggleModal("view", false)} 
        data={selectedItem} 
      />
    </div>
  );
}