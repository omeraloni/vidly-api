const request = require('supertest');
const {User} = require('../../models/user');
const {Genre} = require('../../models/genre');
//const auth = require('../../middleware/auth');
let server;

describe('auth middleware', () => {
    beforeEach(() => { server = require('../../index') });
    afterEach(async() => {
        server.close();
        await Genre.remove({});
    });

    let token;

    const exec = async () => {
        return request(server)
            .post('/api/genres/')
            .set('x-auth-token', token)
            .send({ name: 'test_genre' });
    }

    beforeEach(() => {
        token = new User().generateAuthToken();
    })

    it('should return 401 if token is not provided', async () => {
        token = '';
        const res = await exec();
        expect(res.status).toBe(401);
    });

    it('should return 400 if token is invalid', async () => {
        token = 'token';
        const res = await exec();
        expect(res.status).toBe(400);
    });

    it('should return 200 if toekn is valid', async () => {
        const res = await exec();
        expect(res.status).toBe(200);
    });
});
