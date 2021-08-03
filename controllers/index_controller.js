// Dependencies
const express = require('express');
const index = express.Router()

// Routes
index.get('/', (req, res) => {
    res.send("Controller works, Web App Home Page")
})

// Export Router
module.exports = index