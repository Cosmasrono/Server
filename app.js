const express=require('express')
const cors=require('cors')
const bodyParser=require('body-parser')
const dotenv=require('dotenv')
const mongoose=require('mongoose')
 const router=require('./auth')
let port=process.env.PORT || 8080

const app=express();
//middlewares
app.use(bodyParser.json())
app.use(cors())
app.use(router)
dotenv.config()

const uri = "mongodb+srv://cosmas:22360010s@cluster0.8ehdgpg.mongodb.net/?retryWrites=true&w=majority";

//connect to db 
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
    // Your other code here
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });


app.get('/',(req,res)=>{
    res.json({message:'this is a homepage'})
})



app.listen(port,()=>{
    console.log(`listening on port ${port}`);
})