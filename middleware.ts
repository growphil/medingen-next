import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("jwt_token")?.value;
  const { pathname } = request.nextUrl;

  // Define protected client routes
  const protectedRoutes = [
    "/profile",
    "/personal-info",
    "/savedaddress",
    "/order-payment",
    "/checkout",
  ];

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // If user tries to access a protected route without a token, redirect to login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If logged-in user tries to view login pages, redirect back to home
  const authRoutes = ["/login", "/login2", "/login3", "/enterpassword"];
  if (authRoutes.some((route) => pathname.startsWith(route)) && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, manifest, service workers)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.json|.*\\..*).*)",
  ],
};
