/**
 * Logging utility
 * Simple logging with timestamps
 */

const LogLevel = {
  INFO: "INFO",
  WARN: "WARN",
  ERROR: "ERROR",
  DEBUG: "DEBUG"
};

function formatLog(level, message, data = null) {
  const timestamp = new Date().toISOString();
  let log = `[${timestamp}] [${level}] ${message}`;
  
  if (data) {
    log += ` - ${JSON.stringify(data)}`;
  }
  
  return log;
}

export const logger = {
  info: (message, data) => {
    console.log(formatLog(LogLevel.INFO, message, data));
  },
  
  warn: (message, data) => {
    console.warn(formatLog(LogLevel.WARN, message, data));
  },
  
  error: (message, data) => {
    console.error(formatLog(LogLevel.ERROR, message, data));
  },
  
  debug: (message, data) => {
    if (process.env.DEBUG === "true") {
      console.log(formatLog(LogLevel.DEBUG, message, data));
    }
  }
};

export default logger;
