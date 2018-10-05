const mongoose = require('mongoose');
const Joi = require('joi');

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 50,
    }
});

const Genre = mongoose.model('Genre', genreSchema);

function validate(genre) {
    const schema = {
        name: Joi.string().min(4).max(50).required()
    };

    return Joi.validate(genre, schema);
}

exports.Genre = Genre;
exports.validate = validate;
exports.genreSchema = genreSchema;