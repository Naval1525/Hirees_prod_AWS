# Hirees.com - Professional Job Portal Platform

A modern, scalable job portal platform built with React, Node.js, and AWS services, designed to connect talented professionals with leading companies worldwide.

## 🌟 Overview

Hirees.com is a full-featured job portal that streamlines the recruitment process for both job seekers and employers. The platform offers advanced features like real-time job matching, automated application tracking, and intelligent candidate screening.

## 🏗️ Architecture

### Cloud Infrastructure (AWS)
- **Compute**: AWS EC2 for application servers
- **Database**: AWS DynamoDB for scalable NoSQL storage
- **Storage**: AWS S3 for file storage and media management
- **Caching**: AWS ElastiCache (Redis) for performance optimization
- **CDN**: Amazon CloudFront for content delivery
- **Load Balancing**: AWS Application Load Balancer
- **Security**: AWS WAF and Shield for DDoS protection
- **Monitoring**: AWS CloudWatch for system monitoring
- **CI/CD**: AWS CodePipeline for automated deployments

### Backend Stack
- **Runtime**: Node.js with Express.js
- **Database**: AWS DynamoDB
- **File Storage**: AWS S3
- **Caching**: Redis
- **Authentication**: JWT with refresh tokens
- **Email Service**: AWS SES with Nodemailer
- **Image Processing**: Cloudinary
- **API Documentation**: Swagger/OpenAPI
- **Testing**: Jest and Supertest

### Frontend Stack
- **Framework**: React 18 with Vite
- **State Management**: Redux Toolkit
- **Data Fetching**: React Query
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Routing**: React Router v6
- **Animations**: Framer Motion
- **3D Graphics**: Three.js
- **Form Handling**: React Hook Form
- **Validation**: Zod

## 🚀 Key Features

### For Job Seekers
- Advanced job search with filters
- One-click job applications
- Resume builder and management
- Job alerts and notifications
- Application tracking
- Company reviews and ratings
- Career insights and analytics

### For Employers
- AI-powered candidate matching
- Applicant tracking system
- Company profile management
- Job posting and management
- Candidate screening tools
- Analytics dashboard
- Bulk candidate management

### Platform Features
- Real-time notifications
- Multi-language support
- Dark/Light mode
- Mobile responsive design
- Advanced search algorithms
- Secure file handling
- Automated email notifications

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- AWS Account with appropriate permissions
- Redis server
- Git

## 🛠️ Installation

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/hirees.com.git
   cd hirees.com
   ```

2. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the backend directory:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=production

   # AWS Configuration
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   AWS_REGION=your_aws_region
   AWS_S3_BUCKET=your_s3_bucket
   AWS_DYNAMODB_TABLE=your_dynamodb_table

   # Security
   JWT_SECRET=your_jwt_secret
   JWT_REFRESH_SECRET=your_refresh_secret
   JWT_EXPIRES_IN=1h
   JWT_REFRESH_EXPIRES_IN=7d

   # Redis Configuration
   REDIS_URL=your_redis_url
   REDIS_PASSWORD=your_redis_password

   # Email Configuration
   SMTP_HOST=your_smtp_host
   SMTP_PORT=587
   SMTP_USER=your_smtp_user
   SMTP_PASS=your_smtp_password

   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   ```

4. **Start the backend server**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the frontend directory:
   ```env
   VITE_API_URL=https://api.hirees.com
   VITE_APP_ENV=production
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 📦 Project Structure

```
├── backend/
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Custom middleware
│   │   ├── services/      # Business logic
│   │   ├── utils/         # Utility functions
│   │   └── config/        # Configuration files
│   ├── tests/            # Test files
│   └── docs/             # API documentation
│
└── frontend/
    ├── src/
    │   ├── components/    # React components
    │   ├── pages/        # Page components
    │   ├── store/        # Redux store
    │   ├── hooks/        # Custom hooks
    │   ├── utils/        # Utility functions
    │   ├── services/     # API services
    │   ├── styles/       # Global styles
    │   └── assets/       # Static assets
    ├── public/           # Public files
    └── tests/            # Test files
```

## 🚀 Deployment

### Production Deployment
1. **Backend Deployment**
   - AWS Elastic Beanstalk for Node.js application
   - AWS CodePipeline for CI/CD
   - AWS CloudWatch for monitoring
   - AWS WAF for security

2. **Frontend Deployment**
   - AWS S3 for static hosting
   - CloudFront for CDN
   - Route 53 for DNS management
   - ACM for SSL certificates

3. **Database Deployment**
   - AWS DynamoDB for data storage
   - AWS ElastiCache for Redis
   - AWS Backup for data backup

4. **Monitoring and Logging**
   - AWS CloudWatch for metrics
   - AWS X-Ray for tracing
   - AWS CloudTrail for audit logs

## 🔒 Security Features

- JWT-based authentication
- Role-based access control
- Rate limiting
- Input validation
- XSS protection
- CSRF protection
- SQL injection prevention
- File upload validation
- Secure password hashing
- Regular security audits

## 📈 Performance Optimization

- Redis caching
- CDN integration
- Image optimization
- Code splitting
- Lazy loading
- Database indexing
- Query optimization
- Compression
- Minification

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👥 Authors

- Naval Bihani - Lead Developer

## 🙏 Acknowledgments

- AWS for cloud infrastructure
- Shadcn UI for component library
- The open-source community
- All contributors and supporters

## 📞 Support

For support, email support@hirees.com or join our Slack channel.