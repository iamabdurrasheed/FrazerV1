import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Extract tenant from path
  const tenant = getTenantFromPath(pathname);
  
  // Public routes that don't require authentication
  const publicRoutes = ['/', '/api/auth', '/auth', '/products', '/categories', '/contact', '/about', '/api/products', '/api/categories'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Admin routes protection
  if (pathname.startsWith('/admin')) {
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    });
    
    if (!token || token.role !== 'admin') {
      return NextResponse.redirect(new URL('/auth/admin/login', request.url));
    }
    
    // Add tenant context to headers
    const response = NextResponse.next();
    response.headers.set('x-tenant', 'admin');
    return response;
  }
  
  // User app routes protection
  if (pathname.startsWith('/app')) {
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    });
    
    if (!token || token.role !== 'user') {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    
    // Add tenant context to headers
    const response = NextResponse.next();
    response.headers.set('x-tenant', 'user');
    return response;
  }
  
  // API routes protection
  if (pathname.startsWith('/api/')) {
    // Skip auth API routes and public API routes
    if (pathname.startsWith('/api/auth') || 
        pathname.startsWith('/api/products') || 
        pathname.startsWith('/api/categories') ||
        pathname.startsWith('/api/offers')) {
      return NextResponse.next();
    }
    
    // Admin API routes
    if (pathname.startsWith('/api/admin/')) {
      const token = await getToken({ 
        req: request, 
        secret: process.env.NEXTAUTH_SECRET 
      });
      
      if (!token || token.role !== 'admin') {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
    }

    // User-protected API routes (cart, orders, etc.)
    if (pathname.startsWith('/api/cart') || 
        pathname.startsWith('/api/orders') || 
        pathname.startsWith('/api/users')) {
      const token = await getToken({ 
        req: request, 
        secret: process.env.NEXTAUTH_SECRET 
      });
      
      if (!token || token.role !== 'user') {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
    }
  }
  
  return NextResponse.next();
}

function getTenantFromPath(pathname: string): string {
  if (pathname.startsWith('/admin')) {
    return 'admin';
  }
  if (pathname.startsWith('/app')) {
    return 'user';
  }
  return 'public';
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
