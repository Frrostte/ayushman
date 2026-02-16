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
                patientId: appointment.patientId._id || appointment.patientId,
                doctorId: appointment.doctorId._id || appointment.doctorId,
                ...formData,
                medications
            };

            await api.post('/sessions', payload);
            await api.put(`/appointments/${appointment._id}`, { status: 'completed' });

            if (onSuccess) onSuccess();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.msg || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const inputClasses = "appearance-none rounded-lg relative block w-full px-3 py-3 bg-black/50 border border-white/10 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm transition-all";
    const labelClasses = "block text-sm font-medium text-gray-400 mb-1";

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg text-sm text-center">
                    {error}
                </div>
            )}

            <div>
                <label className={labelClasses}>Complaints</label>
                <textarea name="complaints" value={formData.complaints} onChange={handleChange} rows="3" required className={inputClasses} placeholder="Patient complaints..." />
            </div>

            <div>
                <label className={labelClasses}>Diagnosis</label>
                <textarea name="diagnosis" value={formData.diagnosis} onChange={handleChange} rows="2" required className={inputClasses} placeholder="Medical diagnosis..." />
            </div>

            <div>
                <label className={labelClasses}>Notes</label>
                <textarea name="notes" value={formData.notes} onChange={handleChange} rows="2" className={inputClasses} placeholder="Additional notes..." />
            </div>

            <PrescriptionForm medications={medications} setMedications={setMedications} />

            <div className="pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white ${loading ? 'bg-primary/50' : 'bg-primary hover:bg-primary-dark'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-black transition-all duration-300 shadow-[0_0_20px_-5px_rgba(124,58,237,0.5)]`}
                >
                    {loading ? 'Saving...' : 'Save Session'}
                </button>
            </div>
        </form>
    );
}
