const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        minlength: 4,
        maxlength: 50,
    },

    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 4,
        maxlength: 255,
    },

    password: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 1024,
    },

    isAdmin: Boolean
});

userSchema.methods.generateAuthToken = function() {
    return jwt.sign({ _id: this._id , isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
}

const User = mongoose.model('User', userSchema);

function validate(user) {
    const schema = {
        name: Joi.string().min(4).max(50).required(),
        email: Joi.string().min(4).max(255).required().email(),
        password: Joi.string().min(4).max(255).required()
    };

    return Joi.validate(user, schema);
}


exports.User = User;
exports.validate = validate;