const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');

// deprecation fix
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true); // for part 3D

const url = process.env.MONGODB_URI

console.log('connecting to ', url)

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => console.log('connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB: ', err.message))

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        unique: true,
        uniqueCaseInsensitive: true
    },
    number: {
        type: String,
        required: true,
        validate: {
            validator: function (str) {
                const onlyNum = str.replace(/\D/g, "")
                return onlyNum.length > 7
            },
            message: `Phone number provided needs at least 8 numerical digits`
        }
    },
})

personSchema.plugin(uniqueValidator)

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model("Person", personSchema)