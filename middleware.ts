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
  const { pathname } = request.nextUrl;

  // ================================
  // Allow static files & public assets
  // ================================
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("access_token")?.value;

  // ================================
  // LOGIN PAGE
  // ================================
  // Nếu đã login rồi mà vào /login
  // => redirect về dashboard/home
  if (pathname === "/login") {
    if (token) {
      try {
        const payload = jwtDecode<JwtPayload>(token);

        // token còn hạn + đúng role
        if (
          payload.exp * 1000 > Date.now() &&
          payload.role === "admin"
        ) {
          return NextResponse.redirect(new URL("/", request.url));
        }
      } catch (error) {
        // token lỗi -> vẫn cho vào login
      }
    }

    return NextResponse.next();
  }

  // ================================
  // Protected Routes
  // ================================
  // Không có token
  if (!token) {
    return redirectToLogin(request);
  }

  try {
    const payload = jwtDecode<JwtPayload>(token);

    // Token hết hạn
    if (payload.exp * 1000 < Date.now()) {
      return redirectToLogin(request);
    }

    // Không đúng role admin
    if (payload.role !== "admin") {
      return redirectToLogin(request);
    }

  } catch (error) {
    // Token lỗi
    return redirectToLogin(request);
  }

  return NextResponse.next();
}

function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL("/login", request.url);

  // Lưu redirect path
  if (request.nextUrl.pathname !== "/") {
    loginUrl.searchParams.set(
      "redirect",
      request.nextUrl.pathname
    );
  }

  // Xóa cookie lỗi nếu có
  const response = NextResponse.redirect(loginUrl);

  response.cookies.delete("access_token");
  response.cookies.delete("refresh_token");

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};