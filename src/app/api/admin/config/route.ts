import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const configs = await prisma.platformConfig.findMany();
    return NextResponse.json(configs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch configurations' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { platform, version, downloadUrl } = body;

    const config = await prisma.platformConfig.upsert({
      where: { platform },
      update: { version, downloadUrl },
      create: { platform, version, downloadUrl },
    });

    return NextResponse.json(config);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update configuration' }, { status: 500 });
  }
}
