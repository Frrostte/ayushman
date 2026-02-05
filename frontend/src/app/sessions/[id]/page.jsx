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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-black tracking-tight mb-2">
                        Clinical <span className="text-primary font-black">Session</span>
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium tracking-tight">Comprehensive record of the medical encounter.</p>
                </div>
                <div className={`px-6 py-2 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-sm border ${session
                    ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border-green-100 dark:border-green-500/30'
                    : 'bg-primary/5 dark:bg-primary/10 text-primary border-primary/10 dark:border-primary/20 animate-pulse'}`}>
                    {session ? 'Completed' : 'Session In Progress'}
                </div >
            </div >

            <div className="grid gap-10">
                {/* Patient Context Card */}
                <div className="bg-white dark:bg-surface border border-gray-100 dark:border-white/5 rounded-[2rem] p-8 shadow-xl shadow-gray-200/20 dark:shadow-none">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div>
                            <h3 className="text-gray-400 dark:text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Patient</h3>
                            <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{appointment.patientId?.userId?.name}</p>
                        </div>
                        <div className="hidden md:block h-12 w-px bg-gray-100 dark:bg-white/10"></div>
                        <div>
                            <h3 className="text-gray-400 dark:text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Date & Time</h3>
                            <p className="text-xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">
                                {new Date(appointment.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} <span className="text-gray-400 font-medium mx-1">at</span> {appointment.time}
                            </p>
                        </div>
                        <div className="hidden md:block h-12 w-px bg-gray-100 dark:bg-white/10"></div>
                        <div>
                            <h3 className="text-gray-400 dark:text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Doctor</h3>
                            <p className="text-xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">Dr. {appointment.doctorId?.name}</p>
                        </div>
                    </div>
                </div>

                {session ? (
                    <div className="bg-white dark:bg-surface border border-gray-100 dark:border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
                        <div className="bg-gray-50/50 dark:bg-white/5 px-8 py-6 border-b border-gray-100 dark:border-white/5">
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3 tracking-tight">
                                <div className="p-2 bg-primary/10 rounded-xl">
                                    <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                Session Record
                            </h3>
                        </div>
                        <div className="p-8 space-y-10">
                            <div>
                                <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">Diagnosis</h4>
                                <div className="bg-gray-50 dark:bg-black/20 p-6 rounded-2xl border border-gray-100 dark:border-white/5 text-lg font-bold text-gray-900 dark:text-white leading-relaxed">
                                    {session.diagnosis}
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/5">
                                    <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-3">Complaints</h4>
                                    <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed">{session.complaints}</p>
                                </div>
                                <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/5">
                                    <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-3">Professional Notes</h4>
                                    <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed">{session.notes || 'No additional notes provided.'}</p>
                                </div>
                            </div>

                            {session.medications && session.medications.length > 0 && (
                                <div>
                                    <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-5">Prescription Details</h4>
                                    <div className="bg-gray-50 dark:bg-black/20 rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden">
                                        <table className="w-full text-left text-sm">
                                            <thead className="bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 uppercase text-[10px] font-black tracking-widest">
                                                <tr>
                                                    <th className="px-6 py-4">Medicine</th>
                                                    <th className="px-6 py-4">Dosage</th>
                                                    <th className="px-6 py-4">Frequency</th>
                                                    <th className="px-6 py-4">Duration</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                                {session.medications.map((m, i) => (
                                                    <tr key={i} className="hover:bg-white dark:hover:bg-white/5 transition-colors group">
                                                        <td className="px-6 py-4 font-black text-gray-900 dark:text-white group-hover:text-primary transition-colors">{m.name}</td>
                                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400 font-medium">{m.dosage}</td>
                                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400 font-medium">{m.frequency}</td>
                                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400 font-medium">{m.duration}</td>
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
                    <div className="bg-white dark:bg-surface border border-gray-100 dark:border-white/5 rounded-[2rem] p-8 shadow-xl">
                        {user?.role === 'patient' ? (
                            <div className="text-center py-20 bg-gray-50 dark:bg-white/5 rounded-[2rem] border-2 border-dashed border-gray-200 dark:border-white/10">
                                <div className="mx-auto h-20 w-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-6 text-primary">
                                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">Session Not Started</h3>
                                <p className="text-gray-500 dark:text-gray-400 font-medium">The medical professional has not initiated the session documentation yet.</p>
                            </div>
                        ) : (
                            <>
                                <div className="border-b border-gray-100 dark:border-white/10 pb-6 mb-10 flex items-center gap-4">
                                    <div className="p-3 bg-primary/10 rounded-2xl">
                                        <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">New Session Record</h3>
                                        <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">Document the clinical encounter and prescribe medical care.</p>
                                    </div>
                                </div>
                                <div className="bg-gray-50 dark:bg-black/10 rounded-3xl p-8 border border-gray-100 dark:border-white/5 shadow-inner">
                                    <SessionForm appointment={appointment} onSuccess={() => window.location.reload()} />
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div >
    );
}
