import { NextRequest, NextResponse } from 'next/server';
import { parseSetCookie } from 'set-cookie-parser';
import { EXPIRED_ACCESS_TOKEN } from '@/app/constants/error-code';
import { ResponseError } from '@/app/types/error';

// Guest routes accessible without logging in
const GUEST_ROUTES = [
    '/',
    '/about',
    '/login',
    '/sign-up',
    '/sign-up/verify',
    '/verify',
    '/forget-password',
    '/forgot-password',
    '/reset-password',
    '/terms-and-conditions',
    '/privacy-policy',
];

// Auth-only routes (login / register pages where authenticated users are redirected to '/')
const AUTH_ONLY_ROUTES = [
    '/login',
    '/sign-up',
    '/sign-up/verify',
    '/verify',
    '/forget-password',
    '/forgot-password',
    '/reset-password',
];

function checkIsGuestRoute(pathname: string): boolean {
    return GUEST_ROUTES.some((route) => {
        if (route === '/') return pathname === '/';
        return pathname === route || pathname.startsWith(`${route}/`);
    });
}

function checkIsAuthOnlyRoute(pathname: string): boolean {
    return AUTH_ONLY_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    let response = NextResponse.next({ request });

    let accessToken = request.cookies.get('access_token')?.value;
    const refreshToken = request.cookies.get('refresh_token')?.value;

    const isPublicRoute = checkIsGuestRoute(pathname);
    const isAuthRoute = checkIsAuthOnlyRoute(pathname);

    // Refresh token if access token is present but expired
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
                        const setCookieHeaders = refreshRes.headers.getSetCookie?.() ?? [];

                        if (setCookieHeaders.length > 0) {
                            const parsed = parseSetCookie(setCookieHeaders);

                            parsed.forEach(({ name, value }) => {
                                request.cookies.set(name, value);
                                if (name === 'access_token') accessToken = value;
                            });
                            response = NextResponse.next({ request });

                            parsed.forEach(({ name, value, ...options }) => {
                                response.cookies.set(name, value, options as any);
                            });
                        }
                    } else {
                        response.cookies.delete('access_token');
                        response.cookies.delete('refresh_token');
                        accessToken = undefined;

                        if (!isPublicRoute) {
                            const loginUrl = new URL('/login', request.url);
                            loginUrl.searchParams.set('redirect', pathname);
                            return NextResponse.redirect(loginUrl);
                        }
                    }
                } else if (userRes.status === 401) {
                    response.cookies.delete('access_token');
                    response.cookies.delete('refresh_token');
                    accessToken = undefined;
                }
            }
        } catch {
            // Ignore network errors when verifying API
        }
    }

    const hasValidAccessToken = !!accessToken;

    // Unauthenticated user trying to access protected route
    if (!hasValidAccessToken && !isPublicRoute) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Authenticated user trying to access auth-only pages (login, sign-up, etc.)
    if (hasValidAccessToken && isAuthRoute) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return response;
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};