'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '../../lib/api';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Select from '../../components/Select';
import Modal from '../../components/Modal';

export default function Dashboard() {
    const router = useRouter();
    const [stats, setStats] = useState({ patients: 0, appointments: 0 });
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            // Fetch User (with availability)
            const userRes = await api.get('/auth/user');
            setUser(userRes.data);

            if (userRes.data.role === 'patient') {
                router.push('/patient-dashboard');
                return;
            }

            // Fetch Stats
            const pRes = await api.get('/patients');
            const aRes = await api.get('/appointments');
            const today = new Date().toISOString().split('T')[0];
            const todayAppts = aRes.data.filter(a => a.date.startsWith(today)).length;

            setStats({
                patients: pRes.data.length,
                appointments: todayAppts
            });

            // If Admin, fetch doctors
            if (userRes.data.role === 'admin') {
                try {
                    const dRes = await api.get('/doctors');
                    setStats(prev => ({ ...prev, doctors: dRes.data.length }));
                } catch (e) { console.error('Error fetching doctors', e); }
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
            console.log('Refreshing user data...');
            const res = await api.get('/auth/user');
            console.log('User refreshed. Availability:', res.data.availability?.length);
            setUser(res.data);
        } catch (e) { console.error(e); }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="text-foreground">
            <div className="mb-10">
                <h1 className="text-4xl font-black mb-2 tracking-tight">
                    Welcome, <span className="text-primary">{user?.name}</span>
                </h1>
                <p className="text-gray-500 dark:text-gray-400 font-medium">Here's a summary of what's happening today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Patients Card */}
                <Card className="group hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 relative overflow-hidden bg-white dark:bg-surface border-gray-100 dark:border-white/5 rounded-3xl p-8">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-20 transition-opacity duration-500 transform group-hover:scale-110 group-hover:-rotate-12">
                        <svg className="w-24 h-24 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <h3 className="text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest text-[10px] mb-4">Total Patients</h3>
                    <p className="text-6xl font-black text-gray-900 dark:text-white mb-8 tracking-tighter">{stats.patients}</p>
                    <Link href="/patients" className="inline-flex items-center text-primary font-bold hover:gap-3 transition-all duration-300">
                        Manage Records
                        <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </Card>

                {/* Appointments Card */}
                <Card className="group hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 relative overflow-hidden bg-white dark:bg-surface border-gray-100 dark:border-white/5 rounded-3xl p-8">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-20 transition-opacity duration-500 transform group-hover:scale-110 group-hover:-rotate-12">
                        <svg className="w-24 h-24 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></div>
                        <h3 className="text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest text-[10px]">Today's Appointments</h3>
                    </div>

                    <p className="text-6xl font-black text-gray-900 dark:text-white mb-8 tracking-tighter">{stats.appointments}</p>
                    <Link href="/appointments" className="inline-flex items-center text-primary font-bold hover:gap-3 transition-all duration-300">
                        View Schedule
                        <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </Card>

                {/* Admin: Doctors Card */}
                {user?.role === 'admin' && (
                    <Card className="group hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 relative overflow-hidden bg-white dark:bg-surface border-gray-100 dark:border-white/5 rounded-3xl p-8">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-20 transition-opacity duration-500 transform group-hover:scale-110 group-hover:-rotate-12">
                            <svg className="w-24 h-24 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <h3 className="text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest text-[10px] mb-4">Total Doctors</h3>
                        <p className="text-6xl font-black text-gray-900 dark:text-white mb-8 tracking-tighter">{stats.doctors || 0}</p>
                        <Link href="/doctors" className="inline-flex items-center text-primary font-bold hover:gap-3 transition-all duration-300">
                            Manage Staff
                            <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </Card>
                )}
                {/* Quick Actions Card - Doctors Only */}
                {user?.role === 'doctor' && (
                    <Card className="flex flex-col justify-center bg-white dark:bg-surface border-gray-100 dark:border-white/5 rounded-3xl p-8 shadow-xl">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-gray-400 dark:text-gray-500 font-bold tracking-widest text-[10px] uppercase">Quick Management</h3>
                        </div>

                        <div className="space-y-4">
                            <Link href="/profile" className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 border border-transparent hover:border-gray-100 dark:hover:border-white/10 hover:shadow-xl transition-all group/item">
                                <span className="font-bold text-gray-700 dark:text-gray-200 group-hover/item:text-primary transition-colors flex items-center gap-4">
                                    <span className="p-2.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl shadow-sm">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                    </span>
                                    My Profile
                                </span>
                                <div className="p-1.5 bg-gray-100 dark:bg-white/5 rounded-lg opacity-0 group-hover/item:opacity-100 transition-opacity">
                                    <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </Link>

                            <Link href="/settings" className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 border border-transparent hover:border-gray-100 dark:hover:border-white/10 hover:shadow-xl transition-all group/item">
                                <span className="font-bold text-gray-700 dark:text-gray-200 group-hover/item:text-primary transition-colors flex items-center gap-4">
                                    <span className="p-2.5 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-xl shadow-sm">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    </span>
                                    Clinic Settings
                                </span>
                                <div className="p-1.5 bg-gray-100 dark:bg-white/5 rounded-lg opacity-0 group-hover/item:opacity-100 transition-opacity">
                                    <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </Link>
                        </div>
                    </Card>
                )}

            </div>

        </div>

    );
}


