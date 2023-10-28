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
    }

})
 

module.exports=mongoose.model('intern',schema)