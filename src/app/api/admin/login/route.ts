import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminPassword, getAdminCookieDetails } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    if (!password || !verifyAdminPassword(password)) {
      return NextResponse.json({ success: false, error: 'Invalid admin passcode' }, { status: 401 });
    }

    const cookieDetails = getAdminCookieDetails();
    const response = NextResponse.json({
      success: true,
      message: 'Admin authenticated successfully',
    });

    response.cookies.set(
      cookieDetails.name,
      cookieDetails.value,
      cookieDetails.options
    );

    return response;
  } catch {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE() {
  const cookieDetails = getAdminCookieDetails();
  const response = NextResponse.json({ success: true, message: 'Logged out' });
  response.cookies.delete(cookieDetails.name);
  return response;
}
