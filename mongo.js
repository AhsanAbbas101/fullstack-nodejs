const mongoose = require('mongoose')

if (process.argv.length<3) {
    console.log('give database password as argument.')
    process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3] || null
const number = process.argv[4] || null

const url = `mongodb+srv://fullstack:${password}@cluster0.f8o45o3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

if (name && number) {
    const person = new Person({
        name: name,
        number: number,
    })

    person
        .save()
        .then(() => {
            console.log(`added ${name} number ${number} to phonebook`)
            mongoose.connection.close()
        })
}
else {
    Person
        .find({})
        .then(result => {
            console.log('phonebook:')
            result.forEach(p => {
                console.log(`${p.name} ${p.number}`)
            })
            mongoose.connection.close()
        })
}