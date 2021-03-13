const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../../src/models/user');
const Task = require('../../src/models/task');

const testUserId = new mongoose.Types.ObjectId();
const testUser = {
  _id: testUserId,
  name: "tester",
  email: "test@test.com",
  password: "testing",
  tokens: [{
    token: jwt.sign({_id: testUserId}, process.env.JWT_SECRET)
  }]
}

const testUserId2 = new mongoose.Types.ObjectId();
const testUser2 = {
  _id: testUserId2,
  name: "tester2",
  email: "test2@test.com",
  password: "testing",
  tokens: [{
    token: jwt.sign({_id: testUserId2}, process.env.JWT_SECRET)
  }]
}

const testTask1 = {
  _id: new mongoose.Types.ObjectId(),
  description: 'Test Task 1',
  completed: false,
  owner: testUser._id,
}

const testTask2 = {
  _id: new mongoose.Types.ObjectId(),
  description: 'Test Task 2',
  completed: false,
  owner: testUser._id,
}

const testTask3 = {
  _id: new mongoose.Types.ObjectId(),
  description: 'Test Task 3',
  completed: false,
  owner: testUser2._id,
}

const setUpDatabase = async () => {
  await User.deleteMany();
  await new User(testUser).save();
  await new User(testUser2).save();
  await Task.deleteMany();
  await new Task(testTask1).save();
  await new Task(testTask2).save();
  await new Task(testTask3).save();
}

module.exports = {
  testUserId,
  testUserId2,
  testUser,
  testUser2,
  setUpDatabase,
  testTask1,
  testTask2,
  testTask3
}