const mongoose=require('mongoose');
const schema=mongoose.Schema;
const plants=new schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    climate:{
        type:String,
        required:true
    },
    soil:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    }
    ,variate:{
        type:String,
        required:true
    },
    irrigation:{
        type:String,
        required:true
    }
   
});
module.exports=mongoose.model('Plants',plants);