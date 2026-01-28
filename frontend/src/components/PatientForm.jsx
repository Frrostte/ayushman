'use client';

import { useState } from 'react';
import api from '../lib/api';

export default function PatientForm({ onSuccess, initialData = null }) {
    const [formData, setFormData] = useState({
        name: initialData?.userId?.name || '',
        email: initialData?.userId?.email || '',
        password: '',
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

        if (!initialData) {
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                setError('Please enter a valid email address');
                setLoading(false);
                return;
            }
            if (!/^\d{10}$/.test(formData.phone)) {
                setError('Please enter a valid 10-digit phone number');
                setLoading(false);
                return;
            }
        }

        try {
            let userId = initialData?.userId?._id;

            if (!initialData) {
                const userRes = await api.post('/auth/register', {
                    email: formData.email,
                    password: formData.password,
                    name: formData.name,
                    phone: formData.phone,
                    role: 'patient'
                });
                userId = userRes.data.user.id;
            }

            if (initialData) {
                await api.put(`/patients/${initialData._id}`, {
                    dateOfBirth: formData.dateOfBirth,
                    gender: formData.gender,
                    address: formData.address,
                    medicalNotes: formData.medicalNotes
                });
            } else {
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

    const inputClasses = "appearance-none rounded-lg relative block w-full px-3 py-3 bg-black/50 border border-white/10 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm transition-all";
    const labelClasses = "block text-sm font-medium text-gray-400 mb-1";

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg text-sm text-center">
                    {error}
                </div>
            )}

            {!initialData && (
                <>
                    <div>
                        <label className={labelClasses}>Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required className={inputClasses} placeholder="Patient Name" />
                    </div>
                    <div>
                        <label className={labelClasses}>Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required className={inputClasses} placeholder="Email" />
                    </div>
                    <div>
                        <label className={labelClasses}>Phone</label>
                        <input type="text" name="phone" value={formData.phone} onChange={handleChange} required className={inputClasses} placeholder="Phone" />
                    </div>
                    <div>
                        <label className={labelClasses}>Password (for patient login)</label>
                        <input type="text" name="password" value={formData.password} onChange={handleChange} required className={inputClasses} placeholder="Temporary Password" />
                    </div>
                </>
            )}

            {initialData && (
                <div>
                    <label className={labelClasses}>Name (Read Only)</label>
                    <input type="text" value={formData.name} disabled className={`${inputClasses} opacity-50 cursor-not-allowed`} />
                </div>
            )}

            <div>
                <label className={labelClasses}>Date of Birth</label>
                <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className={inputClasses} style={{ colorScheme: 'dark' }} />
            </div>

            <div>
                <label className={labelClasses}>Gender</label>
                <div className="relative">
                    <select name="gender" value={formData.gender} onChange={handleChange} className={inputClasses}>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                        <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                        </svg>
                    </div>
                </div>
            </div>

            <div>
                <label className={labelClasses}>Address</label>
                <textarea name="address" value={formData.address} onChange={handleChange} className={inputClasses} rows="3" placeholder="Address"></textarea>
            </div>

            <div>
                <label className={labelClasses}>Medical Notes</label>
                <textarea name="medicalNotes" value={formData.medicalNotes} onChange={handleChange} className={inputClasses} rows="3" placeholder="Notes"></textarea>
            </div>

            <div className="pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white ${loading ? 'bg-primary/50' : 'bg-primary hover:bg-primary-dark'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-black transition-all duration-300 shadow-[0_0_20px_-5px_rgba(124,58,237,0.5)]`}
                >
                    {loading ? 'Saving...' : (initialData ? 'Update Patient' : 'Add Patient')}
                </button>
            </div>
        </form>
    );
}
