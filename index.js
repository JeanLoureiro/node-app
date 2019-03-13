const { createLogger, format, transports } = require('winston')
const express = require('express')
const app = express()

// const debug = require('debug')('app:startup')
// debug(config.get('name'))

require('./startup/logging')()
require('./startup/routes')(app)
require('./startup/db')()
require('./startup/config')()
require('./startup/validation')()

const port = process.env.PORT || '3000'

app.set('view engine', 'pug')
app.set('views', './views') //default

const logger = createLogger({
    format: format.simple(),
    transports: [
        new transports.Console(),
    ]
});

const server = app.listen(port, () => logger.log('info', `Listening on port ${port}`) )

module.exports = server