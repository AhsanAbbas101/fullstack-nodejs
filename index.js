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


app.get('/api/persons', (req, res) => {

    Person
        .find({})
        .then(result=> res.json(result))
        .catch(error=> console.log(`Error getting data from db - Error Message: ${error.message}`))
    
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

app.delete('/api/persons/:id', (req,res) => {
    const id = Number(req.params.id);
    const person = persons.find(person => person.id === id)
    let status = 404;

    if (person)
    {
        persons = persons.filter(person => person.id !== id)
        status = 204;
    }
    res.status(status).end()
})

app.post('/api/persons', (req,res)=> {

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
        .catch(error=> console.log(`Error adding new person. ${error.message}`))
    
})

// Start server
const PORT = process.env.PORT || 3001
app.listen(PORT, ()=> {
    console.log(`Server running on port ${PORT}.`);
})