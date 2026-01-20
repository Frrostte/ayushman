const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function verify() {
    try {
        console.log('Starting Strict Booking Verification (Retry)...');

        // 1. Setup Doctor
        const doctorEmail = `doc_strict_retry_${Date.now()}@test.com`;
        const doctorPass = 'password';
        let doctorToken, doctorId;

        // Register new doctor to avoid role check issues with old data
        try {
            const res = await axios.post(`${API_URL}/auth/register`, {
                name: 'Strict Doc Retry',
                email: doctorEmail,
                password: doctorPass,
                phone: '1234567890',
                role: 'doctor'
            });
            doctorToken = res.data.token;
            doctorId = res.data.user.id;
            console.log('Doctor registered:', doctorId);
        } catch (e) {
            console.error('Doc reg failed:', e.response?.data || e.message);
            return;
        }

        // 2. Set Availability
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dateStr = tomorrow.toISOString().split('T')[0];

        try {
            await axios.put(`${API_URL}/doctors/availability`, {
                date: dateStr,
                startTime: '10:00',
                endTime: '11:00'
            }, {
                headers: { 'Authorization': `Bearer ${doctorToken}` }
            });
            console.log(`Availability set for ${dateStr}.`);
        } catch (e) {
            console.error('Avail set failed:', e.response?.data || e.message);
            return;
        }

        // 3. Setup Patient
        const patientEmail = `pat_strict_retry_${Date.now()}@test.com`;
        let patientToken, patientId, patientProfileId;

        try {
            const res = await axios.post(`${API_URL}/auth/register`, {
                name: 'Strict Pat',
                email: patientEmail,
                password: 'password',
                phone: '0987654321',
                role: 'patient'
            });
            patientToken = res.data.token;
            patientId = res.data.user.id;

            const pRes = await axios.post(`${API_URL}/patients`, {
                userId: patientId, dateOfBirth: '1990-01-01', gender: 'male', address: '123 St', medicalNotes: 'None'
            }, { headers: { 'Authorization': `Bearer ${patientToken}` } });
            patientProfileId = pRes.data._id;
            console.log('Patient registered:', patientId);
        } catch (e) {
            console.error('Pat setup failed:', e.response?.data || e.message);
            return;
        }

        // 4. Test Double Booking
        try {
            // First Booking
            console.log('Booking 10:00 slot...');
            await axios.post(`${API_URL}/appointments`, {
                patientId: patientProfileId, doctorId, date: dateStr, time: '10:00'
            }, { headers: { 'Authorization': `Bearer ${patientToken}` } });
            console.log('First booking success.');

            // Second Booking (Same details)
            console.log('Attempting double booking 10:00...');
            try {
                await axios.post(`${API_URL}/appointments`, {
                    patientId: patientProfileId, doctorId, date: dateStr, time: '10:00'
                }, { headers: { 'Authorization': `Bearer ${patientToken}` } });
                console.error('FAIL: Double booking allowed!');
            } catch (e) {
                // We expect error
                console.log(`PASS: Double booking blocked. Status: ${e.response?.status}`);
            }

        } catch (e) {
            console.error('Booking test failed:', e.response?.data || e.message);
        }

    } catch (err) {
        console.error(err.message);
    }
}

verify();
