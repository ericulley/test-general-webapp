// Dependencies
const express = require('express');
const home = express.Router()
const { requiresAuth } = require('express-openid-connect');

// Routes
home.get('/', (req, res) => {
    res.render('index.ejs', {
        userInfo: req.oidc.user,
        isAuthenticated: req.oidc.isAuthenticated(),
        idToken: req.oidc.idTokenClaims,
    })
})

home.get('/requires-auth', requiresAuth(), (req, res) => {
    res.send("!!!This page requires authorization because it stores super secret info!!!")
})

// Export Router
module.exports = home