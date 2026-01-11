import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const ENCODING = 'hex';
const IV_LENGTH = 16; // For AES, this is always 16

// Ensure we have a secret key. In production, this MUST be a strong, persistent env var.
// For dev, we fallback, but warn.
const getSecretKey = () => {
  const key = process.env.LICENSE_ENCRYPTION_KEY || 'default_insecure_secret_key_for_dev_only';
  if (!process.env.LICENSE_ENCRYPTION_KEY) {
    console.warn('WARNING: LICENSE_ENCRYPTION_KEY not set. Using insecure default for development.');
  }
  // Always derive a 32-byte key from the input string
  return crypto.scryptSync(key, 'salt', 32);
};

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, getSecretKey(), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString(ENCODING) + ':' + encrypted.toString(ENCODING);
}

export function decrypt(text: string): string {
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift()!, ENCODING);
  const encryptedText = Buffer.from(textParts.join(':'), ENCODING);
  const decipher = crypto.createDecipheriv(ALGORITHM, getSecretKey(), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}
