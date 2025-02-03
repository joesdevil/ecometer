const express = require("express");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();
const generateOTP = () => {
    let otp = '';
    for (let i = 0; i < 6; i++) {
        otp += Math.floor(Math.random() * 10);
    }
    return otp;
};

const mailTransport = ()=> 
nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: process.env.GMAIL_ADRESS,
      pass: process.env.GMAIL_PASS,
  }
  });

  const emailVerificationTemplate = (otp,clientId) => `
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification</title>
  </head>
  <body style="font-family: Arial, sans-serif; margin: 0; padding: 0;">
      <div style="background-color: #f4f4f4; padding: 20px;">
          <h2 style="color: #333;">Welcome to Our Community!</h2>
          <p style="color: #666;">Dear New Member,</p>
          <p style="color: #666;">We are thrilled to have you join our community. To get started, please verify your email address by entering the OTP code below:</p>
          <a href='http://localhost:5173/verf?cId=${clientId}'>validate your account</a>
          <h3 style="color: #007bff;">${otp}</h3>
          <p style="color: #666;">This code will expire in a short while, so please complete the verification process promptly.</p>
          <p style="color: #666;">If you didn't sign up for our community, please disregard this email.</p>
          <p style="color: #666;">Thank you for joining us!</p>
          <p style="color: #666;">Warm Regards,</p>
          <p style="color: #666;">Ecometer Team</p>
      </div>
  </body>
  </html>
`;

const emailVerifiedTemplate = () =>
`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Verification Success</title>
  <style>
    /* Add your CSS styles here */
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      border: 1px solid #ccc;
      border-radius: 5px;
      background-color: #f9f9f9;
    }
    h1 {
      color: #333;
    }
    p {
      margin-bottom: 20px;
    }
    .button {
      display: inline-block;
      padding: 10px 20px;
      background-color: #007bff;
      color: #fff;
      text-decoration: none;
      border-radius: 5px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Email Verification Success</h1>
    <p>Your email address has been successfully verified. You can now enjoy full access to our platform.</p>
    <p>If you have any questions or need further assistance, feel free to contact us.</p>
    <p>Thank you!</p>
    
  </div>
</body>
</html>
`;

const passwordResetTemplate = (username,link) =>
`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #fff;
            border-radius: 5px;
            padding: 20px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        h2 {
            color: #333333;
        }
        p {
            color: #666666;
            line-height: 1.5;
        }
        .button {
            display: inline-block;
            background-color: #007bff;
            color: #ffffff;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 5px;
            margin-top: 15px;
        }
        .button:hover {
            background-color: #0056b3;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Reset Your Password</h2>
        <p>Dear ${username},</p>
        <p>We received a request to reset the password for your account. If you didn't make this request, you can ignore this email. Otherwise, you can reset your password using the button below:</p>
        <a href="${link}" class="button">Reset Password</a>
        <p>This link will expire in 1 hour, so please reset your password as soon as possible.</p>
        <p>If you have any questions or need further assistance, feel free to contact our support team at <a href="mailto:support@example.com" style="color: #007bff;">ecometer.team@gmail.com</a>.</p>
        <p>Best regards,<br>Ecometer Team</p>
    </div>
</body>
</html>
`;

const passwordResetSuccessTemplate = (username) =>`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Successfully</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #fff;
            border-radius: 5px;
            padding: 20px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        h2 {
            color: #333333;
        }
        p {
            color: #666666;
            line-height: 1.5;
        }
        .button {
            display: inline-block;
            background-color: #007bff;
            color: #ffffff;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 5px;
            margin-top: 15px;
        }
        .button:hover {
            background-color: #0056b3;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Password Reset Successful</h2>
        <p>Dear ${username},</p>
        <p>Your password has been successfully reset.</p>
        <p>If you did not make this change, please contact us immediately.</p>
        <p>If you have any questions or need further assistance, feel free to contact our support team at <a href="mailto:support@example.com" style="color: #007bff;">ecometer.team@gmail.com</a>.</p>
        <p>Best regards,<br>Ecometer Team</p>
    </div>
</body>
</html>
`





module.exports = {
    generateOTP ,
    mailTransport,
    emailVerificationTemplate,
    emailVerifiedTemplate,
    passwordResetTemplate,
    passwordResetSuccessTemplate
};
