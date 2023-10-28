const router = require("express").Router();
const User = require("./model/model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
//routes
router.post("/Signup", async (req, res) => {
  const emailExist = await User.findOne({ Email: req.body.Email });
  let value = await req.body.password;
  if (value != req.body.confirmPassword) {
    {
      res.status(400).send({ message: "password does not match" });
    }
  } else if (emailExist) {
    res.status(400).send({ message: "email already in use" });
  } else {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      const user = new User({
        Email: req.body.Email,
        password: hashedPassword,
        confirmPassword: hashedPassword,
        phoneNumber: req.body.phoneNumber,
        
      });
      const savedUser = await user.save();
      res.status(201).send({
        message: `${user.fname}, Thank you for creating your account`,
      });
    } catch (error) {
      res.status(500).send(error);
    }
  }
});

router.post("/Login", async (req, res) => {
  //checking if email exists
  const userdt = await User.findOne({ email: req.body.email });
  if (!userdt) {
    return res.status(400).send({ message: "Username is not found" });
  } else {
    //validating if password is correct
    const validPass = await bcrypt.compare(req.body.password, userdt.password);
    if (!validPass) {
      return res.status(400).send({ message: "Email or Password is wrong" });
    } else {
     
      res 
        .status(200)
        .send({ message: `You Logged in` });
    }
  }
 
   
}); 
//export router
module.exports = router;