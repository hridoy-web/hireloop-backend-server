// express server create
const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()
const port = process.env.PORT

// middleware
app.use(cors())
app.use(express.json())


// route create 
app.get('/', (req, res) => {
    res.send('HireLoop - Backend Server is runing Good')
})

// server start
app.listen(port, () => {
    console.log(`Server is runing on ${port} Port`);
})