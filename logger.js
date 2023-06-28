const pino = require('pino');

const fileTransports = pino.transport({
  target: 'pino/file',
  options: {
    destination: `${__dirname}/app.log`,
  },
});
module.exports = pino({
  level: process.env.PINO_LOG_LEVEL || 'info',
  formatters: {
    level: (label) => ({ level: label.toUpperCase() }),
  },
  timestamp: pino.stdTimeFunctions.isoTime,
}, fileTransports);
