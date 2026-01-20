const axios = require('axios');

// Let's use API verification as it's more realistic.
const API_URL = 'http://localhost:5000/api';

async function verify() {
    try {
        console.log('Starting verification...');

        // 1. Login as Doctor to setup availability
        console.log('Logging in as Doctor...');
        // We probably need to create a doctor or assume one exists.
        // Let's register a temporary doctor for testing.
        const doctorEmail = `doc_test_${Date.now()}@test.com`;
        const doctorPass = 'password';

        let doctorToken;
        let doctorId;

        try {
            const res = await axios.post(`${API_URL}/auth/register`, {
                name: 'Test Doctor',
                email: doctorEmail,
                password: doctorPass,
                phone: '1234567890',
                role: 'doctor'
            });
            doctorToken = res.data.token;
            doctorId = res.data.user.id;
        } catch (e) {
            console.log('Doctor register failed, trying login (maybe already exists)');
            console.error(e.response?.data || e.message);
            return;
        }

        console.log('Doctor registered:', doctorId);

        // 2. Set Availability
        console.log('Setting availability...');
        try {
            await axios.put(`${API_URL}/doctors/availability`, {
                workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
                startTime: '09:00',
                endTime: '17:00'
            }, {
                headers: { 'x-auth-token': doctorToken }
            });
            console.log('Availability set.');
        } catch (e) {
            console.error('Failed to set availability:', e.response?.data || e.message);
            return;
        }

        // 3. Register Patient
        console.log('Registering Patient...');
        const patientEmail = `pat_test_${Date.now()}@test.com`;
        let patientToken;
        let patientId; // User ID
        let patientProfileId; // Patient Profile ID

        try {
            const res = await axios.post(`${API_URL}/auth/register`, {
                name: 'Test Patient',
                email: patientEmail,
                password: 'password',
                phone: '0987654321',
                role: 'patient'
            });
            patientToken = res.data.token;
            patientId = res.data.user.id;
        } catch (e) {
            console.error('Patient register failed:', e.response?.data || e.message);
            return;
        }

        // Create Patient Profile (required for booking)
        try {
            const res = await axios.post(`${API_URL}/patients`, {
                userId: patientId,
                dateOfBirth: '1990-01-01',
                gender: 'male',
                address: '123 Test St',
                medicalNotes: 'None'
            }, {
                headers: { 'x-auth-token': patientToken }
            });
            patientProfileId = res.data._id;
            console.log('Patient profile created:', patientProfileId);
        } catch (e) {
            console.error('Patient profile creation failed:', e.response?.data || e.message);
            return;
        }

        // 4. Fetch Slots
        // Find a weekday (e.g., next Monday)
        const today = new Date();
        const nextMonday = new Date(today);
        nextMonday.setDate(today.getDate() + (1 + 7 - today.getDay()) % 7);
        // If today is Monday, use today or next week.
        if (nextMonday.getTime() <= today.getTime()) {
            nextMonday.setDate(nextMonday.getDate() + 7);
        }

        const dateStr = nextMonday.toISOString().split('T')[0];
        console.log(`Fetching slots for ${dateStr}...`);

        try {
            const res = await axios.get(`${API_URL}/appointments/slots?doctorId=${doctorId}&date=${dateStr}`, {
                headers: { 'x-auth-token': patientToken }
            });
            console.log('Slots found:', res.data.length);
            if (res.data.length === 0) {
                console.error('No slots found! Check availability logic.');
                return;
            }

            // 5. Book Appointment
            const slotToBook = res.data[0];
            console.log(`Booking slot: ${slotToBook}`);

            await axios.post(`${API_URL}/appointments`, {
                patientId: patientProfileId,
                doctorId: doctorId,
                date: dateStr,
                time: slotToBook
            }, {
                headers: { 'x-auth-token': patientToken }
            });

            console.log('Booking successful!');

            // 6. Verify Slot is Gone
            const res2 = await axios.get(`${API_URL}/appointments/slots?doctorId=${doctorId}&date=${dateStr}`, {
                headers: { 'x-auth-token': patientToken }
            });
            if (res2.data.includes(slotToBook)) {
                console.error('Slot still available after booking! FAIL');
            } else {
                console.log('Slot successfully removed from availability. PASS');
            }

        } catch (e) {
            console.error('Booking flow failed:', e.response?.data || e.message);
        }

    } catch (err) {
        console.error(err.message);
    }
}

verify();
