import { supabase } from "@/lib/supabaseClient";

export interface TeacherStats {
  totalStudents: number;
  honorStudents: number;
  unreadMessages: number;
  upcomingEvents: number;
  academicDist: {
    highest: number; // 98-100
    high: number;    // 95-97
    withHonor: number; // 90-94
    others: number;
  };
}

export interface ParentStats {
  gradeAverage: string; // e.g. "89.60%"
  attendancePct: string; // e.g. "90%"
  unreadMessages: number;
  upcomingEventsCount: number;
  // We will fetch the lists separately or include them here
  upcomingEventsList: any[];
}

export const dashboardService = {
  // === TEACHER DATA ===
  async getTeacherStats(teacherId: string): Promise<TeacherStats> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();

    // 1. Total Students (Unique count in classes advised/taught by teacher)
    // Note: This is an approximation. Ideally, you do a distinct count on student_id.
    const { count: studentCount } = await supabase
      .from('student_class_teacher')
      .select('*', { count: 'exact', head: true })
      .eq('teacher_id', teacherId);

    // 2. Events this Month
    const { count: eventCount } = await supabase
      .from('events')
      .select('*', { count: 'exact', head: true })
      .gte('start_date', startOfMonth)
      .lte('start_date', endOfMonth);

    // 3. Calculate Honors & Distribution (Based on Grades)
    // Fetch all grades given by this teacher (or all grades for their advisory class)
    const { data: grades } = await supabase
      .from('student_grade')
      .select('score')
      .eq('teacher_id', teacherId);

    let highest = 0, high = 0, withHonor = 0, others = 0;

    grades?.forEach(g => {
      const score = Number(g.score);
      if (score >= 98) highest++;
      else if (score >= 95) high++;
      else if (score >= 90) withHonor++;
      else others++;
    });

    return {
      totalStudents: studentCount || 0,
      honorStudents: highest + high + withHonor,
      unreadMessages: 2, // Placeholder until messaging system exists
      upcomingEvents: eventCount || 0,
      academicDist: { highest, high, withHonor, others }
    };
  },

  // === PARENT DATA ===
  async getParentStats(parentId: string): Promise<ParentStats> {
    // 1. Get Linked Student(s)
    const { data: links } = await supabase
      .from('parent_student')
      .select('student_id')
      .eq('parent_id', parentId);
    
    const studentIds = links?.map(l => l.student_id) || [];

    if (studentIds.length === 0) {
      return { 
        gradeAverage: "N/A", 
        attendancePct: "0%", 
        unreadMessages: 0, 
        upcomingEventsCount: 0,
        upcomingEventsList: []
      };
    }

    // 2. Calculate Grade Average
    const { data: grades } = await supabase
      .from('student_grade')
      .select('score')
      .in('student_id', studentIds);

    let avg = 0;
    if (grades && grades.length > 0) {
      const total = grades.reduce((acc, curr) => acc + Number(curr.score), 0);
      avg = total / grades.length;
    }

    // 3. Calculate Attendance %
    const { data: attendance } = await supabase
      .from('attendance')
      .select('status')
      .in('student_id', studentIds);
    
    let attPct = 0;
    if (attendance && attendance.length > 0) {
      const present = attendance.filter(a => a.status === 'Present').length;
      attPct = (present / attendance.length) * 100;
    }

    // 4. Events (This Month)
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();
    
    const { data: events, count: eventCount } = await supabase
      .from('events')
      .select('*') // Select all to list them
      .gte('start_date', startOfMonth)
      .lte('start_date', endOfMonth)
      .order('start_date', { ascending: true })
      .limit(3);

    return {
      gradeAverage: avg > 0 ? `${avg.toFixed(2)}%` : "No Grades",
      attendancePct: attPct > 0 ? `${Math.round(attPct)}%` : "0%",
      unreadMessages: 2, // Placeholder
      upcomingEventsCount: eventCount || 0,
      upcomingEventsList: events || []
    };
  }
};