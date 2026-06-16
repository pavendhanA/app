# E2E QA Automation Framework for Flutter Android Applications

This is an enterprise-grade, production-ready QA E2E automation framework designed for Flutter Android applications, built with **Appium 2.x**, **WebdriverIO**, **Mocha**, **Chai**, and **Node.js**.

## Core Architecture & Design Patterns

The framework implements a **dual-driver architecture** which supports:
1. **Flutter Driver Mode**: Employs `appium-flutter-driver` and the `appium-flutter-finder` library for native Dart-VM level widget interactions (by ValueKey, SemanticsLabel, Widget Text, etc.).
2. **Native Fallback Mode**: Employs `appium-uiautomator2-driver` to automate standard Android compilation views. Our base page automatically decodes base64-encoded Flutter finder values into standard Android Accessibility IDs, Resource IDs, or XPath selectors.

### Directory Structure
....
├── .github/
│   └── workflows/
│       └── flutter-appium.yml # GitHub Actions workflow runner
├── config/
│   └── appium.config.js       # Appium Capabilities and device auto-detection logic
├── reports/                   # Compiled reports, screenshots, and logs
│   ├── failures/              # Screenshot PNGs, logs, and XML source dumps of failed runs
│   ├── logs/                  # Combined.log and error.log Winston log files
│   ├── Flutter_E2E_Report.xlsx # 4-sheet formatted ExcelJS workbook
│   └── index.html             # Premium custom responsive dashboard report
├── src/
│   ├── driver/
│   │   └── DriverFactory.js   # Session manager, context switcher, and fallback handler
│   ├── pages/                 # Page Object Model (POM) representations
│   │   ├── BasePage.js        # Base POM with element wrappers and locator translator
│   │   ├── LoginPage.js       # Auth scenario selectors and action wrappers
│   │   ├── FormPage.js        # Form elements (Dropdown, pickers, radio, text)
│   │   ├── UIComponentPage.js # Material components helper (Switch, sheet, dialogs)
│   │   └── NavigationPage.js  # Tabs, drawers, back-button and deep-link routing
│   └── utils/
│       ├── Logger.js          # Winston logger with custom console & file transports
│       ├── GestureUtils.js    # Multi-finger touch gestures using W3C Actions API
│       ├── ExcelReporter.js   # ExcelJS spreadsheet compile engine
│       ├── HtmlReporter.js    # Static single-page dashboard builder with chart overlays
│       └── AiTestingAgent.js  # Heuristic layout explorer and dynamic validation fuzzing
├── tests/
│   ├── setup.js               # Mocha root hooks, teardowns, and failure handlers
│   ├── auth.test.js           # Credentials and Session spec tests
│   ├── form.test.js           # Form Validation rules spec tests
│   ├── ui.test.js             # Flutter Material UI components click/scroll checks
│   └── navigation.test.js     # Intents, Deep links, Drawers, and Tab spec tests
├── .env                       # Configurable parameters (APK path, Package details, server host)
├── package.json               # NPM scripts and module dependencies
└── SETUP_GUIDE.md             # In-depth local configuration and run guides
```

---

## Features

- **POM Design**: All test suites interface with page objects; selectors are cleanly separated from assertions.
- **W3C Actions Gestures**: Multi-pointer coordinate actions support Tap, Double Tap, Long Press, Scroll, Swipe, Drag & Drop, Pinch, and Zoom.
- **Failures Logging**: When a test fails, setup hooks automatically dump:
  1. High-resolution screenshot (`reports/failures/screenshot_*.png`).
  2. Device Logcat stream (`reports/failures/logs_*.log`).
  3. UI layout XML widget hierarchy tree (`reports/failures/source_*.xml`).
  4. Stack traces inside compilation logs.
- **Premium Custom Reports**:
  - **Excel**: Formatted sheets mapping Execution Summaries, Test lists with status fills, failures details, and timestamped audit logs.
  - **HTML**: Sleek dark-mode dashboard displaying gauge charts, metadata blocks, filter buttons, logs tables, and modal-popup screenshot viewers.
- **Smart AI Explorer**: An autonomous agent that reads layout models via `driver.getPageSource()`, classifies inputs, fuzzes fields with invalid formats, and maps navigation menus.
- **GHA Pipeline**: Complete pipeline file running headless emulators inside hardware-accelerated macOS runner environments.

---

## Commands Reference

Ensure you install all package modules beforehand:
```bash
npm install
```

### Run E2E Test Suite (UiAutomator2 Fallback)
```bash
npm run test:native
```

### Run E2E Test Suite (Flutter Driver)
```bash
npm run test:flutter
```

### Run AI Exploratory Testing Agent
```bash
npm run test:ai
```
