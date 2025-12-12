import { supabase } from "@/lib/supabase";
import { AssignmentFormData } from "@/data/assignmentData";

export const assignmentService = {
  // Function to fetch all Classes (for Teacher dropdown)
  async getClasses() {
    const { data, error } = await supabase
      .from('class')
      .select('id, grade_level, section_name')
      .order('grade_level', { ascending: true });
    if (error) throw error;
    return data?.map(c => ({
      id: c.id,
      name: `Grade ${c.grade_level} - ${c.section_name}`
    }));
  },

  // Function to fetch all subjects (for Teacher dropdown)
  async getSubjects() {
    const { data, error } = await supabase
      .from('subjects')
      .select('id, name')
      .order('name', { ascending: true });
    if (error) throw error;
    return data;
  },

  // 1. GET ALL (For Teachers)
  async getAll() {
    const { data, error } = await supabase
      .from('assignments')
      .select(`
        *, 
        startDate:start_date, 
        dueDate:due_date, 
        creator:created_by, 
        teachers(full_name),
        subjects(name),  
        class(grade_level, section_name) 
      `) 
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return data?.map((item: any) => ({
      ...item,
      creatorName: item.teachers?.full_name || 'Unknown',
      subjectName: item.subjects?.name || 'Unknown Subject',
      // Null check to prevent "Cannot read properties of null" error
      className: item.class ? `Grade ${item.class.grade_level} - ${item.class.section_name}` : 'N/A (Missing Class)'
    }));
  },

  // 2. GET PUBLISHED FOR PARENT (Fixed Logic and Warning)
  async getPublished(parentId: string) {
    // 1. Find all student IDs linked to this parent (RLS check is crucial here)
    const { data: studentLinks, error: studentError } = await supabase
        .from('parent_student')
        .select('student_id')
        .eq('parent_id', parentId);

    if (studentError) throw studentError;
    const studentIds = studentLinks?.map(l => l.student_id) || [];
    
    if (studentIds.length === 0) return []; 

    // 2. Find all unique Class IDs associated with these students
    const { data: classLinks, error: classError } = await supabase
        .from('student_class_teacher')
        .select('class_id')
        .in('student_id', studentIds);
    
    if (classError) throw classError;

    // FIX: Removed the redundant '|| []' expression to clear the TypeScript warning.
    // The inner '|| []' ensures map works even if classLinks is null, though student check covers this.
    const rawClassIds = classLinks?.map((l: any) => l.class_id) || [];
    const classIds = [...new Set(rawClassIds)]; 

    if (classIds.length === 0) return [];

    // 3. Fetch assignments: must be PUBLISHED AND assigned to one of the classes
    const { data, error } = await supabase
      .from('assignments')
      .select(`
          *, 
          startDate:start_date, 
          dueDate:due_date, 
          creator:created_by, 
          subjects(name),
          class(grade_level, section_name)
      `)
      .eq('status', 'Published')
      .in('class_id', classIds) 
      .order('start_date', { ascending: true });

    if (error) throw error;
    
    return data?.map((item: any) => ({
      ...item,
      creatorName: item.teachers?.full_name || 'Unknown',
      subjectName: item.subjects?.name || 'Unknown Subject',
      className: item.class ? `Grade ${item.class.grade_level} - ${item.class.section_name}` : 'N/A (Missing Class)'
    }));
  },

  async create(data: AssignmentFormData) {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !sessionData?.session?.user?.id) { throw new Error("You must be signed in to create assignments."); }

    const userId = sessionData.session.user.id;
    const payload: any = {
      title: data.title,
      type: data.type,
      subject_id: (data as any).subjectId,
      class_id: (data as any).classId, // Must be set by the Modal
      description: data.description,
      start_date: data.startDate,
      due_date: data.dueDate,
      status: "Draft",
      created_by: userId,
    };

    const { data: result, error } = await supabase.from('assignments').insert([payload]).select().single();
    if (error) throw error;
    return result;
  },

  async update(id: string, updates: Partial<AssignmentFormData>) {
    const dbUpdates: any = { ...updates };
    
    if (updates.startDate) dbUpdates.start_date = updates.startDate;
    if (updates.dueDate) dbUpdates.due_date = updates.dueDate;
    if ((updates as any).subjectId) dbUpdates.subject_id = (updates as any).subjectId;
    if ((updates as any).classId) dbUpdates.class_id = (updates as any).classId; 

    // Cleanup keys before update
    delete dbUpdates.startDate; delete dbUpdates.dueDate; delete dbUpdates.creator; 
    delete (dbUpdates as any).creatorName; delete (dbUpdates as any).teachers; delete dbUpdates.id;
    delete dbUpdates.status; delete (dbUpdates as any).created_at; 
    delete (dbUpdates as any).subjectId; delete (dbUpdates as any).classId; 
    
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