const mongoose = require('mongoose')
mongoose.set("debug", true);
mongoose.connect('mongodb://localhost/playground', { useNewUrlParser: true })
    .then(() => console.log('Connected to Mongo DB...'))
    .catch(err => console.error('Could not connect to mongo db ', err))

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 100
    },
    category: {
        type: String,
        required: true,
        enum: ['web', 'frontend', 'backend']
    },
    author: String,
    tags: {
        type: Array,
        validate: {
            isAsync: true,
            validator: function (v, cb) {
                setTimeout(() => {
                    const result = v && v.length > 0
                    cb(result)
                }, 1000)
            },
            messsage: 'A course should have at least 1 tag.'

        }
    },
    // date: { type: Date, default: Date.now },
    date: Date,
    isPublished: Boolean,
    price: {
        type: Number,
        min: 10,
        max: 200,
        required: function () { return this.isPublished }, // only required if isPublished is true
        get: v => Math.round(v),
        set: v => Math.round(v)
    }
})

const Course = mongoose.model('Course', courseSchema)

async function createCourse() {
    const course = new Course({
        name: 'Reactjs Course',
        author: 'Jean',
        category: '-',
        tags: ['react', 'front end'],
        isPublished: true,
        price: 15
    })

    try {
        const result = await course.save()
        console.log(result)
    }
    catch (err) {
        for (field in err.errors){
            console.log(err.errors[field].message)
        }
    }


}

createCourse()

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
    const course = await Course.findByIdAndUpdate(id,
        {
            $set: {
                isPublished: true,
                author: 'Maria Jose'
            }

        }, { new: true }
    )

    console.log(course)

}

// updateCourse('5a68ff090c553064a218a547')


async function removeCourse(id) {

    const result = await Course.deleteOne({ _id: id })
    // Course.findByIdAndRemove()
    console.log(result)

}

// removeCourse('5a68ff090c553064a218a547')