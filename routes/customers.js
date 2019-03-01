const { Customer, validate } = require('../models/customer')
const express = require('express')
const router = express.Router()


router.get('/', async (req, res) => {
    const customers = await Customer.find().sort('name')
    res.send(customers)
})

router.get('/:id', async (req, res) => {
    
    const customer = await Customer.findById(req.params.id)

    if ( ! customer ) return res.status(404).send(`The customer with the given ID ${req.params.id} was not found`)

    res.send(customer)
})

router.post('/', async (req, res) => {

    const { error } = validate(req.body)

    if(error) return res.status(400).send(error.details[0].message)

    let customer = new Customer({ 
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    })

    customer = await customer.save(customer)

    res.send(customer)

})

router.put('/:id', async (req, res) => {

    const findCustomer = await Customer.findById(req.params.id)

    const customerObj = {
        name: req.body.name ? req.body.name : findCustomer.name,
        phone: req.body.phone ? req.body.phone : findCustomer.phone,
        isGold: req.body.isGold ? req.body.isGold : findCustomer.isGold,
    }

    const { error } = validate(customerObj)
    if(error) return res.status(400).send(error.details[0])


    const customer = await Customer.findByIdAndUpdate(req.params.id, { 
        name: customerObj.name, 
        phone: customerObj.phone,
        isGold: customerObj.isGold
    }, {
        new: true
    } )

    if ( ! customer ) return res.status(404).send(`The customer with the given ID ${req.params.id} was not found`)

    res.send(customer)

})

router.delete('/:id', async (req, res) => {
    
    const customer = await Customer.findByIdAndRemove( req.params.id )

    if ( !customer ) return res.status(404).send(`The customer with the given ID ${req.params.id} was not found`)
    
    res.send(customer)
})


module.exports = router