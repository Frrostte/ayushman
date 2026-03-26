const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Clinic = require('../models/Clinic');

const seedAdmin = async () => {
    try {
        // Seed default clinic
        let defaultClinic = await Clinic.findOne({ name: 'Default Ayushman Clinic' });
        if (!defaultClinic) {
            defaultClinic = new Clinic({
                name: 'Default Ayushman Clinic',
                address: 'HQ',
                contactNumber: '0000000000'
            });
            await defaultClinic.save();
            console.log('Seeded default clinic.');
        }

        const adminExists = await User.findOne({ email: 'admin@ayushman.com' });

        if (!adminExists) {
            console.log('No superadmin user found. Seeding initial superadmin...');

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('gadminSAY123!@', salt);

            // Create a superadmin who can manage clinics
            const superadmin = new User({
                email: 'admin@ayushman.com',
                password: hashedPassword,
                name: 'System Super Admin',
                phone: '0000000000',
                role: 'superadmin', // They can manage clinics
                clinicId: defaultClinic._id
            });

            await superadmin.save();
            console.log('Default superadmin user created: admin@ayushman.com');
        } else if (!adminExists.clinicId || adminExists.role !== 'superadmin') {
            // Assign existing admin to default clinic and elevate
            adminExists.clinicId = defaultClinic._id;
            adminExists.role = 'superadmin';
            await adminExists.save();
            console.log('Updated existing admin to superadmin and assigned default clinic.');
        } else {
            console.log('Superadmin user already exists.');
        }
    } catch (err) {
        console.error('Error seeding admin user:', err.message);
    }
};

module.exports = seedAdmin;
