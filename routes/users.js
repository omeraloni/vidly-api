const router = require('express').Router();
const { User, validate } = require('../models/user');
const _ = require('lodash');

/*
router.get('/', async (req, res) => {
    try {
        const users = await User.find().sort('name').select({ name: 1, id: 1 });
        res.send(users);
    }
    catch (ex) {
        res.status(400).json({ error: ex.message });
    }
})

router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select({ name: 1});
        if (!user) return res.status(404).json({ error: "A user with the given ID was not found" });
        res.send(user);    
    }
    catch (ex) {
        res.status(404).json({ error: ex.message });
    }
});
*/

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).json({ error: "User already registered" });

    try {

        user = new User(_.pick(req.body, [ 'name', 'email', 'password' ]));

        await user.save();
        res.send(_.pick(user, [ '_id', 'name', 'email' ]));
    }
    catch (ex) {
        res.status(400).json({ error: ex.message });
    }
});
/*
// Default handler for all / routes
router.route('/')
.all((req, res, next) => {
    res.status(400).json({ error: `${req.method} not implemented`});
});

router.put('/:id', async (req, res) => {
    const { error } = validate(req.body);

    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { 
                name: req.body.name, 
                email: req.body.email, 
                password: req.body.password
            },
            { new: true });

        if (!user) return res.status(404).json({ error: "A user with the given ID was not found" });
        
        res.send(user);    
    }
    catch (ex) {
        res.status(404).json({ error: ex.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findOneAndRemove({ _id: req.params.id });
        if (!user) return res.status(404).json({ error: "A user with the given ID was not found" });
        res.send(user);    
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
