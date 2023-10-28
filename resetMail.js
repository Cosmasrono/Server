// pages/api/send-reset-email.js
import sgMail from '@sendgrid/mail';

export default async (req, res) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const { email, resetPasswordLink } = req.body;

  const msg = {
    to: email,
    from: 'ccosmas001@gmail.com',
    subject: 'Password Reset',
    text: `Click the following link to reset your password: ${resetPasswordLink}`,
  };

  try {
    await sgMail.send(msg);
    res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
    res.status(500).json({ error: 'Error sending email' });
  }
};
