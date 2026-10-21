import { NextResponse } from 'next/server';
import { isUserAdmin } from '@/lib/auth';
import { sendVisitorAlertEmail } from '@/lib/resend';
import { getAllVisitors } from '@/lib/tracker';

export async function POST() {
  const isAdmin = await isUserAdmin();
  if (!isAdmin) {
    return NextResponse.json({ success: false, error: 'Unauthorized: Admin access required' }, { status: 401 });
  }

  const visitors = getAllVisitors();
  const sampleVisitor = visitors[0] || {
    id: 'vis_test_resend',
    ip: '203.0.113.195',
    name: 'Sample Verified Visitor',
    email: 'visitor.sample@example.com',
    isNamed: true,
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    browser: 'Chrome 122',
    os: 'macOS Sonoma',
    deviceType: 'desktop',
    country: 'India',
    countryCode: 'IN',
    city: 'Pune',
    region: 'Maharashtra',
    firstVisitedAt: new Date().toISOString(),
    lastActiveAt: new Date().toISOString(),
    visitCount: 3,
    visitedPages: ['/', '#projects', '#contact'],
    notes: 'Testing Resend email service integration for visitor telemetry.',
  };

  const result = await sendVisitorAlertEmail({
    visitor: sampleVisitor,
    trigger: 'admin_test',
    customSubject: `🧪 Resend Verification: Telemetry Alert from Raghav Portfolio`,
    notes: 'This is a test notification confirming that Resend email delivery is working perfectly for your website visitors and IP telemetry.',
  });

  if (!result.success) {
    return NextResponse.json(
      {
        success: false,
        error: result.error || 'Failed to dispatch email via Resend.',
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: `Resend test alert dispatched successfully to notification email (ID: ${result.id})`,
    id: result.id,
  });
}
