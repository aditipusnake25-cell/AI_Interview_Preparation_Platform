# MockMind — AI Interview Preparation Platform 🚀

MockMind is an AI-powered interview preparation platform designed to help students and job seekers prepare for technical interviews. It combines interview management, AI-generated interview questions, and intelligent answer evaluation to make interview preparation more structured and effective.

## 🌐 Live Demo

- **Frontend:** Add your deployed frontend URL here
- **Backend API:** https://ai-interview-preparation-platform-2mby.onrender.com
- **GitHub Repository:** https://github.com/aditipusnake25-cell/AI_Interview_Preparation_Platform

## ✨ Features

### 🔐 User Authentication
- User registration and login.
- Secure password hashing using bcrypt.
- JWT-based authentication for protected API routes.

### 📝 Interview Management
- Create interview preparation records.
- View saved interviews.
- Update existing interview details.
- Delete interview records.
- Store interview data in MongoDB.

### 🤖 AI-Powered Interview Preparation
- Generate interview questions based on job roles and relevant skills.
- Use Google Gemini AI to support technical interview preparation.
- Evaluate submitted answers with AI-generated feedback.
- Help users identify areas for improvement.

### 🔗 REST API Integration
- Connect the React frontend with the Express backend.
- Organize endpoints for authentication, interviews, and AI features.
- Handle API requests and errors.

### ☁️ Cloud Deployment
- Deploy the frontend and backend using Render.
- Store application data in MongoDB Atlas.
- Configure production environment variables.
- Connect the frontend to the deployed backend API.

## 🛠️ Tech Stack

### Frontend
- React.js
- JavaScript
- Vite
- HTML5
- CSS3

### Backend
- Node.js
- Express.js
- REST APIs
- JSON Web Tokens (JWT)
- bcrypt

### Database
- MongoDB Atlas
- Mongoose

### AI Integration
- Google Gemini API

### Development Tools
- Git
- GitHub
- npm
- Render
- Postman

## 🏗️ Project Structure

```text
AI_Interview_Preparation_Platform/
│
├── Backend/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── .env
│
├── .gitignore
└── README.md
