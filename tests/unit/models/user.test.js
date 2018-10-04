const {User} = require('../../../models/user');
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');

describe('user.generateAuthToken', () => {

    it('should return true if jwtPrivateKey is defined', () => {
        const result = config.has('jwtPrivateKey');
        expect(result).toBe(true);
    });

    it('should retrun a valid JWT', () => {
        const payload = {
            _id: new mongoose.Types.ObjectId().toHexString(),
            isAdmin: true
        };

        const user = new User(payload);
        const token = user.generateAuthToken();
        const result = jwt.verify(token, config.get('jwtPrivateKey'));
        expect(result).toMatchObject(payload);
    });
});