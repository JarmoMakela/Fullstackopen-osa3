const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

/* const url =
  `mongodb+srv://fullstack:${password}@cluster0.o1opl.mongodb.net/?retryWrites=true&w=majority`

const url =
  `mongodb+srv://fullstack:${password}@cluster0.br4pb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
*/
const url =
  `mongodb+srv://fullstack:${password}@cluster0.br4pb.mongodb.net/contactApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const ContactSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Contact = mongoose.model('Contact', ContactSchema)

// Create 
const contact = new Contact({
  name: name,
  number: number
})

contact.save().then(result => {
  console.log(`added ${name} ${number} to phonebook`)
  mongoose.connection.close()
})

// Find
/*Contact.find({}).then(result => {
  result.forEach(contact => {
    console.log(contact)
  })
  mongoose.connection.close()
})*/
