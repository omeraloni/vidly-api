const request = require('supertest');
const {Genre} = require('../../models/genre');
const {User} = require('../../models/user');
let server;

describe('/api/genres', () => {
    beforeEach(() => { server = require('../../index') });
    afterEach(async() => {
        server.close();
        await Genre.remove({}); // cleanup db
    });

    describe('GET /', () => {
        it('should return all genres', async () => {
            await Genre.collection.insertMany([
                { name: 'genre1'},
                { name: 'genre2'},
            ]);

            const res = await request(server).get('/api/genres/');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(g => g.name == 'genre1')).toBeTruthy();
        });
    });

    describe('GET /:id', () => {
        it('should return a genre if valid id is passed', async () => {
            const genre = new Genre({ name: 'genre1' });
            await genre.save();

            const res = await request(server).get('/api/genres/' + genre._id);
            expect(res.status).toBe(200);
            expect(res.body.name).toBe(genre.name);
        });

        it('should return 404 if invalid id is passed', async () => {
            const res = await request(server).get('/api/genres/1');
            expect(res.status).toBe(404);
        });
    });

    describe('POST /', () => {
        let token;
        let name;

        const exec = async () => {
            return res = await request(server)
                .post('/api/genres/')
                .set('x-auth-token', token)
                .send({ name });
        }

        // Set happy path params before each test
        beforeEach(() => {
            token = new User().generateAuthToken();
            name = 'genre1';
        })

        it('should return a 401 if client is not logged in', async () => {
            token = '';
            const res = await exec();
            expect(res.status).toBe(401);
        });

        it('should return a 400 if genre is less than 4 charachters', async () => {
            name = 'gnr';
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return a 400 if genre is more than 50 charachters', async () => {
            name = new Array(52).join('a');
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should save the genre if it\'s valid', async () => {
            await exec();
            const genres = await Genre.find({ name: 'genre1' });
            expect(genres).not.toBeNull();
        });

        it('should return the genre if it\'s valid', async () => {
            const res = await exec();
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('_id')
            expect(res.body).toHaveProperty('name', name);
        });
    });
});
