require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Contact = require('./models/contact')

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

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

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.get('/api/persons', (request, response, next) => {
  Contact.find({}).then(contacts => {
    response.json(contacts)
  })
  .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Contact.findById(request.params.id)
    .then(contact => {
      if (contact) {
        response.json(contact)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
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
  .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  const contact = {
    name: body.name,
    number: body.number
  }

  if (!body.name || !body.number) {
    return response.status(400).json({error: 'content missing'})
  }

  Contact.findByIdAndUpdate(request.params.id, contact, { new: true })
    .then(updatedContact => {
      response.json(updatedContact)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Contact.findByIdAndDelete(request.params.id)
  .then(result => {
    if (result) {
      response.status(204).end()
    } else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})

app.get('/info', (request, response, next) => {
  Contact.countDocuments()
  .then(result => {
    const line1 = `<div>Phonebook has info for ${result} people</div>`
    const line2 = new Date().toString()
    response.send(line1 + '<br>' + line2)
  })
  .catch(error => next(error))
})

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running of port ${PORT}`)
})
