const express = require('express')
require("dotenv").config()

require('colors')
const connectDB = require('./db')

const app = express()

app.use(express.json())

const errorHandler = require('./middlewares/errorMiddleware')

const userRoutes = require('./routes/userRoutes')
const uploadRoutes = require('./routes/uploadRoutes')
const topicRoutes = require('./routes/topicRoutes')
const adminRoutes = require('./routes/adminRoutes')


app.use('/api/users', userRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/topics', topicRoutes)
app.use('/api/admin', adminRoutes)
// app.use('/api/phases',studentRoutes)

// error handling
app.use(errorHandler)

app.get('/', (req, res) => {
    res.send('API is running...')
})

connectDB()

const PORT = 3000 
    app.listen(PORT, () => {
        console.log(`Port connected: ${PORT}`.underline.cyan);
    })