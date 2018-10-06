const express = require('express');
const morgan = require('morgan');
const winston = require('winston');
const auth = require('../routes/auth');
const genres = require('../routes/genres');
const customers = require('../routes/customers');
const movies = require('../routes/movies');
const rentals = require('../routes/rentals');
const users = require('../routes/users');
const returns = require('../routes/returns');
const error = require('../middleware/error');

module.exports = function (app) {

    if (app.get('env') == 'development') {
        app.use(morgan('tiny'));
        winston.info('Morgan enabled', { label: 'routes' });
    }

    app.use(express.json());
    app.use('/api/auth', auth);
    app.use('/api/genres', genres);
    app.use('/api/customers', customers);
    app.use('/api/movies', movies);
    app.use('/api/rentals', rentals);
    app.use('/api/users', users);
    app.use('/api/returns', returns);
    app.use(error);

    winston.info('Routes established', { label: 'routes' });
}