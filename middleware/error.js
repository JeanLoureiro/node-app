const winston = require('winston')
require('winston-mongodb')

const logger = winston.createLogger({
    level: 'error',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.MongoDB({ 
            db: 'mongodb://localhost/vidly' , 
            options:{
                useNewUrlParser: true
            }
        })
    ]
});


module.exports = function(err, req, res, next){
    logger.error( err )
    
    res.status(500).send('Something failed')
}

process.on('uncaughtException', (ex) => {
    logger.error(ex.message)
    // process.exit(1)
} )

process.on('unhandledRejection', (ex) => { throw ex })

exports.logger = logger