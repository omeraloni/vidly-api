const path = require('path');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;
 
const myFormat = printf(info => {
  return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
});

const LOG_DIR = path.normalize(`${process.cwd()}/logs`);

const logger = createLogger({
    level: 'info',
    format: combine(
        label({ label: 'router' }),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        myFormat
      ),
      transports: [
      //
      // - Write to all logs with level `info` and below to `combined.log` 
      // - Write all logs error (and below) to `error.log`.
      //
      new transports.File({ dirname: LOG_DIR,  filename: 'error.log', level: 'error' }),
      new transports.File({ dirname: LOG_DIR, filename: 'combined.log' })
    ]
  });

if (process.env.NODE_ENV == 'development') {
    logger.add(new transports.Console());
}

module.exports = function(err, req, res, next) {
    logger.error(err.message, err);
    res.status(500).send('Internal server error.');
}

