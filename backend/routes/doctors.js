const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const roleCheck = require('../middleware/roleCheck');

// @route   GET api/doctors
// @desc    Get all doctors
// @access  Private
router.get('/', [auth, roleCheck(['admin'])], async (req, res) => {
    try {
        const doctors = await User.find({ role: 'doctor' }).select('-password');
        // Optional: Aggregate with Doctor model if needed, but for simple list, user info is enough.
        res.json(doctors);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/doctors/:id
// @desc    Get single doctor by ID (User ID)
// @access  Private (Admin only)
router.get('/:id', [auth, roleCheck(['admin'])], async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user || user.role !== 'doctor') {
            return res.status(404).json({ msg: 'Doctor not found' });
        }

        const doctorProfile = await Doctor.findOne({ userId: req.params.id });

        // Merge user and doctor profile
        const doctorData = {
            ...user.toObject(),
            ...doctorProfile?.toObject()
        };

        res.json(doctorData);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Doctor not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/doctors/availability
// @desc    Update doctor availability (Single Date)
// @access  Private (Doctor only)
router.put('/availability', [auth, roleCheck(['doctor', 'admin'])], async (req, res) => {
    const { date, startTime, endTime, slotDuration } = req.body;

    if (!date || !startTime || !endTime) {
        return res.status(400).json({ msg: 'Please provide date, start time, and end time' });
    }

    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
        return res.status(400).json({ msg: 'Invalid date format' });
    }

    try {
        let doctor = await Doctor.findOne({ userId: req.user.id });
        if (!doctor) {
            // Create doctor profile if it doesn't exist
            doctor = new Doctor({ userId: req.user.id, availability: [] });
        }

        const dateStr = dateObj.toISOString().split('T')[0];

        // Ensure availability is an array
        if (!Array.isArray(doctor.availability)) {
            doctor.availability = [];
        }

        // Remove existing availability for this date
        doctor.availability = doctor.availability.filter(a => {
            if (!a || !a.date) return false;
            try {
                const d = new Date(a.date);
                return d.toISOString().split('T')[0] !== dateStr;
            } catch (e) {
                return false;
            }
        });

        // Add new availability
        doctor.availability.push({
            date: dateObj,
            startTime,
            endTime,
            slotDuration: slotDuration || 30
        });

        await doctor.save();
        res.json(doctor);
    } catch (err) {
        console.error('SERVER ERROR in PUT /availability:', err);
        res.status(500).json({ msg: 'Server Error: ' + err.message });
    }
});

// @route   POST api/doctors/availability/bulk
// @desc    Bulk update doctor availability
// @access  Private (Doctor only)
router.post('/availability/bulk', [auth, roleCheck(['doctor', 'admin'])], async (req, res) => {
    const { startDate, endDate, startTime, endTime, daysOfWeek, slotDuration } = req.body;

    if (!startDate || !endDate || !startTime || !endTime) {
        return res.status(400).json({ msg: 'Please provide start date, end date, start time, and end time' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res.status(400).json({ msg: 'Invalid date format' });
    }

    if (start > end) {
        return res.status(400).json({ msg: 'Start date cannot be after end date' });
    }

    try {
        let doctor = await Doctor.findOne({ userId: req.user.id });
        if (!doctor) {
            doctor = new Doctor({ userId: req.user.id, availability: [] });
        }

        // Ensure availability is an array
        if (!Array.isArray(doctor.availability)) {
            doctor.availability = [];
        }

        let currentDate = new Date(start);

        // Loop through dates
        while (currentDate <= end) {
            const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 1 = Monday, ...

            // Check if this day is selected (if daysOfWeek is provided)
            if (!daysOfWeek || daysOfWeek.length === 0 || daysOfWeek.includes(dayOfWeek)) {

                const dateStr = currentDate.toISOString().split('T')[0];

                // Remove existing entry for this date if it exists (overwrite)
                doctor.availability = doctor.availability.filter(a => {
                    try {
                        return new Date(a.date).toISOString().split('T')[0] !== dateStr;
                    } catch (e) { return false; }
                });

                // Add new entry
                doctor.availability.push({
                    date: new Date(currentDate),
                    startTime,
                    endTime,
                    slotDuration: slotDuration || 30
                });
            }

            // Next day
            currentDate.setDate(currentDate.getDate() + 1);
        }

        await doctor.save();
        res.json({ msg: 'Bulk availability updated successfully', availability: doctor.availability });

    } catch (err) {
        console.error('SERVER ERROR in POST /availability/bulk:', err);
        res.status(500).json({ msg: 'Server Error: ' + err.message });
    }
});

// @route   DELETE api/doctors/availability
// @desc    Remove availability for a specific date
// @access  Private (Doctor only)
router.delete('/availability', [auth, roleCheck(['doctor', 'admin'])], async (req, res) => {
    const { date } = req.query; // Expecting ?date=YYYY-MM-DD

    if (!date) {
        return res.status(400).json({ msg: 'Please provide date' });
    }

    try {
        const doctor = await Doctor.findOne({ userId: req.user.id });
        const targetDate = new Date(date).toISOString().split('T')[0];

        if (!doctor || !Array.isArray(doctor.availability)) {
            return res.status(404).json({ msg: 'No availability found' });
        }

        const originalLength = doctor.availability.length;

        doctor.availability = doctor.availability.filter(a => {
            try {
                return new Date(a.date).toISOString().split('T')[0] !== targetDate;
            } catch (e) { return false; }
        });

        if (doctor.availability.length === originalLength) {
            return res.status(404).json({ msg: 'Availability not found for this date' });
        }

        await doctor.save();
        res.json({ msg: 'Availability removed' });

    } catch (err) {
        console.error('SERVER ERROR in DELETE /availability:', err);
        res.status(500).json({ msg: 'Server Error: ' + err.message });
    }
});

module.exports = router;
