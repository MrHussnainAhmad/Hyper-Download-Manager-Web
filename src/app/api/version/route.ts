import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const platform = searchParams.get('platform');

  try {
    if (platform) {
      const config = await prisma.platformConfig.findUnique({
        where: { platform: platform.toLowerCase() },
      });

      if (!config) {
        return NextResponse.json({ error: 'Platform not found' }, { status: 404 });
      }

      return NextResponse.json({
        platform: config.platform,
        version: config.version,
        downloadUrl: config.downloadUrl,
        updatedAt: config.updatedAt,
      });
    }

    // If no platform specified, return all configs
    const configs = await prisma.platformConfig.findMany();
    return NextResponse.json(configs);
  } catch (error) {
    console.error('Error fetching version config:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
