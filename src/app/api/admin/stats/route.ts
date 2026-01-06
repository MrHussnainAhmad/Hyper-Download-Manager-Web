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

    const downloadsByCountryRaw = await prisma.download.groupBy({
      by: ['country'],
      _count: {
        id: true,
      },
    });

    const downloadsByCountry = downloadsByCountryRaw
      .sort((a, b) => b._count.id - a._count.id)
      .slice(0, 10);

    return NextResponse.json({
      totalDownloads,
      totalBugs,
      totalReviews,
      pendingReviews,
      downloadsByPlatform,
      downloadsByCountry,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
