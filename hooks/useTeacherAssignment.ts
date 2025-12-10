"use client";

import { useState, useEffect } from "react";
import { assignmentService } from "@/services/assignmentService";
import { Assignment, AssignmentFormData } from "@/data/assignmentData"; 

export function useTeacherAssignment() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [modals, setModals] = useState({ 
    create: false, 
    view: false, 
    delete: false, 
    publish: false, 
    unpublish: false 
  });
  const [selectedItem, setSelectedItem] = useState<Assignment | null>(null);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const data = await assignmentService.getAll();
      setAssignments(data as any); 
    } catch (error) {
      console.error("Failed to load assignments", error);
    } finally {
      setLoading(false);
    }
  };

  const sidePanelList = assignments.filter(a => {
    // A. Must be Published to appear in calendar details
    if (a.status !== "Published") return false;

    if (!date) return false;
    const check = new Date(date); check.setHours(0,0,0,0);
    const start = new Date(a.startDate); start.setHours(0,0,0,0);
    const due = new Date(a.dueDate); due.setHours(0,0,0,0);
    
    return (check >= start && check <= due);
  });

  const toggleModal = (modal: keyof typeof modals, isOpen: boolean) => {
    setModals(prev => ({ ...prev, [modal]: isOpen }));
    if (!isOpen) setSelectedItem(null);
  };

  const actions = {
    handleSave: async (data: AssignmentFormData) => {
      try {
        if (selectedItem) {
          await assignmentService.update(selectedItem.id, data);
        } else {
          await assignmentService.create(data); 
        }
        await fetchAssignments(); 
        toggleModal("create", false);
      } catch (e) { alert("Error saving assignment"); }
    },

    handleDelete: async () => {
      if (!selectedItem) return;
      try {
        await assignmentService.delete(selectedItem.id);
        await fetchAssignments();
        toggleModal("delete", false);
      } catch (e) { alert("Error deleting assignment"); }
    },

    // This handles the actual flipping of the status
    handleToggleStatus: async () => {
      if (!selectedItem) return;
      try {
        await assignmentService.toggleStatus(selectedItem.id, selectedItem.status);
        await fetchAssignments();
        toggleModal(selectedItem.status === "Draft" ? "publish" : "unpublish", false);
      } catch (e) { alert("Error updating status"); }
    }
  };

  return {
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
  };
}