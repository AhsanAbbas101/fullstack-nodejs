require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

const Person = require('./models/person')


morgan.token('req-data', (req,res)=>{
    return JSON.stringify(req.body)
})

app.use(express.static('dist'))
app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-data'))

persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]


app.get('/api/persons', (req, res, next) => {

    Person
        .find({})
        .then(result=> res.json(result))
        .catch(error=> next(error))
    
})

app.get('/info', (req,res) => {
    res.send(`Phonebook has info for ${persons.length} people <br/> ${new Date()}`)
})

app.get('/api/persons/:id', (req,res) => {
    const id = Number(req.params.id);
    const person = persons.find(person => person.id === id)

    if (person)
        res.json(person)
    else
    {
        res.statusMessage = `ID ${id} not found`;
        res.status(404).end()
    }
        
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

app.post('/api/persons', (req,res, next)=> {

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
        .then(result=> res.json(newPerson))
        .catch(error=> next(error))
    
})



// Error Handling
const errorHander = (error, req, res, next) => {

    console.log(error.message)

    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' })
    } 

    next(error)
}

app.use(errorHander)

// Start server
const PORT = process.env.PORT || 3001
app.listen(PORT, ()=> {
    console.log(`Server running on port ${PORT}.`);
})