const path = require('path');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, colorize, printf, prettyPrint } = format;
 
const LOG_DIR = path.normalize(`${process.cwd()}/logs`);
const LABEL = 'router';

const myFormat = printf(info => {
  return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
});

const logger = createLogger({
    level: 'info',
    format: combine(
        label({ label: LABEL }),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        prettyPrint()
      ),
    transports: [
      new transports.File({ 
          dirname: LOG_DIR,  
          filename: 'error.log', 
          level: 'error' 
        }),
      new transports.File({
          dirname: LOG_DIR, 
          filename: 'combined.log' })
    ]
  });

if (process.env.NODE_ENV == 'development') {
    logger.add(new transports.Console({
        format: combine(
            colorize(),
            label({ label: LABEL }),
            timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            myFormat            
        )
    }));
}

module.exports = function(err, req, res, next) {
    logger.error(err.message, err);
    res.status(500).send('Internal server error.');
}

