const router = require('express').Router();
const { Rental } = require('../models/rental');
const { Movie } = require('../models/movie');
const Fawn = require('fawn');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const Joi = require('joi');

router.post('/', [auth, validate(validateReturn)], async (req, res) => {

    const rental = await Rental.lookup(req.body.customerId, req.body.movieId);
    if (!rental) return res.status(404).send('Invalid ID.');
    if (rental.dateReturned) return res.status(400).send('Return already processed.');

    rental.return();
    await rental.save();

    await Movie.update({ _id: rental.movie._id }, {
        $inc: { numberInStock: 1 }
    });

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
