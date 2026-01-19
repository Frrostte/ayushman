'use client';

import { useState } from 'react';
import api from '../lib/api';
import PrescriptionForm from './PrescriptionForm';

export default function SessionForm({ appointment, onSuccess }) {
    const [formData, setFormData] = useState({
        complaints: '',
        diagnosis: '',
        notes: ''
    });
    const [medications, setMedications] = useState([]);
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
            const payload = {
                appointmentId: appointment._id,
                patientId: appointment.patientId._id || appointment.patientId, // Handle populated or not
                doctorId: appointment.doctorId._id || appointment.doctorId,
                ...formData,
                medications
            };

            await api.post('/sessions', payload);

            // Update appointment status to completed?
            await api.put(`/appointments/${appointment._id}`, { status: 'completed' });

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

            <div className="form-group">
                <label>Complaints</label>
                <textarea name="complaints" value={formData.complaints} onChange={handleChange} rows="3" required />
            </div>

            <div className="form-group">
                <label>Diagnosis</label>
                <textarea name="diagnosis" value={formData.diagnosis} onChange={handleChange} rows="2" required />
            </div>

            <div className="form-group">
                <label>Notes</label>
                <textarea name="notes" value={formData.notes} onChange={handleChange} rows="2" />
            </div>

            <PrescriptionForm medications={medications} setMedications={setMedications} />

            <div style={{ marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Session'}
                </button>
            </div>
        </form>
    );
}
