'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';
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
        <div className="min-h-screen bg-background text-white selection:bg-primary selection:text-white">
            <Navbar />
            <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
                <Card>
                    <h1 className="text-3xl font-bold mb-6">Add New Doctor</h1>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg mb-6 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
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

                        <div className="pt-4 flex gap-4">
                            <Button
                                type="button"
                                className="bg-transparent border border-gray-600 hover:border-gray-500 text-gray-300 w-full"
                                onClick={() => router.back()}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" isLoading={loading} className="w-full">
                                Create Doctor Account
                            </Button>
                        </div>
                    </form>
                </Card>
            </main>
        </div>
    );
}
