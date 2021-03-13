const request = require('supertest');
const Task = require('../src/models/task');
const app = require('../src/app');
const {testUserId, testUser, setUpDatabase, testTask3} = require('./fixtures/db');

beforeEach(setUpDatabase);

test('Should create a new task', async () => {
  const response = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
    .send({
      description: 'From my test'
    }).expect(201);
  
  //Assert task was uploaded and exists with correct fields
  const task = await Task.findById(response.body._id);
  expect(task).not.toBeNull();
  expect(task.completed).toEqual(false);
})

test('Should get all tasks of a user', async() => {
  const response = await request(app)
    .get('/tasks')
    .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
    .send()
    .expect(200);

  //Assert tasks was fetched with correct data
  expect(response.body.length).toEqual(2);
})

test('Should not be able to delete task with unauthorized user', async ()=> {
  await request(app)
    .delete(`/tasks/${testTask3._id}`)
    .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
    .send()
    .expect(404);

  //Assert task was not deleted
  const task = await Task.findById(testTask3._id);
  expect(task).not.toBeNull();
})