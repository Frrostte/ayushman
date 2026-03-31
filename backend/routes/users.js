const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const roleCheck = require('../middleware/roleCheck');

// @route   GET api/users
// @desc    Get all users
// @access  Private (Admin, Superadmin only)
router.get('/', [auth, roleCheck(['admin', 'superadmin'])], async (req, res) => {
    try {
        const query = req.user.role === 'superadmin' ? {} : { clinicId: req.user.clinicId };
        const users = await User.find(query).populate('clinicId', 'name').select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}); const bcrypt = require('bcryptjs');

// @route   PUT api/users/:id
// @desc    Update user info (Admin, Superadmin only)
// @access  Private
router.put('/:id', [auth, roleCheck(['admin', 'superadmin'])], async (req, res) => {
    const { name, email, phone, role, password } = req.body;

    try {
        let user = null;
        if (req.user.role === 'superadmin') {
            user = await User.findById(req.params.id);
        } else {
            user = await User.findOne({ _id: req.params.id, clinicId: req.user.clinicId });
        }
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Check if updating email to one that already exists
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ msg: 'Email already in use' });
            }
        }

        // Build user object
        const userFields = {};
        if (name) userFields.name = name;
        if (email) userFields.email = email;
        if (phone) userFields.phone = phone;
        if (role) userFields.role = role;
        if (req.body.isActive !== undefined) userFields.isActive = req.body.isActive;
        if (req.body.clinicId !== undefined && req.user.role === 'superadmin') {
            userFields.clinicId = req.body.clinicId || null;
        }

        // Optionally update password if provided by admin
        if (password) {
            const salt = await bcrypt.genSalt(10);
            userFields.password = await bcrypt.hash(password, salt);
        }

        const query = req.user.role === 'superadmin' 
            ? { _id: req.params.id } 
            : { _id: req.params.id, clinicId: req.user.clinicId };

        user = await User.findOneAndUpdate(
            query,
            { $set: userFields },
            { new: true }
        ).select('-password');

        if (req.user.role === 'superadmin' && req.body.clinicId !== undefined) {
            const newClinicId = req.body.clinicId || null;
            if (user.role === 'patient') {
                await require('../models/Patient').findOneAndUpdate(
                    { userId: user.id }, 
                    { clinicId: newClinicId }, 
                    { upsert: true, new: true, setDefaultsOnInsert: true }
                );
            } else if (user.role === 'doctor') {
                await require('../models/Doctor').findOneAndUpdate(
                    { userId: user.id }, 
                    { clinicId: newClinicId }, 
                    { upsert: true, new: true, setDefaultsOnInsert: true }
                );
            }
        }

        res.json(user);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/users/:id
// @desc    Delete user completely
// @access  Private (Admin, Superadmin only)
router.delete('/:id', [auth, roleCheck(['admin', 'superadmin'])], async (req, res) => {
    try {
        let user = null;
        if (req.user.role === 'superadmin') {
            user = await User.findById(req.params.id);
        } else {
            user = await User.findOne({ _id: req.params.id, clinicId: req.user.clinicId });
        }

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Prevent deleting yourself
        if (user.id === req.user.id) {
            return res.status(400).json({ msg: 'Cannot delete your own account' });
        }

        if (user.role === 'patient') {
            await require('../models/Patient').findOneAndDelete({ userId: user.id });
        } else if (user.role === 'doctor') {
            await require('../models/Doctor').findOneAndDelete({ userId: user.id });
        }

        await User.findByIdAndDelete(user.id);

        res.json({ msg: 'User removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;
