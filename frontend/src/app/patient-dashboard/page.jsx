'use client';

import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Link from 'next/link';
import api from '../../lib/api';

export default function PatientDashboard() {
    const [user, setUser] = useState(null);
    const [patientProfile, setPatientProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showProfileForm, setShowProfileForm] = useState(false);
    const [profileData, setProfileData] = useState({
        dateOfBirth: '',
        gender: 'male',
        address: '',
        medicalNotes: ''
    });

    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');

        if (!token || !userStr) {
            router.push('/login');
            return;
        }

        if (userStr) {
            setUser(JSON.parse(userStr));
        }

        const fetchData = async () => {
            try {
                // 1. Fetch Profile
                const res = await api.get('/patients/me');
                setPatientProfile(res.data);

                // 2. Fetch Appointments (using patient ID from profile)
                if (res.data._id) {
                    const appRes = await api.get(`/appointments/patient/${res.data._id}`);
                    setAppointments(appRes.data);
                }

            } catch (err) {
                if (err.response && err.response.status === 404) {
                    setShowProfileForm(true);
                } else {
                    console.error("Error fetching data", err);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...profileData,
                userId: user.id
            };
            const res = await api.post('/patients', payload);
            setPatientProfile(res.data);
            setShowProfileForm(false);
        } catch (err) {
            console.error("Error creating profile", err);
            alert("Failed to create profile");
        }
    };

    const handleChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    const inputClasses = "appearance-none rounded-lg relative block w-full px-3 py-3 bg-black/50 border border-white/10 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm transition-all";
    const labelClasses = "block text-sm font-medium text-gray-400 mb-1";

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
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Welcome, <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-light to-accent">{user?.name}</span>
                    </h1>
                    {!showProfileForm && (
                        <p className="text-gray-400 text-lg">Manage your health records and appointments.</p>
                    )}
                </div>

                {showProfileForm ? (
                    <div className="max-w-2xl mx-auto bg-surface border border-white/5 rounded-2xl p-8 shadow-[0_0_50px_-10px_rgba(124,58,237,0.1)]">
                        <h3 className="text-2xl font-bold text-white mb-2">Complete Your Profile</h3>
                        <p className="text-gray-400 mb-8">Please provide additional details to continue.</p>
                        <form onSubmit={handleProfileSubmit} className="space-y-6">
                            <div>
                                <label className={labelClasses}>Date of Birth</label>
                                <input type="date" name="dateOfBirth" value={profileData.dateOfBirth} onChange={handleChange} required className={inputClasses} />
                            </div>
                            <div>
                                <label className={labelClasses}>Gender</label>
                                <select name="gender" value={profileData.gender} onChange={handleChange} className={inputClasses}>
                                    <option value="male" className="bg-black">Male</option>
                                    <option value="female" className="bg-black">Female</option>
                                    <option value="other" className="bg-black">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClasses}>Address</label>
                                <textarea name="address" value={profileData.address} onChange={handleChange} required className={inputClasses} rows="3" />
                            </div>
                            <div>
                                <label className={labelClasses}>Medical Notes (Allergies, etc.)</label>
                                <textarea name="medicalNotes" value={profileData.medicalNotes} onChange={handleChange} className={inputClasses} rows="3" />
                            </div>
                            <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-black transition-all duration-300 shadow-lg shadow-purple-900/20">
                                Save Profile
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Medical Record Card */}
                        <div className="lg:col-span-1 h-fit bg-surface border border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                <svg className="w-32 h-32 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                My Profile
                            </h3>
                            <div className="space-y-4 text-sm">
                                <div>
                                    <p className="text-gray-500 mb-1">Date of Birth</p>
                                    <p className="text-white font-medium">{new Date(patientProfile?.dateOfBirth).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 mb-1">Gender</p>
                                    <p className="text-white font-medium capitalize">{patientProfile?.gender}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 mb-1">Address</p>
                                    <p className="text-white font-medium">{patientProfile?.address}</p>
                                </div>
                                {patientProfile?.medicalNotes && (
                                    <div>
                                        <p className="text-gray-500 mb-1">Notes</p>
                                        <p className="text-gray-300 bg-black/30 p-3 rounded-lg border border-white/5">{patientProfile.medicalNotes}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Appointments Section */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                                    Your Appointments
                                    <span className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-full">{appointments.length}</span>
                                </h3>
                                <Link href="/appointments/book" className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-purple-900/20">
                                    Book New
                                </Link>
                            </div>

                            {appointments.length === 0 ? (
                                <div className="bg-surface border border-white/5 rounded-2xl p-12 text-center">
                                    <div className="mx-auto h-12 w-12 text-gray-500 mb-4">
                                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-400">No appointments scheduled.</p>
                                </div>
                            ) : (
                                <div className="grid gap-4">
                                    {appointments.map(app => (
                                        <div key={app._id} className="bg-surface border border-white/5 rounded-xl p-5 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-900/10 group flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div className="flex items-start gap-4">
                                                <div className={`p-3 rounded-lg ${app.status === 'completed' ? 'bg-green-500/10 text-green-500' : 'bg-primary/10 text-primary'}`}>
                                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="text-lg font-semibold text-white">{new Date(app.date).toLocaleDateString()}</p>
                                                    <p className="text-primary-light font-medium">{app.time}</p>
                                                    <p className="text-sm text-gray-400 mt-1">Dr. {app.doctorId.name}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4 pl-14 sm:pl-0">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${app.status === 'completed' ? 'bg-green-500/20 text-green-400 border border-green-500/20' :
                                                    app.status === 'cancelled' ? 'bg-red-500/20 text-red-400 border border-red-500/20' :
                                                        'bg-blue-500/20 text-blue-400 border border-blue-500/20'
                                                    }`}>
                                                    {app.status}
                                                </span>
                                                <Link href={`/sessions/${app._id}`} className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-lg transition-colors border border-white/10">
                                                    View Details
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
