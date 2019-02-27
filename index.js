const Joi = require('joi')
const express = require('express')
const app = express()

app.use(express.json())

const port = process.env.PORT || '3000'

const courses = [
    {id: 1, name: 'Course1'},
    {id: 2, name: 'Course2'},
    {id: 3, name: 'Course3'}
]


app.get('/', (req, res) => {
    res.send('Helo World!')
})

app.get('/api/courses', (req, res) => {
    res.send(courses)
})

app.get('/api/courses/:id', (req, res) => {
    // const course = courses.find( c => c.id === parseInt(req.params.id ))
    // if ( !course ) return res.status(404).send(`The course with the given ID ${req.params.id} was not found`)

    const course = getCourse(req.params.id, res)
    
    res.send(course)
})

app.post('/api/courses', (req, res) => {

    const { error } = validateCourse(req.body)

    if(error) return res.status(400).send(error.details[0].message)

    const course = {
        id: courses.length + 1,
        name: req.body.name
    }

    courses.push(course)

    res.send(course)

})

app.put('/api/courses/:id', (req, res) => {

    // const course = courses.find( c => c.id === parseInt(req.params.id ))
    // if ( !course ) return res.status(404).send(`The course with the given ID ${req.params.id} was not found`)

    const course = getCourse(req.params.id, res)

    const { error } = validateCourse(req.body)

    if(error) return res.status(400).send(error.details[0].message)

    course.name = req.body.name

    res.send(course)

})

app.delete('/api/courses/:id', (req, res) => {
    // const course = courses.find( c => c.id === parseInt(req.params.id ))
    // if ( !course ) return res.status(404).send(`The course with the given ID ${req.params.id} was not found`)

    const course = getCourse(req.params.id, res)

    const index = courses.indexOf(course)
    courses.splice(index, 1)
    
    res.send(course)
})


function validateCourse(course){
    const schema = {
        name: Joi.string().min(3).required()
    }

    return Joi.validate(course, schema)
}

function getCourse(course, res){
    
    const courseObj = courses.find( c => c.id === parseInt(course))
    
    if ( ! courseObj ) return res.status(404).send(`The course with the given ID ${course} was not found`)

    return courseObj
}

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})