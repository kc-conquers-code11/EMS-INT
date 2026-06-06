const fs = require('fs');
const path = require('path');
const db = require('../../models');
const { launchBrowser } = require('../helpers/hallTicket.helper');

const uploadsRoot = path.join(__dirname, '../../uploads');
const PRINCIPAL_SIGN_PNG_REL = '/uploads/faculty/principal/sign.png';
const PRINCIPAL_SIGN_PNG_PATH = path.join(uploadsRoot, 'faculty', 'principal', 'sign.png');
const DEFAULT_SIGNATURE_REL = PRINCIPAL_SIGN_PNG_REL;

const resolveSignatureFilePath = (signatureValue) => {
  if (!signatureValue || typeof signatureValue !== 'string') return null;

  const trimmed = signatureValue.trim();
  if (!trimmed) return null;

  if (path.isAbsolute(trimmed) && fs.existsSync(trimmed)) {
    return trimmed;
  }

  const withoutUploadsPrefix = trimmed.replace(/^\/uploads\/?/, '');
  const candidates = [
    path.join(uploadsRoot, withoutUploadsPrefix),
    path.join(process.cwd(), 'uploads', withoutUploadsPrefix),
    path.join(process.cwd(), trimmed.replace(/^\//, '')),
  ];

  return candidates.find((p) => fs.existsSync(p)) || null;
};

const toFileUri = (absolutePath) => {
  const normalized = path.resolve(absolutePath).replace(/\\/g, '/');
  return `file://${encodeURI(normalized)}`;
};

const isImageExt = (ext) => ['.png', '.jpg', '.jpeg', '.webp', '.gif'].includes(ext);

/**
 * Render PDF signature to PNG with white background (avoids black box in hall ticket PDF).
 */
const pdfSignatureToPngDataUri = async (filePath) => {
  const browser = await launchBrowser();
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 360, height: 100, deviceScaleFactor: 2 });
    const fileUri = toFileUri(filePath);
    await page.setContent(
      `<!DOCTYPE html>
      <html><head><style>
        html, body { margin: 0; padding: 0; background: #ffffff; width: 360px; height: 100px; overflow: hidden; }
        .wrap { width: 360px; height: 100px; display: flex; align-items: center; justify-content: flex-end; background: #fff; }
        embed { width: 300px; height: 90px; }
      </style></head>
      <body><div class="wrap"><embed src="${fileUri}" type="application/pdf" /></div></body></html>`,
      { waitUntil: 'networkidle2', timeout: 45000 }
    );
    await new Promise((r) => setTimeout(r, 600));
    const pngBuffer = await page.screenshot({
      type: 'png',
      omitBackground: false,
      clip: { x: 0, y: 0, width: 360, height: 100 },
    });
    if (!pngBuffer || pngBuffer.length < 200) {
      throw new Error('Signature render produced empty image');
    }
    return `data:image/png;base64,${pngBuffer.toString('base64')}`;
  } finally {
    await browser.close();
  }
};

/**
 * Canonical principal signature: uploads/faculty/principal/sign.png
 */
const resolvePrincipalSignaturePath = async () => {
  if (fs.existsSync(PRINCIPAL_SIGN_PNG_PATH)) {
    return PRINCIPAL_SIGN_PNG_PATH;
  }

  let signatureValue = DEFAULT_SIGNATURE_REL;
  try {
    const rows = await db.sequelize.query(
      `SELECT signature FROM faculty
       WHERE deletedAt IS NULL AND status = 1 AND LOWER(TRIM(role)) = 'principal'
       ORDER BY updatedAt DESC LIMIT 1`,
      { type: db.Sequelize.QueryTypes.SELECT }
    );
    if (rows[0]?.signature) {
      const dbPath = resolveSignatureFilePath(rows[0].signature);
      if (dbPath) signatureValue = rows[0].signature;
    }
  } catch (err) {
    console.error('[principalSignature] faculty lookup failed:', err.message);
  }

  return resolveSignatureFilePath(signatureValue);
};

const getPrincipalSignatureForHallTicket = async (includePrincipalSignature) => {
  if (!includePrincipalSignature) {
    return { requested: false, found: false, fileUri: null, embedSrc: null, mimeType: null, message: null };
  }

  const filePath = await resolvePrincipalSignaturePath();
  if (!filePath) {
    return {
      requested: true,
      found: false,
      fileUri: null,
      embedSrc: null,
      mimeType: null,
      message: 'No signature was found',
    };
  }

  const ext = path.extname(filePath).toLowerCase();

  try {
    if (isImageExt(ext)) {
      const buffer = fs.readFileSync(filePath);
      const mime =
        ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';
      return {
        requested: true,
        found: true,
        fileUri: toFileUri(filePath),
        embedSrc: `data:${mime};base64,${buffer.toString('base64')}`,
        mimeType: mime,
        message: null,
      };
    }

    if (ext === '.pdf') {
      const embedSrc = await pdfSignatureToPngDataUri(filePath);
      return {
        requested: true,
        found: true,
        fileUri: toFileUri(filePath),
        embedSrc,
        mimeType: 'image/png',
        message: null,
      };
    }

    return {
      requested: true,
      found: false,
      fileUri: null,
      embedSrc: null,
      mimeType: null,
      message: 'No signature was found',
    };
  } catch (err) {
    console.error('[principalSignature] render failed:', err.message);
    return {
      requested: true,
      found: false,
      fileUri: null,
      embedSrc: null,
      mimeType: null,
      message: 'No signature was found',
    };
  }
};

module.exports = {
  DEFAULT_SIGNATURE_REL,
  PRINCIPAL_SIGN_PNG_REL,
  PRINCIPAL_SIGN_PNG_PATH,
  resolveSignatureFilePath,
  resolvePrincipalSignaturePath,
  getPrincipalSignatureForHallTicket,
};
