const express=require('express');
const homerouter= express.Router();
const homecontroller=require('../controllers/home');

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
homerouter.get('/',homecontroller.getIndex);
homerouter.get('/profile',homecontroller.getProfile);
homerouter.get('/detect',homecontroller.getdetect);
homerouter.get('/about',homecontroller.getabout);
homerouter.get('/home',homecontroller.gethome);
homerouter.post('/analyze-plant', homecontroller.analyzePlant);
homerouter.post('/edit-profile',homecontroller.editprofile);
homerouter.post('/uploadprofile',homecontroller.uploadprofile);
module.exports=homerouter;