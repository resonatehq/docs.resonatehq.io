import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const docsPrefixes = [
  "/evaluate/",
  "/evaluate",
  "/get-started/",
  "/get-started",
  "/develop/",
  "/develop",
  "/debug/",
  "/debug",
  "/deploy/",
  "/deploy",
  "/learn/",
  "/learn",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rewrite old paths (without /docs prefix) to /docs/...
  // Only if the path is not already under /docs
  if (!pathname.startsWith("/docs")) {
    const matches = docsPrefixes.some(
      (prefix) => pathname === prefix || pathname.startsWith(prefix)
    );
    if (matches) {
      const url = request.nextUrl.clone();
      url.pathname = `/docs${pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match paths that start with doc section prefixes
    "/evaluate/:path*",
    "/evaluate",
    "/get-started/:path*",
    "/get-started",
    "/develop/:path*",
    "/develop",
    "/debug/:path*",
    "/debug",
    "/deploy/:path*",
    "/deploy",
    "/learn/:path*",
    "/learn",
  ],
};
