'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import api from '../../../lib/api';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import Card from '../../../components/Card';

export default function NewDoctor() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        role: 'doctor' // Force role to doctor
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Reusing auth/register, but verifying if we can stay logged in as admin?
            // Auth register returns a token and logs the user in on frontend usually by overwriting localstorage.
            // We DON'T want to log the admin out.
            // But /auth/register is designed for self-registration.
            // If I use it, it returns a token. I should ignore the token if I'm admin adding a user.
            // But backend /auth/register might NOT check if I'm already logged in. It's a public route usually.
            // Let's check backend/routes/auth.js. It's public.
            // Issues:
            // 1. If I call it, it creates a user. 
            // 2. It returns token. I just ignore it.
            // 3. I stay logged in as admin because I don't touch localStorage.

            await api.post('/auth/register', formData);
            router.push('/doctors');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.msg || 'Failed to add doctor');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="text-foreground max-w-3xl mx-auto">
            <div className="mb-10">
                <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-light tracking-tight mb-2">
                    Add New Doctor
                </h1>
                <p className="text-gray-500 dark:text-gray-400 font-medium tracking-tight">Create a professional profile for a new clinical staff member.</p>
            </div>

            <Card className="bg-white dark:bg-surface border border-gray-100 dark:border-white/5 rounded-3xl shadow-xl p-8 md:p-10">
                {error && (
                    <div className="bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/30 text-red-600 dark:text-red-400 px-6 py-4 rounded-2xl mb-8 text-sm font-bold uppercase tracking-widest text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <Input
                            label="Full Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            label="Email Address"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <Input
                            label="Phone Number"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            label="Password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="pt-8 flex flex-col md:flex-row gap-4">
                        <Button
                            type="button"
                            className="bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 w-full hover:bg-gray-200 hover:text-gray-900 transition-all py-4 text-xs font-bold uppercase tracking-widest rounded-2xl"
                            onClick={() => router.back()}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" isLoading={loading} className="w-full py-4 text-xs font-bold uppercase tracking-widest shadow-xl shadow-primary/10 hover:scale-[1.02] transition-transform rounded-2xl">
                            Create Professional Account
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
