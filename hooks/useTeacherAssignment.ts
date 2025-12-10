"use client";

import { useState } from "react";
import { Assignment, INITIAL_ASSIGNMENTS, AssignmentFormData } from "@/data/assignmentData";

export function useTeacherAssignment() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [assignments, setAssignments] = useState<Assignment[]>(INITIAL_ASSIGNMENTS);

  // Added 'publish' and 'unpublish' to state
  const [modals, setModals] = useState({ 
    create: false, 
    view: false, 
    delete: false, 
    publish: false, 
    unpublish: false 
  });
  
  const [selectedItem, setSelectedItem] = useState<Assignment | null>(null);

  const toggleModal = (modal: keyof typeof modals, isOpen: boolean) => setModals(prev => ({ ...prev, [modal]: isOpen }));

  // --- Handlers ---
  const handleSave = (data: AssignmentFormData) => {
    if (selectedItem) {
        setAssignments(prev => prev.map(a => a.id === selectedItem.id ? { ...a, ...data } : a));
    } else {
        setAssignments(prev => [...prev, { ...data, id: Math.random().toString(), creator: "You", status: "Draft" }]);
    }
    toggleModal("create", false);
    setSelectedItem(null);
  };

  const handleDelete = () => {
    if (selectedItem) setAssignments(prev => prev.filter(a => a.id !== selectedItem.id));
    toggleModal("delete", false);
    setSelectedItem(null);
  };

  const handleToggleStatus = (item: Assignment, newStatus: "Draft" | "Published") => {
    setAssignments(prev => prev.map(a => a.id === item.id ? { ...a, status: newStatus } : a));
    // Close the modals after toggling
    if (newStatus === "Published") toggleModal("publish", false);
    else toggleModal("unpublish", false);
    setSelectedItem(null);
  };

  // Filter for Calendar Details Panel
  const sidePanelList = assignments.filter(a => {
    if (!date) return false;
    const check = new Date(date); check.setHours(0,0,0,0);
    const start = new Date(a.startDate); start.setHours(0,0,0,0);
    const due = new Date(a.dueDate); due.setHours(0,0,0,0);
    return (check >= start && check <= due) && a.status === "Published";
  });

  return {
    date, setDate,
    assignments, sidePanelList,
    modals, toggleModal,
    selectedItem, setSelectedItem,
    actions: { handleSave, handleDelete, handleToggleStatus }
  };
}