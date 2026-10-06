# Resume Roaster 🚀

A full-stack, AI-powered resume analytics and optimization platform. Resume Roaster helps candidates evaluate their resumes with real-time ATS scoring, generate tailored rewrites using Google Gemini AI, optimize keyword targeting, track version history with visual diff comparisons, and export polished PDF versions.

---

## 🚀 Features

- 🔒 User Authentication: Secure JWT-based authentication with HTTP-only cookie management and password hashing using bcrypt.
- 📊 ATS Score Analysis: Real-time evaluation of resume readability, structure, and job-match relevance.
- 🤖 AI Resume Rewrite: Instant AI-driven content enhancements powered by the @google/genai SDK.
- 🎯 Keyword Optimization: Uncovers missing industry keywords and optimizes phrase density to boost applicant tracking system (ATS) performance.
- 📜 Version History: Maintains a timeline of resume iterations and revisions over time.
- 🔍 Diff Comparison: Visual side-by-side and inline diff inspection to compare changes between versions.
- 📈 Analytics Dashboard: Interactive metrics and historical score charts built with Recharts.
- 📄 PDF Export: On-demand client-side PDF document generation using @react-pdf/renderer.

---

## 🛠️ Tech Stack

### Backend

- **Runtime & Framework:** Node.js (>=20) + Express 5 (ES Modules)
- **Database & Modeling: MongoDB + Mongoose**
- **AI Integration:** @google/genai (Google Gemini API)
- **Document Parsing:** pdf-parse, multer
- **Security & Validation:** jsonwebtoken, bcrypt, cookie-parser, cors, express-rate-limit, zod
- **Utilities:** diff, morgan

### Frontend

- **Framework:** React + Vite
- **Styling:** Tailwind CSS v4, clsx, tailwind-merge
- **Animations:** Framer Motion, tw-animate-css
- **State & Data Fetching:** @tanstack/react-query, Axios
- **Routing:** React Router v7
- **Data Visualization & Icons:** Recharts, Lucide React
- **Document Handling:** @react-pdf/renderer, react-dropzone
---

## 📦 Installation

### Backend

1. Clone the repository:
   ```bash
   git clone https://github.com/07Gautammishra/AI_RESUME_CHECKER.git,
   cd AI_RESUME_CHECKER/backend or AI_RESUME_CHECKER/frontend
   
### ⚙️ Environment Variables
- **Backend** (/backend/.env)
  
```js
PORT=5000
NODE_ENV=development
MONGO_URL=mongodb://localhost:27017/resume_roaster
CLIENT_ORIGIN=http://localhost:5173
COOKIE_NAME=token
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES=7d
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-3-flash-preview
```

- **Frontend** (/frontend/.env)
  
```js
VITE_API_URL=http://localhost:5000/api
```
### Build the app
- **Backend Setup**
```shell
npm install or npm i
npm start
```

- **Frontend Setup**

```shell
npm install or npm i
npm run dev
```

