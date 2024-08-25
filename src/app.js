const express = require('express');
const path = require('path')
require('./db/mongoose')
const userrouter = require('./routers/user')
const taskRouter = require('./routers/task')
const publicDirectoryPath = path.join(__dirname , '../public')

const app = express();
// const Port = process.env.PORT;


app.use(express.json());
app.use(express.static(publicDirectoryPath))

app.use(userrouter)
app.use(taskRouter)

// app.listen(Port , () => {
//     console.log("server is up and running on port " + Port)
    
// })

module.exports = app
