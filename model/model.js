const mongoose=require('mongoose')


const schema=new mongoose.Schema({
   
    Email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    confirmPassword:{
        type:String,
        required:true,
    },
    phoneNumber:{
        type:String,
        required:true,
    },
    resetPasswordToken: {
        type: String,
      },
      resetPasswordExpires: {
        type: Date,
      },
      Date: {
        type: Date,
        default: Date.now,
      },

})
 

module.exports=mongoose.model('intern',schema)