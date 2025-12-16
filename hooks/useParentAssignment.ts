"use client";

import { useState, useEffect } from "react";
import { assignmentService } from "@/services/assignmentService";
import { Assignment } from "@/data/assignmentData";

export function useParentAssignment() {
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Date state for the calendar filter
    const [date, setDate] = useState<Date | undefined>(new Date());
    
    // View Modal State
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Assignment | null>(null);

    // Initial Fetch
    useEffect(() => {
        const fetchAssignments = async () => {
            setLoading(true);
            try {
                // Fetch ONLY published assignments from the database
                const data = await assignmentService.getPublished();
                setAssignments(data as any);
            } catch (error) {
                console.error("Error fetching assignments:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAssignments();
    }, []);

    // Filter Logic: Show assignments active on the selected date
    const sidePanelList = assignments.filter(a => {
        if (!date) return false;
        const check = new Date(date); check.setHours(0,0,0,0);
        const start = new Date(a.startDate); start.setHours(0,0,0,0);
        const due = new Date(a.dueDate); due.setHours(0,0,0,0);
        
        return check >= start && check <= due;
    });

    const openViewModal = (item: Assignment) => {
        setSelectedItem(item);
        setIsViewModalOpen(true);
    };

    const closeViewModal = () => {
        setIsViewModalOpen(false);
        setSelectedItem(null);
    };

    return {
        assignments, 
        sidePanelList,
        date, 
        setDate,
        loading,
        isViewModalOpen,
        selectedItem,
        openViewModal,
        closeViewModal
    };
}