const express = require('express')
const morgan = require('morgan')

const app = express()

app.use(express.json())

let phonebookData = [
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

const generateId = () => {

    const ranId = Math.trunc(Math.random() * 5000 + 1)
    
    let unique = null
    
    unique = phonebookData.find(person => person.id === ranId)
    
    if (!unique) return ranId

}

morgan.token('payload', (request) => {
  return JSON.stringify(request.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :payload'))

app.get('/', (request, response) => {

    response.send('<h1>Welcome to your Phonebook</h1>')

})

app.get('/info', (request, response) => {

    const date = new Date()

    const dateRequest = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds()

    )

    let message = `<p>Phonebook has info for ${phonebookData.length} people</p>`

    message += `<p>${dateRequest.toDateString()} ${dateRequest.toTimeString()}</p>`

    response.send(message)

})

app.get('/api/persons', (request, response) => {

    response.json(phonebookData)

})

app.get('/api/persons/:id', (request, response) => {

    const id = Number(request.params.id)

    const person = phonebookData.find(person => person.id === id)

    if (person) response.json(person)
    else response.status(404).end()

})

app.delete('/api/persons/:id', (request, response) => {

    const id = Number(request.params.id)

    phonebookData = phonebookData.filter(person => person.id !== id)

    response.status(204).end()
    
})

app.post('/api/persons', (request, response) => {
    
    const body = request.body
    
    if (!body.name || !body.number) return response.status(400).json({ 
        error: 'name or number is missing'
    })
    
    const repeated = phonebookData.find(person => person.name === body.name)

    if (repeated) return response.status(400).json({
        error: 'name must be unique'
    })

    const newPerson = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    phonebookData = phonebookData.concat(newPerson)

    response.json(newPerson)

})

const PORT = 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})