const mongoose = require('mongoose')
// const winston = require('winston')
const { createLogger, format, transports } = require('winston')
mongoose.set('useCreateIndex', true)
const config = require('config')

const logger = createLogger({
    format: format.simple(),
    transports: [
        new transports.Console(),
    ]
});

module.exports = function() {
    const db = config.get('db')
    mongoose.connect( db, { useNewUrlParser: true })
        .then(() => logger.info(`Connected to ${db}...`))
        
}
