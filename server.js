// Importing the node libraries and other modules (files).
const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex')
const register = require('./controllers/register')
const signin = require ('./controllers/signin')
const image = require('./controllers/image')
const profile = require('./controllers/profile')

// We are making use of the Knew library to connect and talk to our postgreSQL
const db = knex({
  // Database information which was initially saved locally and saved in Heroku under the server code project 
  client: 'pg',
  connection: {
    // host : '127.0.0.1',
    // user : 'Adnan',
    // password : '',
    // database : 'face-finder-db'
    // connectionString: process.env.DATABASE_URL,
    // ssl: true,
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  }
});

// We will be using express.js and hence defining it here
const app = express();

app.use(cors())

// Sample end point if we try to reach the server url we get this response
app.get('/', (req, res)=> {
  res.send("It is working");
})

// signin is post request instead of get as we are sending a password hence we are using
//post to securely send password over the body. HTTPS helps us to securely send
//the password we then use hash in order hash it and save it in our db.

// The structure of Signin looks different from other methods as we are calling one function after another 
// if we open the signin module we can see that we first call the function with db, bcrypt and 
// once this functions runs the (res,req) function will be called 
app.post('/signin', signin.handleSignin(db, bcrypt))

// Here it is simple we call the function by passing in the params
app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)})

// in the front end in the fetch function we can specifiy the url as we like
app.get('/profile/:id', (req, res) => {profile.handleProfileGet(req, res, db)})

app.post('/imageurl', (req, res) => {image.handleImageApiCall(req, res)})

// put is used to update; on the frontend if clarify sends a positive response
// we then update the count/rank of the user and send the updated response
app.put('/image', (req, res) => {image.handleImage(req, res, db)
})

app.listen(process.env.PORT || 3000, ()=> {
  console.log(`app is running on port ${process.env.PORT}`);
})
