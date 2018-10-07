const path = require('path');
const winston = require('winston');
const config = require('config');

if (process.env.NODE_ENV != 'test') {
    require('winston-mongodb');
}

require('express-async-errors');

const LOG_DIR = path.normalize(`${process.cwd()}/logs`); // TODO: config.get('logDir')
const TIMESTAMP_FORMAT = 'YYYY-MM-DD HH:mm:ss';

// Just an FYI
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    verbose: 3,
    debug: 4,
    silly: 5
};

function prettyPrintTimestamped() {
    winston.format.combine(
        winston.format.timestamp({ format: TIMESTAMP_FORMAT }),
        winston.format.prettyPrint()
    );
}

function consolePrint() {
    winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: TIMESTAMP_FORMAT }),
        winston.format.printf(info => {
            return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
          })
    );
}

module.exports = function() {
    /*
    winston.exceptions.handle(new winston.transports.File({
        dirname: LOG_DIR,
        filename: 'exceptions.log',
        format: prettyPrintTimestamped(),
        handleExceptions: true
    }));

    // winston handles only unhandledException, so unhandledRejection is re-thrown
    process.on('unhandledRejection', (ex) => {
        throw ex;
    });

    process.on('warning', (warn) => winston.warn(warn.message, { label: 'proc' }));
    process.on('error', (err) => winston.error(err.message, { label: 'proc' }));
    */

    winston.add(new winston.transports.File({
        dirname: LOG_DIR,
        filename: 'errors.log',
        level: 'error',
        format: prettyPrintTimestamped(),
    }));

    winston.add(new winston.transports.File({
        dirname: LOG_DIR,
        filename: 'combined.log',
        format: prettyPrintTimestamped(),
    }));

    const enableConsole = true;//process.env.NODE_ENV == 'development';// || process.env.NODE_ENV == 'test';

    if (enableConsole) {
        winston.add(new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.timestamp({ format: TIMESTAMP_FORMAT }),
                winston.format.printf(info => {
                    return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
                  })
            )
        }));

        //winston.exitOnError = false;
    }

    if (process.env.NODE_ENV != 'test') {
        winston.add(new winston.transports.MongoDB({
            db: config.get('db'),
            options: { useNewUrlParser: true }
        }));
    }

    winston.info('Logging started', { label: 'logging' });
}