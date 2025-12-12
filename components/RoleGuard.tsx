"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

type UserRole = "teacher" | "parent" | "public";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRole: UserRole;
}

export function RoleGuard({ children, allowedRole }: RoleGuardProps) {
  const { role, isLoading, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    // If not authenticated, redirect to login
    if (!user) {
      router.push("/login");
      return;
    }

    // If role doesn't match the allowed role, redirect to their appropriate dashboard
    if (role !== allowedRole && role !== "public") {
      if (role === "teacher") {
        router.push("/dashboard/teacher");
      } else if (role === "parent") {
        router.push("/dashboard/parent");
      }
    }

    // If role is public but trying to access protected routes, redirect to login
    if (role === "public" && pathname && !pathname.startsWith("/login") && !pathname.startsWith("/signup")) {
      router.push("/login");
    }
  }, [role, isLoading, user, router, pathname, allowedRole]);

  // Show nothing while loading or if unauthorized
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
      </div>
    );
  }

  // Only render children if user has the correct role
  if (role === allowedRole) {
    return <>{children}</>;
  }

  return null;
}
