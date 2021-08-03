// Dependencies
const express = require('express');
const dotenv = require('dotenv');

// Config
const app = express()
dotenv.config()
const PORT = process.env.PORT

// Middleware
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))
app.use(express.json())

// Controllers
const indexController = require('./controllers/index_controller.js')
app.use('/', indexController)

//Listener 
app.listen(PORT, () => {
    console.log('listening on port: ', PORT)
})