const {User} = require('../../../models/user');
const auth = require('../../../middleware/auth');
const mongoose = require('mongoose');

describe('auth middleware', () => {

    it('should decode a valid JWT', () => {
        const user = {
            _id: new mongoose.Types.ObjectId().toHexString(),
            isAdmin: true
        };

       const token = new User(user).generateAuthToken();
       const req = { header: jest.fn().mockReturnValue(token) }
       const res = {};
       const next = jest.fn();

       auth(req, res, next);
       expect(req.user).toMatchObject(user);
    });

    it('should throw an exception if JWT fails verification', () => {
       const token = 1;
       const req = { header: jest.fn().mockReturnValue(token) }
       const res = {};
       const next = jest.fn();

       expect(() => auth(req, res, next)).toThrow();
    });
});