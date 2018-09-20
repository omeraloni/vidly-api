const express = require('express');
const genres = require('./routes/genres');
const app = express();

app.use(express.json());
app.use('/api/genres', genres);

const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});
