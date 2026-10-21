import fs from 'fs';
import path from 'path';
import { VisitorLog, TrackRequest } from '@/types';

const DATA_FILE = path.join(process.cwd(), 'src', 'data', 'visitors.json');

// Ensure data directory and file exist
function ensureDataFile(): void {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

export function getAllVisitors(): VisitorLog[] {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw) as VisitorLog[];
  } catch (err) {
    console.error('Error reading visitors log:', err);
    return [];
  }
}

export function saveAllVisitors(visitors: VisitorLog[]): void {
  ensureDataFile();
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(visitors, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing visitors log:', err);
  }
}

// Extract IP cleanly
export function extractClientIp(headers: Headers): string {
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    const parts = forwardedFor.split(',').map((p) => p.trim());
    if (parts[0]) return parts[0];
  }
  const realIp = headers.get('x-real-ip');
  if (realIp) return realIp;

  const cfIp = headers.get('cf-connecting-ip');
  if (cfIp) return cfIp;

  return '127.0.0.1';
}

// User-Agent parser
export function parseUserAgent(ua: string): { browser: string; os: string; deviceType: 'mobile' | 'tablet' | 'desktop' } {
  let browser = 'Unknown Browser';
  let os = 'Unknown OS';
  let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop';

  const lower = ua.toLowerCase();

  // Device type
  if (/ipad|tablet|playbook|silk/i.test(lower)) {
    deviceType = 'tablet';
  } else if (/mobile|iphone|ipod|android|blackberry|iemobile/i.test(lower)) {
    deviceType = 'mobile';
  }

  // OS
  if (lower.includes('windows nt 10.0')) os = 'Windows 10/11';
  else if (lower.includes('windows')) os = 'Windows';
  else if (lower.includes('macintosh') || lower.includes('mac os x')) os = 'macOS';
  else if (lower.includes('android')) os = 'Android';
  else if (lower.includes('iphone') || lower.includes('ipad')) os = 'iOS';
  else if (lower.includes('linux')) os = 'Linux';

  // Browser
  if (lower.includes('edg/')) browser = 'Edge';
  else if (lower.includes('chrome/') && !lower.includes('edg/')) browser = 'Chrome';
  else if (lower.includes('firefox/')) browser = 'Firefox';
  else if (lower.includes('safari/') && !lower.includes('chrome/')) browser = 'Safari';
  else if (lower.includes('opera/') || lower.includes('opr/')) browser = 'Opera';

  return { browser, os, deviceType };
}

// Geolocation lookup
export async function lookupGeo(ip: string): Promise<{ country?: string; countryCode?: string; city?: string; region?: string }> {
  // Check if private / local IP
  if (
    ip === '127.0.0.1' ||
    ip === '::1' ||
    ip.startsWith('192.168.') ||
    ip.startsWith('10.') ||
    ip.startsWith('172.16.')
  ) {
    return {
      country: 'Local Network',
      countryCode: 'DEV',
      city: 'Developer Workstation',
      region: 'Localhost',
    };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000); // 2 second timeout
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,countryCode,regionName,city`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) return {};
    const data = await res.json();
    if (data.status === 'success') {
      return {
        country: data.country,
        countryCode: data.countryCode,
        city: data.city,
        region: data.regionName,
      };
    }
  } catch {
    // Graceful fallback if offline or request blocked
  }

  return {};
}

// Record or update visit
export async function recordVisit(
  reqData: TrackRequest,
  ip: string,
  userAgent: string
): Promise<VisitorLog> {
  const visitors = getAllVisitors();
  const now = new Date().toISOString();
  const { browser, os, deviceType } = parseUserAgent(userAgent);

  // Check if visitor already exists by visitorId or by IP
  let existingIndex = -1;

  if (reqData.visitorId) {
    existingIndex = visitors.findIndex((v) => v.id === reqData.visitorId);
  }

  // If not found by ID, fallback to matching IP within the last 24h
  if (existingIndex === -1 && ip !== '127.0.0.1' && ip !== '::1') {
    existingIndex = visitors.findIndex((v) => v.ip === ip);
  }

  if (existingIndex >= 0) {
    const existing = visitors[existingIndex];
    // Update existing
    const updatedName = reqData.name && reqData.name.trim().length > 0 ? reqData.name.trim() : existing.name;
    const isNamed = updatedName !== 'Anonymous Visitor' && updatedName.trim().length > 0;

    const visitedPages = existing.visitedPages || [];
    if (reqData.page && !visitedPages.includes(reqData.page)) {
      visitedPages.push(reqData.page);
    }

    const updated: VisitorLog = {
      ...existing,
      name: updatedName,
      email: reqData.email ? reqData.email.trim() : existing.email,
      isNamed,
      lastActiveAt: now,
      visitCount: existing.visitCount + 1,
      visitedPages,
      notes: reqData.notes || existing.notes,
      userAgent: userAgent || existing.userAgent,
      browser,
      os,
      deviceType,
    };

    visitors[existingIndex] = updated;
    saveAllVisitors(visitors);
    return updated;
  }

  // Create new visitor
  const geo = await lookupGeo(ip);
  const visitorId = reqData.visitorId || `vis_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const rawName = reqData.name?.trim();
  const name = rawName && rawName.length > 0 ? rawName : 'Anonymous Visitor';

  const newVisitor: VisitorLog = {
    id: visitorId,
    ip,
    name,
    email: reqData.email?.trim() || undefined,
    isNamed: !!(rawName && rawName.length > 0),
    userAgent,
    browser,
    os,
    deviceType,
    country: geo.country || 'Unknown',
    countryCode: geo.countryCode || 'UN',
    city: geo.city || 'Unknown City',
    region: geo.region || 'Unknown Region',
    firstVisitedAt: now,
    lastActiveAt: now,
    visitCount: 1,
    visitedPages: reqData.page ? [reqData.page] : ['/'],
    notes: reqData.notes,
  };

  visitors.unshift(newVisitor); // Most recent first
  saveAllVisitors(visitors);
  return newVisitor;
}

// Generate CSV string
export function exportVisitorsToCsv(visitors: VisitorLog[]): string {
  const headers = [
    'ID',
    'Name',
    'Email',
    'IP Address',
    'Country',
    'City',
    'Browser',
    'OS',
    'Device',
    'Visit Count',
    'First Visited',
    'Last Active',
    'Notes',
  ];

  const escapeCsv = (str: string | undefined | number) => {
    if (str === undefined || str === null) return '""';
    const clean = String(str).replace(/"/g, '""');
    return `"${clean}"`;
  };

  const rows = visitors.map((v) => [
    escapeCsv(v.id),
    escapeCsv(v.name),
    escapeCsv(v.email || 'N/A'),
    escapeCsv(v.ip),
    escapeCsv(v.country),
    escapeCsv(v.city),
    escapeCsv(v.browser),
    escapeCsv(v.os),
    escapeCsv(v.deviceType),
    escapeCsv(v.visitCount),
    escapeCsv(v.firstVisitedAt),
    escapeCsv(v.lastActiveAt),
    escapeCsv(v.notes),
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}
