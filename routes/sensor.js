const express =require('express');
const plantRouter=express.Router();
const plantcontroller=require('../controllers/sensor');
const auth= require('../middleware/auth');