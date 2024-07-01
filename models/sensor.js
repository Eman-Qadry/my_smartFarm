const mongoose=require('mongoose');
const schema=mongoose.Schema;
const sensorSchema= new schema({
    sensortype:{
     type:String,
     required:true
    },
    timestamp:{
        type : Date,
        default:Date.now
    }
    ,data:{
        type : Number,
        required:true
    },
    cropId:{
        type:schema.Types.ObjectId,
          ref:'Crop'
          }
  
})
module.exports=mongoose.model('Sensor',sensor);