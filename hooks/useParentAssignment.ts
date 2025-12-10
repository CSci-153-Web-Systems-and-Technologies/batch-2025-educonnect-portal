"use client";

import { useState } from "react";
import { Assignment, INITIAL_ASSIGNMENTS } from "@/data/assignmentData";

export function useParentAssignment() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [assignments] = useState<Assignment[]>(INITIAL_ASSIGNMENTS.filter(a => a.status === "Published"));
    const [modals, setModals] = useState({ view: false });
    const [selectedItem, setSelectedItem] = useState<Assignment | null>(null);
    const toggleModal = (modal: keyof typeof modals, isOpen: boolean) => setModals(prev => ({ ...prev, [modal]: isOpen }));
    const sidePanelList = assignments.filter(a => {
        if (!date) return false;
        const check = new Date(date); check.setHours(0,0,0,0);
        const start = new Date(a.startDate); start.setHours(0,0,0,0);
        const due = new Date(a.dueDate); due.setHours(0,0,0,0);
        
        return check >= start && check <= due;
    });

    return {
        date, setDate,
        assignments, 
        sidePanelList,
        modals, toggleModal,
        selectedItem, setSelectedItem
    };
}