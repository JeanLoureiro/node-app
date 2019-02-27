const EventEmitter = require('events')
 
const logging = (args) => {
    console.log(args.message)
}

const Logger = require('./logger')
const logger = new Logger()

logger.on('logging', logging)
logger.log('Yeah')

