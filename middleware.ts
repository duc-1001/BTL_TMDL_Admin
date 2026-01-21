import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  user_id: string;
  role: string;
  exp: number;
  type: "access" | "refresh";
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;  
  console.log(token);
  
  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!token) {
      return redirectToLogin(request);
    }

    try {
      const payload = jwtDecode<JwtPayload>(token);
      console.log(payload);
      
      
      // token hết hạn
      if (payload.exp * 1000 < Date.now()) {
        return redirectToLogin(request);
      }

      if (payload.role !== "admin") {
        return redirectToLogin(request);
      }
    } catch {
      return redirectToLogin(request);
    }
  }

  return NextResponse.next();
}

function redirectToLogin(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = "/login";
  url.searchParams.set("redirect", request.nextUrl.pathname);
  return NextResponse.redirect(url);
}
