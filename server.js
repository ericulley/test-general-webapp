// Dependencies
const express = require('express');
const dotenv = require('dotenv');
const { auth } = require('express-openid-connect');

// Config
const app = express()
dotenv.config()
const PORT = process.env.PORT
const DOMAIN = process.env.AUTH0_DOMAIN
const C_DOMAIN = process.env.AUTH0_C_DOMAIN
const CLIENT_ID = process.env.AUTH0_CLIENT_ID
const CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET
const SECRET = process.env.AUTH0_SECRET


// Auth Config
const authConfig = {
    authRequired: false,
    auth0Logout: true,
    baseURL: 'http://localhost:3000',
    clientID: `${CLIENT_ID}`,
    clientSecret: `${CLIENT_SECRET}`,
    secret: `${SECRET}`,
    issuerBaseURL: `https://${C_DOMAIN}`,
    authorizationParams: {
      response_type: 'code id_token',
      audience: `https://${DOMAIN}/api/v2/`,
      scope: 'openid profile email read:secret',
    }
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