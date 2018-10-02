module.exports = function(err, req, res, next) {
    // Log error
    res.status(500).send('Internal server error.');
}