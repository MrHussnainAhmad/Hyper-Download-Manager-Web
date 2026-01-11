import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const ads = await prisma.ad.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(ads);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch ads' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, type, targetTier, contentUrl, linkUrl } = body;

    // Validation
    if (!title || !type || !targetTier || !linkUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!['IMAGE', 'VIDEO', 'LINK'].includes(type)) {
      return NextResponse.json({ error: 'Invalid ad type' }, { status: 400 });
    }

    if (!['FREEMIUM', 'PLUS'].includes(targetTier)) {
      return NextResponse.json({ error: 'Invalid target tier' }, { status: 400 });
    }

    // Business Logic: PLUS tier cannot have VIDEO ads
    if (targetTier === 'PLUS' && type === 'VIDEO') {
      return NextResponse.json(
        { error: 'Plus tier cannot have Video ads. Only Image or Link allowed.' },
        { status: 400 }
      );
    }

    // Content URL required for Image/Video
    if ((type === 'IMAGE' || type === 'VIDEO') && !contentUrl) {
      return NextResponse.json({ error: 'Content URL is required for Image/Video ads' }, { status: 400 });
    }

    const ad = await prisma.ad.create({
      data: {
        title,
        type,
        targetTier,
        contentUrl,
        linkUrl,
      },
    });

    return NextResponse.json(ad);
  } catch (error) {
    console.error('Create ad error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
