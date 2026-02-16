'use client';

import { useState, useEffect } from 'react';
import api from '../lib/api';

export default function DoctorForm({ onSuccess, initialData = null }) {
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        email: initialData?.email || '',
        phone: initialData?.phone || '',
        specialization: initialData?.specialization || '',
        experience: initialData?.experience || '',
        qualifications: initialData?.qualifications || ''
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
            if (initialData) {
                await api.put(`/doctors/${initialData._id}`, formData);
            } else {
                // Not implementing create for now as it's typically via registration
                setError('Create not implemented in this form');
                setLoading(false);
                return;
            }

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
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg text-sm text-center">
                    {error}
                </div>
            )}

            <div>
                <label className={labelClasses}>Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className={inputClasses} />
            </div>
            <div>
                <label className={labelClasses}>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className={inputClasses} />
            </div>
            <div>
                <label className={labelClasses}>Phone</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} required className={inputClasses} />
            </div>

            <div>
                <label className={labelClasses}>Specialization</label>
                <input type="text" name="specialization" value={formData.specialization} onChange={handleChange} className={inputClasses} placeholder="e.g. Cardiologist" />
            </div>

            <div>
                <label className={labelClasses}>Experience (Years)</label>
                <input type="number" name="experience" value={formData.experience} onChange={handleChange} className={inputClasses} />
            </div>

            <div>
                <label className={labelClasses}>Qualifications</label>
                <textarea name="qualifications" value={formData.qualifications} onChange={handleChange} className={inputClasses} rows="2" placeholder="e.g. MBBS, MD"></textarea>
            </div>

            <div className="pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white ${loading ? 'bg-primary/50' : 'bg-primary hover:bg-primary-dark'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-black transition-all duration-300 shadow-[0_0_20px_-5px_rgba(124,58,237,0.5)]`}
                >
                    {loading ? 'Saving...' : 'Update Profile'}
                </button>
            </div>
        </form>
    );
}
