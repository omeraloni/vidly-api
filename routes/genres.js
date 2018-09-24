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

router.put('/:id', async (req, res) => {
    const { error } = validateGenre(req.body);

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

router.delete('/:id', async (req, res) => {
    try {
        const genre = await Genre.findOneAndRemove({ _id: req.params.id });
        if (!genre) return res.status(404).json({ error: "A genre with the given ID was not found" });
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
