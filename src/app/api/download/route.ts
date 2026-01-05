import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { platform, version } = await request.json();

    await prisma.download.create({
      data: { platform, version },
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