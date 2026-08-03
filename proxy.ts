import { NextRequest, NextResponse } from 'next/server';
import { parseSetCookie } from 'set-cookie-parser';
import { EXPIRED_ACCESS_TOKEN } from '@/app/constants/error-code';
import { ResponseError } from '@/app/types/error';

// Các route KHÔNG cần đăng nhập (public)
const publicRoutes = ['/login', '/sign-up', '/forgot-password', '/sign-up/verify',
    '/forget-password', '/reset-password'
];

// Các route CẦN đăng nhập (protected) - có thể dùng cách match ngược lại
const authRoutes = ['/login', '/register'];

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    let response = NextResponse.next({ request });

    const accessToken = request.cookies.get('access_token')?.value;
    const refreshToken = request.cookies.get('refresh_token')?.value;

    const isPublicRoute = publicRoutes.includes(pathname);
    const isAuthRoute = authRoutes.includes(pathname);

    // Chỉ cần refresh khi có CẢ 2 token (access_token có thể hết hạn nhưng còn refresh_token)
    if (accessToken && refreshToken) {
        try {
            const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/user`, {
                headers: { Cookie: `access_token=${accessToken}` },
            });

            if (!userRes.ok) {
                const body: ResponseError | null = await userRes.json().catch(() => null);

                if (userRes.status === 401 && body?.code === EXPIRED_ACCESS_TOKEN) {
                    const refreshRes = await fetch(
                        `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
                        {
                            method: 'POST',
                            headers: { Cookie: `refresh_token=${refreshToken}` },
                        }
                    );

                    if (refreshRes.ok) {
                        // getSetCookie() trả về string[] chuẩn, không bị gộp như .get('set-cookie')
                        const setCookieHeaders = refreshRes.headers.getSetCookie?.() ?? [];

                        if (setCookieHeaders.length > 0) {
                            const parsed = parseSetCookie(setCookieHeaders);

                            // Ghi cookie mới vào request -> Server Component phía sau đọc được ngay
                            parsed.forEach(({ name, value }) => {
                                request.cookies.set(name, value);
                            });
                            response = NextResponse.next({ request });

                            // Ghi cookie mới vào response -> forward về browser
                            parsed.forEach(({ name, value, ...options }) => {
                                response.cookies.set(name, value, options as any);
                            });
                        }
                    } else {
                        // refresh_token cũng hết hạn/revoked -> xoá cookie, coi như logout
                        response.cookies.delete('access_token');
                        response.cookies.delete('refresh_token');

                        if (!isPublicRoute) {
                            const loginUrl = new URL('/login', request.url);
                            loginUrl.searchParams.set('redirect', pathname);
                            return NextResponse.redirect(loginUrl);
                        }
                    }
                }
                // Các lỗi 401 khác (không phải EXPIRED_ACCESS_TOKEN) -> bỏ qua, để route tự xử lý
            }
            // userRes.ok -> access_token còn hạn, không cần refresh
        } catch {
            // Lỗi network khi gọi API xác thực -> bỏ qua, không chặn request
            // (tránh việc backend down làm sập toàn bộ middleware)
        }
    }

    // ===== Logic redirect gốc của bạn, giữ nguyên =====
    const hasValidAccessToken = !!request.cookies.get('access_token')?.value; // đọc lại vì có thể vừa được refresh ở trên

    // TH1: Chưa đăng nhập (không có token) mà cố vào route cần bảo vệ
    if (!hasValidAccessToken && !isPublicRoute) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // TH2: Đã đăng nhập (có token) mà cố vào trang login/register
    if (hasValidAccessToken && isAuthRoute) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return response;
}

// Chỉ áp dụng middleware cho các route cần thiết (tối ưu performance)
export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};