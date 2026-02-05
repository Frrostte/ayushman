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
            <div className="mb-10">
                <h1 className="text-4xl font-black mb-2 tracking-tight">
                    Manage <span className="text-primary font-black">Availability</span>
                </h1>
                <p className="text-gray-500 dark:text-gray-400 font-medium tracking-tight">Set your weekly schedule and manage upcoming appointment slots.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-1">
                    <Card className="bg-white dark:bg-surface border border-gray-100 dark:border-white/5 rounded-3xl shadow-xl p-8 sticky top-8">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-primary/10 rounded-xl">
                                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0h-3m-9-4h.01M9 16h.01M15 16h.01M21 16h.01M12 5h.01M12 12h.01M12 19h.01M12 7V5m0 2v2m0 5v2m0 5v2m-6-6h.01M18 12h.01" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add Slots</h2>
                        </div>
                        <AvailabilityForm onUpdate={refreshUser} />
                    </Card>
                </div>

                {/* List Section */}
                <div className="lg:col-span-2">
                    <Card className="h-full bg-white dark:bg-surface border border-gray-100 dark:border-white/5 rounded-3xl shadow-xl p-8">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-primary/10 rounded-xl">
                                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Upcoming Availability</h2>
                        </div>

                        {user.availability && user.availability.length > 0 ? (
                            <div className="space-y-4">
                                <AvailabilityList availability={user.availability} onUpdate={refreshUser} />
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-gray-50 dark:bg-white/5 rounded-3xl border-2 border-dashed border-gray-200 dark:border-white/10">
                                <p className="text-gray-400 font-medium italic">No availability set. Please add some slots to start receiving bookings.</p>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
}
