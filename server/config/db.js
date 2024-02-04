const mongoose = require('mongoose');
const connectDB = async () =>{
    try{
        mongoose.set('strictQuery', false)
        const conn = await mongoose.connect(process.env.MONGODBURL)
        console.log(`sucessfully connected mongodb host: ${conn.connection.host}`)

    }catch(error){
        console.log(error)
    }
}

module.exports = connectDB