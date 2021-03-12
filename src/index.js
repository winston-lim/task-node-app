const express = require('express');
//without assignment satatement, dependency is executed
require('./db/mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');
const jwt = require('jsonwebtoken');


const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

const token = jwt.sign({_id: "placeholderId"}, "thisisasecretsignature");
console.log(jwt.verify(token,"thisisasecretsignature"));

app.listen(port, ()=> {
  console.log('Server is up on port ', port); 
})