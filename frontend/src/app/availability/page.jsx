'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../lib/api';
import Card from '../../components/Card';
import AvailabilityForm from '../../components/AvailabilityForm';
import AvailabilityList from '../../components/AvailabilityList';

export default function AvailabilityPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            const userRes = await api.get('/auth/user');
            setUser(userRes.data);

            if (userRes.data.role !== 'doctor') {
                router.push('/dashboard'); // Redirect non-doctors
                return;
            }

        } catch (e) {
            console.error(e);
            if (e.response && e.response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                router.push('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const refreshUser = async () => {
        try {
            const res = await api.get('/auth/user');
            setUser(res.data);
        } catch (e) { console.error(e); }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="text-foreground">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">
                    Manage <span className="text-primary">Availability</span>
                </h1>
                <p className="text-secondary">Set your weekly schedule and manage upcoming slots.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-1">
                    <Card>
                        <h2 className="text-xl font-bold mb-6">Add Slots</h2>
                        <AvailabilityForm onUpdate={refreshUser} />
                    </Card>
                </div>

                {/* List Section */}
                <div className="lg:col-span-2">
                    <Card className="h-full">
                        <h2 className="text-xl font-bold mb-6">Upcoming Availability</h2>
                        {user.availability && user.availability.length > 0 ? (
                            <AvailabilityList availability={user.availability} onUpdate={refreshUser} />
                        ) : (
                            <p className="text-gray-400">No availability set. Please add some slots.</p>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
}
