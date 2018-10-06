const request = require('supertest');
const {Genre} = require('../../models/genre');
const {User} = require('../../models/user');
const mongoose = require('mongoose')
let server;

describe('/api/genres', () => {
    beforeEach(() => { server = require('../../index') });
    afterEach(async() => {
        await server.close();
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

        it('should return 400 if non implemente method is used', async () => {
            const res = await request(server).purge('/api/genres/');
            expect(res.status).toBe(400);
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

        it('should return 404 if valid id is passed but not found', async () => {
            const res = await request(server).get('/api/genres/' + new mongoose.Types.ObjectId());
            expect(res.status).toBe(404);
        });

        it('should return 400 if non implemente method is used', async () => {
            const res = await request(server).purge('/api/genres/' + new mongoose.Types.ObjectId());
            expect(res.status).toBe(400);
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

    describe('PUT /', () => {
        let token;
        let name;
        let id;

        const exec = async () => {
            return res = await request(server)
                .put('/api/genres/' + id)
                .set('x-auth-token', token)
                .send({ name });
        }

        // Set happy path params before each test
        beforeEach(() => {
            token = new User().generateAuthToken();
            id = new mongoose.Types.ObjectId();
            name = 'genre1';
            const genre = new Genre({ _id: id, name: name });
            genre.save();
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


        it('should return a 404 if id is not found', async () => {
            id = new mongoose.Types.ObjectId();
            const res = await exec();
            expect(res.status).toBe(404);
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


    describe('DELETE /', () => {
        let token;
        let name;
        let id;

        const exec = async () => {
            return res = await request(server)
                .delete('/api/genres/' + id)
                .set('x-auth-token', token);
        }

        // Set happy path params before each test
        beforeEach(() => {
            token = new User({ isAdmin: true }).generateAuthToken();
            id = new mongoose.Types.ObjectId();
            name = 'genre1';
            const genre = new Genre({ _id: id, name: name });
            genre.save();
        })

        it('should return a 401 if client is not logged in', async () => {
            token = '';
            const res = await exec();
            expect(res.status).toBe(401);
        });

        it('should return a 404 if id is not found', async () => {
            id = new mongoose.Types.ObjectId();
            const res = await exec();
            expect(res.status).toBe(404);
        });

        it('should delete the genre if it\'s valid', async () => {
            await exec();
            const genres = await Genre.find({ name: 'genre1' });
            expect(genres.length).toBe(0);
        });

        it('should return the deleted genre if it\'s valid', async () => {
            const res = await exec();
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('_id')
            expect(res.body).toHaveProperty('name', name);
        });
    });
});
