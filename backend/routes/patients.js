const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Patient = require('../models/Patient');
const Session = require('../models/Session');

const roleCheck = require('../middleware/roleCheck');

// @route   GET api/patients
// @desc    Get all patients
// @access  Private (Doctor only)
router.get('/', [auth, roleCheck(['doctor', 'admin'])], async (req, res) => {
    try {
        const patients = await Patient.find().populate('userId', 'name email phone').sort({ createdAt: -1 });
        res.json(patients);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/patients/me
// @desc    Get current user's patient profile
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        const patient = await Patient.findOne({ userId: req.user.id }).populate('userId', 'name email phone');
        if (!patient) return res.status(404).json({ msg: 'Patient profile not found' });
        res.json(patient);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/patients/:id
// @desc    Get single patient
// @access  Private
router.get('/:id', auth, async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id).populate('userId', 'name email phone');
        if (!patient) return res.status(404).json({ msg: 'Patient not found' });
        res.json(patient);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Patient not found' });
        res.status(500).send('Server Error');
    }
});

// @route   POST api/patients
// @desc    Create new patient
// @access  Private
router.post('/', auth, async (req, res) => {
    const { userId, dateOfBirth, gender, address, medicalNotes } = req.body;

    try {
        const newPatient = new Patient({
            userId,
            dateOfBirth,
            gender,
            address,
            medicalNotes
        });

        const patient = await newPatient.save();
        res.json(patient);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/patients/:id
// @desc    Update patient
// @access  Private
router.put('/:id', auth, async (req, res) => {
    const { dateOfBirth, gender, address, medicalNotes } = req.body;

    // Build patient object
    const patientFields = {};
    if (dateOfBirth) patientFields.dateOfBirth = dateOfBirth;
    if (gender) patientFields.gender = gender;
    if (address) patientFields.address = address;
    if (medicalNotes) patientFields.medicalNotes = medicalNotes;

    try {
        let patient = await Patient.findById(req.params.id);

        if (!patient) return res.status(404).json({ msg: 'Patient not found' });

        patient = await Patient.findByIdAndUpdate(
            req.params.id,
            { $set: patientFields },
            { new: true }
        );

        res.json(patient);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
