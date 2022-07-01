// import mongoose from "mongoose";
// import validator from "validator"

const res = require('express/lib/response')
const mongoose= require('mongoose')
const { stringify } = require('nodemon/lib/utils')
const validator = require('validator')
const jwt = require('jsonwebtoken')

/**
 * @swagger
 * definitions:
 *   UserCreate:
 *     properties:
 *       name:
 *        type: string
 *       email:
 *         type: string
 *       password:
 *         type: string
 *       rollNumber:
 *          type: number
 *       address:
 *          type: string
 */

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
        unique:true,
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
    otp : {
        type : Number,
        require:true
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

studentSchema.methods.generateNewToken = async function(){
    try{ 
        const user = this
        const token = jwt.sign({ _id:user._id.toString() }, process.env.Secret_Key);
        user.tokens = user.tokens.concat({token})
        await user.save();
        return token

    }catch(err){
           console.log(err)
           res.send({message : "the error part of generate token " + err});
    }
}

const StudentModel=new mongoose.model('students',studentSchema)




module.exports=StudentModel