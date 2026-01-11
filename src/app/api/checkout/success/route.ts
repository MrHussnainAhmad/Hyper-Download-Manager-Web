import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { decrypt } from '@/lib/crypto';

// Helper to delay execution
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });
  }

  // Poll for the license (up to 10 seconds) because Webhook might be slightly slower than Redirect
  let license = null;
  const maxRetries = 10;
  
  for (let i = 0; i < maxRetries; i++) {
    license = await prisma.license.findUnique({
      where: { stripeSessionId: sessionId },
    });

    if (license) break;
    
    // Wait 1 second before retrying
    await wait(1000);
  }

  if (!license) {
    return NextResponse.json(
      { error: 'License generation pending or failed. Please check your email.' }, 
      { status: 404 }
    );
  }

  // Security: If already viewed, do not show again.
  if (license.keyViewed) {
    return NextResponse.json(
      { error: 'License key already viewed. Please check your email.' }, 
      { status: 404 } // Using 404 to mimic "not found" behavior as requested
    );
  }

  // Mark as viewed immediately
  await prisma.license.update({
    where: { id: license.id },
    data: { keyViewed: true },
  });

  // Return the decrypted key
  return NextResponse.json({
    key: decrypt(license.encryptedKey),
    plan: license.plan,
    email: license.email
  });
}
