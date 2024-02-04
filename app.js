require("dotenv").config();

const express = require('express')
const expressLayout = require('express-ejs-layouts')
const connectDB = require('./server/config/db')
const cookieParser = require('cookie-parser')
const session = require("express-session");
const MongoStore = require("connect-mongo");
const methodOverride = require('method-override')



const app = express()
const PORT = 5000 || process.env.PORT;
app.use(express.static('public'))

//mongodb connection
connectDB()

//middileware for post method encoded json

app.use(express.urlencoded({extended:true}))
app.use(express.json());
app.use(methodOverride('_method'));

//save cookies
app.use(cookieParser())
app.use(session({
    secret:'keyboard cat',
    resave:false,
    saveUninitialized:true,
    store:MongoStore.create({
        mongoUrl:process.env.MONGODBURL
    })
}))

//Templete Creating
app.use(expressLayout);
app.set('layout','./layouts/main');
app.set('view engine', 'ejs');


//middleware for admin and main pages
app.use('/', require('./server/routes/main'));
app.use('/', require('./server/routes/admin'));

//port 
app.listen(PORT, ()=>{
    console.log(`App Listening on Port No: ${PORT}`)
})