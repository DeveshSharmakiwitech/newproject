// import express from "express";
// import UserModel from "./model/UserModel"

const express = require('express')
const StudentModel = require('../model/user.model')
const router = express.Router();

router.post('/user/create',async(req,res)=>{
    const user = new StudentModel(req.body)        
    try{
        await user.save();
        res.status(200).send(user);
    }catch(err){
        res.status(404).send(err);
    }
})

router.post('/user/login',async(req,res)=>{
    try{
        const user = await StudentModel.findByCredidential(req.body.rollNumber,req.body.password)
        req.send(user)

    }catch(err){
        res.status(400).send(err)
    }
})

router.get('/user/read/:_id',async(req,res)=>{
    const _id = req.params._id;
    
    try{
        const user = await StudentModel.findById(_id)

        if(!user){
            throw new Error('User not Found')
        }

        res.status(200).send(user)

    }catch(err){
        res.status(400).send(err)
    }
})

router.patch('/user/update/:_id',async(req,res)=>{

    const update = Object.keys(req.body);
    const allowedUpdates = ['name','email','password','address'];
    const isValidOperation=update.every((update)=>allowedUpdates.includes(update))

    if(!isValidOperation){
        res.status(400).send({error:'Invalid Update'})
    }

    try{

        const user = await StudentModel.findById(req.params._id)
        update.forEach((update)=>user[update]=req.body[update])
        
        await user.save()

        if(!user){
            throw new Error('User not Found')
        }

        res.status(200).send(user)
    }catch(err){
        res.status(500).send(err)
    }
})

router.delete('/user/delete/:_id', async(req,res)=>{
    try{
        const user = await StudentModel.findByIdAndDelete(req.params._id)
       
        if(!user){
            throw new Error('User not Found')
        }

        res.send(user)

    }catch(err){
        res.status(400).send(err)
    }
})

module.exports = router;