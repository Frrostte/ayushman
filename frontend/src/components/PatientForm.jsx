'use client';

import { useState } from 'react';
import api from '../lib/api';

export default function PatientForm({ onSuccess, initialData = null }) {
    const [formData, setFormData] = useState({
        name: initialData?.userId?.name || '', // Name is in User, but for create it's different. Wait, to create patient we need User first?
        // The prompt says "Doctor can add a new patient".
        // Does "Add Patient" create a User account?
        // "1. User (Doctors + Patients in one table)"
        // "Patient schema: userId: ObjectId ref User"
        // So creating a patient implies creating a User first.
        // The simplified prompt didn't specify separate User creation for Patient.
        // "Doctor can add a new patient -> fills form -> patient created"
        // So the form should probably create both User and Patient or the backend handle it.
        // The backend `POST /api/patients` expects `userId`.
        // This means the User must exist.
        // But the Doctor adds a NEW patient.
        // So I need to register a User (role=patient) then create Patient record.
        // Or the backend `POST /api/patients` should handle creating the User?
        // The backend `patients.js` I wrote just does `new Patient({...})`. It expects `userId` in body.
        // So I need to create a User first in the frontend flow?
        // Or I should have updated backend to handle this.
        // But "Add and manage patients" usually means filling one form.
        // I'll update the frontend to:
        // 1. Call `register` to create User.
        // 2. Call `createPatient` with new userId.

        // So the form needs fields for User (email, name, phone, password?) and Patient (dob, gender, etc).
        // I'll generate a dummy password or ask for it.
        email: initialData?.userId?.email || '',
        password: '', // Default password for patients? Or ask? I'll ask.
        name: initialData?.userId?.name || '',
        phone: initialData?.userId?.phone || '',
        dateOfBirth: initialData?.dateOfBirth ? new Date(initialData.dateOfBirth).toISOString().split('T')[0] : '',
        gender: initialData?.gender || 'other',
        address: initialData?.address || '',
        medicalNotes: initialData?.medicalNotes || ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            let userId = initialData?.userId?._id;

            if (!initialData) {
                // Create User first
                // Check if user exists? Register endpoint handles that.
                const userRes = await api.post('/auth/register', {
                    email: formData.email,
                    password: formData.password,
                    name: formData.name,
                    phone: formData.phone,
                    role: 'patient'
                });
                userId = userRes.data.user.id; // user object from response? My auth.js returns { token, user: { id... } }
            }

            // Create or Update Patient
            if (initialData) {
                // Update
                await api.put(`/patients/${initialData._id}`, {
                    dateOfBirth: formData.dateOfBirth,
                    gender: formData.gender,
                    address: formData.address,
                    medicalNotes: formData.medicalNotes
                });
            } else {
                // Create
                await api.post('/patients', {
                    userId,
                    dateOfBirth: formData.dateOfBirth,
                    gender: formData.gender,
                    address: formData.address,
                    medicalNotes: formData.medicalNotes
                });
            }

            if (onSuccess) onSuccess();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.msg || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {error && <div className="error-msg">{error}</div>}

            {!initialData && (
                <>
                    <div className="form-group">
                        <label>Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Phone</label>
                        <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Password (for patient login)</label>
                        <input type="text" name="password" value={formData.password} onChange={handleChange} required />
                    </div>
                </>
            )}

            {initialData && (
                <div className="form-group">
                    <label>Name (Read Only)</label>
                    <input type="text" value={formData.name} disabled />
                </div>
            )}

            <div className="form-group">
                <label>Date of Birth</label>
                <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />
            </div>

            <div className="form-group">
                <label>Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </select>
            </div>

            <div className="form-group">
                <label>Address</label>
                <textarea name="address" value={formData.address} onChange={handleChange} />
            </div>

            <div className="form-group">
                <label>Medical Notes</label>
                <textarea name="medicalNotes" value={formData.medicalNotes} onChange={handleChange} />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : (initialData ? 'Update Patient' : 'Add Patient')}
            </button>
        </form>
    );
}
