require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
//const mongoose = require('mongoose')
const Contact = require('./models/contact')

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

/*const url =
  `mongodb+srv://fullstack:${password}@cluster0.br4pb.mongodb.net/contactApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const contactSchema = new mongoose.Schema({
  name: String,
  number: String
})

contactSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject._v
  }
})

const Contact = mongoose.model('Contact', contactSchema)*/

// Create new token
morgan.token('body', (req) => req.method === 'POST' ? JSON.stringify(req.body) : '')

// Show also the data in case of POST requests. Otherwise use morgan 'tiny' configuration.
app.use((req, res, next) => {
  if (req.method === 'POST') {
    morgan(':method :url :status :res[content-length] - :response-time ms :body')(req, res, next)
  } else {
    morgan('tiny')(req, res, next)
  }
})

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: "3",
    name: "Dan Abramow",
    number: "12-43-234345"
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122"
  }
]

/*app.get('/api/persons', (request, response) => {
  response.json(persons)
})*/
app.get('/api/persons', (request, response) => {
  Contact.find({}).then(contacts => {
    response.json(contacts)
  })
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(p => p.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

/*app.post('/api/persons', (request, response) => {

  // Check the validity of the input
  if (!request.body.name || request.body.name.length === 0) {
    return response.status(400).json({error: 'name missing'})
  }
  if (!request.body.number || request.body.number.length === 0) {
    return response.status(400).json({error: 'number missing'})
  }
  if (persons.find(p => p.name === request.body.name)) {
    return response.status(400).json({error: 'name must be unique'})
  }

  // Create random id for the new entry and add the entry into the "database"
  const id = Math.floor(Math.random() * 999999999999).toString()
  const person = {id: id, name: request.body.name, number: request.body.number}
  persons = persons.concat(person)
  response.json(person)
})*/
app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({error: 'content missing'})
  }

  const contact = new Contact({
    name: body.name,
    number: body.number
  })

  contact.save().then(savedContact => {
    response.json(savedContact)
  })
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(p => p.id !== id)
  response.status(204).end()
})

app.get('/info', (request, response) => {
  const line1 = `<div>Phonebook has info for ${persons.length} people</div>`
  const line2 = new Date().toString()
  response.send(line1 + '<br>' + line2)
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running of port ${PORT}`)
})
