"use client";

import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useTeacherAssignment } from "@/hooks/useTeacherAssignment";
import { AssignmentRow, AssignmentDetailsList } from "@/components/assignment/AssignmentComponents";
import { CreateAssignmentModal, ViewAssignmentModal, DeleteAssignmentModal } from "@/components/assignment/AssignmentModals";

export default function TeacherAssignmentPage() {
  const { 
    date, setDate, assignments, sidePanelList, 
    modals, toggleModal, selectedItem, setSelectedItem, actions 
  } = useTeacherAssignment();

  // Handlers
  const openCreate = () => { setSelectedItem(null); toggleModal("create", true); };
  const openEdit = (e: any, item: any) => { e.stopPropagation(); setSelectedItem(item); toggleModal("create", true); };
  const openView = (item: any) => { setSelectedItem(item); toggleModal("view", true); };
  const openDelete = (e: any, item: any) => { e.stopPropagation(); setSelectedItem(item); toggleModal("delete", true); };
  
  const handlePublish = (e: any, item: any) => { e.stopPropagation(); actions.handleToggleStatus(item, "Published"); };
  const handleUnpublish = (e: any, item: any) => { e.stopPropagation(); actions.handleToggleStatus(item, "Draft"); };

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
          {/* UPDATED HEADER: Matches Screenshot (Title Left, Date Right) */}
          <div className="p-6 border-b border-gray-100 dark:border-neutral-800 z-10 bg-white dark:bg-neutral-900 flex justify-between items-center">
             <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white">View Details</h3>
             <span className="text-xs font-medium text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100 dark:bg-neutral-800 dark:border-neutral-700">
                {date ? date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }) : 'Select a date'}
             </span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 relative z-0">
             <AssignmentDetailsList assignments={sidePanelList} />
          </div>
        </Card>
      </div>

      {/* 2. MANAGEMENT TABLE */}
      <Card className="rounded-3xl border-none shadow-sm bg-white dark:bg-neutral-900 p-6 lg:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h3 className="font-serif text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Assignments & Activities Management</h3>
            <p className="text-gray-500 mt-1">Manage your assignment and activities efficiently</p>
          </div>
          <Button onClick={openCreate} className="rounded-xl h-12 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 gap-2 px-6">
            <Plus className="h-5 w-5" /> Add
          </Button>
        </div>
        <div className="overflow-x-auto -mx-6 lg:mx-0 px-6 lg:px-0">
          <table className="w-full text-left text-sm min-w-[1000px]">
            <thead>
              <tr className="text-gray-400 border-b border-dashed border-gray-200 dark:border-neutral-800">
                {["Subject Name", "Type", "Date & Time Start", "Date & Time End", "Status", "Created By", "Actions"].map(h => (
                    <th key={h} className={`pb-4 font-medium uppercase text-xs tracking-wider ${h === 'Subject Name' ? 'pl-4' : ''} ${h === 'Actions' ? 'text-right pr-4' : ''}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-neutral-800/50">
              {assignments.map((item) => (
                <AssignmentRow key={item.id} item={item} onClick={openView} onEdit={openEdit} onDelete={openDelete} onPublish={handlePublish} onUnpublish={handleUnpublish} />
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <CreateAssignmentModal isOpen={modals.create} onClose={() => toggleModal("create", false)} onSave={actions.handleSave} initialData={selectedItem} />
      <ViewAssignmentModal isOpen={modals.view} onClose={() => toggleModal("view", false)} data={selectedItem} />
      <DeleteAssignmentModal isOpen={modals.delete} onClose={() => toggleModal("delete", false)} onConfirm={actions.handleDelete} title={selectedItem?.subject || "Assignment"} />
    </div>
  );
}