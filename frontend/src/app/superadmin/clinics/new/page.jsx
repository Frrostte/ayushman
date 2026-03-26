'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../../lib/api';
import Link from 'next/link';
import Input from '../../../../components/Input';
import Button from '../../../../components/Button';
import Card from '../../../../components/Card';

export default function NewClinic() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        contactNumber: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    useEffect(() => {
        const checkSuperAdmin = () => {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                if (user.role !== 'superadmin') {
                    router.push('/dashboard');
                } else {
                    setIsCheckingAuth(false);
                }
            } else {
                router.push('/login');
            }
        };
        checkSuperAdmin();
    }, [router]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        if (!formData.name.trim()) {
            setError('Clinic name is required');
            setIsLoading(false);
            return;
        }

        try {
            await api.post('/clinics', formData);
            setSuccess(`Successfully created new clinic: ${formData.name}`);
            setFormData({
                name: '',
                address: '',
                contactNumber: ''
            });
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to create clinic');
        } finally {
            setIsLoading(false);
        }
    };

    if (isCheckingAuth) return null;

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-fade-in pb-12">
            <div className="flex items-center gap-4">
                <Link href="/superadmin/clinics" className="p-2.5 bg-white dark:bg-surface border border-gray-100 dark:border-white/5 rounded-2xl text-gray-400 hover:text-primary hover:border-primary/30 transition-all shadow-sm group">
                    <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </Link>
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Create New Clinic</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Register a new tenant clinic in the system.</p>
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
                        <Link href="/superadmin/clinics">
                            <Button variant="outline" className="text-xs py-2 px-4 border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 whitespace-nowrap">
                                View All Clinics
                            </Button>
                        </Link>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <Input
                                label="Clinic Name*"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="Apollo Hospital, City Branch"
                            />
                        </div>
                        <Input
                            label="Contact Number"
                            name="contactNumber"
                            value={formData.contactNumber}
                            onChange={handleChange}
                            placeholder="Enter contact number"
                        />
                        <div className="md:col-span-2">
                            <Input
                                label="Address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Full street address"
                            />
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100 dark:border-white/5 flex justify-end">
                        <Button type="submit" isLoading={isLoading} className="px-8 py-4 shadow-xl shadow-primary/20">
                            Register Clinic
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
