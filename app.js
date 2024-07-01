const express=require('express');

const path=require('path');

const bodyparser=require('body-parser');
const session=require('express-session');
const mongostore=require('connect-mongodb-session')(session);
const flash=require('connect-flash');
const plantRouter=require('./routes/plant');
const farmRouter=require('./routes/farm');
const authrouter=require('./routes/auth');
const homerouter=require('./routes/home');
const multer = require('multer');
const fileStorage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads');
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname);
    }
});
const axios = require('axios');
const FormData = require('form-data');
const app=express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname)));
app.use(bodyparser.urlencoded({extended:true}));
app.use(multer({ storage:fileStorage}).single('file'));
const fs = require('fs');
const user = require('./models/user');


app.set('view engine','ejs');

app.set('views',path.join(__dirname,"views"));

const store = new mongostore({
    uri: 'mongodb+srv://wafaakadry756:tNtV3INS0oIi3cIy@wafaaa.srergbn.mongodb.net/grad_db?retryWrites=true&w=majority&appName=wafaaa',
    collection: 'sessions',
    expires: 86400 * 1000 // 1 day (in milliseconds)
});

store.on('error', function(err) {
    console.error('MongoStore error:', err);
});

app.use(session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
        maxAge: 86400 * 1000 // Same as expires, set the cookie max age as well
    }
}));
app.use(flash());

app.use((req,res,next)=>{
    if (!req.session.user){
        return next();
    }
    user.findById(req.session.user._id)
    .then(user=>{
        req.user=user;
        next();
    })
    .catch(err=>{
        console.log(err);
    });
});
app.use((req,res,next)=>{
res.locals.isAuth=req.session.islogged;

next();
});
app.use(authrouter);
app.use(homerouter);

app.use('/plant',plantRouter);
app.use('/farm',farmRouter);
module.exports=app;
