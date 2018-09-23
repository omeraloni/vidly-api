const router = require('express').Router();
const Joi = require('joi');
const mongoose = require('mongoose');


const Genre = mongoose.model('Genre', new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        minlength: 4,
        maxlength: 50,
    }
}));

function validateGenre(genres) {
    const schema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(genres, schema);
}

function findGenre(id) {
    return genres.find(c => c.id === id);
}

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
        console.log(genre);
        res.send(genre);    
    }
    catch (ex) {
        res.status(404).json({ error: ex.message });
    }
});

router.post('/', async (req, res) => {
    const { error } = validateGenre(req.body);

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

router.put('/:id', (req, res) => {
    const genre = findGenre(parseInt(req.params.id));

    if (!genre) return res.status(404).json({ error: `Genre ${req.params.id} not found` });

    const { error } = validateGenre(req.body);

    if (error) return res.status(400).json({ error: error.details[0].message });

    genre.name = req.body.name;
    res.send(genre);
});

router.delete('/:id', (req, res) => {
    const genre = findGenre(parseInt(req.params.id));

    if (!genre) return res.status(404).json({ error: `Genre ${req.params.id} not found` });

    const index = genres.indexOf(genre);
    genres.splice(index, 1);
    res.send(genre);
});


// Default handler for all /:id routes
router.route('/:id')
.all((req, res, next) => {
    res.status(400).json({ error: `${req.method} not implemented`});
});

module.exports = router;
