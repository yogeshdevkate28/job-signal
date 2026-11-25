# Job Signal

**A Full-Stack Job Discovery and Application Tracking Platform**

Job Signal is a web application designed to help job seekers discover relevant job opportunities, explore job details, receive personalized job recommendations, and manage their job applications from one place.

## Overview

Searching for jobs and keeping track of applications can become difficult when opportunities and application updates are spread across different platforms.

Job Signal brings these activities together in one application. Users can create an account, manage their profiles, explore job opportunities, view recommendations, and track applications throughout the hiring process.

## Features

### 1. Authentication and User Accounts
- User registration and login.
- JWT-based authentication.
- User profile management.
- Resume upload and profile information management.

### 2. Job Discovery
- Browse available job opportunities.
- View detailed job descriptions.
- Explore company and job information.
- Access external application links.

### 3. Job Recommendations
- View recommended job opportunities.
- Match job opportunities against user profile information and skills.

### 4. Application Tracking
- Add jobs to a personal application tracker.
- Track application status:
  - Wishlisted
  - Applied
  - Interview
  - Offer
  - Rejected
  - Withdrawn
- Update application status.
- Maintain notes for applications.

### 5. Dashboard
- View application statistics.
- Monitor job application progress.
- Access relevant job and application information.

## Technology Stack

| Layer          | Technologies 
| Frontend       | React, Vite, JavaScript 
| Styling        | CSS 
| Backend        | Python, Django 
| API            | Django REST Framework 
| Authentication | JWT, SimpleJWT 
| Database       | PostgreSQL 
| HTTP Client    | Axios 
| Version Control| Git, GitHub 

## System Architecture

Job Signal follows a frontend-backend architecture.

```text
                 User
                  |
                  v
          React Frontend
          (Vite Application)
                  |
                  | HTTP / REST API
                  | JWT Authentication
                  v
          Django Backend
          (Django REST Framework)
                  |
          +-------+--------+
          |                |
          v                v
     PostgreSQL       Business Logic
       Database       and API Services
```

The React frontend communicates with the Django backend through REST APIs. Django handles authentication, application logic, data processing, and database operations. PostgreSQL stores application data.

## Project Structure

```text
job-signal/
│
├── backend/
│   ├── accounts/
│   ├── config/
│   ├── jobs/
│   ├── startups/
│   ├── .env.example
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   └── pages/
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

## Getting Started

Follow these instructions to run Job Signal locally.

### Prerequisites

Install the following:

- Python
- Node.js and npm
- PostgreSQL
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/yogeshdevkate28/job-signal.git
cd job-signal
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Create a Python virtual environment:

```bash
python -m venv venv
```

Activate it on Windows PowerShell:

```powershell
venv\Scripts\Activate.ps1
```

Install the Python dependencies:

```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Create a `.env` file inside the `backend/` directory.

Use the following variables:

```env
SECRET_KEY=your-django-secret-key
DB_PASSWORD=your-postgresql-password
```

Generate your own Django secret key and use your own PostgreSQL password.

Never commit your actual `.env` file.

### 4. Configure PostgreSQL

Create a PostgreSQL database named:

```sql
CREATE DATABASE jobsignal_db;
```

The default database configuration uses:

- Database name: `jobsignal_db`
- Database user: `postgres`
- Host: `localhost`
- Port: `5432`

If your PostgreSQL configuration is different, update the database settings in `backend/config/settings.py` accordingly.

### 5. Run Database Migrations

From the backend directory:

```bash
python manage.py migrate
```

Optionally create an administrator account:

```bash
python manage.py createsuperuser
```

### 6. Start the Backend Server

```bash
python manage.py runserver
```

The backend runs at:

`http://127.0.0.1:8000/`

API base URL:

`http://127.0.0.1:8000/api/`

### 7. Frontend Setup

Open a second terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend runs at:

`http://localhost:5173/`

## Security

- Secret keys and database passwords are stored in environment variables.
- The actual `.env` file is excluded through `.gitignore`.
- `.env.example` provides a template for required environment variables.
- JWT authentication is used for protected API access.

## Future Improvements

Potential areas for further development:

- Integrate external job data sources.
- Improve job recommendation and matching algorithms.
- Add background processing for job data ingestion.
- Introduce automated testing for backend APIs and frontend workflows.
- Add deployment, monitoring, and production infrastructure.
- Improve analytics and application insights.

## Project Status

Job Signal is an actively developed full-stack project. Its core authentication, profile management, job discovery, recommendations, dashboard, and application tracking workflows have been implemented.

## Author

**Yogesh Devkate**

GitHub: [@yogeshdevkate28](https://github.com/yogeshdevkate28)

---

If you find this project interesting, feel free to explore the repository and share feedback.
