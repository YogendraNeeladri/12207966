 # AffordMed URL Shortener Microservice
This is a Full Stack URL Shortener application developed for **Afford Medical Technologies** as part of the Campus Hiring Evaluation project.
Link: https://shortnerurll.netlify.app/
---

##  Project Structure
└── frontend/
├── src/
├── public/
└── README.md

#Logging Instructions
This app logs every important backend activity using the AffordMed Logging API.

Logging is done from /middleware/logger.js
To verify logs, check the request being sent to:
http://20.244.56.144/evaluation-service/logs
If logging fails, check the status code (401 = wrong or expired token)

 Postman Testing
API: Create a Short URL
POST http://localhost:5000/shorturls

Body (JSON):
{
  "originalUrl": "https://www.affordmed.com",
  "customCode": "afford123",           // optional
  "validityInMinutes": 60              // optional, default = 30
}
 API: Redirect to Original URL
GET http://localhost:5000/afford123

 API: Get Short URL Stats
GET http://localhost:5000/shorturls/afford123

Frontend Setup (React + Material UI)
1. Setup Frontend Project
cd frontend
npm install
2. Run the Frontend

npm start
By default, React runs on port 3000.

🔧 Environment Variables (Frontend)

##env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/urlshortener
BASE_URL=http://localhost:5000
LOGGING_BEARER_TOKEN=your_bearer_token_here

axios.post(`${process.env.REACT_APP_BASE_URL}/shorturls`, { ... });

 Deployment Notes
Ensure MongoDB is hosted (e.g., MongoDB Atlas) or use Docker
Replace BASE_URL with production domain
Set LOGGING_BEARER_TOKEN as a secure environment variable

Use tools like Render, Vercel, or Netlify for frontend
Use Railway, Render, or Heroku for backend

Built by Neeladri Yogendra
Roll No: 12207966
Email: yogiyadav1970@gmail.com
Afford Medical Technologies — Campus Hiring Evaluation 2025
