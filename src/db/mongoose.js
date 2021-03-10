const mongoose = require('mongoose');
const validator = require('validator');

mongoose.connect('mongodb://127.0.0.1:27017/task-mongoose-app', {
  useUnifiedTopology: true,
  useCreateIndex: true, 
});

//Creating a model
const User = mongoose.model('User', {
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
		type: String,
		required: true,
    trim: true,
    lowercase: true,
		validate(value) {
			if (!validator.isEmail(value)) {
        throw new Error('Invalid email');
      }
    }
	},
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 7,
    validate(value) {
      if(value.toLowerCase().includes('password')) {
        throw new Error('Password contains \'password\'');
      }
    }
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if(value<0) {
        throw new Error('Invalid age');
      }
    }
  }
})

// const user1 = new User({
//   name: 'Weng',
//   email: 'test@test.com',
//   age:  27,
//   password: 'password1234',
// })

// user1.save().then(console.log).catch(console.log);

const Task = mongoose.model('Task', {
  description: {
    type: String,
    required: true,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  }
})

const task1 = new Task({
  description: 'Task One',
})

task1.save().then(console.log).catch(console.log);