const config = require('config');
const winston = require('winston');
const version = require('../package').version;

module.exports = function () {
    if (!config.has('jwtPrivateKey')) {
        winston.error('FATAL ERROR: jwtPrivateKey is not defined', { label: config });
        process.exit(1);
    }

    winston.info(`${config.get('name')} ${version} config loaded`, { label: 'config' });
}