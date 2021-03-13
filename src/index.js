const express = require('express');
//without assignment satatement, dependency is executed
require('./db/mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');
const jwt = require('jsonwebtoken');


const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, ()=> {
  console.log('Server is up on port ', port); 
})