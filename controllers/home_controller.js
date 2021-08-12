// Dependencies
const express = require('express');
const home = express.Router()
const { requiresAuth } = require('express-openid-connect');

// Routes
home.get('/', (req, res) => {
    res.render('index.ejs', {
        userInfo: req.oidc.user,
        isAuthenticated: req.oidc.isAuthenticated(),
    })
})

home.get('/status', requiresAuth(), (req, res) => {
    res.send("This is the status page, super secret info")
})

// Export Router
module.exports = home