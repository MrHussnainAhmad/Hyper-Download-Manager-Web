import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { reviewSchema } from '@/lib/validations';
import { ZodError } from 'zod';
import { revalidatePath } from 'next/cache';

export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      where: { approved: true },
      orderBy: { createdAt: 'desc' },
    });

    const stats = await prisma.review.aggregate({
      where: { approved: true },
      _avg: { rating: true },
      _count: { id: true },
    });

    return NextResponse.json({
      reviews,
      averageRating: stats._avg.rating || 0,
      totalReviews: stats._count.id,
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = reviewSchema.parse(body);

    const review = await prisma.review.create({
      data: {
        ...validatedData,
        approved: true, // Auto-approve reviews so they appear immediately
      },
    });

    revalidatePath('/'); // Invalidate the home page cache

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      console.error('Validation error:', error.flatten());
      return NextResponse.json(
        { error: 'Invalid data provided', details: error.flatten() },
        { status: 400 }
      );
    }

    console.error('Error creating review:', error);

    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}