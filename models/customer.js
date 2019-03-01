const mongoose = require('mongoose')
const Joi = require('joi')

const Customer = mongoose.model('Customer', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 50
    },
    isGold: {
        type: Boolean,
        default: false
    },
    phone:{
        type: String,
        required: true,
        minlength: 4,
        maxlength: 10
    }
}))

function validateCustomer(customer){

    console.log('Validation Customer: ', customer)
    const schema = {
        name: Joi.string().min(4).max(50).required(),
        phone: Joi.string().min(4).max(10).required(),
        isGold: Joi.boolean()
    }

    return Joi.validate(customer, schema)
}

exports.Customer = Customer
exports.validate = validateCustomer