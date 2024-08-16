const mongoose = require('mongoose')


mongoose.connect(process.env.MONGODB_URL).then(() => {
    console.log('connected to database')
}).catch((error) => {
    console.log("couldn't connect due to: " + error)
})



