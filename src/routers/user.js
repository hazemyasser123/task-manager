const express  = require("express");
const multer = require('multer')
const sharp = require('sharp')
const User = require('../models/user')
const router = new express.Router()
const jwt = require('jsonwebtoken')
const auth = require('../middleware/auth');
const {sendWelcomeEmail, sendCancelEmail} = require('../emails/account')
// const { Error } = require("mongoose");

//To login a user
router.post('/users/login' , async (req , res) => {
    try {
        const user = await User.findByCredentials(req.body.email , req.body.password);
        const token = await user.generateAuthToken()
        res.send({user , token})
    } catch (error) {
        res.status(400).send(error)
    } 
})

// signup a user
router.post('/users' , async (req , res) => {
    const user = new User(req.body)
    try {
        await user.save()
        sendWelcomeEmail(user.email , user.name);
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (error) {
        res.status(400).send(error)
        console.log("Couldn't add user: " + error )
    }
})

//logging out All
router.post('/users/logoutall' , auth , async (req , res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send({
            msg : 'Done All is removed'
        })
    } catch (error) {
        res.status(500).send(error)
    }
})

//logging out
router.post('/users/logout' , auth , async (req , res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save();
        res.send()
    } catch (error) {
        res.status(500).send(error)
    }
})

// Deleting a user
router.delete('/users/deleteme' ,auth , async (req , res) => {
    try {
        // const user = await User.findByIdAndDelete(req.user._id);
        // console.log(await req.user.remove())
        await req.user.deleteOne();
        sendCancelEmail(req.user.email , req.user.name)
        res.send(req.user)
    } catch (error) {
        res.status(500).send(error)
    }
})

//updating a user Data
router.patch('/users/updateme',auth , async (req , res) => {
    const updates = Object.keys(req.body)
    const AllowedUpdates = ['name' , 'email' , 'password' , 'age']
    const isValidOperation = updates.every((update) => {
        return AllowedUpdates.includes(update)
    })

    if(!isValidOperation){
        return res.status(400).send({error : 'Invalid Updates'})
    }

    try {
        // const user = await User.findById(req.user._id)
        updates.forEach((update) =>  req.user[update] = req.body[update])
        await req.user.save()

        // const user = await User.findByIdAndUpdate(req.params.id ,req.body,{new : true , runValidators : true} )
        // if(!user){
        //     return res.status(404).send()
        // }
        res.send(req.user)

    } catch (error) {
        res.status(500).send(error)
    }
})

//Getting my profile
router.get('/users/me' , auth , async (req , res) => {
    
    // try {
    //     const Find = await User.find()
    //     res.send(Find)
    // } catch (error) {
    //     res.status(500).send(error)
    // }    
    res.send(req.user)
}) 

const upload = multer({
    // dest : 'avatars',
    limits : {
        fileSize : 1000000
    },
    fileFilter(req , file , cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)/)){
            return cb(new Error("the file must be an image with extinsions (jpg or jpeg or png) only"))
        }
        cb(undefined , true)
    }
})



// uploading my avatar
router.post('/users/me/avatar', auth ,upload.single('avatar') ,async (req , res) => {
    // console.log(req.file)    
    const buffer = await sharp(req.file.buffer).resize({width : 250 , height : 250}).png().toBuffer();
    req.user.avatar = buffer
    await req.user.save();
    res.send({msg : 'image is uploaded'})
}, (error , req ,res , next) => {
    res.status(400).send({error : error.message})
})


// deleting my avatar
router.delete('/users/me/avatar' , auth , async (req , res) => {
    try {
        req.user.avatar = undefined;
        await req.user.save();
        res.send({msg : 'image is deleted'})

    } catch (error) {
    res.status(500).send(error)
        
    }
})

// getting my avatar
router.get('/users/:id/avatar' , async (req , res) => {
    try {
        const user = await User.findById(req.params.id);
        if(!user || !user.avatar){
            throw new Error("user or avatar can't be found")
        }
        res.set('Content-Type' , 'image/png')
        res.send(user.avatar)
        // console.log(user.avatar)
    } catch (error) {
        res.status(404).send(error)
    }
})



// limits : {
//     fileSize : 1000000
// },
// fileFilter(req , file , cb){
//     if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
//         return cb(new Error("the file must be an image with extinsions (jpg or jpeg or png) only"))
//     }
//     cb(undefined , true)
// }


// //Getting for a user using ID
// router.get('/users/:id' , async (req , res) => {
//     try {
//         const SingleUser = await User.findById(req.params.id)
//         if(!SingleUser){
//             return res.status(404).send()
//         }
//         res.send(SingleUser)
//     } catch (error) {
//         res.status(500).send(error)
//     }

// })


module.exports = router