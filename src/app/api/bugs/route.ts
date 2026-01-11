import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { bugSchema } from '@/lib/validations';
import { ZodError } from 'zod';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = bugSchema.parse(body);

    const bug = await prisma.bug.create({
      data: validatedData,
    });

    return NextResponse.json(bug, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      console.error('Validation error:', error.flatten());
      return NextResponse.json(
        { error: 'Invalid data provided', details: error.flatten() },
        { status: 400 }
      );
    }

    console.error('Error creating bug report:', error);

    return NextResponse.json(
      { error: 'Failed to submit bug report' },
      { status: 500 }
    );
  }
}