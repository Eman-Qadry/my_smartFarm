const mongoose=require('mongoose');
const schema=mongoose.Schema;
const farmSchema= new schema({
    name:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    size:{
        type:Number,
        required:true
    },
    soiltype:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        required:false
    },
    image: {
        type: String, 
        required: false
    },
    crops: {
        type: [{ type: schema.Types.ObjectId, ref: 'Crop' }],
        default: []
    },
    userId:{
  type :schema.Types.ObjectId,
    ref:'User'
    }
})
module.exports=mongoose.model('Farm',farmSchema);