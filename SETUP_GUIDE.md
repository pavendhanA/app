# Setup and Run Guide: Flutter E2E QA Framework

Follow this guide to install system dependencies, configure Appium 2.x drivers, boot virtual emulators, and execute E2E test suites locally.

---

## 1. Prerequisites & System Requirements

Ensure the following tools are installed and configured on your development machine:

- **Node.js**: LTS version (v18.x or v20.x recommended).
- **Java Development Kit (JDK)**: Version 17. Ensure `JAVA_HOME` is registered in system environment variables.
- **Android Studio & SDK**:
  - Install Android SDK Command-line Tools, Build-Tools, and Platform-Tools.
  - Configure `ANDROID_HOME` pointing to your SDK root path (e.g. `C:\Users\<user>\AppData\Local\Android\Sdk`).
  - Add Platform-Tools (`adb`) and Emulator commands to your system `PATH`.
- **ADB Drivers**: For real device execution, enable USB Debugging in developer options.

---

## 2. Appium 2.x Installation & Drivers Configuration

Appium 2.x requires driver plugins to be installed separately from the main server.

### Install Appium CLI globally
```bash
npm install -g appium@next
```

### Install Android UiAutomator2 Driver
```bash
appium driver install uiautomator2
```

### Install Appium Flutter Driver
```bash
appium driver install --source=npm appium-flutter-driver
```

### Check Installed Drivers
```bash
appium driver list --installed
```

---

## 3. Flutter App Settings & VM Service Port

For **Flutter Driver** to automate a build, the APK must be compiled in **Debug** or **Profile** mode (Release builds exclude the Dart VM Observatory service and cannot be automated with `appium-flutter-driver`).

### Forwarding VM Service Ports
By default, the Flutter driver communicates over Dart's Observatory VM port. Standard configurations expect port `8181`.
Run this command while the app is active to forward port listener requests:
```bash
adb forward tcp:8181 tcp:8181
```

---

## 4. Run Guide

### Step 1: Install Project Node Modules
In the project root folder:
```bash
npm install
```

### Step 2: Configure Environment Variables
Open the `.env` file in the root workspace and customize values:
```env
AUTOMATION_NAME=UiAutomator2   # Set to 'Flutter' or 'UiAutomator2'
APK_PATH=./app/build/outputs/apk/debug/app-debug.apk
APP_PACKAGE=com.gateguard.app
APP_ACTIVITY=com.gateguard.app.SplashActivity
```

### Step 3: Start Appium Server
Open a separate terminal window and launch the Appium server:
```bash
appium
```

### Step 4: Run E2E Tests
Execute tests using cross-env scripts depending on target driver mode:

#### UiAutomator2 (Native) execution
```bash
npm run test:native
```

#### Flutter Driver execution
```bash
npm run test:flutter
```

#### AI Exploratory Testing
```bash
npm run test:ai
```

---

## 5. Troubleshooting & Debugging

- **Appium Driver Not Found Error**:
  Ensure Appium is running from the global context where you installed drivers. Check driver health using:
  ```bash
  appium driver list --installed
  ```

- **ADB Devices Empty**:
  Ensure USB Debugging is active on your device, or boot an AVD emulator from Android Studio AVD Manager. Check status:
  ```bash
  adb devices
  ```

- **Observatory / VM Service Connection Timeout**:
  If using `Flutter` mode, verify that the application has the VM service active. Ensure you have run:
  ```bash
  adb forward tcp:8181 tcp:8181
  ```
  And check that the port is accessible in your web browser at `http://127.0.0.1:8181/`.
