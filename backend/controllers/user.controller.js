import { dynamoDB } from "../config/aws.config.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { uploadToS3 } from "../utils/s3Utils.js";
import nodemailer from 'nodemailer'
// const TABLE_NAME = 'Users';
const TABLE_NAME = 'Users';
import { docClient } from "../config/aws.config.js";
import { ScanCommand } from "@aws-sdk/client-dynamodb";


const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || "navalbihani15@gmail.com",
    pass: process.env.EMAIL_APP_PASSWORD || "rsse sotb vxtr xvmj"
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Different email templates
const emailTemplates = {
  welcome: (fullname, role) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.6;
          color: #333333;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 0;
        }
        .header {
          background-color: #1a365d;
          color: white;
          padding: 30px 20px;
          text-align: center;
        }
        .content {
          background-color: #ffffff;
          padding: 40px 30px;
          border: 1px solid #e5e5e5;
        }
        .footer {
          background-color: #f8f9fa;
          padding: 20px;
          text-align: center;
          color: #666666;
          font-size: 14px;
        }
        h1 {
          margin: 0;
          font-size: 24px;
          font-weight: 600;
        }
        h2 {
          color: #1a365d;
          font-size: 20px;
          margin-top: 0;
        }
        ul {
          padding-left: 20px;
          margin: 15px 0;
        }
        li {
          margin-bottom: 10px;
          color: #333333;
        }
        p {
          margin: 15px 0;
          color: #333333;
        }
        .highlight {
          color: #1a365d;
          font-weight: 600;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to Our Platform</h1>
        </div>
        <div class="content">
          <h2>Dear ${fullname},</h2>
          <p>Thank you for joining our professional community as a <span class="highlight">${role}</span>. We're delighted to have you on board.</p>
          ${role === 'student' ?
            `<p>As a student member, you now have access to:</p>
            <ul>
              <li>Exclusive job opportunities aligned with your career goals</li>
              <li>Professional resume building and optimization tools</li>
              <li>Expert career guidance and industry insights</li>
              <li>Networking opportunities with industry professionals</li>
            </ul>` :
            `<p>As a ${role}, you now have full access to our platform's professional suite of tools and resources designed to enhance your experience.</p>`
          }
          <p>Should you have any questions or require assistance, our dedicated support team is here to help.</p>
          <p>Best regards,<br>The Platform Team</p>
        </div>
        <div class="footer">
          © ${new Date().getFullYear()} Your Platform Name. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `,

  loginAlert: (fullname, loginTime, deviceInfo) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.6;
          color: #333333;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 0;
        }
        .header {
          background-color: #1a365d;
          color: white;
          padding: 30px 20px;
          text-align: center;
        }
        .content {
          background-color: #ffffff;
          padding: 40px 30px;
          border: 1px solid #e5e5e5;
        }
        .footer {
          background-color: #f8f9fa;
          padding: 20px;
          text-align: center;
          color: #666666;
          font-size: 14px;
        }
        h1 {
          margin: 0;
          font-size: 24px;
          font-weight: 600;
        }
        h2 {
          color: #1a365d;
          font-size: 20px;
          margin-top: 0;
        }
        .info-box {
          background-color: #f8f9fa;
          border-left: 4px solid #1a365d;
          padding: 15px;
          margin: 20px 0;
        }
        .alert {
          color: #721c24;
          background-color: #f8d7da;
          border: 1px solid #f5c6cb;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
        }
        .info-label {
          font-weight: 600;
          color: #1a365d;
          display: inline-block;
          width: 100px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Security Alert</h1>
        </div>
        <div class="content">
          <h2>Dear ${fullname},</h2>
          <p>We detected a new login to your account. Please review the details below:</p>

          <div class="info-box">
            <p><span class="info-label">Time:</span> ${loginTime}</p>
            <p><span class="info-label">Device:</span> ${deviceInfo}</p>
          </div>

          <div class="alert">
            If you don't recognize this activity, please secure your account immediately by:
            <ul>
              <li>Changing your password</li>
              <li>Enabling two-factor authentication</li>
              <li>Contacting our support team</li>
            </ul>
          </div>

          <p>Best regards,<br>The Security Team</p>
        </div>
        <div class="footer">
          © ${new Date().getFullYear()} Your Platform Name. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `
};
// Send email function
const sendEmail = async (type, userEmail, data) => {
  try {
    let subject, html;

    switch(type) {
      case 'welcome':
        subject = 'Welcome to Our Platform!';
        html = emailTemplates.welcome(data.fullname, data.role);
        break;
      case 'profileUpdate':
        subject = 'Profile Update Confirmation';
        html = emailTemplates.profileUpdate(data.fullname);
        break;
      case 'loginAlert':
        subject = 'New Login Detected';
        html = emailTemplates.loginAlert(data.fullname, data.loginTime, data.deviceInfo);
        break;
    }

    const mailOptions = {
      from: `"Your Platform Name" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject,
      html
    };

    await transporter.sendMail(mailOptions);

    return true;
  } catch (error) {
    console.error(`Failed to send ${type} email:`, error);
    return false;
  }
};
//register user
export const register = async (req, res) => {
  try {
    const {
      fullname,
      email,
      phoneNumber,
      password,
      role,
      currentLocation,
      jobDomain,
      jobTitle
    } = req.body;

    // Validate input fields
    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        error: "All fields are required",
        status: false,
      });
    }

    // Additional validation for student-specific fields
    if (role === 'student' && (!currentLocation || !jobTitle)) {
      return res.status(400).json({
        error: "All student-specific fields are required",
        status: false,
      });
    }

    // Check if user already exists
    const existingUser = await dynamoDB.get({
      TableName: "Users",
      Key: { email }
    });

    if (existingUser.Item) {
      return res.status(400).json({
        error: "User already exists",
        status: false,
      });
    }

    const file = req.file;
    let s3Response;

    if (file) {
      // If user already has a profile photo, delete it from S3
      if (existingUser.Item?.profile?.profilePhotoKey) {
        await deleteFromS3(existingUser.Item.profile.profilePhotoKey);
      }
      // Upload new profile photo to S3
      s3Response = await uploadToS3(file, 'profile-photos');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Prepare user data
    const userData = {
      fullname,
      email,
      phoneNumber: phoneNumber.toString(),
      password: hashedPassword,
      role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      profile: {
        profilePhoto: s3Response ? s3Response.url : null,
        profilePhotoKey: s3Response ? s3Response.key : null, // Store S3 key for future reference
        bio: "",
        skills: [],
        resume: "",
        resumeOriginalName: ""
      }
    };

    // Add student-specific fields
    if (role === 'student') {
      userData.profile = {
        ...userData.profile,
        currentLocation,
        jobTitle,
        jobDomain
      };
    }

    // Save user to DynamoDB
    await dynamoDB.put({
      TableName: "Users",
      Item: userData
    });

    await sendEmail('welcome', email, { fullname, role });

    // Return success response
    return res.status(201).json({
      message: "User registered successfully",
      status: true,
      user: {
        fullname: userData.fullname,
        email: userData.email,
        role: userData.role,
        profile: userData.profile
      },
    });
  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).json({
      error: "Internal server error",
      details: err.message,
    });
  }
};

  // export const register = async (req, res) => {
  //   try {
  //     const {
  //       fullname,
  //       email,
  //       phoneNumber,
  //       password,
  //       role,
  //       currentLocation,
  //       jobDomain,
  //       // willingToRelocate,
  //       // visaStatus,
  //       jobTitle
  //     } = req.body;

  //     // Validate input fields
  //     if (!fullname || !email || !phoneNumber || !password || !role) {
  //       return res.status(400).json({
  //         error: "All fields are required",
  //         status: false,
  //       });
  //     }

  //     // Additional validation for student-specific fields
  //     if (role === 'student' && (!currentLocation || !jobTitle)) {
  //       return res.status(400).json({
  //         error: "All student-specific fields are required",
  //         status: false,
  //       });
  //     }


  //     // Check if user exists
  //     const existingUser = await dynamoDB.get({
  //       // TableName: "Users",
  //       TableName: "Users",
  //       Key: { email }
  //     });

  //     if (existingUser.Item) {
  //       return res.status(400).json({
  //         error: "User already exists",
  //         status: false,
  //       });
  //     }


  //     const file = req.file;
  //     let s3Response;
  //     if (file) {
  //       s3Response = await uploadToS3(file, 'profile-photos');
  //     }

  //     // Hash password
  //     const hashedPassword = await bcrypt.hash(password, 10);

  //     // Prepare user data
  //     const userData = {
  //       fullname,
  //       email,
  //       phoneNumber: phoneNumber.toString(),
  //       password: hashedPassword,
  //       role,
  //       createdAt: new Date().toISOString(),
  //       updatedAt: new Date().toISOString(),
  //       profile: {
  //         profilePhoto: s3Response ? s3Response.url : null,
  //         bio: "",
  //         skills: [],
  //         resume: "",
  //         resumeOriginalName: ""

  //       }
  //     };

  //     // Add student-specific fields
  //     if (role === 'student') {
  //       userData.profile = {
  //         ...userData.profile,
  //         currentLocation,
  //         // willingToRelocate,
  //         // visaStatus,
  //         jobTitle,
  //         jobDomain
  //       };
  //     }

  //     // Save user to DynamoDB
  //     await dynamoDB.put({
  //       TableName: "Users",
  //       Item: userData
  //     });
  //     await sendEmail('welcome', email, { fullname, role });

  //     // Return success response
  //     return res.status(201).json({
  //       message: "User registered successfully",
  //       status: true,
  //       user: {
  //         fullname: userData.fullname,
  //         email: userData.email,
  //         role: userData.role,
  //         profile: userData.profile
  //       },
  //     });
  //   } catch (err) {
  //     console.error("Registration error:", err);
  //     return res.status(500).json({
  //       error: "Internal server error",
  //       details: err.message,
  //     });
  //   }
  // };




//update use
;

export const modifyProfile = async (req, res) => {
  try {
    const { email } = req.body; // Assuming email is the unique identifier
    const file = req.file;

    // Validate input
    if (!email) {
      return res.status(400).json({
        error: "Email is required",
        status: false,
      });
    }

    // Fetch user from DynamoDB
    const userData = await dynamoDB.get({
      TableName: "Users",
      Key: { email }
    });

    if (!userData.Item) {
      return res.status(404).json({
        error: "User not found",
        status: false,
      });
    }

    let s3UploadResponse;
    const oldProfilePhotoKey = userData.Item.profile?.profilePhotoKey || null;

    if (file) {
      // Upload new profile picture to S3
      s3UploadResponse = await uploadToS3(file, 'profile-photos');
    }

    // Update user profile
    const updatedProfile = {
      ...userData.Item.profile,
      profilePhoto: s3UploadResponse ? s3UploadResponse.url : userData.Item.profile?.profilePhoto,
      profilePhotoKey: s3UploadResponse ? s3UploadResponse.key : userData.Item.profile?.profilePhotoKey
    };

    const updatedUserData = {
      ...userData.Item,
      profile: updatedProfile,
      updatedAt: new Date().toISOString()
    };

    // Save updated user data to DynamoDB
    await dynamoDB.put({
      TableName: "Users",
      Item: updatedUserData
    });

    // Delete old profile photo from S3 **after** successful update
    if (oldProfilePhotoKey && s3UploadResponse) {
      await removeFromS3(oldProfilePhotoKey);
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      status: true,
      user: {
        fullname: updatedUserData.fullname,
        email: updatedUserData.email,
        role: updatedUserData.role,
        profile: updatedUserData.profile
      }
    });
  } catch (err) {
    console.error("Profile modification error:", err);
    return res.status(500).json({
      error: "Internal server error",
      details: err.message,
    });
  }
};

// Function to remove old profile picture from S3
const removeFromS3 = async (fileKey) => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileKey,
    });

    await s3Client.send(command);
    console.log(`Removed old profile photo: ${fileKey}`);
  } catch (err) {
    console.error("Error removing old profile photo:", err);
  }
};




export const updateProfile = async (req, res) => {
  try {
    const {
      email,
      fullname,
      phoneNumber,
      bio,
      skills,
      jobDomain,
      currentLocation,
      willingToRelocate,
      visaStatus,
      jobTitle
    } = req.body;

    if (!email) {
      return res.status(400).json({
        error: "Email is required",
        status: false,
      });
    }

    // Get existing user
    const existingUser = await dynamoDB.get({
      TableName: "Users",
      Key: { email }
    });

    if (!existingUser.Item) {
      return res.status(404).json({
        error: "User not found",
        status: false,
      });
    }

    // Handle file upload to S3
    const file = req.file;
    let s3Response;

    if (file) {
      // If user already has a resume, delete it from S3
      if (existingUser.Item.profile.resumeKey) {
        await deleteFromS3(existingUser.Item.profile.resumeKey);
      }
      // Upload new file to S3
      s3Response = await uploadToS3(file, "resumes");
    }

    // Process skills
    let skillsArray = skills
      ? skills.split(",").map((skill) => skill.trim()).filter(Boolean)
      : existingUser.Item.profile.skills;

    // Prepare update data
    const updateData = {
      fullname: fullname || existingUser.Item.fullname,
      phoneNumber: phoneNumber ? phoneNumber.toString() : existingUser.Item.phoneNumber,
      updatedAt: new Date().toISOString(),
      profile: {
        ...existingUser.Item.profile,
        bio: bio || existingUser.Item.profile.bio,
        skills: skillsArray,
        profilePhoto: existingUser.Item.profile.profilePhoto,
        jobDomain: jobDomain || existingUser.Item.profile.jobDomain
      }
    };

    // Update resume if new file uploaded
    if (s3Response) {
      updateData.profile.resume = s3Response.url;
      updateData.profile.resumeKey = s3Response.key; // Store S3 key for future reference
      updateData.profile.resumeOriginalName = file.originalname;
    }

    // Add student-specific fields if user is a student
    if (existingUser.Item.role === 'student') {
      updateData.profile = {
        ...updateData.profile,
        currentLocation: currentLocation || existingUser.Item.profile.currentLocation,
        willingToRelocate: willingToRelocate !== undefined
          ? willingToRelocate
          : existingUser.Item.profile.willingToRelocate,
        visaStatus: visaStatus || existingUser.Item.profile.visaStatus,
        jobTitle: jobTitle || existingUser.Item.profile.jobTitle
      };
    }

    // Update user in DynamoDB
    await dynamoDB.update({
      TableName: "Users",
      Key: { email },
      UpdateExpression: "set #userData = :userData",
      ExpressionAttributeNames: {
        "#userData": "profile"
      },
      ExpressionAttributeValues: {
        ":userData": updateData.profile
      }
    });

    // Return updated user
    return res.status(200).json({
      message: "User updated successfully",
      status: true,
      user: {
        email,
        fullname: updateData.fullname,
        phoneNumber: updateData.phoneNumber,
        role: existingUser.Item.role,
        profile: updateData.profile,
      },
    });

  } catch (err) {
    console.error("Profile update error:", err);
    return res.status(500).json({
      error: "Internal Server Error",
      message: err.message,
      status: false,
    });
  }
};

// Function to delete old resume from S3
const deleteFromS3 = async (resumeKey) => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: resumeKey,
    });

    await s3Client.send(command);
    console.log(`Deleted old resume: ${resumeKey}`);
  } catch (err) {
    console.error("Error deleting old resume:", err);
  }
};




export const getStudents = async (req, res) => {
  try {
    const params = {
      TableName: "Users",
      IndexName: "RoleIndex",
      KeyConditionExpression: "#role = :roleValue",
      ExpressionAttributeNames: {
        "#role": "role"
      },
      ExpressionAttributeValues: {
        ":roleValue": "student"
      }
    };

    const result = await dynamoDB.query(params);

    // Remove password from results
    const students = result.Items.map(student => {
      const { password, ...studentData } = student;
      return studentData;
    });

    res.status(200).json({
      success: true,
      message: "Students fetched successfully",
      data: students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch students",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Something is missing",
        success: false
      });
    }

    const result = await dynamoDB.get({
      TableName: "Users",
      Key: { email }
    });

    const user = result.Item;

    if (!user) {
      return res.status(400).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }

    const tokenData = {
      userId: user.email // Using email as the unique identifier
    };

    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

    // Remove password from user object
    const { password: userPassword, ...userData } = user;
    // await sendEmail('loginAlert', email, {
    //   fullname: user.fullname,
    //   loginTime: new Date().toLocaleString(),
    //   deviceInfo: req.headers['user-agent']
    // });

    return res.status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'strict',
        path: '/'
      })
      .json({
        message: `Welcome back ${user.fullname}`,
        user: userData,
        success: true
      });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error.message,
      success: false
    });
  }
};




//logout

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "strict",
    });

    return res.status(200).json({
      message: "User logged out successfully",
      status: true,
    });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({
      error: "Internal server error",
      details: err.message,
    });
  }
};



import { unmarshall } from "@aws-sdk/util-dynamodb";
import { GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../config/s3Config.js";

const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Controller for initiating forgot password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Get user by email (primary key)
    const getCommand = new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        email: email
      }
    });

    const { Item } = await docClient.send(getCommand);

    if (!Item) {
      return res.status(404).json({
        success: false,
        message: "User with this email doesn't exist",
      });
    }

    const verificationCode = generateVerificationCode();
    const expiryTime = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Update user with reset code using email as the primary key
    const updateCommand = new UpdateCommand({
      TableName: TABLE_NAME,
      Key: {
        email: email
      },
      UpdateExpression: "SET resetPasswordCode = :code, resetPasswordExpires = :expiry",
      ExpressionAttributeValues: {
        ":code": verificationCode,
        ":expiry": expiryTime
      },
      ReturnValues: "NONE"
    });

    await docClient.send(updateCommand);

    // Send email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Verification Code",
      html: `
        <h1>Password Reset Request</h1>
        <p>Your verification code is: <strong>${verificationCode}</strong></p>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "Verification code sent to your email",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "Error sending verification code",
    });
  }
};

// Controller for verifying the code
export const verifyCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: "Email and code are required",
      });
    }

    // Get user by email (primary key)
    const getCommand = new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        email: email
      }
    });

    const { Item } = await docClient.send(getCommand);

    if (!Item) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }

    const currentTime = Date.now();

    if (
      Item.resetPasswordCode !== code ||
      Item.resetPasswordExpires < currentTime
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }

    res.status(200).json({
      success: true,
      message: "Code verified successfully",
    });
  } catch (error) {
    console.error("Verify code error:", error);
    res.status(500).json({
      success: false,
      message: "Error verifying code",
    });
  }
};

// Controller for resetting the password
export const resetPassword = async (req, res) => {
  try {
    const { email, code, password } = req.body;

    if (!email || !code || !password) {
      return res.status(400).json({
        success: false,
        message: "Email, code, and password are required",
      });
    }

    // Get user by email (primary key)
    const getCommand = new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        email: email
      }
    });

    const { Item } = await docClient.send(getCommand);

    if (!Item) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }

    const currentTime = Date.now();

    if (
      Item.resetPasswordCode !== code ||
      Item.resetPasswordExpires < currentTime
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password and clear reset fields
    const updateCommand = new UpdateCommand({
      TableName: TABLE_NAME,
      Key: {
        email: email
      },
      UpdateExpression: "SET password = :password REMOVE resetPasswordCode, resetPasswordExpires",
      ExpressionAttributeValues: {
        ":password": hashedPassword
      },
      ReturnValues: "NONE"
    });

    await docClient.send(updateCommand);

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "Error resetting password",
    });
  }
};