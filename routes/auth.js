const router = require('express').Router();
const { User } = require('../models/user');
const _ = require('lodash');
const bcrypt = require('bcrypt');

function validate(req) {
    const schema = {
        email: Joi.string().min(4).max(255).required().email(),
        password: Joi.string().min(4).max(255).required()
    };

    return Joi.validate(user, schema);
}

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).json({ error: "Invalid email or password" });

    const validPassword = await bcrypt.compare(req.params.password, user.password);
    if (!validPassword) return res.status(400).json({ error: "Invalid email or password" });

    res.send(true);
});

module.exports = router;
