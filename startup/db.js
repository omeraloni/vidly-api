const mongoose = require('mongoose');
const winston = require('winston');
const config = require('config');
const Fawn = require('fawn');

module.exports = function () {
    const db = config.get('db');

    winston.info(`Connecting to ${db}...`, { label: 'db' });

    mongoose.connect(db, { useNewUrlParser: true })
    .then(() => {
        winston.info(`Connected to ${db}!`, { label: 'db' })
        Fawn.init(mongoose);  
    })
    .catch(error => {
        winston.error(`${error}`, { label: 'db' });
        process.exit(-1);
    });
}
