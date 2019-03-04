const { User, validate } = require('../models/user')
const auth = require('../middleware/auth')
const _ = require('lodash')
const bcrypt = require('bcrypt')
const config = require('config')
const express = require('express')
const router = express.Router()

router.get('/me', auth, async (req, res) => {
    const user = User.findById(req.user._id).select('-password')
    res.send(user)
})

router.post('/', async (req, res) => {


    console.log(req.body)

    const { error } = validate(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    let user = await User.findOne({ email: req.body.email })
    if(user) return res.status(400).send('User already registered.')

    const { name, email, password } = req.body

    user = new User({
        name,
        email,
        password,
    })

    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password, salt)

    await user.save()

    const token = user.generateAuthToken()
    res.header('x-auth-token', token).send(_.pick(user, ['id', 'name', 'email']))

})

module.exports = router 