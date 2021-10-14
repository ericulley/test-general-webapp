// Dependencies
const express = require('express');
const home = express.Router()
const axios = require('axios').default
require('dotenv').config
const { requiresAuth } = require('express-openid-connect');

const DOMAIN = process.env.AUTH0_DOMAIN
const C_DOMAIN = process.env.AUTH0_C_DOMAIN
const CLIENT_ID = process.env.AUTH0_CLIENT_ID
const CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET

let loginAT 

// Routes
home.get('/', (req, res) => {
    console.log("Line 17: ", req.oidc.idTokenClaims)
    console.log("Line 18", req.oidc.accessToken)
    loginAT = req.oidc.accessToken
    if(req.oidc) {
        res.render('index.ejs', {
            userInfo: req.oidc.user,
            isAuthenticated: req.oidc.isAuthenticated(),
            idToken: req.oidc.idTokenClaims,
        })
    } else {
        res.render('index.ejs', {
            userInfo: null,
            isAuthenticated: null,
            idToken: null,
        })
    }
    
})

home.get('/error', (req, res) => {
    res.send("Error: Please verify your email before logging ing. Thank you.")
})

home.get('/requires-auth', requiresAuth(), (req, res) => {
    res.send("!!!This page requires authorization because it stores super secret info!!!")
})

home.get('/userinfo', requiresAuth(), (req, res) => {
    console.log("/userinfo: ", req.oidc.accessToken.access_token)
      
    axios.get(`https://${C_DOMAIN}/userinfo`, {
        headers: {'authorization': `${req.oidc.accessToken.token_type} ${req.oidc.accessToken.access_token}`}
    }).then((res) => {
        console.log("RESPONSE: ", res.data)
    }).catch((err) => {
        // console.log(err)
    })

    res.send("!!!!CHECK CONSOLE FOR RESPONSE!!!!")
})

home.get('/mgmt-api', requiresAuth(), (req, res) => {

    let options = {
        method: 'POST',
        url: `https://${DOMAIN}/oauth/token`,
        headers: {'content-type': 'application/json'},
        data: {
          grant_type: 'client_credentials',
          client_id: `${CLIENT_ID}`,
          client_secret: `${CLIENT_SECRET}`,
          audience: `https://${DOMAIN}/api/v2/`
        }
      };
      
      axios.request(options).then((res) => {
            console.log(res.data)
        }).catch((error) => {
        console.log("ERRRRORRRR: ", error);
      });

 
    // axios.post(`https://${DOMAIN}/oauth/token`, {
    //     grant_type: 'client_credentials',
    //     client_id: `${CLIENT_ID}`,
    //     client_secret: `${CLIENT_SECRET}`,
    //     audience: `https://${DOMAIN}/api/v2/`
    // }, {
    //     headers: {
    //         'content-type': 'application/x-www-form-urlencoded', 
    //     }
    // }).then((res) => {
    //     console.log(res.data)
    // }).catch((err) => {
    //     console.error(err.message)
    // })


    // axios.get(`https://${DOMAIN}/api/v2/users`, {
    //     headers: {
    //         Authorization: `${token_type} ${access_token}`,
    //     }
    // }).then((res) => {
    //     console.log(res)
    // }).catch((err) => {
    //     console.log(err.message)
    // })
    res.send("!!!Check Console to Confirm Response!!!")
})

// Export Router
module.exports = home