'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../lib/api';
import Link from 'next/link';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Select from '../../components/Select';


export default function Register() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        phone: '',
        role: 'doctor'
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
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

        try {
            const res = await api.post('/auth/register', formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            router.push('/dashboard');
        } catch (err) {
            setError(err.response?.data?.msg || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-background px-4 sm:px-6 lg:px-8 py-12">
            <Card className="max-w-md w-full bg-white dark:bg-surface border border-gray-100 dark:border-white/5 shadow-2xl rounded-3xl p-10">
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                        Create Account
                    </h2>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-medium">
                        Join the clinic management system
                    </p>
                </div>
                {error && (
                    <div className="mb-6 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/50 text-red-600 dark:text-red-400 px-4 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wide text-center">
                        {error}
                    </div>
                )}
                <form className="space-y-5" onSubmit={handleSubmit}>
                    <Select
                        label="Register As"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        options={[
                            { value: 'doctor', label: 'Doctor' },
                            { value: 'patient', label: 'Patient' },
                            { value: 'admin', label: 'Admin' }
                        ]}
                    />
                    <Input
                        label="Full Name"
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                    />
                    <Input
                        label="Email Address"
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                    />
                    <Input
                        label="Phone Number"
                        type="text"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="10-digit number"
                    />
                    <Input
                        label="Password"
                        type="password"
                        name="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Create a password"
                    />

                    <div className="pt-4">
                        <Button type="submit" isLoading={isLoading} className="w-full py-4 text-sm font-bold uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform rounded-2xl">
                            Create Account
                        </Button>
                    </div>
                </form>
                <div className="text-center mt-8 pt-8 border-t border-gray-100 dark:border-white/5">
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                        Already have an account? <Link href="/login" className="font-bold text-primary hover:text-primary-dark transition-colors ml-1">Login here</Link>
                    </p>
                </div>
            </Card>
        </div>
    );
}
