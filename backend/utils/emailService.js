import nodemailer from 'nodemailer';

// Create transporter
const createTransporter = () => {
  console.log('📧 Creating email transporter...');
  console.log('Email Host:', process.env.EMAIL_HOST);
  console.log('Email User:', process.env.EMAIL_USER);
  console.log('Email Port:', process.env.EMAIL_PORT);

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Send verification email
export const sendVerificationEmail = async (email, otp) => {
  try {
    console.log('📤 Attempting to send verification email to:', email);
    
    const transporter = createTransporter();

    // Verify connection
    await transporter.verify();
    console.log('✅ Email server connection verified');

    const mailOptions = {
      from: `"Matrimonial App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Email Verification - Matrimonial App',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
              .container { background-color: white; padding: 30px; border-radius: 10px; max-width: 600px; margin: 0 auto; }
              .header { text-align: center; color: #ff1744; margin-bottom: 30px; }
              .otp-box { background-color: #fff0f3; padding: 20px; border-radius: 5px; text-align: center; margin: 20px 0; }
              .otp { font-size: 32px; font-weight: bold; color: #ff1744; letter-spacing: 5px; }
              .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>💕 Matrimonial App</h1>
                <h2>Email Verification</h2>
              </div>
              <p>Hello,</p>
              <p>Thank you for registering with Matrimonial App! Please use the OTP below to verify your email address:</p>
              <div class="otp-box">
                <div class="otp">${otp}</div>
              </div>
              <p>This OTP is valid for 10 minutes.</p>
              <p>If you didn't request this verification, please ignore this email.</p>
              <div class="footer">
                <p>© 2025 Matrimonial App. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `Your verification OTP is: ${otp}. Valid for 10 minutes.`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);
    return info;

  } catch (error) {
    console.error('❌ Error sending verification email:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      command: error.command
    });
    throw new Error('Failed to send verification email: ' + error.message);
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (email, resetUrl) => {
  try {
    console.log('📤 Sending password reset email to:', email);
    
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Matrimonial App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Request - Matrimonial App',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
              .container { background-color: white; padding: 30px; border-radius: 10px; max-width: 600px; margin: 0 auto; }
              .header { text-align: center; color: #ff1744; margin-bottom: 30px; }
              .button { background-color: #ff1744; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
              .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>💕 Matrimonial App</h1>
                <h2>Password Reset Request</h2>
              </div>
              <p>Hello,</p>
              <p>You requested to reset your password. Click the button below to reset it:</p>
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset Password</a>
              </div>
              <p>Or copy this link: <br/>${resetUrl}</p>
              <p>This link will expire in 10 minutes.</p>
              <p>If you didn't request a password reset, please ignore this email.</p>
              <div class="footer">
                <p>© 2025 Matrimonial App. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `Reset your password using this link: ${resetUrl}`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Password reset email sent!');
    console.log('Message ID:', info.messageId);
    return info;

  } catch (error) {
    console.error('❌ Error sending password reset email:', error);
    throw new Error('Failed to send password reset email: ' + error.message);
  }
};
