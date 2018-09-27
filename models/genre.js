const mongoose = require('mongoose');
const Joi = require('joi');

const Genre = mongoose.model('Genre', new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        minlength: 4,
        maxlength: 50,
    }
}));

function validate(genres) {
    const schema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(genres, schema);
}

exports.Genre = Genre;
exports.validate = validate;