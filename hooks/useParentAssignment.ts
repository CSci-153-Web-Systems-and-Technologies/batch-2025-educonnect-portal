"use client";

import { useState, useEffect } from "react";
import { assignmentService } from "@/services/assignmentService";
import { Assignment } from "@/data/assignmentData";
import { useAuth } from "@/contexts/AuthContext"; // <-- CRITICAL IMPORT

export function useParentAssignment() {
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [loading, setLoading] = useState(true);
    
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Assignment | null>(null);

    const { user, isLoading: authLoading } = useAuth(); // Get user and state

    // Initial Fetch - Runs when the user object is ready
    useEffect(() => {
        const fetchAssignments = async () => {
            // CRITICAL: Exit if user is not authenticated or still loading
            if (authLoading || !user?.id) { 
                setLoading(false); 
                return; 
            } 
            
            setLoading(true);
            try {
                // Pass the PARENT ID to the service for filtering
                const data = await assignmentService.getPublished(user.id);
                setAssignments(data as any);
            } catch (error) {
                console.error("Error fetching published assignments for parent:", error);
                setAssignments([]);
            } finally {
                setLoading(false);
            }
        };
        
        // Fetch only when the auth state is stable
        if (!authLoading) {
             fetchAssignments();
        }
    }, [user, authLoading]); // Dependencies must include user and authLoading

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