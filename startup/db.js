const mongoose = require('mongoose')
const winston = require('winston')
mongoose.set('useCreateIndex', true)

module.exports = function() {
    mongoose.connect('mongodb://localhost/vidly', { useNewUrlParser: true })
        .then(() => new winston.transports.Console('Connected to MongoDB...'))
        
}
