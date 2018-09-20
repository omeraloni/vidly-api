const router = require('express').Router();
const Joi = require('joi');

const genres = [
    { id: 1, name: 'action' },
    { id: 2, name: 'drama' },
    { id: 3, name: 'comedy' },
    { id: 4, name: 'horror' },
    { id: 5, name: 'documentary' },
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

router.get('/:id', (req, res, next) => {
    const genre = findGenre(parseInt(req.params.id));
    
    if (!genre) return res.status(404).send(`Genre ${req.params.id} not found`);
    
    res.send(genre);
});

router.post('/', (req, res, next) => {
    const { error } = validateGenre(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    const genre = { 
        id: genres.length + 1,
        name: req.body.name,
    };

    genres.push(genre);
    res.send(genre);
});

router.put('/:id', (req, res, next) => {
    const genre = findGenre(parseInt(req.params.id));

    if (!genre) return res.status(404).send(`Genre ${req.params.id} not found`);

    const { error } = validateGenre(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    genre.name = req.body.name;
    res.send(genre);
});

router.delete('/:id', (req, res, next) => {
    const genre = findGenre(parseInt(req.params.id));

    if (!genre) return res.status(404).send(`Genre ${req.params.id} not found`);

    const index = genres.indexOf(genre);
    genres.splice(index, 1);
    res.send(genre);
});

module.exports = router;
