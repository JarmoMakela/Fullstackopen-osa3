const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to ', url)
mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB: ', error.message)
  })

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  number: { 
    type: String,
    minlength: 8,
    validate : {
      validator: function(str) {
        const arr = str.split('-')
        const regex = /^\d+$/;
        if (arr.length === 2 // A hyphen separates the string into two parts
            && regex.test(arr[0]) // The first part contains only numbers
            && regex.test(arr[1]) // The second part contains only numbers
            && arr[0].length >= 2 && arr[0].length <= 3 // The first part is 2 or 3 numbers
            && (arr[0].length + arr[1].length >= 8) // Total amount of numbers
            ) {
          return true
        } else {
          return false
        }
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    required: [true, 'User phone number required']
  }
})

contactSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Contact', contactSchema)