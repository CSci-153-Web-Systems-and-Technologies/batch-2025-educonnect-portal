"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient'; 
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation'; // Import useRouter

// Define the role type
type UserRole = 'teacher' | 'parent' | 'public';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isLoading: boolean;
  signOut: () => Promise<void>; // Add signOut to interface
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>('public');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter(); // Initialize router

  useEffect(() => {
    const fetchUserAndRole = async (sessionUser: User) => {
      // 1. Check Teacher table
      const { data: teacherData } = await supabase.from('teachers').select('id').eq('id', sessionUser.id).maybeSingle();
      if (teacherData) { setRole('teacher'); return; }
      
      // 2. Check Parent table
      const { data: parentData } = await supabase.from('parents').select('id').eq('id', sessionUser.id).maybeSingle();
      if (parentData) { setRole('parent'); return; }
      
      setRole('public');
    };

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

    return () => { subscription?.unsubscribe(); };
  }, []);

  // --- NEW SIGN OUT FUNCTION ---
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole('public');
    router.push('/login'); // Redirect to login page
  };

  return (
    <AuthContext.Provider value={{ user, role, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};