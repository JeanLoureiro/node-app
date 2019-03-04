require('express-async-errors')
const { createLogger, transports, format } = require('winston')
require('winston-mongodb')

const logger = createLogger({
    level: 'error',
    format: format.json(),
    exceptionHandlers: [
        new transports.Console(),
        new transports.File({ filename: 'uncaughtExceptions.log' })
    ],
    rejectionHandler: [
        new transports.File({ filename: 'uncaughtExceptions.log' })
    ]
    // exitOnError: false
});


module.exports = function () {

    logger.exceptions.handle(
        new transports.File({
            filename: 'uncaughtExceptions.log'
        })
    )

    process.on('unhandledRejection', (ex) => { throw ex })

}


