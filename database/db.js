// import mongoose from 'mongoose';
const mongoose = require('mongoose')

// const dbConnect= function dbConnect(){
// mongoose.connect(`${process.env.mongo_url}/${process.env.db_name}`,{
//     useNewUrlParser:true
// }
// )}

mongoose.connect(`${process.env.mongo_url}/${process.env.db_name}`,{
    useNewUrlParser:true,
},
console.log('DB Connected!')
)


