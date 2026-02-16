const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Session = require('../models/Session');

// @route   GET api/sessions/patient/:patientId
// @desc    Get all sessions for a patient
// @access  Private (Doctor or Patient Owner)
router.get('/patient/:patientId', auth, async (req, res) => {
    try {
        // If user is patient, verify they own this patient record
        if (req.user.role === 'patient') {
            const patient = await require('../models/Patient').findById(req.params.patientId);
            if (!patient || patient.userId.toString() !== req.user.id) {
                return res.status(403).json({ msg: 'Access denied' });
            }
        }

        const sessions = await Session.find({ patientId: req.params.patientId })
            .populate('doctorId', 'name')
            .sort({ sessionDate: -1 });
        res.json(sessions);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/sessions/:id
// @desc    Get single session
// @access  Private
router.get('/:id', auth, async (req, res) => {
    try {
        const session = await Session.findById(req.params.id)
            .populate('patientId')
            .populate('doctorId', 'name')
            .populate('appointmentId');

        if (!session) return res.status(404).json({ msg: 'Session not found' });

        // Access Control
        if (req.user.role === 'patient') {
            // Check if this session belongs to the patient
            // session.patientId is populated, so it's an object
            const patientUserId = session.patientId.userId.toString();
            if (patientUserId !== req.user.id) {
                return res.status(403).json({ msg: 'Access denied' });
            }
        }

        res.json(session);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/sessions
// @desc    Create session with prescription
// @access  Private
router.post('/', auth, async (req, res) => {
    const {
        appointmentId,
        complaints,
        diagnosis,
        notes,
        medications
    } = req.body;

    try {
        // Fetch appointment to get patientId and verify it exists
        const Appointment = require('../models/Appointment');
        const appointment = await Appointment.findById(appointmentId);
        
        if (!appointment) {
            return res.status(404).json({ msg: 'Appointment not found' });
        }

        const newSession = new Session({
            appointmentId,
            patientId: appointment.patientId,
            doctorId: req.user.id,
            complaints,
            diagnosis,
            notes,
            medications
        });

        const session = await newSession.save();
        res.json(session);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/sessions/:id
// @desc    Update session
// @access  Private
router.put('/:id', auth, async (req, res) => {
    const { complaints, diagnosis, notes, medications } = req.body;

    const sessionFields = {};
    if (complaints) sessionFields.complaints = complaints;
    if (diagnosis) sessionFields.diagnosis = diagnosis;
    if (notes) sessionFields.notes = notes;
    if (medications) sessionFields.medications = medications;

    try {
        let session = await Session.findById(req.params.id);

        if (!session) return res.status(404).json({ msg: 'Session not found' });

        session = await Session.findByIdAndUpdate(
            req.params.id,
            { $set: sessionFields },
            { new: true }
        );

        res.json(session);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
