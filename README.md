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
- **Styling**: Tailwind CSS
- **Date Utilities**: date-fns

### Dependencies
- **Backend**: Express 4.18.2, Mongoose 8.0.0, bcryptjs 2.4.3, jsonwebtoken 9.0.2, dotenv 16.3.1, CORS 2.8.5, Axios 1.13.2, Nodemon 3.0.1 (dev)
- **Frontend**: Next.js 14.0.0, React 18.2.0, React DOM 18.2.0, Axios 1.6.0, date-fns 4.1.0, Tailwind CSS 3.3.5, PostCSS 8.4.31, Autoprefixer 10.4.16

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
│   │   ├── doctors.js            # Doctor management endpoints
│   │   ├── patients.js           # Patient CRUD endpoints
│   │   ├── appointments.js       # Appointment management endpoints
│   │   └── sessions.js           # Session management endpoints
│   ├── server.js                 # Express server setup
│   ├── verify-booking.js         # Booking verification utility
│   ├── verify-strict.js          # Strict verification utility
│   ├── verify-strict-retry.js    # Retry verification utility
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.jsx        # Root layout
│   │   │   ├── page.jsx          # Home page
│   │   │   ├── globals.css       # Global styles
│   │   │   ├── login/            # Login page
│   │   │   │   └── page.jsx
│   │   │   ├── register/         # Registration page
│   │   │   │   └── page.jsx
│   │   │   ├── dashboard/        # Doctor dashboard
│   │   │   │   └── page.jsx
│   │   │   ├── patient-dashboard/# Patient dashboard
│   │   │   │   └── page.jsx
│   │   │   ├── patients/         # Patient list and details
│   │   │   │   ├── page.jsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.jsx
│   │   │   ├── appointments/     # Appointment management
│   │   │   │   ├── page.jsx
│   │   │   │   └── book/
│   │   │   │       └── page.jsx
│   │   │   └── sessions/         # Session management
│   │   │       └── [id]/
│   │   │           └── page.jsx
│   │   ├── components/           # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   ├── AppointmentForm.jsx
│   │   │   ├── PatientForm.jsx
│   │   │   ├── PrescriptionForm.jsx
│   │   │   └── SessionForm.jsx
│   │   └── lib/
│   │       └── api.js            # API client utilities
│   ├── jsconfig.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
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
- `POST /api/auth/register` - Register a new user (doctor/patient)
- `POST /api/auth/login` - Login user and get JWT token

### Doctors
- `GET /api/doctors` - Get all doctors
- `PUT /api/doctors/availability` - Update doctor availability (requires date, startTime, endTime)

### Patients
- `GET /api/patients` - Get all patients (doctor only)
- `GET /api/patients/me` - Get current user's patient profile
- `GET /api/patients/:id` - Get patient by ID
- `POST /api/patients` - Create new patient profile
- `PUT /api/patients/:id` - Update patient profile
- `DELETE /api/patients/:id` - Delete patient

### Appointments
- `GET /api/appointments` - Get all appointments (doctor only)
- `GET /api/appointments/slots` - Get available time slots for a doctor on a specific date
- `GET /api/appointments/:id` - Get single appointment
- `GET /api/appointments/patient/:patientId` - Get appointments for a specific patient
- `POST /api/appointments` - Create new appointment (30-minute slots)
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment

### Sessions (Medical Consultations)
- `GET /api/sessions` - Get all sessions
- `GET /api/sessions/:id` - Get single session details
- `GET /api/sessions/patient/:patientId` - Get all sessions for a patient
- `POST /api/sessions` - Create new session with prescription (complaints, diagnosis, notes, medications)
- `PUT /api/sessions/:id` - Update session details

## Data Models

### User
- email (unique, lowercase)
- password (hashed)
- name
- phone
- role (doctor/patient)
- availability (array of date ranges for doctors)
- createdAt

### Patient
- userId (reference to User)
- dateOfBirth
- gender (male/female/other)
- address
- medicalNotes
- createdAt

### Appointment
- patientId (reference to Patient)
- doctorId (reference to User)
- date
- time
- status (scheduled/completed/cancelled)
- createdAt
- Note: Unique constraint on doctor + date + time (excluding cancelled appointments)

### Session (Medical Consultation)
- appointmentId (reference to Appointment)
- patientId (reference to Patient)
- doctorId (reference to User)
- complaints (patient's complaints)
- diagnosis (doctor's diagnosis)
- notes (additional notes)
- medications (array with name, dosage, frequency, duration)
- sessionDate (timestamp)

## Scripts

### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload (nodemon)

### Frontend
- `npm run dev` - Start development server on port 3000
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Utilities
- `node verify-booking.js` - Test complete booking flow (doctor registration, availability setup, appointment booking)
- `node verify-strict.js` - Verify strict booking constraints
- `node verify-strict-retry.js` - Test booking with retry logic

## Security Features

- **Password Hashing**: bcryptjs for secure password storage
- **JWT Authentication**: Token-based authentication for API endpoints with Bearer token header
- **Role-Based Access Control**: 
  - Doctors-only endpoints for viewing all patients and appointments
  - Patients can only view their own data
  - Doctors can only access sessions related to their appointments
- **Double Booking Prevention**: Unique constraint prevents same doctor from having multiple appointments at the same time
- **CORS**: Configured to allow frontend-backend communication
- **Environment Variables**: Sensitive data stored in .env files (PORT, MONGODB_URI, JWT_SECRET, JWT_EXPIRE)
- **Access Control Middleware**: `auth` middleware verifies JWT tokens, `roleCheck` middleware validates user roles

## Future Enhancements

- Appointment reminders (email/SMS notifications)
- Patient medical history timeline
- Advanced doctor availability scheduling
- Payment processing integration
- Email notifications for appointments and status changes
- Mobile app version
- Prescription PDF generation and printing
- Patient search and filtering
- Analytics dashboard for clinic administrators
- Appointment rescheduling functionality
- Video consultation integration

## License

This project is part of an internship program.
