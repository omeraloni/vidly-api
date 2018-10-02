const router = require('express').Router();
const { Customer, validate } = require('../models/customer');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
    const customers = await Customer.find().sort('name').select({ name: 1, id: 1 });
    res.send(customers);
})

router.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id).select({ name: 1});
    if (!customer) return res.status(404).json({ error: "A customer with the given ID was not found" });
    res.send(customer);    
});

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const customer = new Customer({ 
        name: req.body.name, 
        isGold: req.body.isGold, 
        phone: req.body.phone
    });
    
    await customer.save();
    res.send(customer);
});

// Default handler for all / routes
router.route('/')
.all((req, res, next) => {
    res.status(400).json({ error: `${req.method} not implemented`});
});

router.put('/:id', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const customer = await Customer.findByIdAndUpdate(
        req.params.id,
        { 
            name: req.body.name, 
            isGold: req.body.isGold,
            phone: req.body.phone
        },
        { new: true });

    if (!customer) return res.status(404).json({ error: "A customer with the given ID was not found" });
    
    res.send(customer);    
});

router.delete('/:id', auth, async (req, res) => {
    const customer = await Customer.findOneAndRemove({ _id: req.params.id });
    if (!customer) return res.status(404).json({ error: "A customer with the given ID was not found" });
    res.send(customer);    
});


// Default handler for all /:id routes
router.route('/:id')
.all((req, res, next) => {
    res.status(400).json({ error: `${req.method} not implemented`});
});

module.exports = router;
