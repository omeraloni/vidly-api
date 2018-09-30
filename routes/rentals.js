const router = require('express').Router();
const { Rental, validate } = require('../models/rental');
const { Movie } = require('../models/movie');
const { Customer } = require('../models/customer');

router.get('/', async (req, res) => {
    try {
        const rentals = await Rental.find().sort('-dateOut');
        res.send(rentals);
    }
    catch (ex) {
        res.status(400).json({ error: ex.message });
    }
})

/*
router.get('/:id', async (req, res) => {
    try {
        const movie = await Rental.findById(req.params.id);
        if (!movie) return res.status(404).json({ error: "A movie with the given ID was not found" });
        res.send(movie);    
    }
    catch (ex) {
        res.status(404).json({ error: ex.message });
    }
});
*/

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(404).json({ error: "A customer with the given ID was not found" });

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(404).json({ error: "A movie with the given ID was not found" });

    if (movie.numberInStock == 0) return res.status(404).json({ error: `Movie ${movie.title} is out of stock`});

    try {
        const rental = new Rental({ 
            customer: {
                _id: customer._id,
                name: customer.name,
                phone: customer.phone
            },            
            movie : {
                _id: movie._id,
                title: movie.title,
                dailyRentalRate: movie.dailyRentalRate,
            },

            date: Date.now
        });

        await rental.save();

        movie.numberInStock--;
        await movie.save();

        res.send(rental);
    }
    catch (ex) {
        res.status(400).json({ error: ex.message });
    }
});

// Default handler for all / routes
router.route('/')
.all((req, res, next) => {
    res.status(400).json({ error: `${req.method} not implemented`});
});

/*
router.put('/:id', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const customer = await Customer.findById(req.body.CustomerId);
    if (!customer) return res.status(404).json({ error: "A customer with the given ID was not found" });
    
    try {
        const movie = await Rental.findByIdAndUpdate(
            req.params.id,
            { 
                title: req.body.title,
                customer: {
                    _id: customer._id,
                    name: customer.name
                },
                numberInStock: req.body.numberInStock,
                dailyRentalRate: req.body.dailyRentalRate
            },
            { new: true });

        if (!movie) return res.status(404).json({ error: "A movie with the given ID was not found" });
        
        res.send(movie);    
    }
    catch (ex) {
        res.status(404).json({ error: ex.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const movie = await Rental.findOneAndRemove({ _id: req.params.id });
        if (!movie) return res.status(404).send();
        res.send(movie);    
    }
    catch (ex) {
        res.status(404).json({ error: ex.message });
    }
});
*/

// Default handler for all /:id routes
router.route('/:id')
.all((req, res, next) => {
    res.status(400).json({ error: `${req.method} not implemented`});
});

module.exports = router;
