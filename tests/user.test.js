const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../src/app.js');
const User = require('../src/models/user.js')
const mongoose = require('mongoose');
const {userOneId,userOne ,setupDB} = require('./fixtures/db.js')


// const userOneId = new mongoose.Types.ObjectId();

// const userOne = {
//     _id : userOneId,
//     name: 'hazem',
//     email : 'hazemyasser6@gmail.com',
//     password : 'hazemyasser-123',
//     age : 20,
//     tokens : [{
//         token : jwt.sign({_id : userOneId }, process.env.JWT_SECRET)
//     }]
// }

beforeEach(setupDB)

// we don't need it but it is there 😊😊
// afterEach(() => {
//     console.log('afterEach')
// })

test('Should signup a new user', async () => {
    const res = await request(app).post('/users').send({
        name: 'Andrew',
        email: 'andrew@example.com',
        password: 'MyPass777!'
    }).expect(201)

    // console.log(res.user)
    const user =  await User.findById(res.body.user._id)
    // console.log(user)
    expect(user).not.toBeNull()

    // expect(res.body.user.name).toBe('Andrew')
    expect(res.body).toMatchObject({
        user : {
            name: 'Andrew',
            email: 'andrew@example.com',
        },
        token: user.tokens[0].token
    })

    expect(user.password).not.toBe('MyPass777!')

})

test("this should logout the user" , async () => {
    const user = await User.findById(userOne._id)
    expect(user).not.toBeNull();
    
    const res = await request(app)
    .post('/users/logout')
    .set('Authorization' , `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

    const Checkinguser = await User.findById(userOne._id)
    expect(user).not.toBeNull();
    const LeavingToken = Checkinguser.tokens[0];
    console.log(LeavingToken)
    expect(LeavingToken).toBe(undefined)
})

test('should login existing user' , async () => {
    const res = await request(app).post('/users/login').send({
        email : userOne.email,
        password : userOne.password
    }).expect(200)

    const user = await User.findById(userOneId)

    // expect(res.body).toMatchObject({
    //     user : user,
    //     token : user.tokens[1].token
    // })
    expect(res.body.token).toBe(user.tokens[1].token)

    // console.log(res.body.token)
    // console.log(user.tokens[1].token)
})

test("shouldn't login this user" , async () => {
    await request(app).post('/users/login').send({
        email: 'hazemyasser6@gmail.com',
        password : 'hazemyasser/123'
    }).expect(400)
})

test("should get profile for user" , async () => {
    await request(app)
    .get('/users/me')
    .set('Authorization' , `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})

test("should not get profile for unauth users" , async () => {
    await request(app)
    .get('/users/me')
    .set('Authorization' , `Bearer nkjnk`)
    .send()
    .expect(401)
})

test('should delete account for user', async () => {
    const res = await request(app)
    .delete('/users/deleteme')
    .set('Authorization' , `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
    
    // console.log(res.body)
    const user = await User.findById(userOneId)

    expect(user).toBeNull()
})

test('should not delete account for user' , async () => {
    await request(app)
    .delete('/users/deleteme')
    .set('Authorization' , `Bearer  skneaknsfkl/e}`)
    .send()
    .expect(401)
})

test('should upload an avatar image', async () => {
    await request(app)
    .post('/users/me/avatar')
    .set('Authorization' , `Bearer ${userOne.tokens[0].token}`)
    .attach('avatar' , 'tests/fixtures/profile-pic.jpg')
    .send()
    .expect(200)

    const user = await User.findById(userOneId);
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('updatin user data' , async () => {
    await request(app)
    .patch('/users/updateme')
    .set('Authorization' , `Bearer ${userOne.tokens[0].token}`)
    .send({name : 'zuma'})
    .expect(200)

    const user = await User.findById(userOneId)
    expect(user.name).toEqual('zuma')
})

test("this will not update the data" , async () => {
    await request(app)
    .patch('/users/updateme')
    .set('Authorization' , `Bearer ${userOne.tokens[0].token}`)
    .send({location : 'cairo'})
    .expect(400)
})
