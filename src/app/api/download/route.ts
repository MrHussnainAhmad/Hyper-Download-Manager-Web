import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { geolocation } from '@vercel/functions';

export async function POST(request: NextRequest) {
  try {
    const { platform, version } = await request.json();

    let ip = request.headers.get('x-forwarded-for') || request.ip || '127.0.0.1';

    // Handle local loopback
    if (ip === '::1') ip = '127.0.0.1';

    if (ip.includes(',')) {
      ip = ip.split(',')[0].trim();
    }

    console.log(`[Tracking] Download from IP: ${ip}`);

    const geo = geolocation(request);
    const country = geo.country || (ip === '127.0.0.1' ? 'Localhost' : 'Unknown');
    
    console.log(`[Tracking] Detected Country: ${country}, Geo Object: ${JSON.stringify(geo)}`);

    await prisma.download.create({
      data: {
        platform,
        version,
        country
      },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Error tracking download:', error);
    return NextResponse.json(
      { error: 'Failed to track download' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const count = await prisma.download.count();
    return NextResponse.json({ totalDownloads: count });
  } catch (error) {
    console.error('Error fetching downloads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch download count' },
      { status: 500 }
    );
  }
}