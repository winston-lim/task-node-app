const {MongoClient, ObjectId} = require('mongodb');

const connectionUrl = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-node-app';

MongoClient.connect(connectionUrl, {useUnifiedTopology: true,},(error, client)=> {
  if(error) {
    return console.log('Unable to connect to database');
  }
  const db = client.db(databaseName);
  db.collection('tasks').deleteOne(
    //filterQuery object is first argument
    {
    description: 'Task One'
    }
    ).then(console.log).catch(console.log);
 })