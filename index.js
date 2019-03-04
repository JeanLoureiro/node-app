const mongoose = require('mongoose')
const debug = require('debug')('app:startup')
const config = require('config')
const helmet = require('helmet')
const express = require('express')
const Joi = require('joi');
const courses = require('./routes/courses')
const genres = require('./routes/genres')
const customers = require('./routes/customers')
const movies = require('./routes/movies')
const home = require('./routes/home')
const rentals = require('./routes/rentals')
const users = require('./routes/users')
const auth = require('./routes/auth')

Joi.objectId = require('joi-objectid')(Joi)
const app = express()

if ( ! config.get('jwtPrivateKey') ) {
    console.error('FATAL ERROR: jwtPrivateKey is not defined.')
    process.exit(1)
}


mongoose.connect('mongodb://localhost/vidly', { useNewUrlParser: true })
    .then( () => console.log('Connected to MongoDB...'))
    .catch( err => console.error('Could not connect to MongoDB'))

const port = process.env.PORT || '3000'

app.set('view engine', 'pug')
app.set('views', './views') //default

app.use(express.json())
app.use(helmet())
app.use(express.static('public'))
app.use('/', home)
app.use('/api/courses', courses)
app.use('/api/genres', genres)
app.use('/api/customers', customers)
app.use('/api/movies', movies)
app.use('/api/rentals', rentals)
app.use('/api/users', users)
app.use('/api/auth', auth)

debug(config.get('name'))

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})