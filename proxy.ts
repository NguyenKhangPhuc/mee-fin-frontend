import { NextRequest, NextResponse } from 'next/server';

// Các route KHÔNG cần đăng nhập (public)
const publicRoutes = ['/login', '/register', '/forgot-password'];

// Các route CẦN đăng nhập (protected) - có thể dùng cách match ngược lại
const authRoutes = ['/login', '/register'];

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const accessToken = request.cookies.get('access_token')?.value;

    const isPublicRoute = publicRoutes.includes(pathname);
    const isAuthRoute = authRoutes.includes(pathname);

    // TH1: Chưa đăng nhập (không có token) mà cố vào route cần bảo vệ
    if (!accessToken && !isPublicRoute) {
        const loginUrl = new URL('/login', request.url);
        // Lưu lại url ban đầu để sau khi login xong redirect về đúng chỗ
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // TH2: Đã đăng nhập (có token) mà cố vào trang login/register
    if (accessToken && isAuthRoute) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Còn lại thì cho đi tiếp bình thường
    return NextResponse.next();
}

// Chỉ áp dụng middleware cho các route cần thiết (tối ưu performance)
export const config = {
    matcher: [
        /*
         * Match tất cả routes trừ:
         * - api routes (thường tự xử lý auth riêng)
         * - _next/static, _next/image (file tĩnh)
         * - favicon.ico, các file ảnh
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};