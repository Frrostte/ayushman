'use client';

import { useState, useEffect } from 'react';

import SessionForm from '../../../components/SessionForm';
import api from '../../../lib/api';

export default function SessionPage({ params }) {
    const { id } = params;
    return <SessionPageContent id={id} />;
}

function SessionPageContent({ id }) {
    const [appointment, setAppointment] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) setUser(JSON.parse(userStr));

        const init = async () => {
            try {
                const res = await api.get(`/appointments/${id}`);
                setAppointment(res.data);

                if (res.data.patientId) {
                    const patSessionRes = await api.get(`/sessions/patient/${res.data.patientId._id || res.data.patientId}`);
                    const found = patSessionRes.data.find(s => s.appointmentId === id || s.appointmentId?._id === id);
                    if (found) setSession(found);
                }
            } catch (e) {
                console.error("Error loading session context", e);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!appointment) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center text-white">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Appointment Not Found</h2>
                    <p className="text-gray-400">The requested appointment could not be loaded.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="text-foreground max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl md:text-4xl font-bold">
                    Clinical <span className="text-primary">Session</span>
                </h1>
                <span className={`px-4 py-1.5 rounded-full text-sm font-medium border ${session ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-primary/10 text-primary border-primary/20'}`}>
                    {session ? 'Completed' : 'In Progress'}
                </span >
            </div >

            <div className="grid gap-8">
                {/* Patient Context Card */}
                <div className="bg-surface border border-white/5 rounded-2xl p-6 shadow-lg">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">Patient</h3>
                            <p className="text-xl font-bold text-white">{appointment.patientId?.userId?.name}</p>
                        </div>
                        <div className="h-px md:h-12 w-full md:w-px bg-white/10"></div>
                        <div>
                            <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">Date & Time</h3>
                            <p className="text-lg text-white">
                                {new Date(appointment.date).toLocaleDateString()} <span className="text-gray-500">at</span> {appointment.time}
                            </p>
                        </div>
                        <div className="h-px md:h-12 w-full md:w-px bg-white/10"></div>
                        <div>
                            <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">Doctor</h3>
                            <p className="text-lg text-white">Dr. {appointment.doctorId?.name}</p>
                        </div>
                    </div>
                </div>

                {session ? (
                    <div className="bg-surface border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                        <div className="bg-white/5 px-6 py-4 border-b border-white/5">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Session Record
                            </h3>
                        </div>
                        <div className="p-6 space-y-6">
                            <div>
                                <h4 className="text-sm font-medium text-primary mb-2">Diagnosis</h4>
                                <p className="text-gray-200 bg-black/30 p-4 rounded-lg border border-white/5">{session.diagnosis}</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="text-sm font-medium text-primary mb-2">Complaints</h4>
                                    <p className="text-gray-300">{session.complaints}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-primary mb-2">Notes</h4>
                                    <p className="text-gray-300">{session.notes || 'No additional notes.'}</p>
                                </div>
                            </div>

                            {session.medications && session.medications.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-medium text-primary mb-3">Prescription</h4>
                                    <div className="bg-black/30 rounded-lg border border-white/5 overflow-hidden">
                                        <table className="w-full text-left text-sm text-gray-400">
                                            <thead className="bg-white/5 text-gray-200 uppercase font-medium">
                                                <tr>
                                                    <th className="px-4 py-3">Medicine</th>
                                                    <th className="px-4 py-3">Dosage</th>
                                                    <th className="px-4 py-3">Frequency</th>
                                                    <th className="px-4 py-3">Duration</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {session.medications.map((m, i) => (
                                                    <tr key={i} className="hover:bg-white/5 transition-colors">
                                                        <td className="px-4 py-3 font-medium text-white">{m.name}</td>
                                                        <td className="px-4 py-3">{m.dosage}</td>
                                                        <td className="px-4 py-3">{m.frequency}</td>
                                                        <td className="px-4 py-3">{m.duration}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="bg-surface border border-white/5 rounded-2xl p-6 shadow-lg">
                        {user?.role === 'patient' ? (
                            <div className="text-center py-12">
                                <div className="mx-auto h-16 w-16 bg-white/5 rounded-full flex items-center justify-center mb-4 text-gray-500">
                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Session Not Started</h3>
                                <p className="text-gray-400">The doctor has not started this session yet. Please check back later.</p>
                            </div>
                        ) : (
                            <>
                                <div className="border-b border-white/10 pb-4 mb-6">
                                    <h3 className="text-xl font-bold text-white">New Session Record</h3>
                                    <p className="text-gray-400 text-sm">Document the clinical encounter and prescribe medications.</p>
                                </div>
                                <SessionForm appointment={appointment} onSuccess={() => window.location.reload()} />
                            </>
                        )}
                    </div>
                )}
            </div>
        </div >
    );
}
