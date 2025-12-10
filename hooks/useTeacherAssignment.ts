"use client";

import { useState, useEffect } from "react";
// Assuming assignmentService is correctly defined to handle Supabase interaction
import { assignmentService } from "@/services/assignmentService"; 
// Assuming Assignment and AssignmentFormData types are correct
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

  // Initial data fetch
  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      
      // CRITICAL: Use the correct API route for fetching assignments
      const response = await fetch('/api/assignments'); 
      
      if (!response.ok) {
        // Throw an error if the HTTP status is not 200-299
        // This triggers the catch block and shows the devtools error (line 30 fix)
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (Array.isArray(data)) {
        setAssignments(data);
      } else {
        console.warn("API returned non-array data:", data);
        setAssignments([]);
      }

    } catch (error) {
      // Line 30: The specific place the next-devtools error intercepts.
      console.error("Error loading assignments:", error); 
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
    
    // Check if the current selected date falls within the assignment start and due dates
    return (check >= start && check <= due);
  });

  const toggleModal = (modal: keyof typeof modals, isOpen: boolean) => {
    setModals(prev => ({ ...prev, [modal]: isOpen }));
    if (!isOpen) setSelectedItem(null);
  };

  const actions = {
    handleSave: async (data: AssignmentFormData) => {
      try {
        console.log("Submitting assignment data:", data); // Helpful for debugging the payload

        if (selectedItem) {
          await assignmentService.update(selectedItem.id, data);
        } else {
          // This saves the new assignment to the database
          await assignmentService.create(data); 
        }
        
        // Refresh the list and close the modal upon success
        await fetchAssignments(); 
        toggleModal("create", false);
        
      } catch (e: any) { 
        // This ensures the actual database/network error message is shown
        console.error("FULL SAVE ERROR:", e);
        const errorMessage = e.message || e.toString() || "Unknown error";
        alert(`Error saving assignment: ${errorMessage}. Check console for details.`);
      }
    },

    handleDelete: async () => {
      if (!selectedItem) return;
      try {
        await assignmentService.delete(selectedItem.id);
        await fetchAssignments();
        toggleModal("delete", false);
      } catch (e: any) { 
        console.error("DELETE ERROR:", e);
        alert(`Error deleting assignment: ${e.message || "Unknown error"}`); 
      }
    },

    // Handles the actual flipping of the status (Draft <-> Published)
    handleToggleStatus: async () => {
      if (!selectedItem) return;
      try {
        await assignmentService.toggleStatus(selectedItem.id, selectedItem.status);
        await fetchAssignments();
        toggleModal(selectedItem.status === "Draft" ? "publish" : "unpublish", false);
      } catch (e: any) { 
        console.error("STATUS TOGGLE ERROR:", e);
        alert(`Error updating status: ${e.message || "Unknown error"}`); 
      }
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