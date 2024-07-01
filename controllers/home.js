const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const Farm=require('../models/farm');
const Crop=require('../models/crops');
const user=require('../models/user');
const SoilType =require('../models/soilType');
const bcrypt=require('bcryptjs');
//get all farms
exports.getFarms=(req,res,next)=>{
    /* {userId:req.user._id}*/
    Farm.find()
    .then(farms=>{
      res.render('Farm/allfarm',{
        path:"/farms",
        pageTitle:"Farms",
        farms:farms
      });
    })
    .catch(err=>{
        console.log(err)
    });
};
exports.analyzePlant = async (req, res, next) => {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).send('No file uploaded.');
        }

        const form = new FormData();
        form.append('file', fs.createReadStream(file.path));

        const response = await axios.post('http://127.0.0.1:5000/predict', form, {
            headers: {
                ...form.getHeaders(),
            },
        });
       
        res.render('Detect/result', { prediction: response.data.prediction,pageTitle:"result",path:"/detect" });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).send('Error processing file.');
    }
};

exports.getIndex=(req,res,next)=>{

    res.render('Home/Info',{
        pageTitle:'my farm',
        path:'/',
        
      
    });

}
exports.getProfile=(req,res,next)=>{
 res.render('Home/profile',{
    pageTitle:'Profile',
    path:'/profile',
    user:req.user
 });
};
exports.editprofile=(req,res,next)=>{
    const name=req.body.name;
    const lastname=req.body.lastname;
    const email= req.body.email;
    const newemail=req.body.newemail;
    const address=req.body.address;
    const password= req.body.password;
    console.log (name);
    user.findOne({email:email})
    .then(uuser=>{
        bcrypt.hash(password,12) .then(hashedpassword=>{
            
               uuser.name=name;

               uuser.lastname=lastname;

               uuser.email=newemail;
               uuser. address=address;
               uuser.  password=hashedpassword;
               req.session.user=uuser;
             
               return uuser.save();
           })
           .then(result=>{
          
            res.redirect('/home');})
            .
        catch(err=>{
console.log(err);
        });
    })  .
    catch(err=>{
console.log(err);
    });
           
        };
      
        exports.uploadprofile = async (req, res, next) => {
            try {
                const file = req.file;
        
                if (!file) {
                    return res.status(400).send('No file uploaded.');
                }
                user.findById(req.user._id).then(uuser=>{
                    uuser.image=file.path;
                     uuser.save();
                   return req.user=uuser;
               
                }).then(uuser=>{
                res.redirect('/profile');
            })
              
            } catch (error) {
                console.error('Error uploading file:', error);
                res.status(500).send('Error processing file.');
            }
        };
exports.getdetect=(req,res,next)=>{
    res.render('Detect/detect',{
       pageTitle:'Detect',
       path:'/detect',
       
    });
   };
   exports.getabout=(req,res,next)=>{
    res.render('Home/about',{
       pageTitle:'about us',
       path:'/about',
       
    });
   };
   exports.gethome=(req,res,next)=>{
    const summerCrops = [];
    const winterCrops = [];
     const Autumncrops=[];
    Crop.find().then(allcrop=>{
        console.log(allcrop);
        allcrop.forEach(crop => {
      if (crop.season === 'Summer' && !summerCrops.find(s => s.name === crop.name)) {
        summerCrops.push(crop);
      } else if (crop.season === 'Winter' && !winterCrops.find(w => w.name === crop.name)) {
        winterCrops.push(crop);
      }
      else if (crop.season === 'Autumn' && !Autumncrops.find(w => w.name === crop.name)) {
        Autumncrops.push(crop);
      }
    });
})
.then(r=>{
    SoilType.find().lean().then( soilTypes=>{

    res.render('Home/home',{
        pageTitle:'Home',
        path:'/home',
        soilTypes:soilTypes,
        summerCrops,
        winterCrops,
        Autumncrops

     });

    })
 }).catch(err=>{
    console.log(err);
   });
   
   };
   