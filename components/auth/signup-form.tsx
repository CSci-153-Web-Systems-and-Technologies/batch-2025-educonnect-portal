"use client";
import * as React from 'react';
import { supabase } from '@/lib/supabaseClient';
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; 
import Link from 'next/link'; 
import { X, Plus } from 'lucide-react';

const GRADES = ["7", "8", "9", "10"];
const SECTIONS = ["A", "B", "C"];

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [fullName, setFullName] = React.useState('');
  const [role, setRole] = React.useState<'teacher' | 'parent'>('teacher');
  
  // --- NEW STATE FOR GRADES/SECTIONS ---
  // For Parents (Single Child link for now)
  const [childGrade, setChildGrade] = React.useState('');
  const [childSection, setChildSection] = React.useState('');

  // For Teachers (Multiple Advisory Classes)
  const [advisoryClasses, setAdvisoryClasses] = React.useState<{ grade: string, section: string }[]>([]);
  const [tempTeacherGrade, setTempTeacherGrade] = React.useState('');
  const [tempTeacherSection, setTempTeacherSection] = React.useState('');

  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [isSuccess, setIsSuccess] = React.useState(false);

  // Helper to add advisory class for teachers
  const addAdvisoryClass = () => {
    if (!tempTeacherGrade || !tempTeacherSection) return;
    
    // Prevent duplicates
    const exists = advisoryClasses.some(c => c.grade === tempTeacherGrade && c.section === tempTeacherSection);
    if (!exists) {
      setAdvisoryClasses([...advisoryClasses, { grade: tempTeacherGrade, section: tempTeacherSection }]);
    }
    // Reset selection
    setTempTeacherGrade('');
    setTempTeacherSection('');
  };

  // Helper to remove advisory class
  const removeAdvisoryClass = (index: number) => {
    setAdvisoryClasses(advisoryClasses.filter((_, i) => i !== index));
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setIsSuccess(false);

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      setLoading(false);
      return;
    }

    // Validation: Ensure grade/section selected based on role
    if (role === 'parent' && (!childGrade || !childSection)) {
      setMessage("Please select your child's Grade and Section.");
      setLoading(false);
      return;
    }
    // Optional: Enforce at least one advisory class for teachers? 
    // if (role === 'teacher' && advisoryClasses.length === 0) { ... }

    // 1. Create the user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setMessage(`Signup Error: ${authError.message}`);
      setLoading(false);
      return;
    }

    // 2. Create profile via API
    if (authData.user) {
        try {
          const res = await fetch('/api/auth/create-profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: authData.user.id,
              role,
              fullName,
              // Pass the new data fields to the API
              gradeDetails: role === 'parent' 
                ? { grade: childGrade, section: childSection }
                : { advisoryClasses: advisoryClasses } 
            })
          })

          if (!res.ok) {
            const err = await res.json()
            setMessage(`Signup successful, but failed to link profile: ${err.error}`)
          } else {
            setMessage('Success! Check your email to confirm your account.')
            setIsSuccess(true)
          }
        } catch (err: any) {
          setMessage(`Signup successful, but profile creation failed: ${err.message}`)
          setIsSuccess(true) 
        }
    }
    
    setLoading(false);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create Account</CardTitle>
          <CardDescription>
            Enter your details below to create your EduConnectPortal account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp}>
            <FieldGroup>
              
              <Field>
                <FieldLabel htmlFor="role">Account Type</FieldLabel>
                <Select value={role} onValueChange={(value: 'teacher' | 'parent') => setRole(value)}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Account Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="teacher">Teacher</SelectItem>
                        <SelectItem value="parent">Parent/Guardian</SelectItem>
                    </SelectContent>
                </Select>
              </Field>

              {/* === PARENT: Child's Grade & Section === */}
              {role === 'parent' && (
                <div className="grid grid-cols-2 gap-4 p-4 border border-blue-100 dark:border-blue-900 rounded-lg bg-blue-50/50 dark:bg-blue-900/10">
                  <Field>
                    <FieldLabel className="text-blue-600 dark:text-blue-400">Child's Grade</FieldLabel>
                    <Select value={childGrade} onValueChange={setChildGrade}>
                      <SelectTrigger><SelectValue placeholder="Grade" /></SelectTrigger>
                      <SelectContent>
                        {GRADES.map(g => <SelectItem key={g} value={g}>Grade {g}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel className="text-blue-600 dark:text-blue-400">Section</FieldLabel>
                    <Select value={childSection} onValueChange={setChildSection}>
                      <SelectTrigger><SelectValue placeholder="Section" /></SelectTrigger>
                      <SelectContent>
                        {SECTIONS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </Field>
                </div>
              )}

              {/* === TEACHER: Advisory Classes (Multiple) === */}
              {role === 'teacher' && (
                <div className="space-y-3 p-4 border border-orange-100 dark:border-orange-900 rounded-lg bg-orange-50/50 dark:bg-orange-900/10">
                  <FieldLabel className="text-orange-600 dark:text-orange-400">Advisory Class(es)</FieldLabel>
                  
                  {/* Selection Row */}
                  <div className="flex gap-2 items-end">
                    <div className="flex-1">
                      <Select value={tempTeacherGrade} onValueChange={setTempTeacherGrade}>
                        <SelectTrigger><SelectValue placeholder="Grade" /></SelectTrigger>
                        <SelectContent>
                          {GRADES.map(g => <SelectItem key={g} value={g}>Grade {g}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-24">
                      <Select value={tempTeacherSection} onValueChange={setTempTeacherSection}>
                        <SelectTrigger><SelectValue placeholder="Sec" /></SelectTrigger>
                        <SelectContent>
                          {SECTIONS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button 
                      type="button" 
                      onClick={addAdvisoryClass}
                      variant="secondary"
                      className="shrink-0"
                      disabled={!tempTeacherGrade || !tempTeacherSection}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* List of Added Classes */}
                  {advisoryClasses.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {advisoryClasses.map((ac, idx) => (
                        <div key={idx} className="flex items-center gap-1 px-3 py-1 rounded-full bg-white dark:bg-neutral-800 border shadow-sm text-sm">
                          <span className="font-medium">Gr {ac.grade} - {ac.section}</span>
                          <button 
                            type="button" 
                            onClick={() => removeAdvisoryClass(idx)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {advisoryClasses.length === 0 && (
                    <p className="text-xs text-muted-foreground italic">No advisory classes added yet.</p>
                  )}
                </div>
              )}

              <Field>
                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                <Input 
                  id="name" 
                  type="text" 
                  placeholder="John Doe" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required 
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Field>
              <Field>
                <Field className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input 
                      id="password" 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required 
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="confirm-password">
                      Confirm Password
                    </FieldLabel>
                    <Input 
                      id="confirm-password" 
                      type="password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required 
                    />
                  </Field>
                </Field>
                <FieldDescription>
                  Must be at least 8 characters long.
                </FieldDescription>
              </Field>
              
              {message && <p className={isSuccess ? "text-green-600 text-sm mt-2" : "text-red-500 text-sm mt-2"}>{message}</p>}
              
              <Field>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
                <FieldDescription className="text-center">
                  Already have an account? <Link href="/login">Sign in</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}