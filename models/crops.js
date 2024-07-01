const mongoose=require('mongoose');
const schema=mongoose.Schema;
const sensorDataSchema = new schema({
    soilMoisture: Number,
    timestamp: { type: Date, default: Date.now }
  });
const crops=new schema({
    name:{
        type:String,
        required:true
    },
    plantingDate:{
        type:Date,
        required:false
    }
    ,type:{
        type:String,
        required:true
    }
    ,season:{
        type:String,
        required:true
    },
    image: {
        type: String, 
        required: false
    }
    ,
    soiltype:{
        type:String,
        required:true
    },
    sensorData: [sensorDataSchema],
    farmId:{
        type:schema.Types.ObjectId,
          ref:'Farm'
          }
});
module.exports=mongoose.model('Crop',crops);