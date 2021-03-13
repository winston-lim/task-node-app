const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');
const {testUserId, testUser, setUpDatabase} = require('./fixtures/db');

beforeEach(setUpDatabase);


//*****Public routes*****
test('Should create a user', async()=> {
  const response = await request(app)
  .post('/users').send({
    name: 'Winston',
    email: 'winston.lim.cher.hong@gmail.com',
    password: 'testing'})
  .expect(201);

  //Assert that the database was updated
  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();
  
  //Assert that database was updated with correct user
  expect(response.body).toMatchObject({
    user: {
      name: 'Winston',
      email: 'winston.lim.cher.hong@gmail.com',
    },
    token: user.tokens[0].token,
  })
})

test('Should sign in existing user', async()=> {
  const response = await request(app)
  .post('/users/login')
  .send({
    email: testUser.email,
    password: testUser.password,
  }).expect(200);
  
  //Assert that user logged into correctly
  const user = await User.findById(testUserId);
  expect(response.body.token).toBe(user.tokens[1].token);
});

test('Should not sign in nonexistent user', async()=> {
  await request(app).post('/users/login')
  .send({
    email: 'test@test.com',
    password: 'goodpass'})
  .expect(400);
})


//*****Private routes*****
test('Shoud read existing user profile', async ()=> {
  await request(app)
  .get('/users/me')
  .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
  .send({})
  .expect(200);
})

test('Should not read unauthenticated users', async ()=> {
  await request(app)
  .get('/users/me')
  .send({})
  .expect(401);
})

test("Should delete a user", async ()=> {
  await request(app)
  .delete('/users/me')
  .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
  .send({})
  .expect(200);
  
  //Assert that user was removed from Database
  const user = await User.findById(testUserId);
  expect(user).toBeNull();
})

test("Should not delete a user", async ()=> {
  await request(app)
  .delete('/users/me')
  .send({})
  .expect(401);
})

test('Should upload avatar image', async ()=> {
  await request(app)
  .post('/users/me/avatar')
  .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
  .attach('avatar','tests/fixtures/profile-pic.jpg')
  .expect(200);

  //Assert that avatar binary data was stored
  const user = await User.findById(testUserId);
  expect(user.avatar).toEqual(expect.any(Buffer));
})

test('Should update valid user fields', async () => {
  const response = await request(app)
  .patch('/users/me')
  .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
  .send({
    name: 'Updated tester'
  }).expect(200)

  //Assert name changed on database same as request body
  const user = await User.findById(testUserId);
  expect(user.name).toEqual('Updated tester');
})

test('Should not update invalid user fields', async () => {
  const response = await request(app)
  .patch('/users/me')
  .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
  .send({
    location: 'Singapore'
  }).expect(400)
})