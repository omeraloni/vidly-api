const router = require('express').Router();
const { Genre, validate } = require('../models/genre');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const asyncMiddleware = require('../middleware/async');

router.get('/', asyncMiddleware(async (req, res) => {
    const genres = await Genre.find().sort('name').select({ name: 1, id: 1 });
    res.send(genres);
}));

router.get('/:id', async (req, res) => {
    const genre = await Genre.findById(req.params.id).select({ name: 1});
    if (!genre) return res.status(404).json({ error: "A genre with the given ID was not found" });
    res.send(genre);    
});

router.post('/', auth, asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const genre = new Genre({ name: req.body.name });
    await genre.save();
    res.send(genre);
}));

// Default handler for all / routes
router.route('/')
.all((req, res, next) => {
    res.status(400).json({ error: `${req.method} not implemented`});
});

router.put('/:id', auth, asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const genre = await Genre.findByIdAndUpdate(
        req.params.id,
        { name: req.body.name },
        { new: true });

    if (!genre) return res.status(404).json({ error: "A genre with the given ID was not found" });
    res.send(genre);    
}));

router.delete('/:id', [ auth, admin ], asyncMiddleware(async (req, res) => {
    const genre = await Genre.findOneAndRemove({ _id: req.params.id });
    if (!genre) return res.status(404).send();
    res.send(genre);    
}));

// Default handler for all /:id routes
router.route('/:id')
.all((req, res, next) => {
    res.status(400).json({ error: `${req.method} not implemented`});
});

module.exports = router;
