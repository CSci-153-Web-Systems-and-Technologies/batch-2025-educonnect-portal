export type Assignment = {
  id: string;
  subject: string;
  type: "Assignment" | "Activity" | "Group Project" | "Quiz";
  startDate: string; // ISO String
  dueDate: string;   // ISO String
  status: "Draft" | "Published";
  creator: string;
  description: string;
};

// EXPORTED HERE TO PREVENT CIRCULAR DEPENDENCY
export type AssignmentFormData = Omit<Assignment, "id" | "status" | "creator">;

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  { 
    id: "1", subject: "Mathematics", type: "Assignment", 
    startDate: new Date(new Date().setHours(9,0)).toISOString(), 
    dueDate: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(), 
    status: "Draft", creator: "Mr. Thompson", description: "Solve the algebraic expressions in Chapter 4."
  },
  { 
    id: "2", subject: "Science", type: "Activity", 
    startDate: new Date(new Date().setHours(10,0)).toISOString(), 
    dueDate: new Date(new Date().setHours(17,0)).toISOString(), 
    status: "Published", creator: "Ms. Frizzle", description: "Lab report on photosynthesis."
  },
];