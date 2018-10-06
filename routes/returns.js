const router = require('express').Router();
const { Rental } = require('../models/rental');
const { Movie } = require('../models/movie');
const Fawn = require('fawn');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const moment = require('moment');
const Joi = require('joi');

router.post('/', [ auth, validate(validateReturn) ], async (req, res) => {

    //const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

    const rental = await Rental.findOne({
        'customer._id': req.body.customerId,
        'movie._id': req.body.movieId,
    });

    if (!rental) return res.status(404).send('Invalid ID.');

    if (rental.dateReturned) return res.status(400).send('Return already processed.');

    rental.dateReturned = Date.now();
    const days = moment().diff(rental.dateOut, 'days');
    rental.rentalFee = days * rental.movie.dailyRentalRate;
    await rental.save();

    const movie = await Movie.findById(rental.movie._id);
    movie.numberInStock++;
    await movie.save();

    /*
    new Fawn.Task()
        .save('rentals', rental)
        .save('movies', movie)
        .run();
    */

    res.send(rental);
});

function validateReturn(req) {
    const schema = {
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    };

    return Joi.validate(req, schema);
}

module.exports = router;
