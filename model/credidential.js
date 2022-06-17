const express = require('express')
const bcrypt = require('bcryptjs')
const StudentModel = require('./user.model')

const credential = StudentModel.statics.findByCredidential = async(rollNumber,password) =>{
    const user = await StudentModel.findOne({email});

    if(!user){
        throw new Error('Unable to login');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
        throw new Error('Unable to login')
    }

    return user
}

//hash the plain text password before saving

StudentModel.pre('save', async function(next){
    const user=this

    if(user.isModified('password')){
        user.password=await bcrypt.hash(user.password, 8)
    }

    next()
})

module.exports = Credential
