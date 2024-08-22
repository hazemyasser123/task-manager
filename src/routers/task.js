const express = require('express')
const Task = require('../models/task')
const router = new express.Router();
const auth = require('../middleware/auth')


//updating a task
router.patch('/tasks/:id' , auth , async (req , res) => {
    const updates = ['completed' , 'description'];
    const ParameterToBeUpdated = Object.keys(req.body);
    const isValidOperation = ParameterToBeUpdated.every((update) => {
        return updates.includes(update)
    })
    if(!isValidOperation){
        return res.status(400).send({error : 'Invalid Updates'})
    }
    try {
        const task = await Task.findOne({ _id : req.params.id , owner : req.user._id})
        if(!task){
            return res.status(404).send()
        } 
        
        ParameterToBeUpdated.forEach( (param) => task[param] = req.body[param])
        await task.save();
        // const task = await Task.findByIdAndUpdate(req.params.id , req.body , {new : true , runValidators : true})
        res.send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})


//Getting a task using ID
router.get('/tasks/:id' ,auth , async (req , res) => {
    try {
        const task = await Task.findOne({ _id : req.params.id , owner : req.user._id})

        if(!task){
            return res.status(404).send()
        }

        res.send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})

//Getting   /tasks?completed=(true or false)
// GET /tasks?limit=50&skip=0
// GET /tasks?sortBy=createtAt_desc
//limit skip
router.get('/tasks' ,auth ,async (req , res) => {
    const match = {}
    const sort = {}
    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }

    if(req.query.sortBy){
        const parts = req.query.sortBy.split('_');
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;  
    }

    try {
        await req.user.populate({
            path : 'tasks',
            match,
            options :{
                limit : parseInt(req.query.limit),
                skip : parseInt(req.query.skip),
                sort
            }
        })
        res.status(201).send(req.user.tasks)
    } catch (error) {
        res.status(500).send(error)
    }
})

//Adding a new task
router.post('/tasks' ,auth , async (req , res) => {
    // const NewTask =  new Task(req.body);
    const NewTask = new Task({
        ...req.body,
        owner : req.user._id
    })
    try {
        await NewTask.save()
        res.status(201).send(NewTask)
        console.log('New Task Added')
    } catch (error) {
        res.status(400).send(error)
    } 
})

//deleting a Task
router.delete('/tasks/:id', auth , async (req , res) => {
    try {
        const task = await Task.findOneAndDelete({_id : req.params.id , owner : req.user._id} )
        if(!task){
            return res.status(404).send();
        }
        res.send(task);
    } catch (error) {
        res.status(500).send(error)
    }
})



module.exports = router