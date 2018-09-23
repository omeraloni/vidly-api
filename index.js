const express = require('express');
const morgan = require('morgan');
const config = require('config');
const debugStartup = require('debug')('app:startup');
const debugDb = require('debug')('app:db');
const debugConfig = require('debug')('app:config');
const genres = require('./routes/genres');
const app = express();

app.use(express.json());

if (app.get('env') == 'development') {
    app.use(morgan('tiny'));
    debugStartup('Morgan enabled');
}

app.use('/api/genres', genres);

// Configuration
debugConfig(`App Name: ${config.get('name')}`);

const debugLevel = config.get('debug_level');
debugStartup(`Debug level: ${debugLevel}`);

const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});
