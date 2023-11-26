const express = require('express');
const cors = require("cors");
// const jwt = require('jsonwebtoken'); 
require('dotenv').config()
// const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



app.get('/', (req, res) => {
    res.send('EstateEcho Server  is open...')
  })
  
  app.listen(port, () => {
    console.log(`EstateEcho Server is open on port ${port}`)
  })