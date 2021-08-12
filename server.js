// Dependencies
const express = require('express');
const dotenv = require('dotenv');
const { auth } = require('express-openid-connect');

// Config
const app = express()
dotenv.config()
const PORT = process.env.PORT
const DOMAIN = process.env.AUTH0_DOMAIN
const CLIENT_ID = process.env.AUTH0_CLIENT_ID
const CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET


// Auth Config
const authConfig = {
    authRequired: false,
    auth0Logout: true,
    baseURL: 'http://localhost:3000',
    clientID: `${CLIENT_ID}`,
    issuerBaseURL: `https://${DOMAIN}`,
    secret: `${CLIENT_SECRET}`
  };
  

// Middleware
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(auth(authConfig))

// Controllers
const homeController = require('./controllers/home_controller.js')
app.use('/', homeController)

//Listener 
app.listen(PORT, () => {
    console.log('listening on port: ', PORT)
})