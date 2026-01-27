'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Link from 'next/link';
import api from '../../lib/api';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';

export default function Dashboard() {
    const router = useRouter();
    const [stats, setStats] = useState({ patients: 0, appointments: 0 });
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');

        if (!token || !userStr) {
            router.push('/login');
            return;
        }

        if (userStr) {
            const parsedUser = JSON.parse(userStr);
            setUser(parsedUser);

            // Redirect patients to patient dashboard
            if (parsedUser.role === 'patient') {
                router.push('/patient-dashboard');
                return;
            }
        }

        const fetchStats = async () => {
            try {
                const pRes = await api.get('/patients');
                const aRes = await api.get('/appointments');
                const today = new Date().toISOString().split('T')[0];
                const todayAppts = aRes.data.filter(a => a.date.startsWith(today)).length;

                setStats({
                    patients: pRes.data.length,
                    appointments: todayAppts
                });
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-white selection:bg-primary selection:text-white">
            <Navbar />
            <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Welcome back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-light to-accent">{user?.name}</span>
                    </h1>
                    <p className="text-gray-400 text-lg">Here's what's happening in your clinic today.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Patients Card */}
                    <Card className="group hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_-5px_rgba(124,58,237,0.3)] relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <svg className="w-24 h-24 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h3 className="text-gray-400 font-medium mb-2">Total Patients</h3>
                        <p className="text-5xl font-bold text-white mb-6">{stats.patients}</p>
                        <Link href="/patients" className="inline-flex items-center text-primary-light hover:text-white transition-colors group-hover:translate-x-1 duration-300">
                            Manage Patients
                            <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </Card>

                    {/* Appointments Card */}
                    <Card className="group hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_-5px_rgba(124,58,237,0.3)] relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <svg className="w-24 h-24 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                            <h3 className="text-gray-400 font-medium">Today's Appointments</h3>
                        </div>

                        <p className="text-5xl font-bold text-white mb-6">{stats.appointments}</p>
                        <Link href="/appointments" className="inline-flex items-center text-primary-light hover:text-white transition-colors group-hover:translate-x-1 duration-300">
                            View Schedule
                            <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </Card>
                </div>

                {/* Availability Section */}
                <div className="mt-8">
                    <Card>
                        <h2 className="text-2xl font-bold mb-6">Set Availability</h2>
                        <AvailabilityForm />
                    </Card>
                </div>
            </main>
        </div>
    );
}

function AvailabilityForm() {
    const [formData, setFormData] = useState({
        date: '',
        startTime: '09:00',
        endTime: '17:00'
    });
    const [msg, setMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put('/doctors/availability', formData);
            setMsg(`Availability set for ${formData.date} successfully!`);
            setTimeout(() => setMsg(''), 3000);
        } catch (err) {
            console.error(err);
            setMsg('Failed to update availability');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
            {msg && <div className={`p-3 mb-4 rounded ${msg.includes('successfully') ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>{msg}</div>}

            <Input
                label="Select Date"
                type="date"
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                required
                style={{ colorScheme: 'dark' }}
            />

            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="Start Time"
                    type="time"
                    value={formData.startTime}
                    onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                    style={{ colorScheme: 'dark' }}
                />
                <Input
                    label="End Time"
                    type="time"
                    value={formData.endTime}
                    onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                    style={{ colorScheme: 'dark' }}
                />
            </div>

            <div>
                <Button type="submit" className="w-auto px-6">
                    Add Availability
                </Button>
            </div>
        </form>
    );
}
