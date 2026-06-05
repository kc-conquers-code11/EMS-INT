/**
 * Cross-platform Puppeteer Chrome installer.
 * Removes incomplete cache folders (common on Windows after interrupted downloads)
 * then installs the pinned Chrome build for puppeteer.
 */
const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawnSync } = require('child_process');

const optional = process.argv.includes('--optional');
const cacheRoot = path.join(os.homedir(), '.cache', 'puppeteer', 'chrome');
const projectRoot = path.join(__dirname, '..');

const chromeExecutableCandidates = (browserDir) => [
  path.join(browserDir, 'chrome-win64', 'chrome.exe'),
  path.join(browserDir, 'chrome-win32', 'chrome.exe'),
  path.join(browserDir, 'chrome-linux64', 'chrome'),
  path.join(browserDir, 'chrome-mac', 'Google Chrome for Testing.app', 'Contents', 'MacOS', 'Google Chrome for Testing'),
];

const hasChromeExecutable = (browserDir) =>
  chromeExecutableCandidates(browserDir).some((candidate) => fs.existsSync(candidate));

const cleanBrokenCache = () => {
  if (!fs.existsSync(cacheRoot)) {
    return;
  }

  for (const entry of fs.readdirSync(cacheRoot)) {
    const browserDir = path.join(cacheRoot, entry);
    if (!fs.statSync(browserDir).isDirectory()) {
      continue;
    }

    if (!hasChromeExecutable(browserDir)) {
      console.warn(`Removing incomplete Puppeteer Chrome cache: ${browserDir}`);
      fs.rmSync(browserDir, { recursive: true, force: true });
    }
  }
};

const installChrome = () => {
  const puppeteerCli = path.join(
    projectRoot,
    'node_modules',
    'puppeteer',
    'lib',
    'puppeteer',
    'node',
    'cli.js',
  );

  if (!fs.existsSync(puppeteerCli)) {
    console.error('Puppeteer is not installed. Run npm install first.');
    return 1;
  }

  const result = spawnSync(process.execPath, [puppeteerCli, 'browsers', 'install', 'chrome'], {
    cwd: projectRoot,
    stdio: 'inherit',
  });

  return result.status ?? 1;
};

try {
  cleanBrokenCache();
  const exitCode = installChrome();

  if (exitCode !== 0) {
    const message =
      'Puppeteer Chrome install failed. PDF features may not work until you run: npm run puppeteer:install';

    if (optional) {
      console.warn(message);
      process.exit(0);
    }

    console.error(message);
    process.exit(exitCode);
  }

  console.log('Puppeteer Chrome installed successfully.');
} catch (error) {
  const message = `Puppeteer Chrome install error: ${error.message}`;

  if (optional) {
    console.warn(message);
    process.exit(0);
  }

  console.error(message);
  process.exit(1);
}
