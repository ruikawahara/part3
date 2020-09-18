const express = require('express')
const { response } = require('express')
const app = express()
const morgan = require('morgan')

app.use(express.json())
app.use(morgan('tiny'))

let persons = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1
    },
    {
        name: "Ada Lovelace",
        number: "39-43-5323523",
        id: 2
    },
    {
        name: "Dan Abramov",
        number: "12-43-234345",
        id: 3
    },
    {
        name: "Mary Poppendieck",
        number: "39-23-6423122",
        id: 4
    },
]

// GET person
app.get('/api/persons', (req, res) => res.json(persons))

app.get('/api/persons/:id', (req, res) => {
    const person = persons.find(person => person.id === parseInt(req.params.id))

    if (person)
        res.json(person)
    else
        res.status(404)
            .send(`Person with ID of number ${req.params.id} not found`)
            .end()
})

// DELETE person
app.delete('/api/persons/:id', (req, res) => {
    persons = persons.filter(person => person.id !== parseInt(req.params.id))

    res.status(204).end()
})

// GET info
app.get('/info', (req, res) => {
    const personsCount = persons.length
    //app.use(express.responseTime())

    res.send(`
        <p>
            Phonebook has info for ${personsCount} people
        </p>
        <div>
            ${new Date()}
        </div>
    `)
})

// 3.8, show submitted data
morgan.token('json', req => (JSON.stringify(req.body)))
app.use(morgan(':json'))

// POST person
app.post('/api/persons', (req, res) => {
    const body = req.body

    // if there is no name given
    if (!body.name) {
        return res.status(400).json({
            error: 'Name missing'
        })
    }
    // if no number given
    else if (!body.number) {
        return res.status(400).json({
            error: 'Number missing'
        })
    }
    // if name is duplicate
    else if (persons.some(person => person.name === body.name)) {
        return res.status(409).json({
            error: 'Name must be unique'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: Math.floor(Math.random() * 1000)
    }

    persons = persons.concat(person)

    res.json(person)
})


const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})