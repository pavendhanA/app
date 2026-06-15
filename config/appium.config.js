require('dotenv').config();
const path = require('path');
const { execSync } = require('child_process');
const logger = require('../src/utils/Logger');

/**
 * Resolves the absolute path to adb executable on Windows or falls back to global command.
 */
function getAdbPath() {
  const fs = require('fs');
  const localAppData = process.env.LOCALAPPDATA || (process.env.USERPROFILE ? path.join(process.env.USERPROFILE, 'AppData', 'Local') : '');
  if (localAppData) {
    const winAdb = path.join(localAppData, 'Android', 'Sdk', 'platform-tools', 'adb.exe');
    if (fs.existsSync(winAdb)) {
      return winAdb; // Return path directly without surrounding quotes
    }
  }
  return 'adb';
}

const adbCmd = getAdbPath();

/**
 * Executes a shell command and returns the stdout, or null if error.
 */
function runShellCommand(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  } catch (e) {
    logger.error(`Shell command execution failed [${cmd}]: ${e.message}`);
    return null;
  }
}

/**
 * Detects connected Android devices and returns device details.
 */
function detectDevices() {
  logger.info(`Auto-detecting connected Android devices/emulators using command: ${adbCmd}`);
  const adbOutput = runShellCommand(`${adbCmd} devices`);
  if (!adbOutput) {
    logger.warn('ADB command failed or not found. Falling back to configured defaults.');
    return { name: process.env.DEVICE_NAME || 'Android_Emulator', version: process.env.PLATFORM_VERSION || '14.0' };
  }

  const lines = adbOutput.split('\n');
  const devices = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line && line.includes('\tdevice')) {
      const deviceId = line.split('\t')[0];
      devices.push(deviceId);
    }
  }

  if (devices.length === 0) {
    logger.warn('No active Android devices detected via ADB. Defaulting to Emulator.');
    return { name: process.env.DEVICE_NAME || 'Android_Emulator', version: process.env.PLATFORM_VERSION || '14.0' };
  }

  const firstDevice = devices[0];
  logger.info(`Detected active device ID: ${firstDevice}`);

  // Fetch Android OS Version
  let osVersion = runShellCommand(`${adbCmd} -s ${firstDevice} shell getprop ro.build.version.release`);
  if (!osVersion) {
    osVersion = process.env.PLATFORM_VERSION || '14.0';
  }
  logger.info(`Detected Android version for ${firstDevice}: ${osVersion}`);

  return { name: firstDevice, version: osVersion };
}

const device = detectDevices();

// Resolve the absolute path of the APK
const apkPath = path.resolve(process.cwd(), process.env.APK_PATH || './app/app-release.apk');
logger.info(`Target APK Path: ${apkPath}`);

const capabilities = {
  platformName: 'Android',
  'appium:deviceName': device.name,
  'appium:platformVersion': device.version,
  'appium:app': apkPath,
  'appium:appPackage': process.env.APP_PACKAGE || 'com.company.app',
  'appium:appActivity': process.env.APP_ACTIVITY || 'com.company.app.MainActivity',
  'appium:newCommandTimeout': 300,
  'appium:noReset': true,
  'appium:autoGrantPermissions': true,
  'appium:ignoreHiddenApiPolicyError': true
};

// Apply automation specific settings
const automationName = process.env.AUTOMATION_NAME || 'UiAutomator2';
if (automationName.toLowerCase() === 'flutter') {
  capabilities['appium:automationName'] = 'Flutter';
  // Standard flutter driver options
  capabilities['appium:retryBackoffTime'] = 500;
  capabilities['appium:maxRetryCount'] = 3;
} else {
  capabilities['appium:automationName'] = 'UiAutomator2';
}

const config = {
  hostname: process.env.APPIUM_HOST || '127.0.0.1',
  port: parseInt(process.env.APPIUM_PORT || '4723', 10),
  path: process.env.APPIUM_PATH || '/',
  capabilities: capabilities,
  deviceInfo: device // Keep track for reporting
};

module.exports = config;
