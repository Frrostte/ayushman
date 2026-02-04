'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import api from '../../../lib/api';
import Card from '../../../components/Card';
import Button from '../../../components/Button';

export default function DoctorProfile() {
    const { id } = useParams();
    const router = useRouter();
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDoctor = async () => {
            try {
                const res = await api.get(`/doctors/${id}`);
                setDoctor(res.data);
            } catch (err) {
                console.error(err);
                if (err.response?.status === 404) {
                    alert('Doctor not found');
                    router.push('/doctors');
                }
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchDoctor();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!doctor) return null;

    return (
        <div className="min-h-screen bg-background text-white selection:bg-primary selection:text-white">
            <Navbar />
            <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
                <Button
                    onClick={() => router.back()}
                    className="mb-8 bg-transparent text-gray-400 hover:text-white pl-0 flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Doctors
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
                        </Card>
                    </div>

                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-6">
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

                        <Card>
                            <h2 className="text-xl font-bold mb-4">Availability Schedule</h2>
                            {doctor.availability && doctor.availability.length > 0 ? (
                                <div className="space-y-3">
                                    {doctor.availability.sort((a, b) => new Date(a.date) - new Date(b.date)).filter(d => new Date(d.date) >= new Date()).map((slot, i) => (
                                        <div key={i} className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5">
                                            <div className="font-medium text-white">
                                                {new Date(slot.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                            </div>
                                            <div className="text-primary-light font-mono text-sm">
                                                {slot.startTime} - {slot.endTime}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 italic">No upcoming availability scheduled.</p>
                            )}
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
