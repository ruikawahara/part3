const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please provide password as argument for displaying contents of database: node mongo.js <password>')
    console.log('If you would like to add item to database, also provide the arguments: node mongo.js <password> <name> <number>')
    process.exit(1)
}

const password = process.argv[2]
const personName = process.argv[3]
const personNumber = process.argv[4]
const isPhoneNumber = /[0-9-]+$/

const url =
    `mongodb+srv://Rui:${password}@cluster0.jlujh.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length == 5 && personNumber.match(isPhoneNumber)) {
    const person = new Person({
        name: personName,
        number: personNumber
    })

    person.save().then(result => {
        console.log(`added ${result.name} number ${result.number} to phonebook`)
        mongoose.connection.close()
    })
}
else if (process.argv.length == 3) {
    console.log("phonebook:")

    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })

        mongoose.connection.close()
    })
}
else {
    console.error("Invalid input: Make sure the last argument is valid phone number")
    mongoose.connection.close()
}