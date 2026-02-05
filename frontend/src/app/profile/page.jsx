'use client';

import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
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
            const res = await api.get('/doctors/me');
            setDoctor(res.data);
        } catch (err) {
            console.error(err);
            // If failed (e.g. not a doctor), redirect or show error
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
            <div className="min-h-screen bg-background flex flex-col items-center justify-center text-white px-4">
                <Navbar />
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Profile Not Found</h2>
                    <p className="text-gray-400 mb-6">Unable to load your doctor profile.</p>
                    <Button onClick={() => router.push('/dashboard')}>Back to Dashboard</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-white selection:bg-primary selection:text-white">
            <Navbar />
            <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
                <Button
                    onClick={() => router.push('/dashboard')}
                    className="mb-8 bg-transparent text-gray-400 hover:text-white pl-0 flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Dashboard
                </Button>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Sidebar / Profile Card */}
                    <div className="md:col-span-1">
                        <Card className="text-center">
                            <div className="w-32 h-32 mx-auto rounded-full bg-primary/20 flex items-center justify-center text-primary text-4xl font-bold mb-4 shadow-inner">
                                {doctor.name.charAt(0).toUpperCase()}
                            </div>
                            <h1 className="text-2xl font-bold text-white mb-1">{doctor.name}</h1>
                            <p className="text-primary-light mb-6">{doctor.specialization || 'General Physician'}</p>

                            <div className="space-y-4 text-left border-t border-white/5 pt-6">
                                <div>
                                    <label className="text-xs text-gray-500 uppercase font-semibold">Email</label>
                                    <p className="text-gray-300">{doctor.email}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase font-semibold">Phone</label>
                                    <p className="text-gray-300">{doctor.phone}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase font-semibold">Joined</label>
                                    <p className="text-gray-300">{new Date(doctor.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div className="mt-6">
                                <Button
                                    onClick={() => setShowEdit(!showEdit)}
                                    className={`w-full text-sm py-2.5 shadow-lg transition-all duration-300 ${showEdit
                                        ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 ring-1 ring-red-500/20'
                                        : 'bg-primary hover:bg-primary-dark text-white shadow-primary/25'
                                        }`}
                                >
                                    {showEdit ? 'Cancel Editing' : 'Edit Profile'}
                                </Button>
                            </div>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-6">
                        {showEdit && (
                            <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-2xl border border-indigo-500/30 p-8 shadow-2xl animate-fade-in mb-8 w-full relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                                <h3 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
                                    <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Edit Your Profile
                                </h3>
                                <DoctorForm initialData={doctor} onSuccess={() => { setShowEdit(false); fetchData(); }} />
                            </div>
                        )}

                        <Card>
                            <h2 className="text-xl font-bold mb-4">Professional Details</h2>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="text-xs text-gray-500 uppercase font-semibold">Specialization</label>
                                    <p className="text-gray-300 text-lg">{doctor.specialization || 'Not specified'}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase font-semibold">Experience</label>
                                    <p className="text-gray-300 text-lg">{doctor.experience ? `${doctor.experience} years` : 'Not specified'}</p>
                                </div>
                                <div className="col-span-2">
                                    <label className="text-xs text-gray-500 uppercase font-semibold">Qualifications</label>
                                    <p className="text-gray-300 text-lg">{doctor.qualifications || 'Not specified'}</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
