import { config } from '@/config';

const getTimestamp = () => new Date().toISOString();

export const logger = {
  info: (message: string, ...args: any[]) => {
    console.log(`[INFO] ${getTimestamp()} - ${message}`, ...args);
  },
  warn: (message: string, ...args: any[]) => {
    console.warn(`[WARN] ${getTimestamp()} - ${message}`, ...args);
  },
  error: (message: string, ...args: any[]) => {
    console.error(`[ERROR] ${getTimestamp()} - ${message}`, ...args);
  },
  debug: (message: string, ...args: any[]) => {
    if (config.env === 'development') {
      console.debug(`[DEBUG] ${getTimestamp()} - ${message}`, ...args);
    }
  },
};
