const mongoose = require('mongoose');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        minlength: 4,
        maxlength: 50,
    },

    email: {
        type: String,
        unique: true
    },

    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 50,
    }
});

const User = mongoose.model('User', userSchema);

function validate(user) {
    const schema = {
        name: Joi.string().min(4).max(50).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).max(50).required()
    };

    return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validate;
exports.userSchema = userSchema;