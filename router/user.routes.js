// import express from "express";
// import UserModel from "./model/UserModel"
//qajdl

const express = require('express')
const StudentModel = require('../model/user.model')
const router = express.Router();
const jwt = require("jsonwebtoken")
const Auth = require('../middelware/Authentication');
const { body, validationResult } = require('express-validator')
const { send, clearCookie } = require('express/lib/response');
const swaggerUi = require('swagger-ui-express')
const swaggerSpecs = require('../swagger')

router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs))

/**
 * @swagger
 * /user/create:
 *   post:
 *     description:  create users.
 *     summary: create student profile.
 *     operationId: create_user
 *     tags:
 *     - MainData
 *     parameters:
 *       - name: name
 *         description: name of the student.
 *         required: true
 *         in: formData
 *         type: string
 *       - name: email
 *         description: email of the student.
 *         required: true
 *         in: formData
 *         type: string
 *       - name: password
 *         description: student password.
 *         required: true
 *         in: formData
 *         type: string
 *       - name: rollNumber
 *         description: roll number of student.
 *         required: true
 *         in: formData
 *         type: number
 *       - name: address
 *         description: student address.
 *         required: false
 *         in: formData
 *         type: string
 *     responses:
 *       200:
 *         description: Add or update student profile
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: 'Success'
 *       404:
 *         description: Unprocessable Entity
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: false
 *               example: true
 *             message:
 *               type: string
 *               example: The request was unacceptable, often due to missing a required parameter.
 */


router.post('/user/create',async(req,res)=>{
    
    const user = new StudentModel(req.body);       
    try{ 
        
        const token = await user.generateNewToken()
        await user.save();
        res.status(200).send({message:'user signup successfully', data:user, status:200});
    }catch(err){
        
        res.status(404).send({message:'This email id / roll no. is already register!', data:null ,status:404});
    }
})

/**
 * @swagger
 * tags:
 *  name: MainData
 * /user/login:
 *  post:
 *      tags: [MainData]
 *      description: Login user
 *      operationId: login User
 *      summary: login student by roll num
 *      parameters:
 *       - name: rollNumber
 *         description: Student rollNumber.
 *         required: true
 *         in: formData
 *         type: string
 *       - name: password
 *         description: Student Password.
 *         required: true
 *         in: formData
 *         type: string
 *      responses:
 *       200:
 *         description: Login Student profile
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: 'Success'
 *       404:
 *         description: Unprocessable Entity
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: false
 *               example: true
 *             message:
 *               type: string
 *               example: The request was unacceptable, often due to unCorrect a required parameter.
 */

router.post('/user/login',async(req,res)=>{
    try{
        
        const user = await StudentModel.findOne({rollNumber:req.body.rollNumber})
        const token = await user.generateNewToken()
        if(!user){
           return res.status(401).send({msg:'user does not exit',status:401})
        }
        const passwordaccess = user.password==req.body.password
        if(!passwordaccess){
            return res.status(400).send({msg:'password not match',status:400})
        }else{
           return  res.status(200).send({msg:'login successful',data:user,status:200})
        }

    }catch(err){
        return res.status(400).send({message:'Enter the correct credidentials', data:null, status : 400 })
    }
})

/**
 * @swagger
 * /user/loginbyotp:
 *   post:
 *     description:  student login by OTP.
 *     summary: student login by OTP
 *     operationId: OTP_login
 *     tags:
 *     - MainData
 *     parameters:
 *       - name: rollNumber
 *         description: roll number of Student.
 *         required: true
 *         in: formData
 *         type: number
 *     responses:
 *       200:
 *         description: OTP send to email
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: 'Success'
 *       404:
 *         description: Unprocessable Entity
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: false
 *               example: true
 *             message:
 *               type: string
 *               example: The request was unacceptable, often due to missing email required.
 */


router.post('/user/loginbyotp',async(req,res)=>{
    try{
        const user = await StudentModel.findOne({rollNumber:req.body.rollNumber})

        if(!user){
           return res.status(401).send({msg:'user does not exit',status:401})
        }

        const otp = await Math.floor((Math.random()*10000)+1)

        await user.updateOne({otp : otp })
        await user.save()
        console.log('OTP IS ',otp)

           return  res.status(200).send({msg:'OTP has been send successfully',status:200})

    }catch(err){
        return res.status(400).send({message:'Enter the correct credidentials', status : 400 })
    }
})

/**
 * @swagger
 * /user/verifyotpforlogin:
 *   post:
 *     description:  student OTP verify.
 *     summary: student OTP verify
 *     operationId: OTP_verify
 *     tags:
 *     - MainData
 *     parameters:
 *       - name: otp
 *         description: Enter otp.
 *         required: true
 *         in: formData
 *         type: number
 *     responses:
 *       200:
 *         description: OTP verify Successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: 'Success'
 *       404:
 *         description: Unprocessable Entity
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: false
 *               example: true
 *             message:
 *               type: string
 *               example: The request was unacceptable, often due to missing/ incorrect OTP required.
 */

router.post('/user/verifyotpforlogin',async(req,res)=>{
    try{

      

        if(!verifyotp){
            return res.status(400).send({message:'Enter the otp', status : 400 })

        }
        const user = await StudentModel.findOne({otp:verifyotp})
        console.log('verify user =>',user)
        if(!user){
           return res.status(401).send({msg:'Enter the correct otp',status:401})
        }

        await user.updateOne({
            otp :''
        })
        await user.save()


           return  res.status(200).send({msg:'OTP verify successfully',data : user,status:200})

    }catch(err){
        console.log(err)
        return res.status(400).send({message:'OTP is not verify', status : 400 })
    }
})

/**
 * @swagger
 * /user/logout:
 *   post:
 *     description:  logout student Profile.
 *     summary: logout Student Profile by Authentication.
 *     operationId: student profile
 *     security:
 *     - Basic: []
 *     tags:
 *     - MainData
 *     responses:
 *       200:
 *         description: logout student profile by token
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: 'Success'
 *       404:
 *         description: Unauthenticated Entity
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: false
 *               example: true
 *             message:
 *               type: string
 *               example: The request was unacceptable, often due unauthenticated a required parameter.
 */

router.post('/user/logout',Auth,async(req,res)=>{
    try{console.log(req.token)
        req.user.tokens = req.user.tokens.filter((currElement)=>{
            return currElement.token !== req.token
        })
    //    console.log(req.user)
        await req.user.save();  
      return  res.status(200).send({msg:'logout successful',status:200})
    }catch(err){
        console.log(err)
        return res.status(400).send({message:'Enter the correct credidentials', data:null, status : 400 })
    }
})

/**
 * @swagger
 * /user/read:
 *   get:
 *     description:  Show student Profile.
 *     summary: show student profile.
 *     operationId: student profile
 *     security:
 *     - Basic: []
 *     tags:
 *     - MainData
 *     responses:
 *       200:
 *         description: Show student profile by token
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: 'Success'
 *       404:
 *         description: Unauthenticated Entity
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: false
 *               example: true
 *             message:
 *               type: string
 *               example: The request was unacceptable, often due unauthenticated a required parameter.
 */
router.get('/user/read',Auth,async(req,res)=>{
   try{
    return res.status(200).send(req.user)
   }catch(err){
    console.log("error =>",err)
    return res.status(400).send({message:'Unauthenticated user!', data:null ,status:400})
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

/**
 * @swagger
 * /user/update:
 *   patch:
 *     description:  update user.
 *     summary: Update student profile.
 *     operationId: update_user
 *     security:
 *     - Basic: []
 *     tags:
 *     - MainData
 *     parameters:
 *       - name: name
 *         description: name of the user.
 *         required: false
 *         in: formData
 *         type: string
 *       - name: email
 *         description: email of the user.
 *         required: false
 *         in: formData
 *         type: string
 *       - name: password
 *         description: user password.
 *         required: false
 *         in: formData
 *         type: string
 *       - name: address
 *         description: user address.
 *         required: false
 *         in: formData
 *         type: string
 *     responses:
 *       200:
 *         description: update user profile
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: 'Success'
 *       404:
 *         description: Unprocessable Entity
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: false
 *               example: true
 *             message:
 *               type: string
 *               example: The request was unacceptable, often due to required  authentication.
 */

router.patch('/user/update',Auth,async(req,res)=>{

    const update = Object.keys(req.body);
    const allowedUpdates = ['name','email','password','address'];
    const isValidOperation=update.every((update)=>allowedUpdates.includes(update))

    if(!isValidOperation){
        res.status(400).send({error:'Invalid Update'})
    }

    try{

        // const user = await StudentModel.findById(req.params._id)
        update.forEach((update)=>req.user[update]=req.body[update])
        
        await req.user.save()

        if(!req.user){
            throw new Error('User not Found')
        }

      return  res.status(200).send(req.user)
    }catch(err){
      return  res.status(500).send(err)
    }
})

/**
 * @swagger
 * /user/delete:
 *   delete:
 *     description:  delete student Profile.
 *     summary: delete student profile
 *     operationId: delete student profile
 *     security:
 *     - Basic: []
 *     tags:
 *     - MainData
 *     responses:
 *       200:
 *         description:  student profile by token
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: 'Success'
 *       404:
 *         description: Unauthenticated Entity
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: false
 *               example: true
 *             message:
 *               type: string
 *               example: The request was unacceptable, often due unauthenticated a required parameter.
 */

router.delete('/user/delete',Auth, async(req,res)=>{
    try{
        // const user = await StudentModel.findByIdAndDelete(req.params._id)
       
        if(!req.user){
            return  res.send({message:'Enter the correct credidentials', data:null, status : 400 })

            // throw new Error('User not Found')
        }
        await req.user.remove()
        return  res.status(200).send(req.user)

    }catch(err){
        
        return res.status(400).send(err)
    }
})

router.post('/user/validate', 
                body('email').isEmail(),
                body('name').trim().isAlpha().isLength({min : 3}),
                (req,res)=>{
                 const  errors = validationResult(req);
                 
                 if(!errors.isEmpty()){
                    console.log("error =>"+errors)
                    return res.status(400).send({ success : false, errors : errors.array()})
                 }

                 res.status(200).send({success: true,
                    message: 'Login successful'})
                })

module.exports = router;