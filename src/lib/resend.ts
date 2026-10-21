import { Resend } from 'resend';
import { VisitorLog } from '@/types';

const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || 'raghavmetange14@gmail.com';
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Portfolio Telemetry <onboarding@resend.dev>';

// Lazy initialization of Resend client
function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    return null;
  }
  return new Resend(apiKey);
}

export interface SendAlertParams {
  visitor: VisitorLog;
  trigger?: 'visit' | 'guest_pass' | 'contact_message' | 'admin_test';
  customSubject?: string;
  notes?: string;
}

export async function sendVisitorAlertEmail({
  visitor,
  trigger = 'visit',
  customSubject,
  notes,
}: SendAlertParams): Promise<{ success: boolean; id?: string; error?: string }> {
  const resend = getResendClient();

  if (!resend) {
    const errorMsg = 'RESEND_API_KEY not configured. Set RESEND_API_KEY in environment variables.';
    console.warn(`[Resend Service] ${errorMsg}`);
    return { success: false, error: errorMsg };
  }

  const visitorEmail = visitor.email || 'None provided (Anonymous)';
  const visitorIp = visitor.ip || 'Unknown IP';
  const visitorName = visitor.name || 'Anonymous Visitor';
  const location = [visitor.city, visitor.region, visitor.country]
    .filter(Boolean)
    .join(', ') || 'Unknown Location';
  const noteContent = notes || visitor.notes || 'None';

  let subject = customSubject;
  if (!subject) {
    if (trigger === 'contact_message') {
      subject = `💬 New Message from ${visitorName} [${visitorEmail}] (IP: ${visitorIp})`;
    } else if (trigger === 'guest_pass' || visitor.isNamed) {
      subject = `👤 Guest Pass Minted: ${visitorName} [${visitorEmail}] (IP: ${visitorIp})`;
    } else {
      subject = `🌐 Portfolio Visitor Alert: IP ${visitorIp} from ${location}`;
    }
  }

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Visitor Alert</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #05060b; color: #f3f4f6; margin: 0; padding: 24px; }
    .container { max-width: 600px; margin: 0 auto; background: #0c0f1d; border: 1px solid #1f2744; border-radius: 16px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #0e1630 0%, #171b38 100%); padding: 24px; border-bottom: 1px solid #252e50; }
    .header h1 { margin: 0; font-size: 20px; color: #ffffff; }
    .header p { margin: 6px 0 0; font-size: 13px; color: #06b6d4; font-family: monospace; }
    .content { padding: 24px; }
    .highlight-card { background: rgba(6, 182, 212, 0.08); border: 1px solid rgba(6, 182, 212, 0.25); border-radius: 12px; padding: 16px; margin-bottom: 20px; }
    .highlight-card .item { margin-bottom: 10px; }
    .highlight-card .item:last-child { margin-bottom: 0; }
    .label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #94a3b8; font-weight: 600; }
    .value-primary { font-size: 16px; font-weight: 700; color: #38bdf8; word-break: break-all; font-family: monospace; }
    .value-ip { font-size: 15px; font-weight: 700; color: #34d399; font-family: monospace; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; }
    .grid-cell { background: #12162b; border: 1px solid #1e2440; border-radius: 10px; padding: 12px; }
    .grid-cell .val { font-size: 13px; color: #e2e8f0; font-weight: 500; margin-top: 4px; }
    .notes-box { background: #12162b; border-left: 3px solid #818cf8; border-radius: 0 10px 10px 0; padding: 14px; margin-bottom: 20px; }
    .footer { padding: 16px 24px; background: #080a14; border-top: 1px solid #1a2035; text-align: center; font-size: 12px; color: #64748b; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚀 Raghav Metange Portfolio Alert</h1>
      <p>TRIGGER: ${trigger.toUpperCase()} • ${new Date().toUTCString()}</p>
    </div>
    <div class="content">
      <div class="highlight-card">
        <div class="item">
          <div class="label">Visitor Email Address</div>
          <div class="value-primary">${visitorEmail}</div>
        </div>
        <div class="item" style="margin-top: 12px;">
          <div class="label">Client IP Address</div>
          <div class="value-ip">${visitorIp}</div>
        </div>
      </div>

      <div class="grid">
        <div class="grid-cell">
          <div class="label">Visitor Name / Role</div>
          <div class="val">${visitorName}</div>
        </div>
        <div class="grid-cell">
          <div class="label">Location</div>
          <div class="val">${location}</div>
        </div>
        <div class="grid-cell">
          <div class="label">Device & OS</div>
          <div class="val">${visitor.deviceType} • ${visitor.os}</div>
        </div>
        <div class="grid-cell">
          <div class="label">Browser</div>
          <div class="val">${visitor.browser}</div>
        </div>
        <div class="grid-cell">
          <div class="label">Page Visited</div>
          <div class="val">${visitor.visitedPages?.slice(-1)[0] || '/'}</div>
        </div>
        <div class="grid-cell">
          <div class="label">Total Visits</div>
          <div class="val">${visitor.visitCount || 1} time(s)</div>
        </div>
      </div>

      ${
        noteContent !== 'None'
          ? `
      <div class="label" style="margin-bottom: 6px;">Message / Note:</div>
      <div class="notes-box">
        <div style="font-size: 14px; color: #f1f5f9; line-height: 1.5;">${escapeHtml(noteContent)}</div>
      </div>
      `
          : ''
      }
    </div>
    <div class="footer">
      Automated visitor telemetry dispatch powered by Resend • Host: raghavmetange14@gmail.com
    </div>
  </div>
</body>
</html>
  `.trim();

  const text = `
🚀 Raghav Metange Portfolio Visitor Alert
Trigger: ${trigger.toUpperCase()}
Timestamp: ${new Date().toISOString()}

=====================================
VISITOR EMAIL: ${visitorEmail}
VISITOR IP:    ${visitorIp}
=====================================

Name:       ${visitorName}
Location:   ${location}
Device:     ${visitor.deviceType} (${visitor.os})
Browser:    ${visitor.browser}
Page:       ${visitor.visitedPages?.slice(-1)[0] || '/'}
Visit Count: ${visitor.visitCount || 1}
Notes/Msg:  ${noteContent}
`.trim();

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [NOTIFICATION_EMAIL],
      subject,
      html,
      text,
    });

    if (error) {
      console.error('[Resend Service] Error dispatching email:', error);
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown dispatch error';
    console.error('[Resend Service] Unexpected error:', errorMessage);
    return { success: false, error: errorMessage };
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
