const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Appointment = require('../models/Appointment');
const roleCheck = require('../middleware/roleCheck');
const User = require('../models/User');
const Doctor = require('../models/Doctor');

// @route   GET api/appointments/slots
// @desc    Get available slots for a doctor on a specific date
// @access  Private
router.get('/slots', auth, async (req, res) => {
    const { doctorId, date } = req.query; // date in YYYY-MM-DD format

    try {
        const doctor = await User.findById(doctorId);
        if (!doctor || doctor.role !== 'doctor') {
            return res.status(404).json({ msg: 'Doctor not found' });
        }

        const doctorProfile = await Doctor.findOne({ userId: doctorId });

        if (!doctorProfile || !doctorProfile.availability || doctorProfile.availability.length === 0) {
            return res.json([]);
        }

        // Find availability for the specific date
        const availability = doctorProfile.availability.find(
            a => new Date(a.date).toISOString().split('T')[0] === new Date(date).toISOString().split('T')[0]
        );

        if (!availability) {
            return res.json([]);
        }

        const { startTime, endTime, slotDuration } = availability;
        const duration = slotDuration || 30; // Default to 30 min if not set
        const slots = [];
        let currentTime = new Date(`${date}T${startTime}`);
        const endDateTime = new Date(`${date}T${endTime}`);

        // Generate slots based on dynamic duration
        while (currentTime < endDateTime) {
            const timeString = currentTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
            slots.push(timeString);
            currentTime.setMinutes(currentTime.getMinutes() + duration);
        }

        // Fetch existing appointments
        // Note: Database stores date as Date object, so we need to match the day
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const appointments = await Appointment.find({
            doctorId,
            date: { $gte: startOfDay, $lte: endOfDay },
            status: { $ne: 'cancelled' }
        });

        const bookedTimes = appointments.map(app => app.time);
        const availableSlots = slots.filter(slot => !bookedTimes.includes(slot));

        res.json(availableSlots);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/appointments
// @desc    Get all appointments
// @access  Private (Doctor only)
router.get('/', [auth, roleCheck(['doctor', 'admin'])], async (req, res) => {
    try {
        const appointments = await Appointment.find()
            .populate({
                path: 'patientId',
                populate: { path: 'userId', select: 'name' }
            })
            .populate('doctorId', 'name email')
            .sort({ date: 1 });
        res.json(appointments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/appointments/:id
// @desc    Get single appointment
// @access  Private
router.get('/:id', auth, async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id)
            .populate({
                path: 'patientId',
                populate: { path: 'userId', select: 'name' }
            })
            .populate('doctorId', 'name email');

        if (!appointment) return res.status(404).json({ msg: 'Appointment not found' });

        res.json(appointment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/appointments/doctor/:doctorId
// @desc    Get doctor's appointments
// @access  Private
router.get('/doctor/:doctorId', auth, async (req, res) => {
    try {
        const appointments = await Appointment.find({ doctorId: req.params.doctorId })
            .populate('patientId')
            .populate({
                path: 'patientId',
                populate: { path: 'userId', select: 'name' }
            })
            .sort({ date: 1 });
        res.json(appointments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/appointments/patient/:patientId
// @desc    Get patient's appointments
// @access  Private
router.get('/patient/:patientId', auth, async (req, res) => {
    try {
        const appointments = await Appointment.find({ patientId: req.params.patientId })
            .populate('doctorId', 'name')
            .sort({ date: 1 });
        res.json(appointments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/appointments
// @desc    Book new appointment
// @access  Private
router.post('/', auth, async (req, res) => {
    const { patientId, doctorId, date, time } = req.body;

    try {
        const newAppointment = new Appointment({
            patientId,
            doctorId,
            date,
            time
        });

        // Check for existing appointment
        const existingAppointment = await Appointment.findOne({
            doctorId,
            date,
            time,
            status: { $ne: 'cancelled' }
        });

        if (existingAppointment) {
            return res.status(400).json({ msg: 'This slot is already booked' });
        }

        const appointment = await newAppointment.save();
        res.json(appointment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/appointments/:id
// @desc    Update appointment status
// @access  Private
router.put('/:id', auth, async (req, res) => {
    const { status } = req.body;

    try {
        let appointment = await Appointment.findById(req.params.id);

        if (!appointment) return res.status(404).json({ msg: 'Appointment not found' });

        appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { $set: { status } },
            { new: true }
        );

        res.json(appointment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/appointments/:id
// @desc    Delete appointment
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({ msg: 'Appointment not found' });
        }

        // Check user authorization (optional: passed auth middleware but could check ownership)
        // For simplicity allow deleting if authenticated

        await Appointment.findByIdAndDelete(req.params.id);

        res.json({ msg: 'Appointment removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Appointment not found' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;
