const request = require('supertest')
const { Rental } = require('../../models/rental')
const { User } = require('../../models/user')
const { Movie } = require('../../models/movie')
const mongoose = require('mongoose')
const moment = require('moment')

let server
let customerId
let movieId
let rental
let movie
let token

const execute = () => {
    return request(server)
        .post('/api/returns/')
        .set('x-auth-token', token)
        .send({ customerId, movieId })
}

describe('/api/returns', () => {
    beforeEach( async () => {
        server = require('../../index')

        customerId = mongoose.Types.ObjectId().toHexString()
        movieId = mongoose.Types.ObjectId().toHexString()
        token = new User().generateAuthToken()

        movie = new Movie({
            _id: movieId,
            title: '12345',
            dailyRentalRate: 2,
            genre: { name: '12345'},
            numberInStock: 10
        })
        await movie.save()


        rental = new Rental({
            customer: {
                _id: customerId,
                name: '12345',
                phone: '12345'
            },
            movie: {
                _id: movieId,
                title: 'Movie Title',
                dailyRentalRate: 2
            }   
        })
        await rental.save()

    })
    afterEach(async () => {

        await server.close()
        await Rental.deleteMany({})
        await Movie.deleteMany({})
        
    })

    it('should return 401 is client is not logged in', async () => {
        token = ''
        const response = await execute()

        expect(response.status).toBe(401)
    })

    it('should return 400 if customerId is not provided', async () => {        
        customerId = ''
        const response = await execute()
        
        expect(response.status).toBe(400)
    })

    it('should return 400 if movieId is not provided', async () => {
        movieId = '' 
        const response = await execute()
        
        expect(response.status).toBe(400)
    })

    it('should return 404 if no rental found for this customer/movie', async () => {
        await Rental.deleteMany({})

        const response = await execute()
        
        expect(response.status).toBe(404)
    })

    it('should return 400 if return is already processed', async () => {
        rental.dateReturned = new Date()
        await rental.save()
        const response = await execute()
        
        expect(response.status).toBe(400)
    })

    it('should return 200 if return is valid', async () => {
        const response = await execute()
        
        expect(response.status).toBe(200)
    })

    it('should set the returnDate if input is valid', async () => {
        const response = await execute()
        const rentalInDb = await Rental.findById(rental._id)
        const diff = new Date() - rentalInDb.dateReturned

        expect(diff).toBeLessThan(10 * 1000)
    })

    it('should calculate the rental fee ( numberOfDays * movie.dailyRentalRate )', async () => {
        rental.dateOut = moment().add(-7, 'days').toDate()
        await rental.save()
        const response = await execute()
        const rentalInDb = await Rental.findById(rental._id)
    
        expect(rentalInDb.rentalFee).toBe(14)
    })

    it('should increase the movie stock if input is valid', async () => {

        const response = await execute()
        const movieInDb = await Movie.findById(movieId)
    
        expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1)
    })

    it('should return the rental in the body of the response', async () => {

        const response = await execute()
        const rentalInDb = await Rental.findById(rental._id)

        expect(Object.keys(response.body)).toEqual(
            expect.arrayContaining([
                'dateOut',
                'dateReturned',
                'rentalFee',
                'customer',
                'movie'
            ]))
    })

})

