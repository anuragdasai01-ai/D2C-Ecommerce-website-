// src/middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const { data: { session } } = await supabase.auth.getSession();

  // Protect Admin Routes
  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!session) return NextResponse.redirect(new URL('/login', req.url));
    
    // Check role in profiles table
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();
      
    if (profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url)); // Kick out non-admins
    }
  }
  return res;
}
