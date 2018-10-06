const request = require('supertest');
const {User} = require('../../models/user');
const {Rental} = require('../../models/rental');
const {Movie} = require('../../models/movie');
const mongoose = require('mongoose');
const moment = require('moment');

describe('/api/returns', () => {
    let server;
    let token;
    let rental;
    let movie;
    let customerId;
    let movieId;

    const exec = async () => {
        return request(server)
            .post('/api/returns/')
            .set('x-auth-token', token)
            .send({ customerId, movieId });
    }

    beforeEach(async () => {
        server = require('../../index');
        token = new User().generateAuthToken();
        customerId = new mongoose.Types.ObjectId();
        movieId = new mongoose.Types.ObjectId();

        rental = new Rental({
            customer: {
                _id: customerId,
                name: 'Lorne Malvo',
                phone: '123456789'
            },

            movie: {
                _id: movieId,
                title: 'Fargo',
                dailyRentalRate: 10,
            }
        });

        await rental.save();

        movie = new Movie({
            _id: movieId,
            genre: { name: 'Crime' },
            title: 'Fargo',
            numberInStock: 3,
            dailyRentalRate: 10
        });

        await movie.save();
    });

    afterEach(async () => {
        await server.close();
        await Rental.remove({});
        await Movie.remove({});
    });


    /*
    it('sanity test - verify rental document was created in monogo', async () => {
        const result = await Rental.findById(rental._id);
        expect(result).not.toBeNull();
    });
    */

    it('should return 401 if client is not logged in', async () => {
        token = '';
        const res = await exec();
        expect(res.status).toBe(401);
    });

    it('should return 400 if customer ID is invalid', async () => {
        customerId = '';
        const res = await exec();
        expect(res.status).toBe(400);
    });

    it('should return 400 if movie ID is invalid', async () => {
        movieId = '';
        const res = await exec();
        expect(res.status).toBe(400);
    });

    it('should return 404 if no rental with given customerId and movieId is found', async () => {
        await Rental.remove({});
        const res = await exec();
        expect(res.status).toBe(404);
    });

    it('should return 400 if rental has already been processed', async () => {
        rental.dateReturned = Date.now();
        await rental.save();
        const res = await exec();
        expect(res.status).toBe(400);
    });

    it('should return 200 if request is valid', async () => {
        const res = await exec();
        expect(res.status).toBe(200);
    });

    it('should set the return date if input is valid', async () => {
        await exec();
        const rentalInDb = await Rental.findById(rental._id);
        const diff = new Date() - rentalInDb.dateReturned;
        expect(diff).toBeLessThan(10 * 1000);
    });

    it('should update the returned movie number in stock', async () => {
        await exec();
        const movieInDb = await Movie.findById(rental.movie._id);
        expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
    });

    it('should calculate the rental fee', async () => {
        rental.dateOut =  moment().subtract(2, 'days').toDate();
        await rental.save();
        await exec();
        const rentalInDb = await Rental.findById(rental._id);
        expect(rentalInDb.rentalFee).toBe(20);
    });

    it('should return the rental', async () => {
        rental.dateOut =  moment().subtract(2, 'days').toDate();
        await rental.save();
        const res = await exec();
        const rentalInDb = await Rental.findById(rental._id);

        expect(Object.keys(res.body)).toEqual(
            expect.arrayContaining(['dateOut', 'dateReturned', 'customer', 'movie', 'rentalFee']));
    });
});
