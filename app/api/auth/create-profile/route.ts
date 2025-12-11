import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

// Initialize Admin Client (Bypasses RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
)

export async function POST(request: NextRequest) {
  try {
    const { userId, role, fullName, gradeDetails } = await request.json()

    if (!userId || !role) {
      return NextResponse.json({ error: 'Missing userId or role' }, { status: 400 })
    }

    // 1. Create the Base Profile (Teacher or Parent)
    const table = role === 'teacher' ? 'teachers' : 'parents'
    const payload = role === 'teacher'
      ? { id: userId, full_name: fullName }
      : { id: userId, phone_number: null } // Phone number can be updated later

    const { error: profileError } = await supabaseAdmin
      .from(table)
      .insert(payload)

    if (profileError) throw profileError

    // 2. Handle Designation Logic based on Role
    if (gradeDetails) {
      
      // === TEACHER LOGIC: Link to Advisory Classes ===
      if (role === 'teacher' && gradeDetails.advisoryClasses) {
        const classes = gradeDetails.advisoryClasses as { grade: string, section: string }[];
        
        for (const cls of classes) {
          // A. Find or Create Class
          const { data: classData, error: classError } = await supabaseAdmin
            .from('class')
            .select('id')
            .eq('grade_level', cls.grade)
            .eq('section_name', cls.section)
            .single()

          let classId = classData?.id

          // If class doesn't exist, create it on the fly
          if (!classId) {
             const { data: newClass } = await supabaseAdmin
               .from('class')
               .insert({ grade_level: cls.grade, section_name: cls.section })
               .select()
               .single()
             classId = newClass?.id
          }

          // B. Link Teacher to Class
          if (classId) {
            await supabaseAdmin
              .from('class_advisers')
              .insert({ teacher_id: userId, class_id: classId })
          }
        }
      }

      // === PARENT LOGIC: Link to Child's Class ===
      if (role === 'parent' && gradeDetails.grade && gradeDetails.section) {
        // A. Find the Class
        const { data: classData } = await supabaseAdmin
          .from('class')
          .select('id')
          .eq('grade_level', gradeDetails.grade)
          .eq('section_name', gradeDetails.section)
          .single()

        if (classData?.id) {
          // B. Create a Placeholder Student (Since we don't have the child's name yet)
          // The parent can update the child's name later in their dashboard
          const { data: studentData, error: studentError } = await supabaseAdmin
            .from('students')
            .insert({ full_name: `Child of ${fullName}` }) // Placeholder Name
            .select('id')
            .single()

          if (studentData) {
            // C. Link Parent -> Student
            await supabaseAdmin
              .from('parent_student')
              .insert({ parent_id: userId, student_id: studentData.id })

            // D. Try to Link Student -> Class -> Adviser
            // We need to find if this class has an adviser to satisfy the NOT NULL constraint in student_class_teacher
            const { data: adviserData } = await supabaseAdmin
              .from('class_advisers')
              .select('teacher_id')
              .eq('class_id', classData.id)
              .maybeSingle()

            if (adviserData?.teacher_id) {
               // If an adviser exists, we can fully enroll the student
               await supabaseAdmin
                 .from('student_class_teacher')
                 .insert({
                   student_id: studentData.id,
                   class_id: classData.id,
                   teacher_id: adviserData.teacher_id,
                   is_adviser: true // Assuming the class adviser is the main teacher
                 })
            } else {
               console.warn("Student created but not linked to class yet: No adviser found for this section.")
            }
          }
        }
      }
    }

    return NextResponse.json({ success: true }, { status: 200 })

  } catch (error: any) {
    console.error('Create profile error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}