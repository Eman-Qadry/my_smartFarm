const Farm=require('../models/farm');
const Crop=require('../models/crops');
const user=require('../models/user');
//get all farms
exports.getFarms=(req,res,next)=>{
    user.findById(req.user._id)
    .populate('farm')
    .then(uuser=>{
      if (uuser.farm.length==0){
        return res.render('Farm/nofarm',{
            path:"/farm",
            pageTitle:"Farm",
           
          });
      }
      res.render('Farm/allfarm',{
        path:"/farm",
        pageTitle:"Farm",
        user:uuser,
        farm:null
      });
    })
    .catch(err=>{
        console.log(err)
    });
};
exports.getaddFarms=(req,res,next)=>{
   
   
      res.render('Farm/addFarn',{
        path:"/farms",
        pageTitle:"Add-Farm"
      });
    
};

// add new farm 
exports.addFarm=(req,res,next)=>{
    
    user.findById(req.user._id)
    .then(uuser=>{
const name=req.body.name;
const location=req.body.location;
const size=req.body.size;
const soiltype=req.body.soilType;
const date=req.body.date;

let image;
if (req.file && req.file.path) {
    image = req.file.path;
}
const farm= new Farm({
    name:name,
    location:location,
    size:size,
    soiltype:soiltype,
    userId:req.user._id,
    date:date,
    image:image,
    crops:[]
});
return farm.save()
.then(savedFarm => {
    if (!uuser.farm) {
        uuser.farm = [];
    }
    uuser.farm.push(savedFarm._id); // Make sure to push the farm's ID
    return uuser.save();
});
})
.then(result => {
res.redirect('/farm');
})
.catch(err=>{
    console.log(err);
});
};
//get one farm
exports.getFarm = (req, res, next) => {
    const farmId = req.params.farmId;
   
    Farm.findById(farmId)
         .populate('crops' )// Populate the crops within each farm
          .then(farm => {

            if (!farm) {
                throw new Error('farm not found');
            }
            
            if (farm.crops.length==0){
                return res.render('Farm/nocrop',{
                    path:"/farm",
                    pageTitle:"Farm",
                   farm:farm
                  });
              }
                    res.render('Farm/onefarm', {
                        path: "/farm",
                        pageTitle: "Farm",
                      
                        farm:farm
                        // Specific farm details
                    });
                })
    
        
        .catch(err => {
            console.log("server error");
            res.status(500).send('Internal Server Error');
        });
};



exports.getaddcrop=(req,res,next)=>{
    /* {userId:req.user._id}*/
   const farmId=req.params.farmId;
      res.render('Farm/addcrop',{
        path:"/farms",
        pageTitle:"add-crop",
        farmId:farmId
      });
    
};
    //farm/:farmId/add-crop
exports.addcrop=(req,res,next)=>{
   
    const farmId=req.params.farmId;
    Farm.findById({_id :farmId})
    .then(farm=>{
        const cropName= req.body.name;
        const type= req.body.type;
        const plantingDate = req.body.plantingDate;
        const season= req.body.season;
        const soiltype=req.body.soilType;
       
        let image;
        if (req.file && req.file.path) {
            image = req.file.path;
        }
        const crop= new Crop({
          name:cropName,
          type:type,
          season:season,
          image:image,
          plantingDate:plantingDate,
          soiltype:soiltype,
          farmId:farmId

        });
      
       
        return crop.save()
        .then(savedcrop => {
            if (! farm.crops) {
                farm.crops = [];
            }
            farm.crops.push(savedcrop._id); // Make sure to push the farm's ID
            return  farm.save();;
        });
        })
        .then(result => {
            res.redirect(`/farm/${farmId}`);
        })
        .catch(err=>{
            return res.status(500).send(err);
        });
};

exports.getcrop=(req,res,next)=>{
    Crop.findById(req.params.cropId).then( crop => {
        // if (!crop ) {
        //     return res.status(500).send(err);
        // }
        res.render('Farm/sensor', 
            {crop: crop ,
                farmId:req.params.farmId,
                pageTitle:'sensor',
                path:'/farm'
            });
    });
};








// delete farm
exports.deleteFarm = (req, res, next) => {
    const farmId = req.params.farmId;
console.log(farmId);
    Farm.findByIdAndDelete(farmId)
        .then(result => {
            console.log("Farm deleted");
            // Optionally, delete related crops
             Crop.deleteMany({ _id: { $in: result.crops } })
                 .then(() => console.log("Crops deleted"))
                 .catch(err => console.log(err));
            res.redirect('/farm');
        })
        .catch(err => {
            console.log(err);
        });
};



exports.deleteCrop=(req,res,next)=>{
    const farmId=req.params.farmId;
    const cropId=req.params.cropId;

    Farm.findById(farmId)
    .then(farm=>{
      // is it need to be of type objectId?
        const cropIndex= farm.crops.indexOf(cropId  );
        farm.crops.splice(cropIndex,1);
        farm.save();
       
        Crop.findByIdAndDelete(cropId);
        res.redirect(`/farm/${farmId}`);
    })
    .catch(err=>{
        console.log(err);
    });
};




// Edit  the farm informatio not the crops
exports.postEditFarm=(req,res,next)=>{
    const farmId=req.params.farmId;
    const updatedfarm= req.body;
   Farm.findByIdAndUpdate(farmId,updatedfarm,{new:true})
   .then(result=>{
    console.log('updated Farm');
    res.redirect('/')
})
.catch(err=>{
    console.log(err);
});
};

exports.postEditcrop=(req,res,next)=>{
    const cropId=req.params.cropId;
    const updatedCrop= req.body;
   Crop.findByIdAndUpdate(cropId,updatedCrop,{new:true})
   .then(result=>{
    console.log('updated Crop');
    res.redirect('/')
})
.catch(err=>{
    console.log(err);
});
};
// exports.postEditCrop=(req,res,next)=>{
//     const cropId=req.params.prodId;
//    const name=req.body.name;
//    const season=req.body.season;
//    const plantingDate=req.body.plantingDate;
//    const type=req.body.type;
//    Crop.findById(cropId)
//    .then(crop=>{
//        crop.name=name;
//        crop.season=season;
//        crop.plantingDate=plantingDate;
//        crop.type=type;
//        return crop.save();
//    })
   
//    .then(result=>{
//        console.log("crop updated");
//    })
//    .catch(err=>{
//        console.log(err);
//    });
// };
exports.getEditCrop=(req,res,next)=>{
    const editMode=req.params.editing;
    if (!editMode)
    return res.redirect('/');
    const cropId=req.params.cropId;
    Crop.findById(cropId)
    .then(crop=>{
        if (!crop)
       return res.redirect('/');
        console.log(crop);
        res.render('Crop-edit-product',{
            pageTitle:'Edit Product',
            path:'Crop-edit-product',
            editing:editMode,
            crop:crop
        });
        
    })
    .catch(err=>{
        console.log(err);
    })
};