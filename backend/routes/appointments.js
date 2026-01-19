const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Appointment = require('../models/Appointment');
const roleCheck = require('../middleware/roleCheck');

// @route   GET api/appointments
// @desc    Get all appointments
// @access  Private (Doctor only)
router.get('/', [auth, roleCheck(['doctor'])], async (req, res) => {
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

module.exports = router;
