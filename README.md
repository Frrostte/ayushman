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
- **Authentication**: JWT (JSON Web Token)
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
│   ├── .env                      # Environment variables (not committed)
│   ├── package.json
│   └── package-lock.json
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
│   │   │   ├── Navbar.jsx        # Navigation bar for all pages
│   │   │   ├── Button.jsx        # Reusable button component
│   │   │   ├── Input.jsx         # Reusable input field component
│   │   │   ├── Card.jsx          # Card layout component
│   │   │   ├── Select.jsx        # Dropdown/select component
│   │   │   ├── AppointmentForm.jsx # Form for booking/managing appointments
│   │   │   ├── PatientForm.jsx   # Form for patient profile creation/editing
│   │   │   ├── SessionForm.jsx   # Form for creating consultation sessions
│   │   │   └── PrescriptionForm.jsx # Form for adding prescriptions in sessions
│   │   └── lib/
│   │       └── api.js            # API client utilities
│   ├── jsconfig.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   └── package-lock.json
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
   JWT_EXPIRE=7d
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

## Environment Configuration

### Backend (.env)
```
PORT=5000                              # Server port (default: 5000)
MONGODB_URI=mongodb://localhost:27017/clinic-db  # MongoDB connection string
JWT_SECRET=your_secret_key_here       # Secret key for JWT signing (keep secure!)
JWT_EXPIRE=7d                          # Token expiration time (e.g., '7d', '24h')
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api    # Backend API endpoint (must be public for client-side access)
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user (doctor/patient), returns JWT token and user info
- `POST /api/auth/login` - Login user and get JWT token, validates credentials
- `GET /api/auth/user` - Get logged in user profile (requires authentication)

### Doctors
- `GET /api/doctors` - Get all doctors (authentication required)
- `PUT /api/doctors/availability` - Update doctor availability with date, startTime, endTime (doctor only)

### Patients
- `GET /api/patients` - Get all patients with user details (doctor only)
- `GET /api/patients/me` - Get current user's patient profile
- `GET /api/patients/:id` - Get patient by ID with user details
- `POST /api/patients` - Create new patient profile (requires userId, dateOfBirth, gender, address, medicalNotes)
- `PUT /api/patients/:id` - Update patient profile (dateOfBirth, gender, address, medicalNotes)
- `DELETE /api/patients/:id` - Delete patient profile

### Appointments
- `GET /api/appointments` - Get all appointments with patient and doctor details, sorted by date (doctor only)
- `GET /api/appointments/slots?doctorId=X&date=YYYY-MM-DD` - Get available 30-minute time slots for a doctor on specific date
- `GET /api/appointments/:id` - Get single appointment with populated patient and doctor info
- `GET /api/appointments/patient/:patientId` - Get all appointments for a specific patient
- `POST /api/appointments` - Create new appointment (30-minute slots, prevents double-booking)
- `PUT /api/appointments/:id` - Update appointment details or status
- `DELETE /api/appointments/:id` - Cancel appointment

### Sessions (Medical Consultations)
- `GET /api/sessions` - Get all sessions
- `GET /api/sessions/:id` - Get single session with populated appointment, patient, and doctor info
- `GET /api/sessions/patient/:patientId` - Get all sessions for a patient, sorted by date descending (patient access control)
- `POST /api/sessions` - Create session with prescription (appointmentId, complaints, diagnosis, notes, medications)
- `PUT /api/sessions/:id` - Update session details (doctor can update complaints, diagnosis, notes, medications)

## Data Models

### User
- **email**: String (unique, lowercase, required)
- **password**: String (hashed with bcryptjs, required)
- **name**: String (required)
- **phone**: String (required)
- **role**: String (enum: 'doctor', 'patient', required)
- **availability**: Array of objects (for doctors, contains date ranges with startTime and endTime)
- **createdAt**: Date (timestamp of account creation)

### Patient
- **userId**: ObjectId (reference to User, required)
- **dateOfBirth**: Date (optional)
- **gender**: String (enum: 'male', 'female', 'other', optional)
- **address**: String (optional)
- **medicalNotes**: String (optional, for storing patient medical history)
- **createdAt**: Date (timestamp of profile creation)

### Appointment
- **patientId**: ObjectId (reference to Patient, required)
- **doctorId**: ObjectId (reference to User, required)
- **date**: Date (appointment date, required)
- **time**: String (appointment time in HH:MM format, required)
- **status**: String (enum: 'scheduled', 'completed', 'cancelled', default: 'scheduled')
- **createdAt**: Date (timestamp of appointment creation)
- **Note**: Unique compound index on (doctorId, date, time) excluding cancelled appointments prevents double-booking

### Session (Medical Consultation)
- **appointmentId**: ObjectId (reference to Appointment, required)
- **patientId**: ObjectId (reference to Patient, required)
- **doctorId**: ObjectId (reference to User, required)
- **complaints**: String (patient's initial complaints)
- **diagnosis**: String (doctor's diagnosis)
- **notes**: String (additional consultation notes)
- **medications**: Array of objects (each with name, dosage, frequency, duration)
- **sessionDate**: Date (timestamp of consultation, defaults to current date)

## Frontend Features

- **Next.js 14 App Router**: Modern file-based routing with app/ directory
- **Authentication Flow**: Login/register pages with JWT token storage in localStorage
- **Responsive Design**: Tailwind CSS with mobile-first approach
- **API Integration**: Axios client with automatic JWT token injection via interceptor
- **User-Specific Dashboards**: 
  - Doctor Dashboard: View appointments, manage patients, create sessions
  - Patient Dashboard: View appointments, view medical sessions
- **Dynamic Forms**: Appointment booking, patient profile management, session creation with prescriptions
- **Data Fetching**: Client-side rendering with data fetched from backend API
- **Navigation**: Navbar component on all pages with role-based menu options
- **Date/Time Management**: date-fns library for date formatting and manipulation

## Running the Application

### Backend
```bash
cd backend
npm install
npm run dev    # Start development server with nodemon (auto-reload on file changes)
npm start      # Start production server
```

### Frontend
```bash
cd frontend
npm install
npm run dev    # Start development server on port 3000
npm run build  # Build for production
npm start      # Start production server
npm run lint   # Run ESLint to check code quality
```

## Security Features

- **Password Hashing**: bcryptjs (salt rounds: 10) for secure password storage, passwords never sent in responses
- **JWT Authentication**: Token-based authentication for API endpoints with Bearer token in Authorization header, auto-attached by axios interceptor on frontend
- **Token Expiration**: Configurable JWT expiration (default 7 days via JWT_EXPIRE env variable)
- **Role-Based Access Control**: 
  - Doctors-only endpoints: GET all patients, GET all appointments, PUT doctor availability
  - Patients can only view their own profile, appointments, and sessions
  - Doctors can only access/modify sessions related to their appointments
  - `roleCheck` middleware validates user roles on protected endpoints
- **Double Booking Prevention**: MongoDB unique compound index on (doctorId, date, time) excludes cancelled appointments
- **CORS**: Configured to allow frontend-backend communication
- **Environment Variables**: Sensitive data stored in .env files (PORT, MONGODB_URI, JWT_SECRET, JWT_EXPIRE)
  - Never commit .env files to version control
- **Access Control Middleware**: 
  - `auth` middleware: Verifies JWT tokens from Authorization header, attaches user info to request
  - `roleCheck` middleware: Validates that user has required role(s) for endpoint
- **Input Validation**: Server-side validation on all endpoints (date formats, required fields, ObjectId validation)
- **Error Handling**: Generic error messages to prevent information disclosure

## Appointment Slot Generation

The system automatically generates 30-minute appointment slots based on doctor availability:

1. **Doctor Availability**: Doctor sets availability with date, startTime (e.g., "09:00"), and endTime (e.g., "17:00")
2. **Slot Generation**: System generates 30-minute intervals between start and end time
   - Example: 09:00, 09:30, 10:00, 10:30, 11:00, etc.
3. **Filtering**: Available slots exclude times that already have confirmed appointments
4. **Response**: GET `/api/appointments/slots` returns array of available times in HH:MM format
5. **Booking**: Patient can book any available slot, system prevents double-booking with MongoDB unique index

## Workflow

### Doctor Registration & Setup
1. Doctor registers with email, password, name, and phone via POST `/api/auth/register`
2. Doctor logs in and receives JWT token via POST `/api/auth/login`
3. Doctor sets availability using PUT `/api/doctors/availability` endpoint with date range and hours
4. Doctor can view all registered patients via GET `/api/patients`
5. Doctor views upcoming appointments via GET `/api/appointments`

### Patient Registration & Booking
1. Patient registers with email, password, name, and phone via POST `/api/auth/register`
2. Patient logs in and receives JWT token via POST `/api/auth/login`
3. Patient creates their profile with personal and medical information via POST `/api/patients`
4. Patient views available doctors and their appointment slots via GET `/api/appointments/slots?doctorId=X&date=YYYY-MM-DD`
5. Patient books appointment for available time slot via POST `/api/appointments`
6. Appointment confirmed and added to schedule (prevents double-booking)

### Consultation & Medical Records
1. Doctor sees appointment in their dashboard via GET `/api/appointments`
2. During consultation, doctor creates a session via POST `/api/sessions` with appointment ID, complaints, diagnosis, and medications
3. Session saved to patient's medical history in database
4. Patient can view all past sessions and medical records via GET `/api/sessions/patient/:patientId`
5. Doctor can update session details via PUT `/api/sessions/:id`

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
