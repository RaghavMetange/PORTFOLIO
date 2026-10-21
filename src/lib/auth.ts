import { cookies } from 'next/headers';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'cse2026';
const ADMIN_COOKIE_NAME = 'portfolio_admin_token';
const ADMIN_TOKEN_VALUE = 'auth_session_' + Buffer.from(ADMIN_PASSWORD).toString('base64');

export function verifyAdminPassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}

export async function isUserAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return token === ADMIN_TOKEN_VALUE;
}

export function getAdminCookieDetails() {
  return {
    name: ADMIN_COOKIE_NAME,
    value: ADMIN_TOKEN_VALUE,
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    },
  };
}
