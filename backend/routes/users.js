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
});

module.exports = router;
