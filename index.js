// import 'dotenv/config';
// import express from 'express';
// import dbConnect  from './database/db.js'

require('dotenv').config();
const express = require('express');
require('./database/db');
const router = require('./router/user.routes');


const app = express();

// dbConnect();

app.use(express.json());
app.use(router);

app.listen(process.env.PORT,(err)=>{
    if(err) throw err;
    console.log(`Server is running on PORT:${process.env.PORT}`);
})


