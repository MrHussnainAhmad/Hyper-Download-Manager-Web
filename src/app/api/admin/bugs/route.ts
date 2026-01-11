import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const bugs = await prisma.bug.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(bugs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch bugs' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    const updatedBug = await prisma.bug.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(updatedBug);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update bug' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await prisma.bug.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Bug deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete bug' }, { status: 500 });
  }
}
