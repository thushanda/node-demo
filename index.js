/*
* expressjs-> spring
* mongoose
* nodemon
* dotenv
* */
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
require('./middleware/PassportConfig');
const bodyParser= require('body-parser');
const passport= require('passport');
const session = require('express-session');


const serverPort = process.env.SERVER_PORT;

// =========================================
const CustomerRoute = require('./routes/CustomerRoute');
const UserRoute = require('./routes/UserRoute');
const {Strategy: GoogleStrategy} = require("passport-google-oauth20");
// =========================================

const app = express();

// app.use(session({
// secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     cookie: { secure: true }
// }));




app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

mongoose.connect('mongodb://localhost:27017/TestApp');

app.listen(serverPort,()=>{
    console.log(`server up & Running on port ${serverPort}`)
})

app.get('/test',(req,res)=>{
    return res.json('server works');
})

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackUrl: '/auth/google/callback',
    passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, done) => {

    console.log(profile);
    done(null,profile)
}));
passport.serializeUser((user,done)=>{
    done(null,user);
})
passport.deserializeUser(async (id,done)=>{
    done(null,id)
})

app.use(session({
secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true }
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/',(req,res)=>{
    res.send('<a href="/auth/google">signup with google</a>')
});
app.get('/auth/google',(req,res)=>{
    passport.authenticate('google', {scope:['profile','email']});
});
app.get('/auth/google/callback',
    passport.authenticate('google', {failureRedirect:'/'}),
    (req,res)=>{
    res.redirect('/profile')
});
app.get('/profile',(req,res)=>{
    console.log(req.body);
});

app.use('/api/v1/customers',CustomerRoute);
app.use('/api/v1/users',UserRoute);
app.use('/auth',require('./routes/Auth'));