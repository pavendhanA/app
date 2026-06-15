const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Ensure reports directory structure exists
const logDirectory = path.join(process.cwd(), 'reports', 'logs');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

// Custom log levels if needed, using standard winston levels
const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    step: 3,
    debug: 4
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    step: 'cyan',
    debug: 'blue'
  }
};

winston.addColors(customLevels.colors);

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  winston.format.printf(info => `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`)
);

const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(info => `${info.timestamp} [${info.level}]: ${info.message}`)
);

const logger = winston.createLogger({
  levels: customLevels.levels,
  level: 'debug',
  format: logFormat,
  transports: [
    // Write all errors to error.log
    new winston.transports.File({ 
      filename: path.join(logDirectory, 'error.log'), 
      level: 'error' 
    }),
    // Write all logs to combined.log
    new winston.transports.File({ 
      filename: path.join(logDirectory, 'combined.log') 
    }),
    // Output to console
    new winston.transports.Console({
      format: consoleFormat,
      level: 'debug'
    })
  ]
});

// Add step-logging helper
logger.step = (testName, stepName, result, remarks = '') => {
  const msg = `[${testName}] - Step: "${stepName}" - Result: ${result} ${remarks ? `(${remarks})` : ''}`;
  logger.log('step', msg);
  
  // Store steps for reporting purposes globally or in setup buffers
  if (!global.executionLogs) {
    global.executionLogs = [];
  }
  global.executionLogs.push({
    timestamp: new Date().toISOString(),
    testName,
    step: stepName,
    result,
    remarks
  });
};

module.exports = logger;
