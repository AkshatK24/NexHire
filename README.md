# NexHire

NexHire is an AI-powered Placement Copilot built to help students understand whether they are actually ready to apply for a role before hitting the "Apply" button.

During placement season, students often apply to companies without knowing how well their skills match the job requirements. NexHire tries to solve that problem by analyzing a resume against a job description and providing meaningful insights such as match score, missing skills, preparation roadmap, interview topics, and company-specific hiring information.

Instead of simply telling candidates whether they are a good fit, the platform also helps them understand what they need to improve and how they should prepare for the recruitment process.

---

## What NexHire Does

- Upload a resume in PDF format
- Paste any job description
- Get an ATS-style match score
- Identify matching and missing skills
- Receive an apply recommendation (Yes / Maybe / No)
- View expected interview topics
- Get company-specific recruitment insights when available
- Generate a personalized preparation roadmap
- Receive practical suggestions for improving readiness

---

## Why I Built This

As a student preparing for placements, I noticed that most candidates spend a lot of time applying for jobs but very little time understanding whether they actually meet the requirements.

I wanted to build a tool that could act like a placement mentor something that could quickly compare a resume with a role, highlight gaps, and provide a clear action plan for preparation.

NexHire was created with that idea in mind.

---

## Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- Axios

### Backend
- Python
- Flask
- Flask-CORS

### AI & Resume Processing
- Groq API (Llama 3.3 70B)
- PDFPlumber

### Deployment
- Vercel
- Render

---

## Project Structure

```bash
NexHire
│
├── frontend
│   ├── src
│   ├── public
│   └── vite.config.js
│
├── backend
│   ├── app.py
│   ├── analyzer.py
│   ├── parser.py
│   └── requirements.txt
│
└── README.md
```

---

## Running the Project Locally

### Clone the Repository

```bash
git clone https://github.com/AkshatK24/NexHire.git

cd NexHire
```

### Backend Setup

```bash
cd backend

pip install -r requirements.txt

python app.py
```

Backend will run on:

```bash
http://127.0.0.1:5000
```

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend will run on:

```bash
http://localhost:5173
```

---

## Environment Variables

Create a `.env` file inside the backend directory:

```env
GROQ_API_KEY=your_api_key_here
```

---

## How It Works

1. Upload your resume.
2. Enter the target company name.
3. Paste the job description.
4. Let NexHire analyze the resume.
5. Review:
   - Match Score
   - Apply Recommendation
   - Matching Skills
   - Missing Skills
   - Interview Topics
   - Recruitment Process
   - Preparation Roadmap
   - Personalized Suggestions

---

## 📸 Screenshots

### Landing Page

<img width="1897" height="866" alt="image" src="https://github.com/user-attachments/assets/e2557f29-870f-4ab2-9950-348baf41a868" />

---

### Resume Analysis Dashboard


<img width="1872" height="862" alt="image" src="https://github.com/user-attachments/assets/f1d2d924-4239-4de4-9079-cc75490a9e3e" />



---

### Personalized Preparation Roadmap

<img width="1872" height="863" alt="image" src="https://github.com/user-attachments/assets/02dc1416-0c69-4833-ad2b-a937b462d399" />


---

### Skill Gap Analysis

<img width="1868" height="858" alt="image" src="https://github.com/user-attachments/assets/c2203916-d9e4-47c0-91a7-afae168ccbb8" />


## Future Improvements

Some ideas planned for future versions:

- Resume improvement suggestions
- AI-generated resume rewriting
- Mock interview preparation
- Company-wise question banks
- Placement analytics dashboard
- Resume version comparison

---

## Author

Akshat Kumar

Final-year Engineering Student | Aspiring Software Engineer & Product Manager

GitHub: https://github.com/AkshatK24

---

If you found this project interesting, feel free to star the repository. Feedback and suggestions are always welcome.
