const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    complaints: String,
    diagnosis: String,
    notes: String,

    medications: [{
        name: String,
        dosage: String,
        frequency: String,
        duration: String
    }],

    sessionDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Session', sessionSchema);
