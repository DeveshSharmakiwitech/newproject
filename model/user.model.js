// import mongoose from "mongoose";
// import validator from "validator"

const mongoose= require('mongoose')
const { stringify } = require('nodemon/lib/utils')
const validator = require('validator')

studentSchema=new mongoose.Schema({
    name:{
        type:String,
        require:true,
        trim:true
    },
    email:{
        type:String,
        require:true,
        trim:true,
        unique:1,
        validate(value){
            if(validator.isEmpty(value)){
                throw new Error('Enter the Email')
            }
            else if(!validator.isEmail(value)){
                throw new Error('Invalid Email')
            }
        }
    },
    password:{
        type:String,
        require:true,
        trim:true,
        minlength:7,
        maxlength:15,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error('Enter Strong Password')
            }
        }
    },
    rollNumber:{
        type:Number,
        require:true,
        // trim:true,
        unique:true,
        validate(value){
            if(!value){
                return Error()
            }
        }
    },
    address:{
        type:String,
        require:true,
        trim:true
    },
    tokens:[{
        token:{
            type:String,
            require:true
        }
    }]
},{
    timestamps:true
})

const StudentModel=new mongoose.model('students',studentSchema)

module.exports=StudentModel