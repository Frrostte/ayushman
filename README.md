# Clinic Management System

A full-stack web application for managing clinic operations, including patient records, appointments, and medical sessions. Built with Node.js/Express for the backend and Next.js for the frontend.

## Features

- **User Authentication**: Secure login and registration for doctors and patients
- **Patient Management**: Create and manage patient profiles with medical information
- **Appointment Scheduling**: Book, view, and manage appointments between patients and doctors
- **Medical Sessions**: Track doctor-patient consultation sessions
- **Role-Based Access Control**: Different permissions for doctors and patients
- **Responsive UI**: Modern, user-friendly interface built with React

## Tech Stack

### Backend
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs for password hashing, CORS enabled
- **Environment**: Node.js

### Frontend
- **Framework**: Next.js 14
- **UI Library**: React 18
- **HTTP Client**: Axios
- **Styling**: CSS

### Dependencies
- **Backend**: Express, Mongoose, bcryptjs, jsonwebtoken, dotenv, CORS
- **Frontend**: Next.js, React, React DOM, Axios

## Project Structure

```
clinic-management/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database connection
│   ├── middleware/
│   │   ├── auth.js               # JWT authentication middleware
│   │   └── roleCheck.js          # Role-based access control
│   ├── models/
│   │   ├── User.js               # User schema (doctor/patient)
│   │   ├── Patient.js            # Patient profile schema
│   │   ├── Appointment.js        # Appointment schema
│   │   └── Session.js            # Medical session schema
│   ├── routes/
│   │   ├── auth.js               # Authentication endpoints
│   │   ├── patients.js           # Patient CRUD endpoints
│   │   ├── appointments.js       # Appointment management endpoints
│   │   └── sessions.js           # Session management endpoints
│   ├── server.js                 # Express server setup
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.jsx        # Root layout
│   │   │   ├── page.jsx          # Home page
│   │   │   ├── login/            # Login page
│   │   │   ├── register/         # Registration page
│   │   │   ├── dashboard/        # Doctor dashboard
│   │   │   ├── patient-dashboard/# Patient dashboard
│   │   │   ├── patients/         # Patient list and details
│   │   │   ├── appointments/     # Appointment management
│   │   │   └── sessions/         # Session management
│   │   ├── components/           # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   ├── AppointmentForm.jsx
│   │   │   ├── PatientForm.jsx
│   │   │   ├── PrescriptionForm.jsx
│   │   │   └── SessionForm.jsx
│   │   ├── lib/
│   │   │   └── api.js            # API client utilities
│   │   └── app/
│   │       └── globals.css       # Global styles
│   ├── next.config.js
│   └── package.json
│
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB instance (local or cloud)
- npm or yarn

### Installation

#### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend root:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   ```

4. Start the server:
   ```bash
   npm run dev    # Development with nodemon
   npm start      # Production
   ```

The backend API will be available at `http://localhost:5000`

#### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Patients
- `GET /api/patients` - Get all patients
- `GET /api/patients/:id` - Get patient by ID
- `POST /api/patients` - Create new patient
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient

### Appointments
- `GET /api/appointments` - Get all appointments
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment

### Sessions
- `GET /api/sessions` - Get all sessions
- `GET /api/sessions/:id` - Get session by ID
- `POST /api/sessions` - Create new session
- `PUT /api/sessions/:id` - Update session

## Data Models

### User
- email (unique)
- password (hashed)
- name
- phone
- role (doctor/patient)
- createdAt

### Patient
- userId (reference to User)
- dateOfBirth
- gender
- address
- medicalNotes
- createdAt

### Appointment
- patientId
- doctorId
- date
- time
- status (scheduled/completed/cancelled)
- createdAt

## Scripts

### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Security Features

- **Password Hashing**: bcryptjs for secure password storage
- **JWT Authentication**: Token-based authentication for API endpoints
- **Role-Based Access**: Middleware for controlling access based on user role
- **CORS**: Configured to allow frontend-backend communication
- **Environment Variables**: Sensitive data stored in .env files

## Future Enhancements

- Prescription management
- Appointment reminders
- Medical history and patient records
- Doctor availability scheduling
- Payment processing
- Email notifications
- Mobile app version

## License

This project is part of an internship program.
