import { docClient } from "../config/aws.config.js";
import { Application } from "../models/application.model.js";
import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer";
import {
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { dynamoDB } from "../models/company.model.js";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || "hireessupp@gmail.com",
    pass: process.env.EMAIL_APP_PASSWORD || "ctdw tvvn psqw haap",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const emailTemplates = {
  applicationConfirmation: `
    <!DOCTYPE html>
    <html>
    <head>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-gray-50 font-sans">
      <div class="max-w-2xl mx-auto p-6">
        <div class="bg-white rounded-xl shadow-md overflow-hidden">
          <div class="bg-indigo-900 text-white p-8">

            <h1 class="text-3xl font-bold">Application Confirmation</h1>
          </div>

          <div class="p-8">
            <p class="text-gray-800 text-lg mb-6">
              Thank you for submitting your application to Hirees. We appreciate your interest in joining our platform.
            </p>

            <div class="bg-indigo-50 border-l-4 border-indigo-900 p-6 mb-8">
              <h2 class="text-lg font-semibold text-indigo-900 mb-2">Next Steps</h2>
              <p class="text-gray-700">
                Our recruiting team will carefully review your qualifications and experience. You will receive updates regarding your application status within 3-5 business days.
              </p>
            </div>

            <div class="mb-8">
              <h2 class="text-lg font-semibold text-gray-900 mb-4">While You Wait</h2>
              <ul class="space-y-3 text-gray-700">
                <li class="flex items-start">
                  <svg class="h-6 w-6 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Enhance your profile with additional certifications and achievements
                </li>
                <li class="flex items-start">
                  <svg class="h-6 w-6 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Explore our resource center for interview preparation materials
                </li>
                <li class="flex items-start">
                  <svg class="h-6 w-6 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Review other opportunities that match your expertise
                </li>
              </ul>
            </div>

            <div class="border-t pt-6">
              <p class="text-gray-700">
                Best regards,<br>
                <span class="font-semibold">Hirees Talent Acquisition Team</span>
              </p>
            </div>
          </div>

          <div class="bg-gray-50 px-8 py-4">
            <div class="text-center text-gray-600 text-sm">
              <p>© ${new Date().getFullYear()} Hirees. All rights reserved.</p>
              <p class="mt-2">This is an automated message. Please do not reply to this email.</p>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `,

  statusUpdate: (status) => {
    const statusInfo = {
      Accepted: {
        style: "bg-emerald-600",
        icon: '<svg class="h-12 w-12 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
        title: "Application Accepted",
        message: "Congratulations on advancing to the next stage.",
        details:
          "you will receive detailed information about the subsequent steps in our selection process.",
      },
      Rejected: {
        style: "bg-gray-600",
        icon: '<svg class="h-12 w-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
        title: "Application Status Update",
        message: "Thank you for your interest in opportunities at Hirees.",
        details:
          "After careful consideration of your profile, we have decided to pursue other candidates whose qualifications more closely match our current requirements. We encourage you to apply for future positions aligned with your expertise.",
      },
      Pending: {
        style: "bg-blue-600",
        icon: '<svg class="h-12 w-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
        title: "Application in Review",
        message:
          "Your application is currently under evaluation by our recruitment team.",
        details:
          "We are thoroughly reviewing your qualifications and experience. You can expect to receive an update within 5-7 business days.",
      },
    };

    const info = statusInfo[status];

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="bg-gray-50 font-sans">
        <div class="max-w-2xl mx-auto p-6">
          <div class="bg-white rounded-xl shadow-md overflow-hidden">
            <div class="bg-indigo-900 text-white p-8">

              <h1 class="text-3xl font-bold">${info.title}</h1>
            </div>

            <div class="p-8">
              <div class="flex justify-center mb-8">
                ${info.icon}
              </div>

              <div class="mb-8 text-center">
                <div class="inline-block ${
                  info.style
                } text-white px-6 py-2 rounded-full text-sm font-semibold mb-4">
                  ${status.toUpperCase()}
                </div>
                <p class="text-gray-800 text-xl">${info.message}</p>
              </div>

              <div class="bg-gray-50 border-l-4 border-indigo-900 p-6 mb-8">
                <p class="text-gray-700">${info.details}</p>
              </div>

              <div class="border-t pt-6">
                <p class="text-gray-700">
                  Best regards,<br>
                  <span class="font-semibold">Hirees Talent Acquisition Team</span>
                </p>
              </div>
            </div>

            <div class="bg-gray-50 px-8 py-4">
              <div class="text-center text-gray-600 text-sm">
                <p>© ${new Date().getFullYear()} Hirees. All rights reserved.</p>
                <p class="mt-2">This is an automated message. Please do not reply to this email.</p>
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  },
};

const sendEmail = async (type, to, data = {}) => {
  try {
    let subject, html;

    switch (type) {
      case "applicationConfirmation":
        subject = "Your Application Has Been Received - Hirees";
        html = emailTemplates.applicationConfirmation;
        break;
      case "statusUpdate":
        subject = `Application Status Update - ${data.status} - Hirees`;
        html = emailTemplates.statusUpdate(data.status);
        break;
      default:
        throw new Error("Invalid email type");
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
};
// Apply for a job
export const applyJob = async (req, res) => {
  try {
    const userId = req.id;
    const { id: jobId } = req.params;

    // Check for existing application
    const { Items: existingApplications } = await docClient.send(
      new QueryCommand({
        TableName: "Application",
        IndexName: "job-index",
        KeyConditionExpression: "job = :job AND applicant = :applicant",
        ExpressionAttributeValues: {
          ":job": jobId,
          ":applicant": userId,
        },
      })
    );

    if (existingApplications?.length > 0) {
      return res.status(400).json({
        error: "You have already applied for this job.",
        status: false,
      });
    }

    // Get job details
    const { Item: jobDetails } = await docClient.send(
      new GetCommand({
        TableName: "Jobs",
        Key: { jobId },
      })
    );

    if (!jobDetails) {
      return res.status(404).json({
        error: "Job not found.",
        status: false,
      });
    }

    // Get applicant details
    const { Items: applicantDetails } = await docClient.send(
      new QueryCommand({
        TableName: "Users",
        KeyConditionExpression: "#email = :email",
        ExpressionAttributeNames: { "#email": "email" },
        ExpressionAttributeValues: { ":email": userId },
      })
    );

    if (!applicantDetails?.length) {
      return res.status(404).json({
        error: "Applicant not found.",
        status: false,
      });
    }

    const applicantEmail = applicantDetails[0].email || userId;

    // Create application
    const applicationId = uuidv4();
    const newApplication = {
      id: applicationId,
      job: jobId,
      applicant: userId,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await docClient.send(
      new PutCommand({
        TableName: "Application",
        Item: newApplication,
      })
    );

    // Send confirmation email
    try {
      await sendEmail("applicationConfirmation", applicantEmail);
    } catch (emailError) {
      console.error("Error sending email notification:", emailError);
    }

    return res.status(201).json({
      message: "Job application submitted successfully.",
      status: true,
      application: newApplication,
    });
  } catch (err) {
    console.error("Apply job error:", err);
    return res.status(500).json({
      error: "Internal server error",
      details: err.message,
    });
  }
};

// Get all applied jobs for a user
export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.id;

    const { Items: applications } = await dynamoDB.query({
      TableName: "Application",
      IndexName: "applicant-index",
      KeyConditionExpression: "applicant = :applicantId",
      ExpressionAttributeValues: { ":applicantId": userId },
      ScanIndexForward: false,
    });

    if (!applications?.length) {
      return res.status(200).json({
        status: true,
        applications: [],
      });
    }

    const populatedApplications = await Promise.all(
      applications.map(async (application) => {
        const { Item: job } = await dynamoDB.get({
          TableName: "Jobs",
          Key: { jobId: application.job },
        });

        if (job) {
          const { Item: company } = await dynamoDB.get({
            TableName: "Companies",
            Key: { companyId: job.companyId },
          });

          return {
            ...application,
            job: { ...job, company: company || null },
          };
        }
        return application;
      })
    );

    return res.status(200).json({
      status: true,
      applications: populatedApplications,
    });
  } catch (err) {
    console.error("Error fetching applications:", err);
    return res.status(500).json({
      error: "Internal server error",
      details: err.message,
    });
  }
};

// Get all applicants for a job
export const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;

    const { Items: applications } = await docClient.query({
      TableName: "Application",
      IndexName: "job-index",
      KeyConditionExpression: "job = :job",
      ExpressionAttributeValues: { ":job": jobId },
    });

    if (!applications?.length) {
      return res.status(404).json({
        error: "No applications found",
        status: false,
      });
    }

    const applicantsWithDetails = await Promise.all(
      applications.map(async (application) => {
        try {
          const { Item: userDetails } = await docClient.get({
            TableName: "Users",
            Key: { email: application.applicant },
          });

          if (!userDetails) {
            throw new Error(`User not found: ${application.applicant}`);
          }

          return {
            applicationId: application.id,
            jobId: application.job,
            status: application.status,
            createdAt: application.createdAt,
            updatedAt: application.updatedAt,
            applicant: {
              fullName: userDetails.fullname,
              email: userDetails.email,
              phoneNumber: userDetails.phoneNumber || null,
              profile: userDetails.profile || {},
            },
          };
        } catch (error) {
          console.error(`Error fetching user details: ${error}`);
          return {
            applicationId: application.id,
            jobId: application.job,
            status: application.status,
            createdAt: application.createdAt,
            updatedAt: application.updatedAt,
            applicant: {
              email: application.applicant,
              error: "Failed to fetch complete user details",
            },
          };
        }
      })
    );

    applicantsWithDetails.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    return res.status(200).json({
      status: true,
      applications: applicantsWithDetails,
    });
  } catch (err) {
    console.error("Get applicants error:", err);
    return res.status(500).json({
      error: "Internal server error",
      details: err.message,
    });
  }
};

// Update application status
export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;

    if (
      !status ||
      !["pending", "accepted", "rejected"].includes(status.toLowerCase())
    ) {
      return res.status(400).json({
        error: "Valid status is required",
        status: false,
      });
    }

    const application = await Application.get(applicationId);
    if (!application) {
      return res.status(404).json({
        error: "Application not found",
        status: false,
      });
    }

    const { Attributes } = await docClient.send(
      new UpdateCommand({
        TableName: "Application",
        Key: { id: applicationId },
        UpdateExpression: "set #status = :status, updatedAt = :updatedAt",
        ExpressionAttributeNames: { "#status": "status" },
        ExpressionAttributeValues: {
          ":status": status.toLowerCase(),
          ":updatedAt": new Date().toISOString(),
        },
        ReturnValues: "ALL_NEW",
      })
    );
    console.log(status);
    try {
      await sendEmail("statusUpdate", application.applicant, { status });
    } catch (emailError) {
      console.error("Error sending status update email:", emailError);
    }

    return res.status(200).json({
      status: true,
      message: "Status updated successfully",
      application: Attributes,
    });
  } catch (err) {
    console.error("Update application error:", err);
    return res.status(500).json({
      error: "Internal server error",
      details: err.message,
    });
  }
};
