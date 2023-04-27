const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log('connected to mongoDB'.underline.yellow)
    } catch (err) {
        console.log(err)
        process.exit(1)
    }
}
mongoose.connection.on("error", err => {
    console.log(err)
})

module.exports = connectDB