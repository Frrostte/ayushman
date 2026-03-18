'use client';

import { useState, useEffect } from 'react';
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
    const [userRole, setUserRole] = useState(null);

    // Check user role on mount
    // Check user role on mount
    useEffect(() => {
        const checkRole = async () => {
            try {
                const res = await api.get('/auth/user');
                setUserRole(res.data.role);
            } catch (e) { console.error(e); }
        };
        checkRole();
    }, []);

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
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
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

    const inputClasses = "rounded-2xl relative block w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 placeholder-gray-400 dark:placeholder-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/50 sm:text-sm transition-all duration-300";
    const disabledClasses = "rounded-2xl relative block w-full px-4 py-3 bg-gray-100/50 dark:bg-black/40 border border-gray-200 dark:border-white/5 text-gray-400 dark:text-gray-500 cursor-not-allowed sm:text-sm";
    const labelClasses = "block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5 ml-1";

    const canEditMedicalHistory = userRole === 'doctor';

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg text-sm text-center">
                    {error}
                </div>
            )}

            <div>
                <label className={labelClasses}>Name*</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className={inputClasses} placeholder="Patient Name" />
            </div>
            <div>
                <label className={labelClasses}>Email*</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className={inputClasses} placeholder="Email" />
            </div>
            <div>
                <label className={labelClasses}>Phone*</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} required className={inputClasses} placeholder="Phone" />
            </div>

            {!initialData && (
                <div>
                    <label className={labelClasses}>Password* (for patient login)</label>
                    <input type="text" name="password" value={formData.password} onChange={handleChange} required className={inputClasses} placeholder="Temporary Password" />
                </div>
            )}

            <div>
                <label className={labelClasses}>Date of Birth*</label>
                <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className={inputClasses} />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label className={labelClasses}>Gender*</label>
                    <div className="relative">
                        <select name="gender" value={formData.gender} onChange={handleChange} className={`${inputClasses} appearance-none`}>
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
            </div>

            <div>
                <label className={labelClasses}>Address*</label>
                <textarea name="address" value={formData.address} onChange={handleChange} className={inputClasses} rows="3" placeholder="Primary Living Address"></textarea>
            </div>

            {/* Medical Notes: Editable by Doctor ONLY */}
            <div>
                <label className={labelClasses}>Medical Notes {canEditMedicalHistory ? '' : '(Read Only)'}</label>
                <textarea
                    name="medicalNotes"
                    value={formData.medicalNotes}
                    onChange={handleChange}
                    className={canEditMedicalHistory ? inputClasses : disabledClasses}
                    rows="3"
                    placeholder="Clinical notes and medical history..."
                    disabled={!canEditMedicalHistory}
                ></textarea>
            </div>

            <div className="pt-6">
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex justify-center py-4 px-6 border border-transparent text-xs font-black uppercase tracking-widest rounded-2xl text-white ${loading ? 'bg-primary/50 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark shadow-xl shadow-primary/20 hover:scale-[1.02]'} focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all duration-300`}
                >
                    {loading ? 'Processing...' : (initialData ? 'Update Clinical Record' : 'Register New Patient')}
                </button>
            </div>
        </form>
    );
}
