const mongoose = require('mongoose');
const Joi = require('joi');

const customerSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        minlength: 4,
        maxlength: 50,
    },

    isGold: {
        type: Boolean,
        default: false,
    },

    phone: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 50,
    }
});

const Customer = mongoose.model('Customer', customerSchema);

function validate(customer) {
    const schema = {
        name: Joi.string().min(4).max(50).required(),
        isGold: Joi.boolean().optional(),
        phone: Joi.string().min(4).max(50).required()
    };

    return Joi.validate(customer, schema);
}

exports.Customer = Customer;
exports.validate = validate;
exports.customerSchema = customerSchema;