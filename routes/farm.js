const express=require('express');
const farmRouter=express.Router();
const farmController=require('../controllers/farm');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
farmRouter.get('/',farmController.getFarms);
farmRouter.get('/add-farm',farmController.getaddFarms);
farmRouter.post('/add-farm' ,farmController.addFarm);
farmRouter.get('/:farmId',farmController.getFarm);


farmRouter.get('/delete/:farmId' ,farmController.deleteFarm);
farmRouter.get('/delete/:farmId/:cropId',farmController.deleteCrop);

farmRouter.get('/:farmId/add-crop',farmController.getaddcrop);
farmRouter.post('/:farmId/add-crop',farmController.addcrop);
farmRouter.get('/:farmId/:cropId',farmController.getcrop);




farmRouter.patch('farm/:farmId',farmController.postEditFarm);




farmRouter.patch('/:farmId/cropId',farmController.postEditcrop);

module.exports=farmRouter;