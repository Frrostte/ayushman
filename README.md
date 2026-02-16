# Clinic Management System

A full-stack web application for managing clinic operations, including patient records, appointments, and medical sessions. Built with Node.js/Express for the backend and Next.js for the frontend.

## Features

- **User Authentication**: Secure login and registration for doctors, patients, and admins
- **Patient Management**: Create and manage patient profiles with medical information
- **Doctor Management**: Comprehensive doctor profiles with specialization, qualifications, and experience tracking
- **Appointment Scheduling**: Book, view, and manage appointments between patients and doctors
- **Medical Sessions**: Track doctor-patient consultation sessions with prescriptions
- **Doctor Availability Management**: Set and manage doctor availability with single-day or bulk updates
- **Role-Based Access Control**: Multi-tier permissions for admins, doctors, and patients
- **Dark/Light Theme**: Toggle between dark and light modes with persistent preference
- **Responsive UI**: Modern, mobile-first interface with sidebar navigation built with React and Tailwind CSS
- **Interactive Calendar**: Visual calendar component for date selection and availability viewing

## Tech Stack

### Backend
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose ODM)
- **Authentication**: JWT (JSON Web Token)
- **Security**: bcryptjs for password hashing, CORS enabled
- **Environment**: Node.js

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS
- **Theme Management**: next-themes (dark/light mode)
- **Date Utilities**: date-fns

### Dependencies
- **Backend**: Express 4.18.2, Mongoose 8.0.0, bcryptjs 2.4.3, jsonwebtoken 9.0.2, dotenv 16.3.1, CORS 2.8.5, Axios 1.13.2, Nodemon 3.0.1 (dev)
- **Frontend**: Next.js 14.0.0, React 18.2.0, React DOM 18.2.0, Axios 1.6.0, date-fns 4.1.0, next-themes 0.4.6, Tailwind CSS 3.3.5, PostCSS 8.4.31, Autoprefixer 10.4.16

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
│   │   ├── User.js               # User schema (doctor/patient/admin)
│   │   ├── Doctor.js             # Doctor profile schema with specialization and availability
│   │   ├── Patient.js            # Patient profile schema
│   │   ├── Appointment.js        # Appointment schema
│   │   └── Session.js            # Medical session schema
│   ├── routes/
│   │   ├── auth.js               # Authentication endpoints
│   │   ├── doctors.js            # Doctor management and availability endpoints
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
│   │   │   ├── layout.jsx        # Root layout with theme provider
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
│   │   │   ├── profile/          # Doctor profile page
│   │   │   │   └── page.jsx
│   │   │   ├── availability/     # Doctor availability management
│   │   │   │   └── page.jsx
│   │   │   ├── doctors/          # Doctor management (admin)
│   │   │   │   ├── page.jsx      # Doctor list
│   │   │   │   ├── new/          # Add new doctor
│   │   │   │   │   └── page.jsx
│   │   │   │   └── [id]/         # Doctor details
│   │   │   │       └── page.jsx
│   │   │   ├── patients/         # Patient list and details
│   │   │   │   ├── page.jsx
│   │   │   │   ├── new/          # Patient registration
│   │   │   │   │   └── page.jsx
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
│   │   │   ├── LayoutWrapper.jsx # Layout wrapper with sidebar
│   │   │   ├── Sidebar.jsx       # Sidebar navigation with theme toggle
│   │   │   ├── Navbar.jsx        # Navigation bar
│   │   │   ├── ThemeProvider.jsx # Theme context provider
│   │   │   ├── ThemeToggle.jsx   # Dark/light mode toggle
│   │   │   ├── Button.jsx        # Reusable button component
│   │   │   ├── Input.jsx         # Reusable input field component
│   │   │   ├── Card.jsx          # Card layout component
│   │   │   ├── Select.jsx        # Dropdown/select component
│   │   │   ├── Modal.jsx         # Modal dialog component
│   │   │   ├── Calendar.jsx      # Interactive calendar component
│   │   │   ├── AppointmentForm.jsx # Form for booking/managing appointments
│   │   │   ├── PatientForm.jsx   # Form for patient profile creation/editing
│   │   │   ├── DoctorForm.jsx    # Form for doctor profile editing
│   │   │   ├── AvailabilityForm.jsx # Form for setting doctor availability
│   │   │   ├── AvailabilityList.jsx # Display doctor availability
│   │   │   ├── SessionForm.jsx   # Form for creating consultation sessions
│   │   │   └── PrescriptionForm.jsx # Form for adding prescriptions in sessions
│   │   └── lib/
│   │       └── api.js            # API client utilities with JWT interceptor
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
- `GET /api/doctors` - Get all doctors (authentication required, admin/patient only)
- `GET /api/doctors/me` - Get current doctor profile with specialization and availability (doctor only)
- `GET /api/doctors/:id` - Get single doctor by ID with full profile (authentication required)
- `PUT /api/doctors/:id` - Update doctor profile (name, email, phone, specialization, experience, qualifications) (admin or same doctor)
- `PUT /api/doctors/availability` - Update doctor availability for a single date (requires date, startTime, endTime, optional slotDuration)
- `POST /api/doctors/availability/bulk` - Bulk update availability for date range (requires startDate, endDate, startTime, endTime, optional daysOfWeek array, slotDuration)
- `DELETE /api/doctors/availability?date=YYYY-MM-DD` - Remove availability for a specific date (doctor only)

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
- **role**: String (enum: 'doctor', 'patient', 'admin', required)
- **createdAt**: Date (timestamp of account creation)

### Doctor
- **userId**: ObjectId (reference to User, required, unique)
- **specialization**: String (default: 'General Physician')
- **qualifications**: String (optional)
- **experience**: Number (years of experience, default: 0)
- **availability**: Array of objects (each containing date, startTime, endTime, slotDuration)
  - **date**: Date (specific date for availability)
  - **startTime**: String (HH:MM format)
  - **endTime**: String (HH:MM format)
  - **slotDuration**: Number (minutes, default: 30)
- **createdAt**: Date (timestamp of profile creation)

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
- **Theme Switching**: Dark/light mode toggle with next-themes, persistent across sessions
- **Responsive Design**: Mobile-first Tailwind CSS with responsive sidebar navigation
- **Layout System**: Consistent layout with LayoutWrapper and Sidebar components
- **API Integration**: Axios client with automatic JWT token injection via interceptor
- **User-Specific Dashboards**: 
  - **Admin Dashboard**: Manage doctors and view all system data
  - **Doctor Dashboard**: View appointments, manage patients, create sessions, manage availability, edit profile
  - **Patient Dashboard**: View appointments, view medical sessions
- **Doctor Management**: Full CRUD operations for doctor profiles (admin only)
- **Availability Management**: 
  - Single-day availability setting
  - Bulk availability updates for date ranges
  - Visual calendar for date selection
  - Delete specific availability slots
- **Dynamic Forms**: Appointment booking, patient profile management, session creation with prescriptions, availability forms
- **Interactive Components**: Calendar, Modal, Cards with consistent styling
- **Data Fetching**: Client-side rendering with data fetched from backend API
- **Navigation**: Sidebar component with role-based menu filtering
- **Date/Time Management**: date-fns library for date formatting, manipulation, and calendar functionality

## UI Components

The frontend features a comprehensive set of reusable components built with Tailwind CSS and dark mode support:

### Layout Components
- **LayoutWrapper**: Main layout component with responsive sidebar integration
- **Sidebar**: Navigation sidebar with role-based menu filtering, theme toggle, and user profile display
- **Navbar**: Top navigation bar (legacy, replaced by Sidebar in most pages)

### Form Components
- **Input**: Reusable input field with consistent styling and dark mode support
- **Select**: Dropdown select component with custom styling
- **Button**: Customizable button component with loading states
- **AppointmentForm**: Form for creating and managing appointments with date/time selection
- **PatientForm**: Patient profile creation and editing form
- **DoctorForm**: Doctor profile editing form with specialization fields
- **SessionForm**: Medical session creation with prescription management
- **PrescriptionForm**: Add/edit prescriptions within sessions
- **AvailabilityForm**: Set doctor availability with single-day or bulk updates
- **AvailabilityList**: Display and manage existing availability entries

### UI Elements
- **Card**: Card container component with consistent styling and shadows
- **Modal**: Modal dialog component with backdrop blur and animations
- **Calendar**: Interactive calendar component built with date-fns for date selection and availability visualization
- **ThemeProvider**: Context provider for dark/light theme management using next-themes
- **ThemeToggle**: Toggle button for switching between dark and light modes

All components follow a consistent design language with:
- Dark mode support (default dark theme)
- Responsive design for mobile, tablet, and desktop
- Smooth animations and transitions
- Consistent color palette with primary gradient (purple/blue)
- Tailwind CSS utility classes
- Accessibility considerations

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
  - **Admin**: Full access to all endpoints, can manage doctors, view all data
  - **Doctors**: Access to doctor-only endpoints (availability management, profile editing, patient and appointment management)
  - **Patients**: Limited access, can only view their own profile, appointments, and sessions
  - Doctors-only endpoints: GET /doctors/me, PUT /doctors/availability, bulk availability
  - Admin-only endpoints: GET all doctors, POST new doctors, PUT any doctor profile
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

The system automatically generates appointment slots based on doctor availability stored in the Doctor model:

1. **Doctor Availability**: Doctor sets availability via PUT `/api/doctors/availability` with date, startTime (e.g., "09:00"), and endTime (e.g., "17:00")
2. **Bulk Availability**: Doctors can set availability for multiple days using POST `/api/doctors/availability/bulk` with date range and optional days of week filter
3. **Slot Storage**: Availability is stored in the Doctor model with configurable slotDuration (default 30 minutes)
4. **Slot Generation**: System generates time slots at specified intervals between start and end time
   - Example: 09:00, 09:30, 10:00, 10:30, 11:00, etc.
5. **Filtering**: Available slots exclude times that already have confirmed appointments
6. **Response**: GET `/api/appointments/slots` returns array of available times in HH:MM format
7. **Booking**: Patient can book any available slot, system prevents double-booking with MongoDB unique index
8. **Management**: Doctors can view, update, and delete availability entries via dedicated endpoints

## Workflow

### Admin Operations
1. Admin registers with role 'admin' via POST `/api/auth/register`
2. Admin logs in and receives JWT token via POST `/api/auth/login`
3. Admin can add new doctors through the `/doctors/new` page, which uses POST `/api/auth/register` with role 'doctor'
4. Admin can view and manage all doctors via GET `/api/doctors` and PUT `/api/doctors/:id`
5. Admin has full access to all system functionality

### Doctor Registration & Setup
1. Doctor registers (or is registered by admin) with email, password, name, and phone via POST `/api/auth/register`
2. Doctor logs in and receives JWT token via POST `/api/auth/login`
3. Doctor creates/updates profile with specialization, qualifications, and experience via PUT `/api/doctors/:id`
4. Doctor sets availability using:
   - Single-day: PUT `/api/doctors/availability` with date and time range
   - Bulk: POST `/api/doctors/availability/bulk` with date range and optional days filter
5. Doctor can view and manage availability via GET `/api/doctors/me` and DELETE `/api/doctors/availability?date=YYYY-MM-DD`
6. Doctor can view all registered patients via GET `/api/patients`
7. Doctor views upcoming appointments via GET `/api/appointments`

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
- Patient medical history timeline visualization
- Email notifications for appointments and status changes
- Mobile app version (React Native or Progressive Web App)
- Prescription PDF generation and printing
- Patient search and filtering with advanced queries
- Analytics dashboard for clinic administrators with charts and statistics
- Appointment rescheduling functionality
- Video consultation integration (Zoom, Google Meet, or custom WebRTC)
- Payment processing integration for consultation fees
- Multi-clinic support for clinic chains
- Automated appointment confirmation workflows
- Patient feedback and rating system
- Medical report uploads and storage
- Lab test integration and tracking

## License

This project is part of an internship program.
