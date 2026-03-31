const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const roleCheck = require('../middleware/roleCheck');

// @route   GET api/doctors
// @desc    Get all doctors
// @access  Private (Admin, Patient)
router.get('/', [auth, roleCheck(['admin', 'patient'])], async (req, res) => {
    try {
        const doctors = await User.find({ role: 'doctor', clinicId: req.user.clinicId }).select('-password');
        // Optional: Aggregate with Doctor model if needed, but for simple list, user info is enough.
        res.json(doctors);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
// @route   GET api/doctors/me
// @desc    Get current doctor profile
// @access  Private (Doctor only)
router.get('/me', [auth, roleCheck(['doctor'])], async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user || user.role !== 'doctor') {
            return res.status(404).json({ msg: 'Doctor profile not found' });
        }

        const doctorProfile = await Doctor.findOne({ userId: req.user.id });

        const doctorData = {
            ...doctorProfile?.toObject(),
            ...user.toObject()
        };

        res.json(doctorData);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/doctors/:id
// @desc    Get single doctor by ID (User ID)
// @access  Private (Admin, Doctor, Patient)
router.get('/:id', [auth, roleCheck(['admin', 'doctor', 'patient'])], async (req, res) => {
    try {
        // Enforce clinic boundaries
        const query = { _id: req.params.id, role: 'doctor' };
        if (req.user.role !== 'superadmin') {
            query.clinicId = req.user.clinicId;
        }

        const user = await User.findOne(query).select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'Doctor not found or unauthorized' });
        }

        const profileQuery = { userId: req.params.id };
        if (req.user.role !== 'superadmin') {
            profileQuery.clinicId = req.user.clinicId;
        }
        const doctorProfile = await Doctor.findOne(profileQuery);

        // Merge user and doctor profile
        const doctorData = {
            ...doctorProfile?.toObject(),
            ...user.toObject()
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

// @route   PUT api/doctors/:id
// @desc    Update doctor profile
// @access  Private (Admin, Doctor)
router.put('/:id', [auth, roleCheck(['admin', 'doctor'])], async (req, res) => {
    const {
        name, email, phone,
        specialization, experience, qualifications
    } = req.body;

    try {
        const query = { _id: req.params.id, role: 'doctor' };
        if (req.user.role !== 'superadmin') {
            query.clinicId = req.user.clinicId;
        }

        let user = await User.findOne(query);
        if (!user) {
            console.log(`[DEBUG] PUT /doctors/:id - User not found or unauthorized for ID: ${req.params.id}`);
            return res.status(404).json({ msg: 'Doctor not found or unauthorized' });
        }

        // Check permission: Admin or same user
        if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
            return res.status(403).json({ msg: 'Not authorized to update this profile' });
        }

        // Update User fields
        const userFields = {};
        if (name) userFields.name = name;
        if (email) userFields.email = email;
        if (phone) userFields.phone = phone;

        if (Object.keys(userFields).length > 0) {
            await User.findByIdAndUpdate(req.params.id, { $set: userFields });
        }

        // Update Doctor fields
        const doctorFields = {};
        if (specialization) doctorFields.specialization = specialization;
        if (experience) doctorFields.experience = experience;
        if (qualifications) doctorFields.qualifications = qualifications;

        const profileQuery = { userId: req.params.id };
        if (req.user.role !== 'superadmin') {
            profileQuery.clinicId = req.user.clinicId;
        }
        
        let doctor = await Doctor.findOne(profileQuery);
        if (!doctor) {
            // Create if not exists (though unlikely for existing doctor)
            doctor = new Doctor({ userId: req.params.id, clinicId: req.user.clinicId, availability: [], ...doctorFields });
            await doctor.save();
        } else {
            doctor = await Doctor.findOneAndUpdate(
                { userId: req.params.id, clinicId: req.user.clinicId },
                { $set: doctorFields },
                { new: true }
            );
        }

        // Return combined data
        const updatedUser = await User.findById(req.params.id).select('-password');
        res.json({ ...updatedUser.toObject(), ...doctor.toObject() });

    } catch (err) {
        console.error(err.message);
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
        let doctor = await Doctor.findOne({ userId: req.user.id, clinicId: req.user.clinicId });
        if (!doctor) {
            // Create doctor profile if it doesn't exist
            doctor = new Doctor({ userId: req.user.id, clinicId: req.user.clinicId, availability: [] });
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
        let doctor = await Doctor.findOne({ userId: req.user.id, clinicId: req.user.clinicId });
        if (!doctor) {
            doctor = new Doctor({ userId: req.user.id, clinicId: req.user.clinicId, availability: [] });
        }

        // Ensure availability is an array
        if (!Array.isArray(doctor.availability)) {
            doctor.availability = [];
        }

        let count = 0;
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
                count++;
            }

            // Next day
            currentDate.setDate(currentDate.getDate() + 1);
        }

        console.log('Saving availability for doctor:', doctor.userId);
        console.log('Availability count before save:', doctor.availability.length);

        await doctor.save();

        console.log('Doctor saved successfully.');
        console.log('Returning availability count:', doctor.availability.length);

        if (count === 0) {
            return res.json({ msg: 'No slots added. The selected date range does not contain the chosen days.', availability: doctor.availability, count: 0 });
        }

        res.json({ msg: `Successfully added availability for ${count} days`, availability: doctor.availability });

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
        const doctor = await Doctor.findOne({ userId: req.user.id, clinicId: req.user.clinicId });
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
