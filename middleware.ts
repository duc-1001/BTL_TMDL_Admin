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
  
  // 1. Cho phép truy cập các file tĩnh và trang login không cần token
  if (
    pathname.startsWith("/_next") || 
    pathname.startsWith("/api") || 
    pathname.startsWith("/static") ||
    pathname === "/login"
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("access_token")?.value;

  // 2. Nếu không có token -> Đá về login
  if (!token) {
    return redirectToLogin(request);
  }

  try {
    const payload = jwtDecode<JwtPayload>(token);

    // 3. Kiểm tra hết hạn (Next.js Middleware chạy ở Edge, Date.now() chuẩn)
    if (payload.exp * 1000 < Date.now()) {
      return redirectToLogin(request);
    }

    // 4. Kiểm tra quyền Admin
    // Vì đây là App Admin, nếu không phải admin thì không cho xem gì cả
    if (payload.role !== "admin") {
      // Có thể chuyển hướng sang một trang "Access Denied" hoặc quay về login
      return redirectToLogin(request);
    }
  } catch (error) {
    // Token lỗi hoặc không giải mã được
    return redirectToLogin(request);
  }

  return NextResponse.next();
}

function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL("/login", request.url);
  
  // Tránh việc lưu redirect nếu đang ở trang chủ
  if (request.nextUrl.pathname !== "/") {
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
  }
  
  return NextResponse.redirect(loginUrl);
}

// Cấu hình để middleware chạy trên tất cả các route
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};