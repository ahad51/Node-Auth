const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv =require('dotenv')
const authRoute = require('./routes/auth');
const postRoute=require('./routes/post');

dotenv.config();    

async function connectToDatabase() {
  try {
    await mongoose.connect(
      process.env.DB_CONNECT,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log('Connected to Db');
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
}   
connectToDatabase();

app.use(express.json());
app.use('/api/posts',postRoute)

app.use('/api/user', authRoute);

app.listen(3000, () => console.log('Server up and running'));
