import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Add custom middleware logic here if needed
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/signup",
    },
  }
);

export const config = {
  matcher: [
    "/profile/:path*",
    "/dashboard/:path*",
    "/settings/:path*",
    // Add other protected routes here
  ],
}; 