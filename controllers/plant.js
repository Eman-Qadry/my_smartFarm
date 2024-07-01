const Plants=require('../models/plants');
exports.getPlants=(req,res,next)=>{
    
    Plants.find().populate('_id','name')
    .then(Plants=>{
        
       res.render('crops/crops',{
            path:'/plant',
            pageTitle:'plants',
           Plants:Plants
           
        });
    })
    .catch(err=>{
        console.log(err);
    });
};

//Details 
exports.getPlant=(req,res,next)=>{
  
    const name=req.params.name;
    Plants.findOne({name:name})
    .then(Plant=>{
     console.log (Plant);
        res.render('crops/info',{
            layout:false,
          path:'/plant',
            pageTitle:'plantnfo',
           crop:Plant
           
        });  }).catch(err=>{
            console.log(err);
            res.status(500).send('Server error');
     });
 };

 exports.getIrrigation=(req,res,next)=>{
  
    const name=req.params.name;
    Plants.findOne({name:name})
    .then(Plant=>{
     
        res.render('crops/irrigation',{
            layout:false,
          path:'/plant',
            pageTitle:'Irrigation Info',
           irrigation:Plant.irrigation
           
        });  }).catch(err=>{
            console.log(err);
            res.status(500).send('Server error');
     });
 };
exports.getSearch=(req,res,next)=>{
const name=req.body.search;

Plants.find({name:name})
.then(Plant=>{
    console.log(Plant);
    res.render('crops/search',{
      path:'/plant',
        pageTitle:name ,
       plant:Plant
       
    });
 })
 .catch(err=>{
     console.log(err);
 });
};