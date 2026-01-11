import crypto from 'crypto';

export function generateLicenseKey(): string {
  // Define allowed characters (uppercase alphanumeric to avoid ambiguity if printed)
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const length = 12;
  
  // Generate random bytes
  const bytes = crypto.randomBytes(length);
  let result = '';

  // Map each byte to a character in our set
  for (let i = 0; i < length; i++) {
    // bytes[i] is 0-255. Modulo gives us a valid index.
    result += chars[bytes[i] % chars.length];
  }

  return result;
}
