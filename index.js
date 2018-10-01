const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const express = require('express');
const morgan = require('morgan');
const config = require('config');
const debugStartup = require('debug')('app:startup');
const debugDb = require('debug')('app:db');
const debugConfig = require('debug')('app:config');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');
const mongoose = require('mongoose');
const app = express();

mongoose.connect('mongodb://localhost/vidly', { useNewUrlParser: true })
    .then(() => debugDb('Connected to MongoDB...'))
    .catch(err => debugDb('Could not connect to MongoDB', err.message));

if (app.get('env') == 'development') {
    app.use(morgan('tiny'));
    debugStartup('Morgan enabled');
}

app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);

// Configuration
debugConfig(`App Name: ${config.get('name')}`);

/*
const debugLevel = config.get('debug_level');
debugStartup(`Debug level: ${debugLevel}`);
*/

const port = process.env.PORT || 4000;

app.listen(port, () => {
    debugStartup(`Listening on port ${port}...`);
});
