
const mongoose=require('mongoose');
const schema=mongoose.Schema;
const userSchema=new schema({
   name:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        
    },
    address:{
        type:String,
      
    },
   email:{
        type:String,
        required:true
    },
   password:{
        type:String,
        required:true
    },
    resetToken:{
       type: String
    },
    tokenExpiration:{
        type:Date
    },
   image:{
        type:String
    },
    farm: {
        type: [{ type: schema.Types.ObjectId, ref: 'Farm' }],
        default: []
    }
    
})
module.exports=mongoose.model('User',userSchema);