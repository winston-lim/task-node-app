const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
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
    },
    tokens: [{
      token: {
        type: String,
        required: true,
      }
    }],
    avatar: {
      type: Buffer,
    }
  },
  {
    timestamps: true,
  }
);

userSchema.virtual('tasks', {
	ref: 'Task',
	localField: "_id",
	foreignField: "owner",
})

userSchema.methods.generateAuthToken = async function() {
  const user = this;
  const token = jwt.sign({_id: user._id.toString()}, 'privateKey');
  user.tokens = user.tokens.concat({token});
  await user.save();
  return token;
}

//Express by default converts response with .toJSON
//By overwriting toJSON,we define what the output is
userSchema.methods.toJSON = function() {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;  
  delete userObject.avatar;
  return userObject;
}

userSchema.statics.login = async(email,password) => {
	const user  = await User.findOne({email}) //same as {email: email}
	if (!user) {
    console.log('User does not exist')
		throw new Error('Unable to login');
	}

	const isMatch = await bcrypt.compare(password, user.password);
	if (!isMatch) {
    console.log('Not matching')
		throw new Error('Incorrent login credentials');
	}
	return user;
}

userSchema.pre('save', async function(next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
})

userSchema.pre('remove',async function(next) {
  const user = this;
  await Task.deleteMany({owner: user._id});
  next();
})

const User = mongoose.model('User', userSchema)

module.exports = User;