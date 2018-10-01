const router = require('express').Router();
const { Genre, validate } = require('../models/genre');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/', async (req, res) => {
    try {
        const genres = await Genre.find().sort('name').select({ name: 1, id: 1 });
        res.send(genres);
    }
    catch (ex) {
        res.status(400).json({ error: ex.message });
    }
})

router.get('/:id', async (req, res) => {
    try {
        const genre = await Genre.findById(req.params.id).select({ name: 1});
        if (!genre) return res.status(404).json({ error: "A genre with the given ID was not found" });
        res.send(genre);    
    }
    catch (ex) {
        res.status(404).json({ error: ex.message });
    }
});

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);

    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
        const genre = new Genre({ name: req.body.name });
        await genre.save();
        res.send(genre);
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

router.put('/:id', auth, async (req, res) => {
    const { error } = validate(req.body);

    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
        const genre = await Genre.findByIdAndUpdate(
            req.params.id,
            { name: req.body.name },
            { new: true });

        if (!genre) return res.status(404).json({ error: "A genre with the given ID was not found" });
        
        res.send(genre);    
    }
    catch (ex) {
        res.status(404).json({ error: ex.message });
    }
});

router.delete('/:id', [ auth, admin ], async (req, res) => {
    try {
        const genre = await Genre.findOneAndRemove({ _id: req.params.id });
        if (!genre) return res.status(404).send();
        res.send(genre);    
    }
    catch (ex) {
        res.status(404).json({ error: ex.message });
    }
});


// Default handler for all /:id routes
router.route('/:id')
.all((req, res, next) => {
    res.status(400).json({ error: `${req.method} not implemented`});
});

module.exports = router;
