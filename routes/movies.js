const router = require('express').Router();
const { Movie, validate } = require('../models/movie');
const { Genre } = require('../models/genre');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
    const movies = await Movie.find().sort('title');
    res.send(movies);
})

router.get('/:id', async (req, res) => {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ error: "A movie with the given ID was not found" });
    res.send(movie);    
});

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(404).json({ error: "A genre with the given ID was not found" });

    const movie = new Movie({ 
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },            numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });

    await movie.save();
    res.send(movie);
});

// Default handler for all / routes
router.route('/')
.all((req, res, next) => {
    res.status(400).json({ error: `${req.method} not implemented`});
});

router.put('/:id', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(404).json({ error: "A genre with the given ID was not found" });
    
    const movie = await Movie.findByIdAndUpdate(
        req.params.id,
        { 
            title: req.body.title,
            genre: {
                _id: genre._id,
                name: genre.name
            },
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate
        },
        { new: true });

    if (!movie) return res.status(404).json({ error: "A movie with the given ID was not found" });
    
    res.send(movie);    
});

router.delete('/:id', auth, async (req, res) => {
    const movie = await Movie.findOneAndRemove({ _id: req.params.id });
    if (!movie) return res.status(404).send();
    res.send(movie);    
});


// Default handler for all /:id routes
router.route('/:id')
.all((req, res, next) => {
    res.status(400).json({ error: `${req.method} not implemented`});
});

module.exports = router;
