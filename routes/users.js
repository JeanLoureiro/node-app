const { User, validate } = require('../models/user')
const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
    const users = await User.find().sort('name')
    res.send(users)
})

router.post('/', async (req, res) => {


    console.log(req.body)

    const { error } = validate(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    })

    await user.save(user)

    res.send(user)

})

module.exports = router 