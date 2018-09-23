const router = require('express').Router();
const Joi = require('joi');

const genres = [
    { id: 1, name: 'Action' },
    { id: 2, name: 'Drama' },
    { id: 3, name: 'Comedy' },
    { id: 4, name: 'Horror' },
    { id: 5, name: 'Documentary' },
];

function validateGenre(genres) {
    const schema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(genres, schema);
}

function findGenre(id) {
    return genres.find(c => c.id === id);
}

router.get('/', (req, res, next) => {
    res.send(genres);
})

router.get('/:id', (req, res) => {
    const genre = findGenre(parseInt(req.params.id));
    
    if (!genre) return res.status(404).json({ error: `Genre ${req.params.id} not found` });
    
    res.send(genre);
});

router.post('/', (req, res) => {
    const { error } = validateGenre(req.body);

    if (error) return res.status(400).json({ error: error.details[0].message });

    const genre = { 
        id: genres.length + 1,
        name: req.body.name,
    };

    genres.push(genre);
    res.send(genre);
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
