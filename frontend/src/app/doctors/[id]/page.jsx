'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

import api from '../../../lib/api';
import Card from '../../../components/Card';
import Button from '../../../components/Button';
import DoctorForm from '../../../components/DoctorForm';

export default function DoctorProfile() {
    const { id } = useParams();
    const router = useRouter();
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showEdit, setShowEdit] = useState(false);
    const [canEdit, setCanEdit] = useState(false);

    const fetchData = async () => {
        try {
            const res = await api.get(`/doctors/${id}`);
            setDoctor(res.data);

            // Check if current user can edit
            try {
                const userRes = await api.get('/auth/user');
                const currentUser = userRes.data;
                if (currentUser.role === 'admin' || String(currentUser._id) === String(id)) {
                    setCanEdit(true);
                }
            } catch (e) {
                console.error("Error checking permissions", e);
            }

        } catch (err) {
            console.error(err);
            if (err.response?.status === 404) {
                // Instead of alert, we could redirect or show inline error
                // router.push('/doctors'); // Redirecting might be confusing if it loops
                setDoctor(null); // Will show nothing or we can add an error state
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!doctor) {
        return (
            <div className="flex flex-col items-center justify-center text-foreground px-4 py-12">
                <div className="text-center">
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Doctor Not Found</h2>
                    <p className="text-gray-400 mb-6">The doctor profile you are looking for does not exist or you don't have permission to view it.</p>
                    <Button
                        onClick={() => router.back()}
                        className="bg-transparent text-gray-400 hover:text-white pl-0 flex items-center gap-2 mx-auto"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Doctors
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="text-foreground max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Sidebar / Profile Card */}
                <div className="md:col-span-1">
                    <Card className="text-center bg-white dark:bg-surface border border-gray-100 dark:border-white/5 rounded-3xl shadow-xl p-8">
                        <div className="w-32 h-32 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-primary text-4xl font-bold mb-6 shadow-sm">
                            {doctor.name.charAt(0).toUpperCase()}
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{doctor.name}</h1>
                        <p className="text-primary font-bold mb-8 uppercase tracking-widest text-xs">{doctor.specialization || 'General Physician'}</p>

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

                        {canEdit && (
                            <div className="mt-10">
                                <Button
                                    onClick={() => setShowEdit(!showEdit)}
                                    className={`w-full text-sm font-bold py-3.5 shadow-lg transition-all duration-300 rounded-2xl ${showEdit
                                        ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/25'
                                        : 'bg-primary hover:bg-primary-dark text-white shadow-primary/25'
                                        }`}
                                >
                                    {showEdit ? 'Cancel Editing' : 'Edit Profile'}
                                </Button>
                            </div>
                        )}
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
                                Edit Doctor Profile
                            </h3>
                            <DoctorForm initialData={doctor} onSuccess={() => { setShowEdit(false); fetchData(); }} />
                        </div>
                    )}

                    <Card className="bg-white dark:bg-surface border border-gray-100 dark:border-white/5 rounded-3xl shadow-xl p-8">
                        <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                            <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
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

                    <Card className="bg-white dark:bg-surface border border-gray-100 dark:border-white/5 rounded-3xl shadow-xl p-8">
                        <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                            <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Availability Schedule
                        </h2>
                        {doctor.availability && doctor.availability.length > 0 ? (
                            <div className="grid gap-4">
                                {doctor.availability.sort((a, b) => new Date(a.date) - new Date(b.date)).filter(d => new Date(d.date) >= new Date()).map((slot, i) => (
                                    <div key={i} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 hover:border-primary/30 transition-all group">
                                        <div className="font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-primary ring-4 ring-primary/10"></div>
                                            {new Date(slot.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                        </div>
                                        <div className="px-3 py-1 bg-primary/10 text-primary font-bold text-xs rounded-full">
                                            {slot.startTime} - {slot.endTime}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-gray-50 dark:bg-white/5 rounded-3xl border border-dashed border-gray-200 dark:border-white/10">
                                <p className="text-gray-500 font-medium italic">No upcoming availability scheduled.</p>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
}
