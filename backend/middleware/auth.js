const jwt = require('jsonwebtoken');

module.exports = async function (req, res, next) {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    // Check if not token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        
        // --- Real-time Kill Switch Check ---
        if (req.user.clinicId && req.user.role !== 'superadmin') {
            const Clinic = require('../models/Clinic');
            const clinic = await Clinic.findById(req.user.clinicId);
            if (clinic && clinic.isActive === false) {
                return res.status(403).json({ msg: 'Account Suspended: Your clinic is currently inactive.' });
            }
        }

        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
