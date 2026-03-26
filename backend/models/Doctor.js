const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    clinicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Clinic', required: true },
    specialization: { type: String, default: 'General Physician' },
    qualifications: { type: String },
    experience: { type: Number, default: 0 },
    availability: [{
        date: { type: Date, required: true },
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        slotDuration: { type: Number, default: 30 }
    }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Doctor', doctorSchema);
