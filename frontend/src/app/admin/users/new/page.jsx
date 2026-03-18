'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../../lib/api';
import Link from 'next/link';
import Input from '../../../../components/Input';
import Button from '../../../../components/Button';
import Card from '../../../../components/Card';
import Select from '../../../../components/Select';

export default function NewUser() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: 'doctor' // Default
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    useEffect(() => {
        const checkAdmin = () => {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                if (user.role !== 'admin') {
                    router.push('/dashboard');
                } else {
                    setIsCheckingAuth(false);
                }
            } else {
                router.push('/login');
            }
        };
        checkAdmin();
    }, [router]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setError('Please enter a valid email address');
            setIsLoading(false);
            return;
        }

        if (!/^\d{10}$/.test(formData.phone)) {
            setError('Please enter a valid 10-digit phone number');
            setIsLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            setIsLoading(false);
            return;
        }

        try {
            await api.post('/auth/admin/register', formData);
            setSuccess(`Successfully created new ${formData.role} account for ${formData.name}`);
            // Reset form
            setFormData({
                name: '',
                email: '',
                phone: '',
                password: '',
                role: 'doctor'
            });
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to create user');
        } finally {
            setIsLoading(false);
        }
    };

    if (isCheckingAuth) return null;

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-fade-in pb-12">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/admin/users" className="p-2.5 bg-white dark:bg-surface border border-gray-100 dark:border-white/5 rounded-2xl text-gray-400 hover:text-primary hover:border-primary/30 transition-all shadow-sm group">
                    <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </Link>
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Create New User</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Add a new admin, doctor, or patient to the system.</p>
                </div>
            </div>

            <Card className="bg-white dark:bg-surface border border-gray-100 dark:border-white/5 rounded-3xl shadow-xl p-8 md:p-10">
                {error && (
                    <div className="mb-8 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/50 text-red-600 dark:text-red-400 px-6 py-4 rounded-2xl text-sm font-bold flex items-center gap-3">
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-8 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/50 text-emerald-600 dark:text-emerald-400 px-6 py-4 rounded-2xl text-sm font-bold flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            {success}
                        </div>
                        <Link href="/admin/users">
                            <Button variant="outline" className="text-xs py-2 px-4 border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 whitespace-nowrap">
                                View All Users
                            </Button>
                        </Link>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Full Name*"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="John Doe"
                        />
                        <Select
                            label="Role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            options={[
                                { value: 'doctor', label: 'Doctor' },
                                { value: 'admin', label: 'Administrator' },
                                { value: 'patient', label: 'Patient' }
                            ]}
                        />
                        <Input
                            label="Email Address*"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="john@example.com"
                            autoComplete="off"
                        />
                        <Input
                            label="Phone Number*"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            placeholder="10-digit number"
                        />
                        <div className="md:col-span-2">
                            <Input
                                label="Password*"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="Min. 6 characters"
                                autoComplete="new-password"
                            />
                            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 font-medium ml-1">
                                The user will use this password to log in for the first time.
                            </p>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100 dark:border-white/5 flex justify-end">
                        <Button type="submit" isLoading={isLoading} className="px-8 py-4 shadow-xl shadow-primary/20">
                            Create User Account
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
