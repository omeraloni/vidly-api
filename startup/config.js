const config = require('config');
const winston = require('winston');
const version = require('../package').version;

module.exports = function () {
    if (!config.has('jwtPrivateKey')) {
        throw new Error('FATAL ERROR: jwtPrivateKey is not defined');
    }

    winston.info(`${config.get('name')} ${version} config loaded`, { label: 'config' });
}