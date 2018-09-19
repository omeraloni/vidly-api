const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const genres = [
    { id: 1, genre: 'action' },
    { id: 2, genre: 'drama' },
    { id: 3, genre: 'comedy' },
    { id: 4, genre: 'horror' },
    { id: 5, genre: 'documentary' },
];

