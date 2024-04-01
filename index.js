const express = require('express')
const app = express()

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
// Start server
const PORT = 3001
app.listen(PORT, ()=> {
    console.log(`Server running on port ${PORT}.`);
})