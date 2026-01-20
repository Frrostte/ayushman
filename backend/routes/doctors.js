const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const roleCheck = require('../middleware/roleCheck');

// @route   GET api/doctors
// @desc    Get all doctors
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const doctors = await User.find({ role: 'doctor' }).select('-password');
        res.json(doctors);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/doctors/availability
// @desc    Update doctor availability
// @access  Private (Doctor only)
router.put('/availability', [auth, roleCheck(['doctor'])], async (req, res) => {
    const { date, startTime, endTime } = req.body;

    if (!date || !startTime || !endTime) {
        return res.status(400).json({ msg: 'Please provide date, start time, and end time' });
    }

    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
        return res.status(400).json({ msg: 'Invalid date format' });
    }

    try {
        const doctor = await User.findById(req.user.id);

        console.log('Update Availability Request:', { date, startTime, endTime });
        console.log('Existing Availability Type:', typeof doctor.availability);
        console.log('Is Array?', Array.isArray(doctor.availability));

        const dateStr = dateObj.toISOString().split('T')[0];

        // Robustly handle existing availability
        // If it's not an array or looks like old schema, reset it or filter safely
        if (Array.isArray(doctor.availability)) {
            doctor.availability = doctor.availability.filter(a => {
                // Check if entry is valid object and has date
                if (!a || !a.date) return false;
                try {
                    // Check if date is valid
                    const d = new Date(a.date);
                    if (isNaN(d.getTime())) return false; // Invalid date in DB, remove it
                    return d.toISOString().split('T')[0] !== dateStr;
                } catch (e) {
                    console.error('Error processing existing availability item:', a, e);
                    return false; // Remove if error
                }
            });
        } else {
            console.warn('Resetting availability due to invalid format (likely old schema)');
            doctor.availability = [];
        }

        // Add new availability
        doctor.availability.push({
            date: dateObj,
            startTime,
            endTime
        });

        await doctor.save();
        res.json(doctor);
    } catch (err) {
        console.error('SERVER ERROR in PUT /availability:', err);
        res.status(500).json({ msg: 'Server Error: ' + err.message });
    }
});

module.exports = router;
