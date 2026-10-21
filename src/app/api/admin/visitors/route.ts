import { NextRequest, NextResponse } from 'next/server';
import { isUserAdmin } from '@/lib/auth';
import { getAllVisitors, saveAllVisitors } from '@/lib/tracker';

export async function GET() {
  const isAdmin = await isUserAdmin();
  if (!isAdmin) {
    return NextResponse.json({ success: false, error: 'Unauthorized: Admin access only' }, { status: 401 });
  }

  const visitors = getAllVisitors();

  // Calculate metrics
  const totalVisits = visitors.reduce((acc, curr) => acc + (curr.visitCount || 1), 0);
  const uniqueVisitors = visitors.length;
  const namedVisitors = visitors.filter((v) => v.isNamed).length;

  const countryCounts: Record<string, number> = {};
  visitors.forEach((v) => {
    const c = v.country || 'Unknown';
    countryCounts[c] = (countryCounts[c] || 0) + 1;
  });

  const deviceCounts: Record<string, number> = { desktop: 0, mobile: 0, tablet: 0 };
  visitors.forEach((v) => {
    if (v.deviceType in deviceCounts) {
      deviceCounts[v.deviceType]++;
    }
  });

  const now = Date.now();
  const last24hCount = visitors.filter(
    (v) => now - new Date(v.lastActiveAt).getTime() < 24 * 60 * 60 * 1000
  ).length;

  return NextResponse.json({
    success: true,
    data: {
      visitors,
      stats: {
        totalVisits,
        uniqueVisitors,
        namedVisitors,
        last24hCount,
        countryCounts,
        deviceCounts,
      },
    },
  });
}

export async function DELETE(req: NextRequest) {
  const isAdmin = await isUserAdmin();
  if (!isAdmin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const visitorId = searchParams.get('id');

    if (visitorId) {
      // Delete single visitor
      let visitors = getAllVisitors();
      visitors = visitors.filter((v) => v.id !== visitorId);
      saveAllVisitors(visitors);
      return NextResponse.json({ success: true, message: `Visitor ${visitorId} deleted` });
    } else {
      // Clear all
      saveAllVisitors([]);
      return NextResponse.json({ success: true, message: 'All visitor logs cleared' });
    }
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to delete' }, { status: 500 });
  }
}

// Allow admin to add simulated test visitor for demonstration
export async function POST(req: NextRequest) {
  const isAdmin = await isUserAdmin();
  if (!isAdmin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name, ip, country, city, browser, os, deviceType, notes } = await req.json();
    const visitors = getAllVisitors();
    const newVisitor = {
      id: `vis_sim_${Date.now()}`,
      ip: ip || '198.51.100.' + Math.floor(Math.random() * 200 + 1),
      name: name || 'Mock Recruiter',
      isNamed: true,
      userAgent: `${browser || 'Chrome'} on ${os || 'macOS'}`,
      browser: browser || 'Chrome',
      os: os || 'macOS',
      deviceType: (deviceType as 'desktop' | 'mobile' | 'tablet') || 'desktop',
      country: country || 'United Kingdom',
      countryCode: 'GB',
      city: city || 'London',
      region: 'England',
      firstVisitedAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
      visitCount: 1,
      visitedPages: ['/', '#projects'],
      notes: notes || 'Simulated visitor for admin dashboard preview',
    };

    visitors.unshift(newVisitor);
    saveAllVisitors(visitors);
    return NextResponse.json({ success: true, visitor: newVisitor });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to create test visitor' }, { status: 500 });
  }
}
