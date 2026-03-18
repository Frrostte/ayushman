const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json());
app.use(cors());

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/patients', require('./routes/patients'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/sessions', require('./routes/sessions'));
app.use('/api/doctors', require('./routes/doctors'));

// Connect Database before starting server
const startServer = async () => {
    await connectDB();
    const seedAdmin = require('./config/seedAdmin');
    await seedAdmin();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
};

startServer();


// Trigger restart 3

