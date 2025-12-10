"use client";

import { useTeacherAssignment } from "@/hooks/useTeacherAssignment";
import { AssignmentRow, AssignmentDetailsList } from "@/components/assignment/AssignmentComponents";
import { CreateAssignmentModal, ViewAssignmentModal } from "@/components/assignment/AssignmentModals";
import { ConfirmationModal } from "@/components/ui/confirmation-modal"; 
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar"; 
import { Card } from "@/components/ui/card";
import { Plus, Loader2 } from "lucide-react";

export default function AssignmentTeacherPage() {
  const { 
    assignments, 
    sidePanelList, 
    date, 
    setDate, 
    loading, 
    modals, 
    toggleModal, 
    selectedItem, 
    setSelectedItem, 
    actions 
  } = useTeacherAssignment();

  if (loading && assignments.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-gray-50 dark:bg-black p-6 gap-6 overflow-y-auto">
    
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 shrink-0">
        
        {/* 1. CALENDAR VIEW (Top Left) */}
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
               onClick={(item) => { setSelectedItem(item); toggleModal("view", true); }}
             />
           </div>
        </Card>
      </div>

      <Card className="flex-1 flex flex-col p-6 rounded-3xl border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm min-h-[400px]">
        
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-serif">Assignments & Activities Management</h1>
            <p className="text-gray-500 mt-1">Set upcoming tasks and deadlines.</p>
          </div>
          <Button onClick={() => toggleModal("create", true)} className="rounded-xl bg-black dark:bg-white text-white dark:text-black hover:opacity-90">
            <Plus className="mr-2 h-4 w-4" /> Create New
          </Button>
        </div>

        <div className="flex-1 overflow-x-auto">
          {assignments.length === 0 ? (
             <div className="flex h-full items-center justify-center text-gray-400">
                No assignments found.
             </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="text-gray-400 border-b border-gray-100 dark:border-neutral-800 text-xs font-bold uppercase tracking-wider">
                  <th className="pb-4 pl-4 w-[30%]">Subject Name</th>
                  <th className="pb-4 w-[10%]">Type</th>
                  <th className="pb-4 w-[15%]">Date & Time Start</th>
                  <th className="pb-4 w-[15%]">Date & Time End</th>
                  <th className="pb-4 w-[10%]">Status</th>
                  <th className="pb-4 w-[10%]">Created By</th>
                  <th className="pb-4 text-right pr-4 w-[10%]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-neutral-800">
                {assignments.map((item) => (
                  <AssignmentRow 
                    key={item.id} 
                    item={item} 
                    onClick={() => { setSelectedItem(item); toggleModal("view", true); }}
                    onEdit={(e, item) => { e.stopPropagation(); setSelectedItem(item); toggleModal("create", true); }}
                    onDelete={(e, item) => { e.stopPropagation(); setSelectedItem(item); toggleModal("delete", true); }}
                    onPublish={(e, item) => { e.stopPropagation(); setSelectedItem(item); toggleModal("publish", true); }}
                    onUnpublish={(e, item) => { e.stopPropagation(); setSelectedItem(item); toggleModal("unpublish", true); }}
                  />
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      <CreateAssignmentModal isOpen={modals.create} onClose={() => toggleModal("create", false)} onSave={actions.handleSave} initialData={selectedItem} />
      <ViewAssignmentModal isOpen={modals.view} onClose={() => toggleModal("view", false)} data={selectedItem} />
      
      {/* NOTE: Ensure that your AssignmentRow component is calling `onPublish` when status is Draft 
         and `onUnpublish` when status is Published. This hook handles the rest.
      */}
      
      <ConfirmationModal isOpen={modals.delete} onClose={() => toggleModal("delete", false)} onConfirm={actions.handleDelete} title="Delete Assignment?" variant="danger" confirmLabel="Yes, Delete" description={<>Are you sure you want to delete <strong>{selectedItem?.subject}</strong>?</>} />
      <ConfirmationModal isOpen={modals.publish} onClose={() => toggleModal("publish", false)} onConfirm={actions.handleToggleStatus} title="Publish Assignment?" variant="success" confirmLabel="Publish Now" description={<>Students will see <strong>{selectedItem?.subject}</strong>.</>} />
      <ConfirmationModal isOpen={modals.unpublish} onClose={() => toggleModal("unpublish", false)} onConfirm={actions.handleToggleStatus} title="Unpublish Assignment?" variant="warning" confirmLabel="Unpublish" description="This will hide the assignment." />
    </div>
  );
}