export type Assignment = {
  id: string;
  title: string;
  // Use subjectId (UUID) instead of plain 'subject'
  subjectId: string;
  // NEW: Add Class ID (UUID)
  classId: string;
  type: "Assignment" | "Activity" | "Group Project" | "Quiz" | "Report" | "Oral Recitation" | "Need to Study" | "Project";
  startDate: string;
  dueDate: string;
  status: "Draft" | "Published";
  creator: string;
  description: string;
  subjectName?: string; 
  className?: string; // For display purposes
};

// Update AssignmentFormData to include subjectId and classId
export type AssignmentFormData = Omit<Assignment, "id" | "status" | "creator" | "subjectName" | "className">;

// NOTE: You can remove INITIAL_ASSIGNMENTS if you are no longer using mock data.