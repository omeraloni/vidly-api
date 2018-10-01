const router = require('express').Router();
const { User, validate } = require('../models/user');
const _ = require('lodash');
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).json({ error: "User already registered" });

    try {

        user = new User(_.pick(req.body, [ 'name', 'email', 'password' ]));
        
        const salt = await bcrypt.genSalt(10);    
        const hashed = await bcrypt.hash(user.password, salt);
        user.password = hashed;

        await user.save();
        res.send(_.pick(user, [ '_id', 'name', 'email' ]));
    }
    catch (ex) {
        res.status(400).json({ error: ex.message });
    }
});

module.exports = router;
