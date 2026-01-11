import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';
import { encrypt, decrypt } from '@/lib/crypto';
import { generateLicenseKey } from '@/lib/keygen';
import { sendLicenseEmail } from '@/lib/email';

// Load .env manually since we are running a standalone script
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf-8');
  envConfig.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value && !process.env[key]) {
      process.env[key.trim()] = value.trim();
    }
  });
}

const prisma = new PrismaClient();

async function testFlow() {
  console.log('🚀 Starting Purchase Flow Test...');

  const testEmail = "testaccformidas02@gmail.com";
  const plan = 'PLUS';
  const sessionId = `sess_plus_${Date.now()}`;

  console.log(`\n1. Simulating Checkout Success for ${testEmail}`);

  // 2. Generate Key
  const key = generateLicenseKey();
  console.log(`   Generated Raw Key: ${key}`);

  // 3. Encrypt & Hash
  const keyHash = crypto.createHash('sha256').update(key).digest('hex');
  const encryptedKey = encrypt(key);
  console.log(`   Encrypted Key: ${encryptedKey}`);
  console.log(`   Key Hash: ${keyHash}`);

  try {
    // 4. Save to DB
    console.log('\n2. Saving to Database...');
    const license = await prisma.license.create({
      data: {
        email: testEmail,
        plan,
        keyHash,
        encryptedKey,
        stripeSessionId: sessionId,
        status: 'active',
      },
    });
    console.log('   ✅ License saved to DB with ID:', license.id);

    // 5. Verify Decryption
    console.log('\n3. Verifying Decryption...');
    const decrypted = decrypt(license.encryptedKey);
    if (decrypted === key) {
      console.log('   ✅ Decryption successful! Key matches.');
    } else {
      console.error('   ❌ Decryption FAILED! Expected:', key, 'Got:', decrypted);
    }

    // 6. Test Email (Mock)
    console.log('\n4. Testing Email Sending...');
    await sendLicenseEmail(testEmail, key, plan);
    console.log('   (Check console logs above for Mock Email or check your inbox if configured)');

  } catch (error) {
    console.error('\n❌ Test Failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testFlow();
