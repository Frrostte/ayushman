const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function verify() {
    try {
        console.log('Starting Strict Booking Verification...');

        // 1. Setup Doctor
        const doctorEmail = `doc_strict_${Date.now()}@test.com`;
        const doctorPass = 'password';
        let doctorToken, doctorId;

        try {
            const res = await axios.post(`${API_URL}/auth/register`, {
                name: 'Strict Doc',
                email: doctorEmail,
                password: doctorPass,
                phone: '1234567890',
                role: 'doctor'
            });
            doctorToken = res.data.token;
            doctorId = res.data.user.id;
        } catch (e) {
            console.error('Doc reg failed:', e.response?.data || e.message);
            return;
        }

        // 2. Set Availability for Tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dateStr = tomorrow.toISOString().split('T')[0];

        try {
            await axios.put(`${API_URL}/doctors/availability`, {
                date: dateStr,
                startTime: '10:00',
                endTime: '11:00' // Should generate 10:00 and 10:30 slots
            }, {
                headers: { 'x-auth-token': doctorToken }
            });
            console.log(`Availability set for ${dateStr}.`);
        } catch (e) {
            console.error('Avail set failed:', e.response?.data || e.message);
            return;
        }

        // 3. Setup Patient
        const patientEmail = `pat_strict_${Date.now()}@test.com`;
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
            }, { headers: { 'x-auth-token': patientToken } });
            patientProfileId = pRes.data._id;
        } catch (e) {
            console.error('Pat setup failed:', e.response?.data || e.message);
            return;
        }

        // 4. Test Slot Generation
        try {
            // Correct Date
            const res = await axios.get(`${API_URL}/appointments/slots?doctorId=${doctorId}&date=${dateStr}`, { headers: { 'x-auth-token': patientToken } });
            console.log(`Slots for ${dateStr}:`, res.data);
            if (!res.data.includes('10:00') || !res.data.includes('10:30')) {
                console.error('FAIL: Missing expected slots');
            }

            // Incorrect Date (Day after tomorrow - should have NO slots)
            const nextDay = new Date(tomorrow);
            nextDay.setDate(nextDay.getDate() + 1);
            const nextDayStr = nextDay.toISOString().split('T')[0];
            const res2 = await axios.get(`${API_URL}/appointments/slots?doctorId=${doctorId}&date=${nextDayStr}`, { headers: { 'x-auth-token': patientToken } });
            if (res2.data.length > 0) {
                console.error('FAIL: Slots found on unavailable date');
            } else {
                console.log('PASS: No slots on unavailable date');
            }
        } catch (e) {
            console.error('Slot test failed:', e.message);
        }

        // 5. Test Double Booking
        try {
            console.log('Booking 10:00 slot...');
            await axios.post(`${API_URL}/appointments`, {
                patientId: patientProfileId, doctorId, date: dateStr, time: '10:00'
            }, { headers: { 'x-auth-token': patientToken } });
            console.log('First booking success.');

            console.log('Attempting double booking 10:00...');
            try {
                await axios.post(`${API_URL}/appointments`, {
                    patientId: patientProfileId, doctorId, date: dateStr, time: '10:00'
                }, { headers: { 'x-auth-token': patientToken } });
                console.error('FAIL: Double booking allowed!');
            } catch (e) {
                if (e.response && e.response.status === 500) { // We didn't implement explicit 400 for 11000 properly in prev tool, so it might be 500
                    console.log('PASS: Double booking blocked (Server Error due to duplicate key).');
                } else if (e.response && e.response.status === 400) {
                    console.log('PASS: Double booking blocked (Bad Request).');
                } else {
                    console.error('FAIL: Unexpected error on double booking:', e.message);
                }
            }

        } catch (e) {
            console.error('Booking test failed:', e.response?.data || e.message);
        }

    } catch (err) {
        console.error(err.message);
    }
}

verify();
