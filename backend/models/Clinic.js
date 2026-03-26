const mongoose = require('mongoose');

const clinicSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String },
    contactNumber: { type: String },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Clinic', clinicSchema);
