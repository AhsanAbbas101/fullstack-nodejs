require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

const Person = require('./models/person')


morgan.token('req-data', (req) => {
    return JSON.stringify(req.body)
})

app.use(express.static('dist'))
app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-data'))

app.get('/api/persons', (req, res, next) => {

    Person
        .find({})
        .then(result => res.json(result))
        .catch(error => next(error))

})

app.get('/info', (req,res,next) => {

    Person
        .countDocuments({})
        .then(result => {
            res.send(`Phonebook has info for ${result} people <br/> ${new Date()}`)
        })
        .catch(error => next(error))

})

app.get('/api/persons/:id', (req,res,next) => {

    Person
        .findById(req.params.id)
        .then(result => {
            if (result)
                res.json(result)
            else
                res.status(404).end()
        })
        .catch(error => next(error))

})

app.delete('/api/persons/:id', (req,res,next) => {

    Person
        .findByIdAndDelete(req.params.id)
        .then(result => {
            if (result)
                res.status(204).end()
            else
                res.status(404).end()
        })
        .catch(error => next(error))

})

app.post('/api/persons', (req,res, next) => {

    const person = req.body

    if (!person.name || !person.number) {
        return res.status(400).json({
            error: 'content missing'
        })
    }

    /*TODO ignored for now.
    const match = persons.find(p => p.name.toLowerCase() === person.name.toLowerCase())
    if (match)
    {
        return res.status(400).json({
            error: 'name must be unique'
          })
    }
    */

    const newPerson = new Person(person)

    newPerson
        .save()
        .then(() => res.json(newPerson))
        .catch(error => next(error))

})

app.put('/api/persons/:id',(req,res,next) => {

    const body = req.body

    const person = {
        number: body.number
    }

    const options = {
        new: true,
        runValidators: true,
        context: 'query'
    }

    Person
        .findByIdAndUpdate(req.params.id,person,options)
        .then(result => {
            if (result)
                res.json(result)
            else
                res.status(404).json({
                    error: 'Id not found'
                })
        })
        .catch(error => next(error))

})

// Error Handling
const errorHander = (error, req, res, next) => {

    console.log(error.message)

    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' })
    }
    else if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message })
    }

    next(error)
}

app.use(errorHander)

// Start server
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}.`)
})