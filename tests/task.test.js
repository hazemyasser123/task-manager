const Task= require('../src/models/task')
const request = require('supertest')
// const jwt = require('jsonwebtoken');
const app = require('../src/app.js');
// const mongoose = require('mongoose');
const {userOneId ,userOne , userTwo, userTwoId ,setupDB , taskOne } = require('./fixtures/db.js')

beforeEach(setupDB)


test('should create task for user' , async () => {
    const res=  await request(app)
    .post('/tasks')
    .set('Authorization' , `Bearer ${userOne.tokens[0].token}`)
    .send({
        description : 'This is a task from test',
        completed : true
    })
    .expect(201)
    // console.log(res.body._id)
    const task = await Task.findById(res.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toBe(true)
} )

test('should get all users tasks' , async () => {
    const res = await request(app)
    .get('/tasks')
    .set('Authorization' , `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(201)
    console.log(res.body.length)
})

test('should not be able to delete the task' , async () => {
    const res = await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set('Authorization' , `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404)

    const task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull()
    // console.log(res)
})