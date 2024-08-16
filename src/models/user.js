const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const Task = require('../models/task')

const userSchema = new mongoose.Schema( {
    name : {
        type: String,
        required : true,
        trim :true
    },
    password : {
        type : String,
        required : true,
        trim : true,
        minLength: [6, 'Password must be 6 chars or greater'],
        validate(value){
            if(validator.contains(value.toLowerCase() , 'password') === true ){
                throw new Error("password can't contain password")
            }
        }
    },
    email : {
        type : String,
        required : true,
        trim :true,
        unique : true,
        lowercase : true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('invalid Email')
            }
        }
    },
    age : {
        type: Number,
        // required : true,
        default : 0,
        validate(value) {
            if(value < 0){
                throw new Error('Age must be a postive number')
            }
        }
    },
    tokens: [{
        token:{
            type: String,
            required : true
        }
    }],
    avatar : {
        type : Buffer
    } 
} , {
    timestamps: true
})

userSchema.virtual('tasks' , {
    ref : 'Task',
    localField : '_id',
    foreignField : 'owner'
})

//statics are used on the model itself
userSchema.statics.findByCredentials = async (email , password) => {
    const user = await User.findOne({email : email})
    if(!user){
        throw new Error("unable to login")
    }
    const isMatch = await bcrypt.compare(password , user.password)
    if(!isMatch){
        throw new Error("unable to login");
        
    }
    return user
}

userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens; 
    delete userObject.avatar;

    return userObject;
}

//methods are acssesible on instance of the object
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({_id : user._id.toString()} , process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({token : token})
    await user.save()
    return token
}


//hash the plain text password before saving
userSchema.pre('save' , async function (next) {
    const user = this;
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password , 8) 
    }

    next()
})

//
userSchema.pre('deleteOne' , { document: true, query: false } , async function (next) {
    const user = this;
    await Task.deleteMany({owner : user._id})
    console.log('Tasks are deleted')
    next()
})

const User = mongoose.model('User' ,userSchema)


module.exports = User
