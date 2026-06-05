const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { hallTicketDataSchema } = require('../validations/hall_ticket/hallTicket.validations');
const { generateHallTicketHtml } = require('../templates/hallTicketTemplate');

const uploadsRoot = path.join(__dirname, '../../uploads');

const resolveBranchFolder = (branchCode, branchName) => {
  const code = (branchCode || '').trim();
  if (code) {
    return code.replace(/[^A-Za-z0-9_-]/g, '') || 'Unknown';
  }
  const name = (branchName || 'Unknown').trim();
  return name.replace(/[^A-Za-z0-9_-]/g, '_').slice(0, 64) || 'Unknown';
};

/**
 * uploads/students/{branch}/{stud_clg_id}/hall_ticket.pdf
 */
const resolveHallTicketStorage = ({ branch_code, branch_name, stud_clg_id, sid }) => {
  const branchFolder = resolveBranchFolder(branch_code, branch_name);
  const studentFolder = (stud_clg_id || sid || 'unknown').toString().trim();
  const fileName = 'hall_ticket.pdf';
  const dir = path.join(uploadsRoot, 'students', branchFolder, studentFolder);
  const filePath = path.join(dir, fileName);
  const downloadUrl = `/uploads/students/${branchFolder}/${studentFolder}/${fileName}`;
  return { branchFolder, studentFolder, fileName, dir, filePath, downloadUrl };
};

/** Legacy path: uploads/students/{stud_clg_id}/hall_ticket/hall_ticket.pdf */
const resolveLegacyHallTicketStorage = (stud_clg_id, sid) => {
  const studentFolder = (stud_clg_id || sid || 'unknown').toString().trim();
  const fileName = 'hall_ticket.pdf';
  const dir = path.join(uploadsRoot, 'students', studentFolder, 'hall_ticket');
  const filePath = path.join(dir, fileName);
  const downloadUrl = `/uploads/students/${studentFolder}/hall_ticket/${fileName}`;
  return { dir, filePath, fileName, downloadUrl };
};

const resolvePuppeteerExecutable = async () => {
  if (process.env.PUPPETEER_EXECUTABLE_PATH && fs.existsSync(process.env.PUPPETEER_EXECUTABLE_PATH)) {
    return process.env.PUPPETEER_EXECUTABLE_PATH;
  }

  try {
    const bundled = puppeteer.executablePath?.();
    const resolved = bundled && typeof bundled.then === 'function' ? await bundled : bundled;
    if (resolved && fs.existsSync(resolved)) {
      return resolved;
    }
  } catch {
    /* fall through */
  }

  const systemCandidates = [
    '/usr/bin/google-chrome-stable',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
  ];
  return systemCandidates.find((p) => fs.existsSync(p)) || null;
};

const launchBrowser = async () => {
  const args = ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'];
  const executablePath = await resolvePuppeteerExecutable();

  const launchOpts = { headless: true, args };
  if (executablePath) {
    launchOpts.executablePath = executablePath;
  }

  try {
    return await puppeteer.launch(launchOpts);
  } catch (firstErr) {
    try {
      return await puppeteer.launch({ channel: 'chrome', headless: true, args });
    } catch {
      throw {
        status: 500,
        message:
          'PDF engine (Chrome) is not available. Run: npx puppeteer browsers install chrome',
        cause: firstErr,
      };
    }
  }
};

const assertPdfWritten = (filePath) => {
  if (!fs.existsSync(filePath)) {
    throw { status: 500, message: 'PDF file was not created on disk' };
  }
  const size = fs.statSync(filePath).size;
  if (size < 100) {
    throw { status: 500, message: 'PDF file is empty or corrupt' };
  }
};

const sanitizeHallTicketInput = (studentData) => ({
  ...studentData,
  branch_code: studentData.branch_code ?? undefined,
  branch_name: studentData.branch_name || 'Unknown',
  stud_clg_id: studentData.stud_clg_id || studentData.sid,
  photo_url: studentData.photo_url ?? undefined,
  programme_name: studentData.programme_name || '-',
  academic_year: studentData.academic_year || '-',
  seat_no: studentData.seat_no || 'TBD',
});

const generateHallTicketPdf = async (studentData) => {
  const validatedData = hallTicketDataSchema.parse(sanitizeHallTicketInput(studentData));

  const { dir, filePath, fileName, downloadUrl } = resolveHallTicketStorage({
    branch_code: validatedData.branch_code,
    branch_name: validatedData.branch_name,
    stud_clg_id: validatedData.stud_clg_id,
    sid: validatedData.sid,
  });

  fs.mkdirSync(dir, { recursive: true });
  console.log(validatedData)

  const html = generateHallTicketHtml(validatedData);

  const browser = await launchBrowser();
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.pdf({ path: filePath, format: 'A4', printBackground: true });
  } finally {
    await browser.close();
  }

  assertPdfWritten(filePath);

  const fileSizeKb = Math.round(fs.statSync(filePath).size / 1024);

  return { filePath, fileName, fileSizeKb, downloadUrl };
};

module.exports = {
  uploadsRoot,
  resolveBranchFolder,
  resolveHallTicketStorage,
  resolveLegacyHallTicketStorage,
  generateHallTicketPdf,
  launchBrowser,
  assertPdfWritten,
};
