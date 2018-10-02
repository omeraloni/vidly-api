const path = require('path');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, colorize, printf, prettyPrint } = format;
require('winston-mongodb');

const LOG_DIR = path.normalize(`${process.cwd()}/logs`);

const myFormat = printf(info => {
  return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
});

const logger = createLogger({
    level: 'info',
    format: combine(
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
            filename: 'combined.log'
        }),
        new transports.File({
            dirname: LOG_DIR, 
            filename: 'exceptions.log',
            handleExceptions: true
        }),        
        new transports.MongoDB({
            level: 'error',
            db: 'mongodb://localhost/vidly',
            options: { useNewUrlParser: true },
        })
    ],
  });


if (process.env.NODE_ENV == 'development') {
    logger.add(new transports.Console({
        format: combine(
            colorize(),
            timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            myFormat            
        )
    }));
}

module.exports = logger;
