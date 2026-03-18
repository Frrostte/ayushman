'use client';

import { useState, useEffect } from 'react';

import PatientForm from '../../../components/PatientForm';

import api from '../../../lib/api';
import { useRouter } from 'next/navigation';
import Button from '../../../components/Button';

export default function PatientDetails({ params }) {
    const [patient, setPatient] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showEdit, setShowEdit] = useState(false);

    const router = useRouter();

    const { id } = params;

    const fetchData = async () => {
        try {
            setLoading(true);
            const pRes = await api.get(`/patients/${id}`);
            setPatient(pRes.data);

            const hRes = await api.get(`/sessions/patient/${pRes.data._id}`);
            setHistory(hRes.data);
        } catch (e) {
            console.error(e);
            if (e.response?.status === 404) router.push('/patients');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!patient) return null;

    return (
        <div className="text-foreground max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column: Patient Profile */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-surface rounded-3xl border border-gray-100 dark:border-white/5 p-8 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-accent"></div>

                        <div className="flex flex-col items-center text-center mb-10">
                            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-3xl mb-6 shadow-sm ring-8 ring-primary/5">
                                {patient.userId?.name?.charAt(0).toUpperCase()}
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{patient.userId?.name}</h1>
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Patient ID: <span className="font-mono">{patient._id.slice(-6)}</span></p>
                        </div>

                        <div className="space-y-6 border-t border-gray-100 dark:border-white/10 pt-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block">Contact Details</label>
                                <p className="text-gray-700 dark:text-gray-200 font-medium flex items-center gap-3">
                                    <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    {patient.userId?.phone || 'N/A'}
                                </p>
                                <p className="text-gray-700 dark:text-gray-200 font-medium flex items-center gap-3">
                                    <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    {patient.userId?.email || 'N/A'}
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block">Gender</label>
                                    <p className="text-gray-700 dark:text-gray-200 font-bold capitalize mt-1">{patient.gender}</p>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block">Date of Birth</label>
                                    <p className="text-gray-700 dark:text-gray-200 font-bold mt-1">{patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : 'N/A'}</p>
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block text-xs">Address</label>
                                <p className="text-gray-700 dark:text-gray-200 font-medium mt-1 leading-relaxed">{patient.address || 'No address provided'}</p>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block text-xs">Medical Background</label>
                                <div className="mt-2 text-gray-600 dark:text-gray-300 text-sm bg-gray-50 dark:bg-black/20 p-4 rounded-2xl border border-gray-100 dark:border-white/5 leading-relaxed">
                                    {patient.medicalNotes || 'No notes available.'}
                                </div>
                            </div>
                        </div>

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
                    </div>
                </div>

                {/* Right Column: Forms & History */}
                <div className="lg:col-span-2 space-y-10">
                    {showEdit && (
                        <div className="bg-white dark:bg-surface rounded-3xl border border-primary/20 p-8 shadow-2xl animate-fade-in mb-8 w-full relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                            <h3 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-xl">
                                    <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </div>
                                Edit Patient Profile
                            </h3>
                            <PatientForm initialData={patient} onSuccess={() => { setShowEdit(false); fetchData(); }} />
                        </div>
                    )}



                    <div>
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-xl">
                                    <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                    </svg>
                                </div>
                                Patient Medical History
                            </h2>
                            <span className="bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 px-4 py-1.5 rounded-full text-xs font-bold border border-gray-200 dark:border-white/10 shadow-sm">
                                {history.length} Records
                            </span>
                        </div>

                        {history.length === 0 ? (
                            <div className="bg-white dark:bg-surface rounded-3xl border border-gray-100 dark:border-white/5 p-16 text-center shadow-xl">
                                <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-400">
                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                    </svg>
                                </div>
                                <p className="text-gray-500 font-medium">No medical history found for this patient.</p>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {history.map(session => (
                                    <div key={session._id} className="bg-white dark:bg-surface rounded-3xl border border-gray-100 dark:border-white/5 p-8 shadow-xl hover:border-primary/30 transition-all group">
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-6 border-b border-gray-100 dark:border-white/5 gap-4">
                                            <div>
                                                <p className="text-primary font-bold text-xl mb-1">
                                                    {new Date(session.sessionDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                                </p>
                                                <p className="text-gray-400 dark:text-gray-500 text-[10px] font-bold uppercase tracking-widest">Session ID: {session._id.slice(-6)}</p>
                                            </div>
                                            <div className="flex items-center gap-3 bg-gray-50 dark:bg-white/10 px-4 py-2 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm">
                                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-[10px] font-black uppercase tracking-tighter">
                                                    DR
                                                </div>
                                                <span className="text-sm text-gray-900 dark:text-gray-200 font-bold">Dr. {session.doctorId?.name}</span>
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-10">
                                            <div className="space-y-6">
                                                <div>
                                                    <h4 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Diagnosis</h4>
                                                    <p className="text-gray-900 dark:text-white font-bold text-lg">{session.diagnosis}</p>
                                                </div>
                                                <div>
                                                    <h4 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Patient Complaints</h4>
                                                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{session.complaints}</p>
                                                </div>
                                                {session.notes && (
                                                    <div>
                                                        <h4 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Doctor's Clinical Notes</h4>
                                                        <p className="text-gray-500 dark:text-gray-400 text-sm italic leading-relaxed bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border-l-4 border-primary/30">"{session.notes}"</p>
                                                    </div>
                                                )}
                                            </div>

                                            {session.medications.length > 0 && (
                                                <div className="bg-gray-50 dark:bg-black/20 rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-inner">
                                                    <h4 className="text-sm font-bold text-primary mb-6 flex items-center gap-2">
                                                        <div className="p-1.5 bg-primary/10 rounded-lg">
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                                            </svg>
                                                        </div>
                                                        Prescribed Medications
                                                    </h4>
                                                    <ul className="space-y-4">
                                                        {session.medications.map((m, i) => (
                                                            <li key={i} className="flex items-start justify-between text-sm pb-3 border-b border-gray-100 dark:border-white/5 last:border-0 last:pb-0">
                                                                <div>
                                                                    <span className="font-bold text-gray-900 dark:text-white block mb-0.5">{m.name}</span>
                                                                    <span className="text-gray-500 dark:text-gray-500 text-xs font-medium">{m.frequency}</span>
                                                                </div>
                                                                <div className="text-right">
                                                                    <span className="text-primary font-bold block mb-0.5">{m.dosage}</span>
                                                                    <span className="text-gray-500 dark:text-gray-500 text-xs font-medium">{m.duration}</span>
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
