-- Recoverable credential storage (AES-GCM encrypted with server JWT_SECRET).
ALTER TABLE users
  ADD COLUMN password_encrypted VARCHAR(512) NULL
  COMMENT 'AES-GCM encrypted recoverable password (server-side only)';
