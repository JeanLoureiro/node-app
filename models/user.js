const mongoose = require('mongoose')
const Joi = require('joi')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 50
    },
    
    email: {
        type: String,
        unique: true,
        required: true,
        min: 0,
        max: 255
    },
    password: {
        type: String,
        required: true,
        min: 0,
        max: 1024
    },
})

const User = mongoose.model('User', userSchema)


function validateUser(user){
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(0).max(255).required().email(),
        password: Joi.string().min(0).max(255).required()
    }

    return Joi.validate(user, schema)
}

exports.User = User
exports.validate = validateUser

