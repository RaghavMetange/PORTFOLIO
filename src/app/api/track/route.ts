import { NextRequest, NextResponse } from 'next/server';
import { extractClientIp, recordVisit } from '@/lib/tracker';
import { sendVisitorAlertEmail } from '@/lib/resend';
import { TrackRequest } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const ip = extractClientIp(req.headers);
    const userAgent = req.headers.get('user-agent') || 'Unknown';
    const body: TrackRequest = await req.json().catch(() => ({}));

    const visitor = await recordVisit(body, ip, userAgent);

    // Send Resend email notification
    // Case 1: Visitor provided an email address or message (Guest Pass / Contact Form)
    // Case 2: First-time visitor arrival (IP & telemetry)
    const isFirstVisit = visitor.visitCount === 1 && !visitor.emailNotified;
    const hasEmailOrMessage = Boolean(body.email?.trim() || body.notes?.trim() || (body.name && body.name !== 'Anonymous Visitor'));

    if (hasEmailOrMessage || isFirstVisit) {
      const trigger = body.page === '#contact' ? 'contact_message' : (body.name || body.email ? 'guest_pass' : 'visit');
      // Fire Resend alert asynchronously without blocking client response
      sendVisitorAlertEmail({
        visitor,
        trigger,
        notes: body.notes,
      }).then((result) => {
        if (result.success && isFirstVisit) {
          visitor.emailNotified = true;
        }
      }).catch((err) => {
        console.error('[Track Route] Resend email dispatch failed:', err);
      });
    }

    return NextResponse.json({
      success: true,
      visitor: {
        id: visitor.id,
        name: visitor.name,
        email: visitor.email,
        isNamed: visitor.isNamed,
        ip: visitor.ip,
        city: visitor.city,
        country: visitor.country,
        visitCount: visitor.visitCount,
      },
    });
  } catch (error) {
    console.error('Tracking error:', error);
    return NextResponse.json({ success: false, error: 'Tracking failed' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const ip = extractClientIp(req.headers);
  return NextResponse.json({ ip });
}
