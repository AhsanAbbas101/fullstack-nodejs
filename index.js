const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())

morgan.token('req-data', (req,res)=>{
    return JSON.stringify(req.body)
})

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
    res.json(persons)
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

    const match = persons.find(p => p.name.toLowerCase() === person.name.toLowerCase())
    if (match)
    {
        return res.status(400).json({ 
            error: 'name must be unique' 
          })
    }

    const id = Math.floor(Math.random()* 10000);

    const newPerson = {...person, 'id':id}
    persons = persons.concat(newPerson)

    res.json(newPerson)
})

// Start server
const PORT = 3001
app.listen(PORT, ()=> {
    console.log(`Server running on port ${PORT}.`);
})