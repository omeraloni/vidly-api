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
const error = require('./middleware/error');
require('express-async-errors');
const mongoose = require('mongoose');
const app = express();

if (!config.has('jwtPrivateKey')) {
    console.error('FATAL ERROR: jwtPrivateKey is not defined');
    process.exit(1);
}

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
app.use(error);

// Configuration
debugConfig(`App Name: ${config.get('name')}`);

const port = process.env.PORT || 4000;

app.listen(port, () => {
    debugStartup(`Listening on port ${port}...`);
});
