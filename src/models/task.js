const mongoose = require('mongoose')


const TaskScehma = new mongoose.Schema({
    description : {
        type : String,
        required : true,
        trim : true
    },
    completed : {
        type : Boolean,
        default : false
    },
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'User'
    }
},{
    timestamps : true
})


// const NewTask = new Task({
//     description : 'this is the sixth task ',
//     completed : true
// })

// NewTask.save().then(() => {
    //     console.log(NewTask)
    // }).catch((error) => {
        //     console.log(error)
        // })
        
const Task = mongoose.model('Task' ,TaskScehma)
module.exports = Task