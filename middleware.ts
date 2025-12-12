import { NextResponse, type NextRequest } from 'next/server';
import { createServerClientMiddleware } from '@/lib/supabase/server'; // Import the new utility

// Define protected paths for specific roles
const PROTECTED_PATHS: { [key: string]: string[] } = {
  '/dashboard/teacher': ['teacher'],
  '/assignment/teacher': ['teacher'],
  '/attendance/teacher': ['teacher'],
  '/grade/teacher': ['teacher'],
  '/calendar/teacher': ['teacher'],
  
  '/dashboard/parent': ['parent'],
  '/assignment/parent': ['parent'],
  '/attendance/parent': ['parent'],
  '/grade/parent': ['parent'],
  '/calendar/parent': ['parent'],
};

// Paths accessible to anyone (public)
const PUBLIC_PATHS = ['/login', '/signup', '/'];

// Function to find user's role in the database (requires service role key access)
// Since we don't have access to the service role key in middleware, 
// we rely on the client-side role check after sign-in.
// For robust server-side protection, we will check if the user is authenticated 
// and if their profile (teacher/parent) exists.
async function getUserRole(userId: string, supabase: any): Promise<string> {
    const { data: teacher } = await supabase.from('teachers').select('id').eq('id', userId).maybeSingle();
    if (teacher) return 'teacher';

    const { data: parent } = await supabase.from('parents').select('id').eq('id', userId).maybeSingle();
    if (parent) return 'parent';

    return 'unauthenticated';
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 1. Session Refresh (Decoupled Module)
  const { supabase, response: sessionResponse } = createServerClientMiddleware(request);
  const { data: { user } } = await supabase.auth.getUser();

  // If user is accessing public paths, let them through immediately (after session refresh)
  if (PUBLIC_PATHS.includes(pathname)) {
    return sessionResponse;
  }
  
  // 2. Role Guard (Authorization)
  if (!user) {
    // If user is not logged in and accessing a non-public path, redirect to login
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect_to', pathname);
    return NextResponse.redirect(url);
  }

  // 3. Check specific role authorization for protected paths
  const requiredRole = PROTECTED_PATHS[pathname];
  
  if (requiredRole) {
    const userRole = await getUserRole(user.id, supabase);

    if (requiredRole.includes(userRole)) {
      // User has the required role. Allow access.
      return sessionResponse; 
    } else {
      // User is logged in but doesn't have the required role (e.g., Parent accessing /teacher path)
      const redirectUrl = userRole === 'teacher' ? '/dashboard/teacher' : 
                          userRole === 'parent' ? '/dashboard/parent' : 
                          '/'; // Fallback to root

      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
  }

  // 4. Default: If the path is authenticated but not specifically listed above, allow access
  return sessionResponse;
}

// Ensure the middleware matches all paths you want to protect (excluding static assets)
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - API routes (already handled by Next.js)
     */
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
    '/'
  ],
};