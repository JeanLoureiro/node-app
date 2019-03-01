const { Genre, validate } = require('../models/genre')
const express = require('express')
const router = express.Router()




router.get('/', async (req, res) => {
    const genres = await Genre.find().sort('name')
    res.send(genres)
})

router.get('/:id', async (req, res) => {
    // const course = courses.find( c => c.id === parseInt(req.params.id ))
    
    const genre = await Genre.findById(req.params.id)

    if ( ! genre ) return res.status(404).send(`The course with the given ID ${req.params.id} was not found`)

    res.send(genre)
})

router.post('/', async (req, res) => {

    const { error } = validate(req.body)

    if(error) return res.status(400).send(error.details[0].message)

    let genre = new Genre({ name: req.body.name })

    genre = await genre.save(genre)

    res.send(genre)

})

router.put('/:id', async (req, res) => {

    // const course = courses.find( c => c.id === parseInt(req.params.id ))
    // if ( !course ) return res.status(404).send(`The course with the given ID ${req.params.id} was not found`)
    
    const { error } = validate(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
        new: true
    } )

    if ( ! genre ) return res.status(404).send(`The course with the given ID ${req.params.id} was not found`)

    res.send(genre)

})

router.delete('/:id', async (req, res) => {
    
    const genre = await Genre.findByIdAndRemove( req.params.id )

    if ( !genre ) return res.status(404).send(`The genre with the given ID ${req.params.id} was not found`)
    
    res.send(genre)
})




module.exports = router