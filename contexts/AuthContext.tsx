"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient'; 
import { User } from '@supabase/supabase-js';

// Define the role type
type UserRole = 'teacher' | 'parent' | 'public';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>('public');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Function to fetch the user and their role from the database
    const fetchUserAndRole = async (sessionUser: User) => {
      // 1. Check Teacher table
      const { data: teacherData } = await supabase.from('teachers').select('id').eq('id', sessionUser.id).maybeSingle();
      
      if (teacherData) {
        setRole('teacher');
        return;
      }
      
      // 2. Check Parent table
      const { data: parentData } = await supabase.from('parents').select('id').eq('id', sessionUser.id).maybeSingle();
      
      if (parentData) {
        setRole('parent');
        return;
      }
      
      setRole('public'); // Fallback role
    };

    // Listen for auth state changes (login/logout/token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        fetchUserAndRole(session.user);
      } else {
        setUser(null);
        setRole('public');
      }
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};