'use client';

import { useState, useEffect } from 'react';

import api from '../../lib/api';
import Card from '../../components/Card';
import Button from '../../components/Button';
import DoctorForm from '../../components/DoctorForm';
import { useRouter } from 'next/navigation';

export default function MyProfile() {
    const router = useRouter();
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showEdit, setShowEdit] = useState(false);

    const fetchData = async () => {
        try {
            const userStr = localStorage.getItem('user');
            if (!userStr) {
                router.push('/login');
                return;
            }
            const user = JSON.parse(userStr);
            if (user.role !== 'doctor') {
                router.push('/dashboard');
                return;
            }

            const res = await api.get('/doctors/me');
            setDoctor(res.data);
        } catch (err) {
            console.error(err);
            if (err.response && err.response.status === 401) {
                router.push('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!doctor) {
        return (
            <div className="text-center text-foreground p-8">
                <h2 className="text-2xl font-bold mb-2">Profile Not Found</h2>
                <p className="text-secondary mb-6">Unable to load your doctor profile.</p>
                <Button onClick={() => router.push('/dashboard')}>Go to Dashboard</Button>
            </div>
        );
    }

    return (
        <div className="text-foreground max-w-4xl mx-auto">
            <button
                onClick={() => router.push('/dashboard')}
                className="mb-8 bg-transparent text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary pl-0 flex items-center gap-2 font-bold transition-all group border-none shadow-none cursor-pointer"
            >
                <div className="p-1.5 bg-gray-100 dark:bg-white/5 rounded-lg group-hover:bg-primary group-hover:text-white transition-all shadow-md">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </div>
                Back to Dashboard
            </button>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Sidebar / Profile Card */}
                <div className="md:col-span-1">
                    <Card className="text-center bg-white dark:bg-surface border border-gray-100 dark:border-white/5 rounded-3xl shadow-xl p-8">
                        <div className="w-32 h-32 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-primary text-4xl font-bold mb-6 shadow-sm ring-8 ring-primary/5">
                            {doctor.name.charAt(0).toUpperCase()}
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{doctor.name}</h1>
                        <p className="text-primary font-bold mb-8 uppercase tracking-widest text-[10px]">{doctor.specialization || 'General Physician'}</p>

                        <div className="space-y-6 text-left border-t border-gray-100 dark:border-white/5 pt-8">
                            <div>
                                <label className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-bold tracking-widest block mb-1">Email</label>
                                <p className="text-gray-700 dark:text-gray-300 font-medium">{doctor.email}</p>
                            </div>
                            <div>
                                <label className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-bold tracking-widest block mb-1">Phone</label>
                                <p className="text-gray-700 dark:text-gray-300 font-medium">{doctor.phone}</p>
                            </div>
                            <div>
                                <label className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-bold tracking-widest block mb-1">Joined Date</label>
                                <p className="text-gray-700 dark:text-gray-300 font-medium">{new Date(doctor.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="mt-10">
                            <Button
                                onClick={() => setShowEdit(!showEdit)}
                                className={`w-full text-sm font-bold py-3.2 rounded-xl transition-all duration-300 ${showEdit
                                    ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/20'
                                    : 'bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/25'
                                    }`}
                            >
                                {showEdit ? 'Cancel Editing' : 'Edit Profile'}
                            </Button>
                        </div>
                    </Card>
                </div>

                {/* Main Content */}
                <div className="md:col-span-2 space-y-8">
                    {showEdit && (
                        <div className="bg-white dark:bg-surface rounded-3xl border border-primary/20 p-8 shadow-2xl animate-fade-in mb-8 w-full relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                            <h3 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-xl">
                                    <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </div>
                                Edit Your Profile
                            </h3>
                            <DoctorForm initialData={doctor} onSuccess={() => { setShowEdit(false); fetchData(); }} />
                        </div>
                    )}

                    <Card className="bg-white dark:bg-surface border border-gray-100 dark:border-white/5 rounded-3xl shadow-xl p-8">
                        <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                            <div className="p-1.5 bg-primary/10 rounded-lg">
                                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            Professional Details
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5">
                                <label className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-bold tracking-widest block mb-1">Specialization</label>
                                <p className="text-gray-900 dark:text-gray-200 font-bold text-lg">{doctor.specialization || 'Not specified'}</p>
                            </div>
                            <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5">
                                <label className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-bold tracking-widest block mb-1">Experience</label>
                                <p className="text-gray-900 dark:text-gray-200 font-bold text-lg">{doctor.experience ? `${doctor.experience} years` : 'Not specified'}</p>
                            </div>
                            <div className="col-span-full bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5">
                                <label className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-bold tracking-widest block mb-1">Qualifications</label>
                                <p className="text-gray-900 dark:text-gray-200 font-bold text-lg">{doctor.qualifications || 'Not specified'}</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
