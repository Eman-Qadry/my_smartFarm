const express =require('express');
const plantRouter=express.Router();
const plantcontroller=require('../controllers/plant');
const auth= require('../middleware/auth');
plantRouter.get('/',plantcontroller.getPlants);
plantRouter.post('/search',plantcontroller.getSearch);
plantRouter.get('/:name',plantcontroller.getPlant);
plantRouter.get('/irrigation/:name',plantcontroller.getIrrigation);
module.exports=plantRouter;
