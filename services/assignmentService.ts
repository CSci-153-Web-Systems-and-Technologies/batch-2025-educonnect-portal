import { supabase } from "@/lib/supabase";
import { AssignmentFormData } from "@/data/assignmentData";

export const assignmentService = {
  // 1. GET ALL (For Teachers - sees Drafts & Published)
  async getAll() {
    const { data, error } = await supabase
      .from('assignments')
      .select('*, startDate:start_date, dueDate:due_date, creator:created_by') 
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data;
  },

  // 2. GET PUBLISHED ONLY (For Parents - sees only Published)
  async getPublished() {
    const { data, error } = await supabase
      .from('assignments')
      .select('*, startDate:start_date, dueDate:due_date, creator:created_by')
      .eq('status', 'Published') // <--- The Magic Filter
      .order('start_date', { ascending: true });

    if (error) throw error;
    return data;
  },

  // ... (Keep existing create, update, delete, toggleStatus methods exactly as they were)
  async create(data: AssignmentFormData) {
    const { data: result, error } = await supabase
      .from('assignments')
      .insert([{
        subject: data.subject, type: data.type, description: data.description,
        start_date: data.startDate, due_date: data.dueDate, status: "Draft", created_by: "Teacher"
      }]).select().single();
    if (error) throw error;
    return result;
  },

  async update(id: string, updates: Partial<AssignmentFormData>) {
    const dbUpdates: any = { ...updates };
    if (updates.startDate) dbUpdates.start_date = updates.startDate;
    if (updates.dueDate) dbUpdates.due_date = updates.dueDate;
    delete dbUpdates.startDate; delete dbUpdates.dueDate;
    const { error } = await supabase.from('assignments').update(dbUpdates).eq('id', id);
    if (error) throw error;
  },

  async delete(id: string) {
    const { error } = await supabase.from('assignments').delete().eq('id', id);
    if (error) throw error;
  },

  async toggleStatus(id: string, currentStatus: string) {
    const newStatus = currentStatus === "Draft" ? "Published" : "Draft";
    const { error } = await supabase.from('assignments').update({ status: newStatus }).eq('id', id);
    if (error) throw error;
    return newStatus;
  }
};