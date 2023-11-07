const router = require("express").Router();
const User = require("./model/model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");
const crypto = require("crypto");

 const saltRounds = 10; // You can adjust the number of salt rounds

// Hash the password before storing it in the database
const plainTextPassword = 'user_password';
bcrypt.hash(plainTextPassword, saltRounds, (err, hash) => {
  if (err) {
    // Handle the error
  } else {
    // Store 'hash' in the database
  }
});


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
  const userdt = await User.findOne({ Email: req.body.Email });
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



  //password reset

  router.post("/Forgot-password", async (req, res) => {
    const { email } = req.body;
    console.log(email);
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).send({ message: "User not found" });
      }
  
      const resetToken = crypto.randomBytes(20).toString("hex");
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
      await user.save();
  
      const resetLink = `$https://render.com/reset-password/${resetToken}`;
      const msg = {
        to: email,
        from: "francismwanik254@gmail.com",
        subject: "Password Reset Request",
        text: `Click on the following link to reset your password: ${resetLink}`,
      };
  
      await sgMail.send(msg);
      res.status(200).send({ message: "Password reset email sent successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  });
  
  router.post("/reset-password/:token", async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
  
    try {
      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      });
  
      if (!user) {
        return res.status(400).send({ message: "Invalid or expired token" });
      }
  
      // Hash the new password and save it to the user
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
  
      res.status(200).send({ message: "Password reset successful" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  });
 
   
}); 
//export router
module.exports = router;