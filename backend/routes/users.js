const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const roleCheck = require('../middleware/roleCheck');

// @route   GET api/users
// @desc    Get all users
// @access  Private (Admin only)
router.get('/', [auth, roleCheck(['admin'])], async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}); const bcrypt = require('bcryptjs');

// @route   PUT api/users/:id
// @desc    Update user info (Admin only)
// @access  Private
router.put('/:id', [auth, roleCheck(['admin'])], async (req, res) => {
    const { name, email, phone, role, password } = req.body;

    try {
        let user = await User.findById(req.params.id);
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

        // Optionally update password if provided by admin
        if (password) {
            const salt = await bcrypt.genSalt(10);
            userFields.password = await bcrypt.hash(password, salt);
        }

        user = await User.findByIdAndUpdate(
            req.params.id,
            { $set: userFields },
            { new: true }
        ).select('-password');

        res.json(user);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;
