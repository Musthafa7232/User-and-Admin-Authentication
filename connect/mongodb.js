const { MongoClient } = require('mongodb');
const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);

async function dbConnect() {
    let result = await client.connect()
      db = result.db('app');
    return db.collection('users');
}

   async function  dbConnects() {
    let result=await client.connect();
     db=result.db('app');
    return db.collection('admin');
   }



module.exports=[dbConnect,dbConnects];