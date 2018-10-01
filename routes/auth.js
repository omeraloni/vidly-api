const router = require('express').Router();
const Joi = require('joi');
const { User } = require('../models/user');
const bcrypt = require('bcrypt');

function validate(req) {
    const schema = {
        email: Joi.string().min(4).max(255).required().email(),
        password: Joi.string().min(4).max(255).required()
    };

    return Joi.validate(req, schema);
}

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ error: "Invalid email or password" });

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).json({ error: "Invalid email or password" });

    const token = user.generateAuthToken();
    res.send(token);
});

module.exports = router;
