// logging.ts - Standardized logging utility for frontend

const isProd = process.env.NODE_ENV === 'production';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

function format(level: LogLevel, message: string, ...args: unknown[]) {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
}

export const logger = {
  info: (message: string, ...args: unknown[]) => {
    if (!isProd) console.info(format('info', message), ...args);
  },
  warn: (message: string, ...args: unknown[]) => {
    if (!isProd) console.warn(format('warn', message), ...args);
  },
  error: (message: string, ...args: unknown[]) => {
    if (!isProd) console.error(format('error', message), ...args);
  },
  debug: (message: string, ...args: unknown[]) => {
    if (!isProd) console.debug(format('debug', message), ...args);
  },
};
