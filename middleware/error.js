const { createLogger, transports, format } = require('winston')
require('winston-mongodb')

const logger = createLogger({
    level: 'error',
    format: format.json(),
    transports: [
        new transports.File({ filename: 'error.log', level: 'error' }),
        new transports.MongoDB({ 
            db: 'mongodb://localhost/vidly' , 
            options:{
                useNewUrlParser: true
            }
        })
    ]
});

module.exports = function(err, req, res, next){
    
    logger.error( err.message )
    
    res.status(500).send('Something failed')
}

exports.logger = logger
