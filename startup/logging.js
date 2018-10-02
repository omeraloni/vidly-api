const path = require('path');
const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');

const LOG_DIR = path.normalize(`${process.cwd()}/logs`);

const myFormat = winston.format.printf(info => {
    return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
  });

module.exports = function() {
    winston.exceptions.handle(new winston.transports.File({
        dirname: LOG_DIR,
        filename: 'exceptions.log',
        format: winston.format.prettyPrint(),
        handleExceptions: true
    }));

    process.on('unhandledRejection', (ex) => {
        throw ex;
    });

    winston.add(new winston.transports.File({
        dirname: LOG_DIR,
        level: 'error',
        filename: 'errors.log'        
    }));

    winston.add(new winston.transports.File({
        dirname: LOG_DIR,
        filename: 'combined.log'        
    }));

    if (process.env.NODE_ENV == 'development') {
        winston.add(new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                myFormat
            )
        }));

        //winston.exitOnError = false;
    }

    winston.add(new winston.transports.MongoDB({
        db: 'mongodb://localhost/vidly',
        options: { useNewUrlParser: true }
    }));

    winston.info('Logging started', { label: 'logging' });
}