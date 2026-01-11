import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { licenseKey } = body;

    if (!licenseKey) {
      return NextResponse.json(
        { valid: false, message: 'License key is required' },
        { status: 400 }
      );
    }

    // Hash the provided key to match against the database
    const keyHash = crypto.createHash('sha256').update(licenseKey).digest('hex');

    const license = await prisma.license.findUnique({
      where: { keyHash },
    });

    if (!license) {
      return NextResponse.json({
        valid: false,
        status: 'not_found',
        message: 'Invalid license key',
      });
    }

    // Check if revoked or inactive
    if (license.status !== 'active') {
      return NextResponse.json({
        valid: false,
        status: license.status,
        message: `License is ${license.status}`,
      });
    }

    // Check expiration
    if (license.expiresAt && new Date() > license.expiresAt) {
      return NextResponse.json({
        valid: false,
        status: 'expired',
        expiresAt: license.expiresAt,
        message: 'License has expired',
      });
    }

    // If we get here, it's valid
    return NextResponse.json({
      valid: true,
      status: 'active',
      plan: license.plan,
      expiresAt: license.expiresAt,
      message: 'License is valid',
    });

  } catch (error) {
    console.error('License verification error:', error);
    return NextResponse.json(
      { valid: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
