import pino from 'pino';

const fileTransports = pino.transport({
  target: 'pino/file',
  options: {
    destination: './app.log',
  },
});
export default pino({
  level: process.env.PINO_LOG_LEVEL || 'info',
  formatters: {
    level: (label) => ({ level: label.toUpperCase() }),
  },
  timestamp: pino.stdTimeFunctions.isoTime,
}, fileTransports);
