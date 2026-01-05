import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [totalDownloads, totalBugs, totalReviews, pendingReviews] = await Promise.all([
      prisma.download.count(),
      prisma.bug.count(),
      prisma.review.count(),
      prisma.review.count({ where: { approved: false } }),
    ]);

    const downloadsByPlatform = await prisma.download.groupBy({
      by: ['platform'],
      _count: {
        id: true,
      },
    });

    return NextResponse.json({
      totalDownloads,
      totalBugs,
      totalReviews,
      pendingReviews,
      downloadsByPlatform,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
