import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendExpirationWarning } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const now = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(now.getDate() + 7);

    // 1. Send Reminders (Expires in the next 7 days and not warned yet)
    // We look for licenses that expire AFTER now but BEFORE 7 days from now.
    const expiringLicenses = await prisma.license.findMany({
      where: {
        expiresAt: {
          gt: now,
          lte: sevenDaysFromNow,
        },
        reminderSent: false,
      },
    });

    let emailsSent = 0;
    for (const license of expiringLicenses) {
      await sendExpirationWarning(license.email);
      // Mark as sent immediately to avoid duplicates if job fails halfway
      await prisma.license.update({
        where: { id: license.id },
        data: { reminderSent: true },
      });
      emailsSent++;
    }

    // 2. Cleanup (Expired licenses)
    // Delete licenses where expiresAt is in the past
    const deleted = await prisma.license.deleteMany({
      where: {
        expiresAt: {
          lt: now,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Maintenance completed',
      stats: {
        remindersSent: emailsSent,
        licensesDeleted: deleted.count,
      },
    });
  } catch (error: any) {
    console.error('Maintenance error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
