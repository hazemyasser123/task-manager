// const request = require('supertest');
const jwt = require('jsonwebtoken');
// const app = require('../src/app.js');
const User = require('../../src/models/user.js')
const mongoose = require('mongoose');
const Task = require('../../src/models/task.js')

const userOneId = new mongoose.Types.ObjectId();

const userOne = {
    _id : userOneId,
    name: 'hazem',
    email : 'hazemyasser6@gmail.com',
    password : 'hazemyasser-123',
    age : 20,
    tokens : [{
        token : jwt.sign({_id : userOneId }, process.env.JWT_SECRET)
    }]
}
const userTwoId = new mongoose.Types.ObjectId();

const userTwo = {
    _id : userTwoId,
    name: 'hazem yasser',
    email : 'hazemyasser69@gmail.com',
    password : 'hazemyasser-123',
    age : 24,
    tokens : [{
        token : jwt.sign({_id : userTwoId }, process.env.JWT_SECRET)
    }]
}

const taskOne = {
    _id : new mongoose.Types.ObjectId(),
    description : 'First Task for userOne',
    owner : userOneId,
    completed : false
}

const taskTwo = {
    _id : new mongoose.Types.ObjectId(),
    description : 'First Task for userTwo',
    owner : userTwoId,
    completed : true
}

const taskThree = {
    _id : new mongoose.Types.ObjectId(),
    description : 'secound Task for userOne',
    owner : userOneId,
    completed : true
}

const setupDB = async () => {
    await User.deleteMany();
    await Task.deleteMany();
    // await Task.deleteMany();
    await new User(userOne).save()
    await new User(userTwo).save()

    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}

module.exports = {
    userOneId,
    userOne,
    userTwo,
    userTwoId,
    setupDB,
    taskOne
}