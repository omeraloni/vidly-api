const express = require('express');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const winston = require('winston');

const app = express();

require('./startup/logging')();
require('./startup/config')();
require('./startup/routes')(app);
require('./startup/db')();

const port = process.env.PORT || 4000;

app.listen(port, () => {
    winston.info(`Listening on port ${port}...`, { label: 'app' });
});
