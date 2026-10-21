import { NextRequest, NextResponse } from 'next/server';
import { isUserAdmin } from '@/lib/auth';
import { getAllVisitors, exportVisitorsToCsv } from '@/lib/tracker';

export async function GET(req: NextRequest) {
  const isAdmin = await isUserAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const format = searchParams.get('format') || 'csv';
  const visitors = getAllVisitors();

  if (format === 'json') {
    return new NextResponse(JSON.stringify(visitors, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="visitors_log_${new Date().toISOString().slice(0, 10)}.json"`,
      },
    });
  }

  const csvContent = exportVisitorsToCsv(visitors);
  return new NextResponse(csvContent, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="visitors_log_${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
