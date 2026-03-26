const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    role: { type: String, enum: ['doctor', 'patient', 'admin', 'superadmin'], required: true },
    clinicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Clinic' }, // superadmin might not have a clinic
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
