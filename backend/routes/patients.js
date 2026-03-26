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
        const patients = await Patient.find({ clinicId: req.user.clinicId })
            .populate('userId', 'name email phone role')
            .sort({ createdAt: -1 });

        console.log('--- GET /patients DEBUG (Explicit Filter) ---');
        console.log(`Raw Patient docs found: ${patients.length}`);

        const truePatients = patients.filter(p => {
            if (!p.userId) {
                console.log(`[FILTER] Patient ID: ${p._id} - Dropped (No User populated)`);
                return false;
            }

            const { name, role } = p.userId;
            const isPatient = role === 'patient';

            console.log(`[FILTER] Checking: ${name} (Role: ${role}) -> ${isPatient ? 'PASS' : 'FAIL'}`);

            if (!isPatient) {
                // console.log(`Filtering out Patient ID: ${p._id} linked to ${p.userId.name} - Role is: '${role}'`);
            }

            return isPatient;
        });

        console.log(`Returning ${truePatients.length} patients`);
        console.log('-------------------------------------------');

        res.json(truePatients);
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
        const patient = await Patient.findOne({ _id: req.params.id, clinicId: req.user.clinicId }).populate('userId', 'name email phone');
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
            clinicId: req.user.clinicId,
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
    const { dateOfBirth, gender, address, medicalNotes, name, email, phone } = req.body;

    // Build patient object
    const patientFields = {};
    if (dateOfBirth) patientFields.dateOfBirth = dateOfBirth;
    if (gender) patientFields.gender = gender;
    if (address) patientFields.address = address;
    if (medicalNotes) patientFields.medicalNotes = medicalNotes;

    try {
        let patient = await Patient.findOne({ _id: req.params.id, clinicId: req.user.clinicId });

        if (!patient) return res.status(404).json({ msg: 'Patient not found' });

        // Update User fields if provided
        if (name || email || phone) {
            const userFields = {};
            if (name) userFields.name = name;
            if (email) userFields.email = email;
            if (phone) userFields.phone = phone;

            await require('../models/User').findByIdAndUpdate(
                patient.userId,
                { $set: userFields }
            );
        }

        patient = await Patient.findOneAndUpdate(
            { _id: req.params.id, clinicId: req.user.clinicId },
            { $set: patientFields },
            { new: true }
        ).populate('userId', 'name email phone');

        res.json(patient);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
