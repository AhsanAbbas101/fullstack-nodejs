const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.set('strictQuery',false)

mongoose.connect(url)
    .then(() => {
        console.log('Connected to MongoDB.')
    })
    .catch(error => {
        console.log(`error connecting to MongoDB: ${error.message}`)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: [3, 'Name length must be atleast 3, got {VALUE}']
    },
    number: {
        type: String,
        minLength: [8, 'Phone number length must be atleast 8, got {VALUE}'],
        match: [/^\b\d{2,3}-\d+\b$/, '{VALUE} is not a valid phone number!']
    }
})

personSchema.set('toJSON', {
    transform: (document,returnedObj) => {
        returnedObj.id = returnedObj._id.toString()
        delete returnedObj._id
        delete returnedObj.__v
    }
})

module.exports = mongoose.model('Person', personSchema)