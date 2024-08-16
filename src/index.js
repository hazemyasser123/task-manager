const express = require('express');
require('./db/mongoose')
const userrouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express();
const Port = process.env.PORT;

// app.use((req , res , next) => {
//     // console.log(req.method , req.path)
//     // next()
//     if(req.method === 'GET'){
//         res.send("Get request is disabled")
//     } else{
//         next()
        
//     }
// })

// app.use((req , res , next) => {
//         res.status(503).send("The service is under maintainance")
// })



app.use(express.json());
app.use(userrouter)
app.use(taskRouter)

app.listen(Port , () => {
    console.log("server is up and running on port " + Port)
    
})






// const multer = require('multer')
// const upload = multer({
//     dest : 'images',
//     limits : {
//         fileSize : 1000000 
//     },
//     fileFilter(req , file , cb) {
//         if(!file.originalname.match(/\.(doc|docx)$/)){
//             return cb(new Error('File must be a Word document'))
//         }

//         cb(undefined,true)
        
//         // cb(new Error('File must be a PDF'))
//         // cb(undefined,true)
//         // cb(undefined,false)
//     }
// });

// app.post('/upload',upload.single('upload') , (req , res) => {
//     res.send({msg : 'done'});
// })


/*************************************************************** */

// const Task = require('./models/task')
// const User = require('./models/user')
// const main = async () => {
        // const task = await Task.findById('66bcbc71e966b8a89c978b12');
        // console.log(task.owner)
        // await task.populate('owner')
        // console.log(task.owner)
        
    
    //     const user = await User.findById('66bcbb28bf086fd90a0a7136')
    //     await user.populate('tasks')
    //     console.log(user.tasks)
    //     console.log(user.tasks)
    
    
    //     // const user = await User.findById(task.owner)
    //     // console.log(user)
    // }
    
    // main()
/*************************************************************** */
    
// const pet = {
//     name : "hal"
// }

// pet.toJSON = function () {
//     // console.log(this);
//     // return this
//     return {}
// }

// console.log(JSON.stringify(pet))

// const bcrypt = require('bcryptjs')
// const jwt = require('jsonwebtoken')

// const myFunc = async () => {
//     const token = jwt.sign({_id : 'abc123'} , 'thisiszumabeehinhere' , {expiresIn : '2 days'})
//     console.log(token)

//     const data = jwt.verify(token , 'thisiszumabeehinhere')
//     console.log(data)
// }

// myFunc();    