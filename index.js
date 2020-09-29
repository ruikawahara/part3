require('dotenv').config()
const express = require('express')
//const { response } = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const { response } = require('express')

app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('build'))

/*
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
    }
]
*/

// GET person
app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => res.json(persons))
})

// GET specific person
app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
        .then(person => {
            if (person)
                res.json(person)
            else
                res.status(404).end()
        })
        .catch(err => next(err))

    // below for part 3B
    /*
    const person = persons.find(person => person.id === parseInt(req.params.id))

    if (person)
        res.json(person)
    else
        res.status(404)
            .send(`Person with ID of number ${req.params.id} not found`)
            .end()
    */
})

// PUT new phone number (update)
app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body
    const person = {
        number: body.number,
    }

    Person.findByIdAndUpdate(req.params.id, person, { new: true })
        .then(updatedPerson => res.json(updatedPerson))
        .catch(err => next(err))
})

// DELETE person
app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
        .then(result => res.status(204).end())
        .catch(err => next(err))

    /* // from part3B
    persons = persons.filter(person => person.id !== parseInt(req.params.id))
    res.status(204).end()
    */
})

// GET info... will not work for part 3C
app.get('/info', (req, res, next) => {

    // for part 3C
    Person.countDocuments({})
        .then(result => {
            res.send(`
                <p>
                    Phonebook has info for ${result} people
                </p>
                <div>
                    ${new Date()}
                </div>
            `)
        })
        .catch(err => next(err))

    /* //from part 3A & 3B
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
    */
})

// 3.8, show submitted data
morgan.token('json', req => (JSON.stringify(req.body)))
app.use(morgan(':json'))

// POST person
app.post('/api/persons', (req, res) => {
    const body = req.body

    // if there is no name given
    if (body.name === undefined) {
        return res.status(400).json({
            error: 'Name missing'
        })
    }
    // if no number given
    else if (body.number === undefined) {
        return res.status(400).json({
            error: 'Number missing'
        })
    }

    // part 3C
    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPerson => res.json(savedPerson))

    // // Below is for part 3B, which is
    // // not required for exercise 3.14 (Part C)

    // // if name is duplicate
    // else if (persons.some(person => person.name === body.name)) {
    //     return res.status(409).json({
    //         error: 'Name must be unique'
    //     })
    // }
    /* 
    const person = {
        name: body.name,
        number: body.number,
        id: Math.floor(Math.random() * 1000)
    }

    persons = persons.concat(person)
    res.json(person)
    */
})

const errorHandler = (err, req, res, next) => {
    console.log(err.message)

    if (err.name === 'CastError')
        return res.status(400).send({ err: 'Malformatted id' })

    next(err)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})