import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret_key");

// Define protected routes
const protectedRoutes = ["/activity", "/admin"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  console.log("Middleware Triggered: Checking route:", pathname);

  // Retrieve the `auth_token` cookie
  const token = req.cookies.get("auth_token")?.value || "";
  console.log("Retrieved Token:", token);

  if (!token) {
    console.log("Token not found, redirecting to /login");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    // Verify the token using jose library
    const { payload } = await jwtVerify(token, SECRET_KEY);
    console.log("User authenticated:", payload);

    // Continue with the request if the token is valid
    return NextResponse.next();
  } catch (err) {
    console.log("Invalid or Missing Token:", err.message);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/activity/:path*", "/admin/:path*"],
};
