const pino = require('pino');
//const multistream = require('pino-multi-stream');
const fs = require('fs');

const logger = pino({
  level: process.env.PINO_LOG_LEVEL || 'info',
  formatters: {
    bindings: (bindings) => {
      return {
        pid: bindings.pid,
        host: bindings.hostname,
        node_version: process.version,
      };
    },
    level: (label) => {
      return {
        level: label.toUpperCase()
      };
    },
  },  
});

const fileTransports = pino.transport({
  target: 'pino/file',
  options: { destination: `${__dirname}/app.log` },
});

module.exports = pino(
  {
    level: process.env.PINO_LOG_LEVEL || 'info',
    formatters: {
      level: (label) => {
        return { level: label.toUpperCase() };
        
      },
    },   
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  fileTransports
);

