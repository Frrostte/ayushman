const bcrypt = require('bcryptjs');
const User = require('../models/User');

const seedAdmin = async () => {
    try {
        const adminExists = await User.findOne({ role: 'admin' });

        if (!adminExists) {
            console.log('No admin user found. Seeding initial admin...');

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('gadminSAY123!@', salt);

            const admin = new User({
                email: 'admin@ayushman.com',
                password: hashedPassword,
                name: 'System Admin',
                phone: '0000000000',
                role: 'admin'
            });

            await admin.save();
            console.log('Default admin user created: admin@ayushman.com / admin123');
        } else {
            console.log('Admin user already exists.');
        }
    } catch (err) {
        console.error('Error seeding admin user:', err.message);
    }
};

module.exports = seedAdmin;
