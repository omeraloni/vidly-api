const mongoose = require('mongoose');
const Joi = require('joi');

const rentalSchema = new mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
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
        }),

        required: true
    },

    movie: {
        type: new mongoose.Schema({
            title: {
                type: String,
                required: true,
                trim: true,
                minlength: 4,
                maxlength: 50,
            },

            dailyRentalRate: {
                type: Number,
                required: true,
                min: 0,
                max: 255,
            }
        }),

        required: true
    },

    dateOut: {
        type: Date,
        required: true,
        default: Date.now
    },

    dateReturned: {
        type: Date,
    },

    rentalFee: {
        type: Number,
        min: 0
    }
});

const Rental = mongoose.model('Rental', rentalSchema);

rentalSchema.statics.lookup = function(customerId, movieId) {
    return this.findOne({
        'customer._id': customerId,
        'movie._id': movieId,
    });
}

function validate(rental) {
    const schema = {
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required(),
    };

    return Joi.validate(rental, schema);
}

exports.Rental = Rental;
exports.validate = validate;