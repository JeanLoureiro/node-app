const EventEmitter = require('events')

class Logger extends EventEmitter {
    log( message ){
        console.log(message)

        this.emit('logging', { message: 'Logging'} )
    }
}

module.exports = Logger