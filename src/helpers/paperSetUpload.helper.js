const fs = require('fs');
const path = require('path');
const multer = require('multer');
const crypto = require('crypto');
const {
  ALLOWED_UPLOAD_EXT,
  ALLOWED_UPLOAD_MIME,
  MAX_UPLOAD_BYTES,
} = require('../constants/paperSet.constants.js');

const uploadsRoot = path.join(__dirname, '../../uploads');
const paperUploadRoot = path.join(uploadsRoot, 'question-papers');

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

ensureDir(paperUploadRoot);

const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    const setId = req.params.set_id || 'pending';
    const dir = path.join(paperUploadRoot, setId);
    ensureDir(dir);
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeBase = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 80);
    cb(null, `${safeBase}_${Date.now()}${ext}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (
    ALLOWED_UPLOAD_EXT.has(ext) &&
    (ALLOWED_UPLOAD_MIME.has(file.mimetype) || file.mimetype === 'application/octet-stream')
  ) {
    cb(null, true);
    return;
  }
  cb(new Error('Only Word documents (.doc, .docx) are allowed'));
};

const uploadQuestionPaper = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_UPLOAD_BYTES },
});

const buildPublicFileUrl = (filePath) => {
  if (!filePath) return null;
  const normalized = filePath.replace(/\\/g, '/');
  const idx = normalized.indexOf('/uploads/');
  if (idx >= 0) return normalized.slice(idx);
  const rel = path.relative(uploadsRoot, filePath).replace(/\\/g, '/');
  return `/uploads/${rel}`;
};

const deleteFileIfExists = (filePath) => {
  if (!filePath) return;
  try {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  } catch (err) {
    console.warn('Could not delete old question paper file:', err.message);
  }
};

const resolveDownloadPath = (storedPath) => {
  if (!storedPath) return null;
  if (fs.existsSync(storedPath)) return storedPath;
  const rel = storedPath.replace(/^\/uploads\/?/, '');
  const candidate = path.join(uploadsRoot, rel);
  return fs.existsSync(candidate) ? candidate : null;
};

module.exports = {
  uploadQuestionPaper,
  buildPublicFileUrl,
  deleteFileIfExists,
  resolveDownloadPath,
  paperUploadRoot,
  uploadsRoot,
};
