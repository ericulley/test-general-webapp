// Dependencies
const express = require('express');
const dotenv = require('dotenv');
const { auth } = require('express-openid-connect');
const jose = require('jose');

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
    baseURL: `http://localhost:${PORT}`,
    clientID: `${CLIENT_ID}`,
    clientSecret: `${CLIENT_SECRET}`,
    secret: `${SECRET}`,
    issuerBaseURL: `https://${C_DOMAIN}`,
    // auth0Logout: true, 
    // idpLogout: true,
    authorizationParams: {
      response_type: 'code',
      audience: `test-general-nodeAPI`,
      scope: 'openid email profile offline_access read:users',
    },
    routes: {
      login: false,
      // callback: '/callback'
    }, 
    session: {
      name: 'apple',
      absoluteDuration: 3,
      rollingDuration: 3
    }, 
    afterCallback: (req, res, session) => {
        const claims = jose.decodeJwt(session.id_token); // using jose library to decode JWT
        console.log("CLAIMS: ", claims);
        return session;
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