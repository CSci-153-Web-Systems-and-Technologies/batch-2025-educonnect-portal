import { supabase } from "@/lib/supabase";
import { AssignmentFormData } from "@/data/assignmentData";

export const assignmentService = {
  async getAll() {
    // We alias the DB columns (snake_case) to match your UI types (camelCase)
    const { data, error } = await supabase
      .from('assignments')
      .select('*, startDate:start_date, dueDate:due_date, creator:created_by') 
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Error fetching assignments:", error);
      throw error;
    }
    return data;
  },

  async create(data: AssignmentFormData) {
    const { data: result, error } = await supabase
      .from('assignments')
      .insert([{
        subject: data.subject,
        type: data.type,
        description: data.description,
        start_date: data.startDate,
        due_date: data.dueDate,
        status: "Draft",
        created_by: "Teacher" // Placeholder for current user
      }])
      .select()
      .single();

    if (error) throw error;
    return result;
  },

  async update(id: string, updates: Partial<AssignmentFormData>) {
    // Manually map fields back to snake_case for the DB
    const dbUpdates: any = { ...updates };
    if (updates.startDate) dbUpdates.start_date = updates.startDate;
    if (updates.dueDate) dbUpdates.due_date = updates.dueDate;
    // Remove the camelCase keys so Supabase doesn't complain
    delete dbUpdates.startDate;
    delete dbUpdates.dueDate;

    const { error } = await supabase
      .from('assignments')
      .update(dbUpdates)
      .eq('id', id);

    if (error) throw error;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('assignments')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async toggleStatus(id: string, currentStatus: string) {
    const newStatus = currentStatus === "Draft" ? "Published" : "Draft";
    const { error } = await supabase
      .from('assignments')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) throw error;
    return newStatus;
  }
};