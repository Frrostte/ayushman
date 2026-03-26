const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const Clinic = require('../models/Clinic');

// @route   GET api/clinics
// @desc    Get all clinics
// @access  Private (Superadmin only)
router.get('/', [auth, roleCheck(['superadmin'])], async (req, res) => {
    try {
        const clinics = await Clinic.find().sort({ createdAt: -1 });
        res.json(clinics);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/clinics/active
// @desc    Get all active clinics for public registration
// @access  Public
router.get('/active', async (req, res) => {
    try {
        const clinics = await Clinic.find({ isActive: true }).select('name _id').sort({ name: 1 });
        res.json(clinics);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/clinics
// @desc    Create a new clinic
// @access  Private (Superadmin only)
router.post('/', [auth, roleCheck(['superadmin'])], async (req, res) => {
    const { name, address, contactNumber } = req.body;

    try {
        const newClinic = new Clinic({
            name,
            address,
            contactNumber
        });

        const clinic = await newClinic.save();
        res.json(clinic);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/clinics/:id
// @desc    Update a clinic
// @access  Private (Superadmin only)
router.put('/:id', [auth, roleCheck(['superadmin'])], async (req, res) => {
    const { name, address, contactNumber, isActive } = req.body;

    const clinicFields = {};
    if (name) clinicFields.name = name;
    if (address) clinicFields.address = address;
    if (contactNumber) clinicFields.contactNumber = contactNumber;
    if (isActive !== undefined) clinicFields.isActive = isActive;

    try {
        let clinic = await Clinic.findById(req.params.id);

        if (!clinic) return res.status(404).json({ msg: 'Clinic not found' });

        clinic = await Clinic.findByIdAndUpdate(
            req.params.id,
            { $set: clinicFields },
            { new: true }
        );

        res.json(clinic);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
