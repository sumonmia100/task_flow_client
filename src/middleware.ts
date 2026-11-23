import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/", "/about", "/features", "/pricing", "/contact", "/login", "/register"];
const ADMIN_ROUTES = ["/admin"];
const MANAGER_ROUTES = ["/dashboard"];
const MEMBER_ROUTES = ["/member"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (PUBLIC_ROUTES.some((route) => pathname === route)) {
    return NextResponse.next();
  }

  // Allow payment callback routes (called by bKash)
  if (pathname.startsWith("/payment")) {
    return NextResponse.next();
  }

  const token = request.cookies.get("accessToken")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "");

  // No token → redirect to login
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Decode role from JWT payload (without verification — verification happens on API)
  try {
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString(),
    );
    const role = payload?.role as string;

    if (
      ADMIN_ROUTES.some((r) => pathname.startsWith(r)) &&
      role !== "ADMIN"
    ) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (
      MANAGER_ROUTES.some((r) => pathname.startsWith(r)) &&
      role !== "MANAGER" &&
      role !== "ADMIN"
    ) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (
      MEMBER_ROUTES.some((r) => pathname.startsWith(r)) &&
      role !== "MEMBER" &&
      role !== "ADMIN"
    ) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
