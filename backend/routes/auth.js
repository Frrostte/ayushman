const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const auth = require('../middleware/auth');

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', async (req, res) => {
    let { email, password, name, phone, clinicId } = req.body;
    const role = 'patient'; // Force public registration to be patient only

    try {
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            email,
            password,
            name,
            phone,
            role,
            clinicId
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        // Auto-create associated role profile
        if (role === 'patient') {
            const Patient = require('../models/Patient');
            const newPatient = new Patient({
                userId: user.id,
                clinicId: user.clinicId || null
            });
            await newPatient.save();
        } else if (role === 'doctor') {
            const Doctor = require('../models/Doctor');
            const newDoctor = new Doctor({
                userId: user.id,
                clinicId: user.clinicId || null
            });
            await newDoctor.save();
        }

        const payload = {
            user: {
                id: user.id,
                role: user.role,
                clinicId: user.clinicId
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, clinicId: user.clinicId } });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/auth/admin/register
// @desc    Admin register new user (no auto login)
// @access  Private (Admin)
const roleCheck = require('../middleware/roleCheck');
router.post('/admin/register', [auth, roleCheck(['admin', 'superadmin'])], async (req, res) => {
    let { email, password, name, phone, role, clinicId } = req.body;

    // Enforce clinic boundary: admins cannot provision users outside their clinic
    if (req.user.role !== 'superadmin') {
        clinicId = req.user.clinicId;
    } else if (!clinicId && req.user.clinicId) {
        clinicId = req.user.clinicId;
    }

    try {
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            email,
            password,
            name,
            phone,
            role,
            clinicId
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        // Auto-create associated role profile
        if (role === 'patient') {
            const Patient = require('../models/Patient');
            const newPatient = new Patient({
                userId: user.id,
                clinicId: user.clinicId
            });
            await newPatient.save();
        } else if (role === 'doctor') {
            const Doctor = require('../models/Doctor');
            const existingDoc = await Doctor.findOne({ userId: user.id });
            if (!existingDoc) {
                const newDoctor = new Doctor({
                    userId: user.id,
                    clinicId: user.clinicId
                });
                await newDoctor.save();
            }
        }

        res.json({ msg: 'User created successfully', user: { id: user.id, name: user.name, email: user.email, role: user.role, clinicId: user.clinicId } });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // --- Check if user itself is inactive ---
        if (user.isActive === false) {
            return res.status(403).json({ msg: 'Account Suspended: Your profile is completely inactive.' });
        }

        // --- Check if user belongs to an inactive clinic ---
        if (user.clinicId && user.role !== 'superadmin') {
            const Clinic = require('../models/Clinic');
            const clinic = await Clinic.findById(user.clinicId);
            if (clinic && clinic.isActive === false) {
                return res.status(403).json({ msg: 'Account Suspended: Your clinic is currently inactive. Please contact support.' });
            }
        }

        const payload = {
            user: {
                id: user.id,
                role: user.role,
                clinicId: user.clinicId
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, clinicId: user.clinicId } });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/auth/user
// @desc    Get logged in user
// @access  Private
router.get('/user', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');

        let userData = user.toObject();

        if (user.role === 'doctor') {
            const doctorProfile = await Doctor.findOne({ userId: req.user.id });
            if (doctorProfile) {
                console.log('Merging doctor profile for user:', user._id);
                userData = { ...userData, ...doctorProfile.toObject() };
                console.log('Availability count:', userData.availability ? userData.availability.length : 0);
            } else {
                console.log('No doctor profile found for user:', user._id);
            }
        }

        res.json(userData);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
