//CRUD operations

// const mongodb = require('mongodb')
// const MongoClient = mongodb.MongoClient
// const ObjectID = mongodb.ObjectID
const {MongoClient , ObjectID} = require('mongodb')


const ConnectionURL = 'mongodb://localhost:27017'
const databaseName = 'task-manager'
// const id = new ObjectID()

// console.log(id)
// console.log(id.getTimestamp())

MongoClient.connect(ConnectionURL, {useNewUrlParser : true} , (error , client) => {
    if(error){
        return console.log('unable to connect')
    }
    console.log('connected succefully')
    
    const db = client.db(databaseName)
    
    
})
// db.collection('users').deleteOne({
//     age : 20
// }).then((res) => {
//     console.log(res)
// }).catch((err) => {
//     console.log(err)
// })
// db.collection('tasks').deleteOne({
//     description:"This is the first task"
// }).then((res) => {
//     console.log(res)
// }).catch((err) => {
//     console.log(err)
// })

// db.collection('users').updateOne({_id : new ObjectID('66a7e8d7b47cb26b6c1abc28')} , {
//     // $set: {
//     //     name : 'salem'
//     // }
//     $inc:{
//         age : 1
//     }
// }).then((resault) => {
//     console.log(resault)
// }).catch((error) => {
//     console.log(error)
// })
// db.collection('tasks').updateMany({completed : false} ,
//     {
//         $set: {
//             completed : true
//         }
//     }
// ).then((res) => {
//     console.log(res)
// }).catch((error) => {
//     console.log(error)
// }) 
// db.collection('users').findOne({name : 'Hazem'} , (error , resault) => {
//     if(error){
//         return console.log('no user by this name is found')
//     }
//     console.log(resault)
// })
// db.collection('users').find({name : 'Hazem'}).toArray((error , users) => {
//     if(error) {
//         return console.log("couldn't find any users")
//     }
//     console.log(users)
// })

// db.collection('tasks').findOne({_id : new ObjectID('66a7ee38109d185fb0c8db6f')} , (error ,resault) => {
//     if(error){
//         return console.log("could't find the task")
//     }
//     console.log(resault)
// })

// db.collection('tasks').find({completed : false}).toArray((error , users) => {
//     if(error){
//         return console.log("could't find the task")
//     }
//     console.log(users)
// })
    
    
    
    
    
    
    
    // db.collection('users').insertOne({
    //     _id : id,
    //     name : "zuma",
    //     age : 30,

    // } , (error , resault) => {
    //     if(error) {
    //         console.log("could't insert user")
    //     }
        
    //         console.log(resault.ops)
    // })

    // })
    // console.log('done')
    // db.collection('users').insertMany([
    //     {
    //         name : "ammar",
    //         age:24
    //     },
    //     {
    //         name : "yasser",
    //         age:50
    //     }

    // ] , (error , resault) =>{
    //     if(error) {
    //         return console.log("couldn't insert users")
    //     }
    //     console.log(resault.ops)
    // } )

    // db.collection('tasks').insertMany([
    //     {
    //         description : 'This is the first task',
    //         completed : true
    //     },
    //     {
    //         description : 'This is the secound task',
    //         completed : false
    //     },
    //     {
    //         description : 'This is the third task',
    //         completed : true
    //     }
    // ] , (error , resault) => {
    //     if(error){
    //         return console.log("couldn't insert tasks")
    //     }

    //     console.log(resault.ops)