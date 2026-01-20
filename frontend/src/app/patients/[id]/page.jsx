'use client';

import { useState, useEffect } from 'react';
import Navbar from '../../../components/Navbar';
import PatientForm from '../../../components/PatientForm';
import AppointmentForm from '../../../components/AppointmentForm';
import api from '../../../lib/api';
import { useRouter } from 'next/navigation';

export default function PatientDetails({ params }) {
    const [patient, setPatient] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showEdit, setShowEdit] = useState(false);
    const [showApptForm, setShowApptForm] = useState(false);
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
        <div className="min-h-screen bg-background text-white selection:bg-primary selection:text-white">
            <Navbar />
            <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column: Patient Profile */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-surface rounded-2xl border border-white/5 p-6 shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent"></div>

                            <div className="flex flex-col items-center text-center mb-6">
                                <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-3xl mb-4 shadow-inner ring-4 ring-white/5">
                                    {patient.userId?.name?.charAt(0).toUpperCase()}
                                </div>
                                <h1 className="text-2xl font-bold text-white mb-1">{patient.userId?.name}</h1>
                                <p className="text-gray-400 text-sm">Patient ID: {patient._id.slice(-6)}</p>
                            </div>

                            <div className="space-y-4 border-t border-white/10 pt-6">
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</label>
                                    <p className="text-gray-200 mt-1 flex items-center gap-2">
                                        <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        {patient.userId?.phone || 'N/A'}
                                    </p>
                                    <p className="text-gray-200 mt-1 flex items-center gap-2">
                                        <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        {patient.userId?.email || 'N/A'}
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Gender</label>
                                        <p className="text-gray-200 mt-1 capitalize">{patient.gender}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">DOB</label>
                                        <p className="text-gray-200 mt-1">{patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : 'N/A'}</p>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Address</label>
                                    <p className="text-gray-200 mt-1">{patient.address || 'No address provided'}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Medical Notes</label>
                                    <p className="text-gray-300 mt-1 text-sm bg-black/20 p-3 rounded-lg border border-white/5">
                                        {patient.medicalNotes || 'No notes available.'}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mt-6">
                                <button
                                    onClick={() => setShowApptForm(!showApptForm)}
                                    className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-medium transition-all shadow-lg shadow-purple-900/20"
                                >
                                    {showApptForm ? 'Cancel' : 'Book Appointment'}
                                </button>
                                <button
                                    onClick={() => setShowEdit(!showEdit)}
                                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg text-sm font-medium transition-all"
                                >
                                    {showEdit ? 'Cancel' : 'Edit Profile'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Forms & History */}
                    <div className="lg:col-span-2 space-y-8">
                        {showEdit && (
                            <div className="bg-surface rounded-2xl border border-white/5 p-6 shadow-xl animate-fade-in mb-8">
                                <h3 className="text-xl font-bold mb-6 text-white">Edit Patient Profile</h3>
                                <PatientForm initialData={patient} onSuccess={() => { setShowEdit(false); fetchData(); }} />
                            </div>
                        )}

                        {showApptForm && (
                            <div className="bg-surface rounded-2xl border border-white/5 p-6 shadow-xl animate-fade-in mb-8">
                                <h3 className="text-xl font-bold mb-6 text-white">Book New Appointment</h3>
                                <AppointmentForm
                                    patients={[patient]}
                                    onSuccess={() => { setShowApptForm(false); alert('Appointment Booked!'); router.push('/appointments'); }}
                                />
                            </div>
                        )}

                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                    <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                    </svg>
                                    Patient History
                                </h2>
                                <span className="bg-white/5 text-gray-400 px-3 py-1 rounded-full text-xs font-medium border border-white/10">
                                    {history.length} Records
                                </span>
                            </div>

                            {history.length === 0 ? (
                                <div className="bg-surface rounded-2xl border border-white/5 p-12 text-center text-gray-400">
                                    <p>No medical history found for this patient.</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {history.map(session => (
                                        <div key={session._id} className="bg-surface rounded-2xl border border-white/5 p-6 shadow-lg hover:border-primary/30 transition-all">
                                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 pb-4 border-b border-white/5 gap-2">
                                                <div>
                                                    <p className="text-primary font-bold text-lg">
                                                        {new Date(session.sessionDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                                    </p>
                                                    <p className="text-gray-500 text-xs mt-0.5">Session ID: {session._id.slice(-6)}</p>
                                                </div>
                                                <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                                                    <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-xs font-bold">
                                                        Dr
                                                    </div>
                                                    <span className="text-sm text-gray-300 font-medium">{session.doctorId?.name}</span>
                                                </div>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div className="space-y-4">
                                                    <div>
                                                        <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Diagnosis</h4>
                                                        <p className="text-white">{session.diagnosis}</p>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Complaints</h4>
                                                        <p className="text-gray-300 text-sm">{session.complaints}</p>
                                                    </div>
                                                    {session.notes && (
                                                        <div>
                                                            <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Notes</h4>
                                                            <p className="text-gray-400 text-sm italic">"{session.notes}"</p>
                                                        </div>
                                                    )}
                                                </div>

                                                {session.medications.length > 0 && (
                                                    <div className="bg-black/20 rounded-xl p-4 border border-white/5">
                                                        <h4 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                                            </svg>
                                                            Prescription
                                                        </h4>
                                                        <ul className="space-y-3">
                                                            {session.medications.map((m, i) => (
                                                                <li key={i} className="flex items-start justify-between text-sm pb-2 border-b border-white/5 last:border-0 last:pb-0">
                                                                    <div>
                                                                        <span className="font-medium text-white block">{m.name}</span>
                                                                        <span className="text-gray-500 text-xs">{m.frequency}</span>
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <span className="text-gray-300 block">{m.dosage}</span>
                                                                        <span className="text-gray-500 text-xs">{m.duration}</span>
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
            </main>
        </div>
    );
}
