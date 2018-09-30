const mongoose = require('mongoose');
const Joi = require('joi');
const { genreSchema } = require('./genre');

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 4,
        maxlength: 50,
    },

    genre: {
        type: genreSchema,
        required: true
    },

    numberInStock: { 
        type: Number,
        required: true,
        min: 0,
        max: 255,
    },

    dailyRentalRate: { 
        type: Number,
        required: true,
        min: 0,
        max: 255,
    }
});

const Movie = mongoose.model('Movie', movieSchema);

function validate(movie) {
    const schema = {
        title: Joi.string().min(4).max(50).required(),
        genreId: Joi.string().required(),
        numberInStock: Joi.number().min(0),
        dailyRentalRate: Joi.number().min(0)
    };

    return Joi.validate(movie, schema);
}

exports.Movie = Movie;
exports.validate = validate;
exports.movieSchema = movieSchema;