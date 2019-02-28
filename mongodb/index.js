const mongoose = require('mongoose')
mongoose.set("debug", true);
mongoose.connect('mongodb://localhost/playground', { useNewUrlParser: true })
    .then(() => console.log('Connected to Mongo DB...'))
    .catch(err => console.error('Could not connect to mongo db ', err))

const courseSchema = new mongoose.Schema({
    name: String,
    author: String,
    tags: [String],
    // date: { type: Date, default: Date.now },
    date: Date,
    isPublished: Boolean
})

const Course = mongoose.model('Course', courseSchema)

// async function createCourse(){
//     const course = new Course({
//         name: 'Reactjs Course',
//         author: 'Jean',
//         tags: ['react', 'front end'],
//         isPublished: true
//     })

//     const result = await course.save()
//     console.log(result)
// }

// createCourse()

async function getCourses() {

    const pageNumber = 2
    const pageSize = 10

    return await Course
        .find({ isPublished: true })
        .or([
            { price: { $gte: 15 } },
            { name: /.*by.*/i }
        ])
        // .find({
        // name: /^react/i
        // name: /.*react.*/i
        // })
        // .skip(( pageNumber -1 ) * pageSize) // pagination
        // .limit(pageSize)
        // .sort({ price: -1 }) // 1 or -1
        .sort('-price') // -price or price
        // .select({ name: 1, author: 1 })
        .select('name author price')
    // .countDocuments()

    // console.log(courses)
}

// getCourses()

async function displayCourses() {
    const courses = await getCourses()
    console.log(courses)
}

// displayCourses()


async function updateCourse(id) {
    // Query first
    // const result = await Course.updateOne({ _id: id}, {
    //     $set: {
    //         isPublished: false,
    //         author: 'Another Author'
    //     }
    // })
    console.log(id)
    const result = await Course.updateOne(
        { _id: id },
        {
            $set: {
                isPublished: false,
                author: 'Another Author'
            }

        }
    )

    console.log(result)

    // Update first
}

updateCourse('5a68ff090c553064a218a547')