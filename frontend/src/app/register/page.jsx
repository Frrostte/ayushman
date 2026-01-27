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
        <div className="min-h-screen flex items-center justify-center bg-background px-4 sm:px-6 lg:px-8 py-12">
            <Card className="max-w-md w-full">
                <div>
                    <h2 className="text-center text-3xl font-extrabold text-white">
                        Create Account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-400">
                        Join the clinic management system
                    </p>
                </div>
                {error && (
                    <div className="mt-4 bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg text-sm text-center">
                        {error}
                    </div>
                )}
                <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                    <Select
                        label="Register As"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        options={[
                            { value: 'doctor', label: 'Doctor' },
                            { value: 'patient', label: 'Patient' }
                        ]}
                    />
                    <Input
                        label="Full Name"
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Full Name"
                    />
                    <Input
                        label="Email"
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email address"
                    />
                    <Input
                        label="Phone"
                        type="text"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Phone number"
                    />
                    <Input
                        label="Password"
                        type="password"
                        name="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Password"
                    />

                    <div className="pt-4">
                        <Button type="submit" isLoading={isLoading}>
                            Register
                        </Button>
                    </div>
                </form>
                <div className="text-center mt-4">
                    <p className="text-sm text-gray-400">
                        Already have an account? <Link href="/login" className="font-medium text-primary-light hover:text-white transition-colors">Login here</Link>
                    </p>
                </div>
            </Card>
        </div>
    );
}
