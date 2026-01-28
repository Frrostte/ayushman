const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    status: {
        type: String,
        enum: ['scheduled', 'completed', 'cancelled'],
        default: 'scheduled'
    },
    createdAt: { type: Date, default: Date.now }
});

// Prevent double booking: unique doctor, date, and time, unless cancelled
appointmentSchema.index({ doctorId: 1, date: 1, time: 1 }, {
    unique: true,
    partialFilterExpression: { status: { $ne: 'cancelled' } }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
