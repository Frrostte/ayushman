'use client';

import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import PatientForm from '../../components/PatientForm';
import api from '../../lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Patients() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const router = useRouter();

    const fetchPatients = async () => {
        try {
            const res = await api.get('/patients');
            setPatients(res.data);
        } catch (e) {
            console.error(e);
            if (e.response?.status === 401) router.push('/login');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            if (user.role === 'patient') {
                router.push('/patient-dashboard');
                return;
            }
        } else {
            router.push('/login');
            return;
        }
        fetchPatients();
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
                <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-light to-accent mb-2">
                            Patients
                        </h1>
                        <p className="text-gray-400">Manage patient records and details.</p>
                    </div>

                    <button
                        className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 shadow-lg ${showForm
                                ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20'
                                : 'bg-primary hover:bg-primary-dark text-white shadow-purple-900/20'
                            }`}
                        onClick={() => setShowForm(!showForm)}
                    >
                        {showForm ? (
                            <>
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Cancel
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Add New Patient
                            </>
                        )}
                    </button>
                </div>

                {showForm && (
                    <div className="mb-10 bg-surface rounded-2xl border border-white/5 p-8 shadow-xl animate-fade-in relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent"></div>
                        <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
                            <span className="bg-primary/20 p-2 rounded-lg text-primary">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                            </span>
                            New Patient Registration
                        </h3>
                        <div className="max-w-3xl">
                            <PatientForm onSuccess={() => { setShowForm(false); fetchPatients(); }} />
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {patients.map(p => (
                        <div key={p._id} className="bg-surface rounded-2xl border border-white/5 p-6 shadow-xl hover:shadow-2xl hover:border-primary/20 transition-all duration-300 group relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-accent opacity-50 group-hover:opacity-100 transition-opacity"></div>

                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg shadow-inner">
                                        {p.userId?.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white group-hover:text-primary-light transition-colors">{p.userId?.name}</h3>
                                        <p className="text-gray-400 text-sm">ID: {p._id.slice(-6)}</p>
                                    </div>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-semibold uppercase tracking-wide border ${p.gender === 'male' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                        p.gender === 'female' ? 'bg-pink-500/10 text-pink-400 border-pink-500/20' :
                                            'bg-gray-500/10 text-gray-400 border-gray-500/20'
                                    }`}>
                                    {p.gender}
                                </span>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-3 text-gray-300 text-sm">
                                    <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    {p.userId?.phone || 'No phone'}
                                </div>
                                <div className="flex items-center gap-3 text-gray-300 text-sm">
                                    <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    {p.dateOfBirth ? new Date(p.dateOfBirth).toLocaleDateString() : 'DOB not set'}
                                </div>
                            </div>

                            <Link
                                href={`/patients/${p._id}`}
                                className="block w-full py-2.5 text-center bg-white/5 hover:bg-primary hover:text-white text-gray-300 rounded-lg text-sm font-medium transition-all duration-300 border border-white/5 hover:border-transparent hover:shadow-lg hover:shadow-primary/25"
                            >
                                View Patient Record
                            </Link>
                        </div>
                    ))}
                </div>

                {patients.length === 0 && (
                    <div className="bg-surface rounded-2xl border border-white/5 p-12 text-center shadow-xl">
                        <div className="mx-auto h-20 w-20 bg-white/5 rounded-full flex items-center justify-center mb-6 text-gray-600">
                            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No Patients Found</h3>
                        <p className="text-gray-400 max-w-sm mx-auto mb-8">Get started by registering a new patient to the system.</p>
                        <button
                            className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg shadow-lg shadow-purple-900/20 transition-all font-medium"
                            onClick={() => setShowForm(true)}
                        >
                            Add New Patient
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}
