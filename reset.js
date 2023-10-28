const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 8080;

// Connect to MongoDB (replace with your MongoDB connection string)
mongoose.connect('mongodb://localhost/your-database', { useNewUrlParser: true });

// Define a User schema (customize as needed)
const User = mongoose.model('User', {
  email: String,
  password: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

app.use(bodyParser.json());

// Function to generate a reset token
const generateResetToken = () => {
  return crypto.randomBytes(20).toString('hex');
};

// Function to send a password reset email
const sendResetEmail = (user, resetToken, req, res) => {
  // Configure your email service
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'ccosmas001@gmail.com',
      pass: 'your-password',
    },
  });

  const resetLink = `http://${req.headers.host}/reset-password/${resetToken}`;

  const mailOptions = {
    to: user.email,
    from: 'ccosmas001@gmail.com',
    subject: 'Password Reset',
    text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
      Please click on the following link to complete the process:\n\n
      ${resetLink}\n\n
      If you did not request this, please ignore this email, and your password will remain unchanged.\n`,
  };

  transporter.sendMail(mailOptions, (err) => {
    if (err) {
      res.status(500).json({ error: 'Error sending email' });
    } else {
      res.status(200).json({ message: 'Password reset email sent' });
    }
  });
};

// Route to handle password reset requests
app.post('/ResetPassword', async (req, res) => {
  const { email } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate a reset token
    const resetToken = generateResetToken();

    // Update the user's reset token and expiration
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour

    await user.save();

    // Send a password reset email
    sendResetEmail(user, resetToken, req, res);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a route to handle password reset form submission
app.post('/api/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    // Find the user by the reset token and check expiration
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: 'Password reset token is invalid or has expired' });
    }

    // Update the user's password and clear the reset token fields
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
