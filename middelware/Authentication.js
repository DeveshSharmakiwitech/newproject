const express = require('express');
const jwt = require('jsonwebtoken');
const StudentModel = require('../model/user.model')


const Auth = async (req,res,next)=>{
    try{
    const token = req.header('Authorization').replace('Bearer ', '')
    // console.log('this is token :-'+token)
    if(!token){
        console.log('token incorrect!')
    }
    const tokenVerify = jwt.verify(token,process.env.Secret_Key);
    const user = await StudentModel.findOne({ _id : tokenVerify._id , tokens:{$elemMatch:{token:token} }})
   
    if(!user){
      return  res.status(400).send({message:'User not found',status:400})
    }

    req.token = token
    req.user = user


    next()
}catch(err){
  
   return res.status(401).send({message:'Unauthorized token', status:401})
}
}

module.exports = Auth;