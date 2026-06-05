const crypto = require('crypto');

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;
const KEY_SALT = 'ems-credential-v1';

function getEncryptionKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not configured');
  }
  return crypto.scryptSync(secret, KEY_SALT, 32);
}

/** Encrypt a plain credential for server-side recovery (never expose JWT_SECRET client-side). */
function encryptCredential(plainText) {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(String(plainText), 'utf8'),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString('base64');
}

/** Decrypt a credential stored with encryptCredential. */
function decryptCredential(ciphertext) {
  if (!ciphertext) return null;
  const key = getEncryptionKey();
  const buf = Buffer.from(ciphertext, 'base64');
  if (buf.length < IV_LENGTH + AUTH_TAG_LENGTH + 1) return null;

  const iv = buf.subarray(0, IV_LENGTH);
  const tag = buf.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
  const encrypted = buf.subarray(IV_LENGTH + AUTH_TAG_LENGTH);
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString(
    'utf8'
  );
}

module.exports = { encryptCredential, decryptCredential };
