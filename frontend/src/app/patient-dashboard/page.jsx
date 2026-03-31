'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '../../lib/api';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Select from '../../components/Select';
import Button from '../../components/Button';

export default function PatientDashboard() {
    const router = useRouter();
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
            const parsedUser = JSON.parse(userStr);
            if (parsedUser.role !== 'patient') {
                router.push('/dashboard');
                return;
            }
            setUser(parsedUser);
        }

        const fetchData = async () => {
            try {
                // 1. Fetch Profile
                const res = await api.get('/patients/me');
                setPatientProfile(res.data);

                // Auto-show profile completion if core fields are missing
                if (!res.data.dateOfBirth || !res.data.gender || !res.data.address) {
                    setShowProfileForm(true);
                }

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
            const res = await api.put('/patients/me', profileData);
            setPatientProfile(res.data);
            setShowProfileForm(false);
        } catch (err) {
            console.error("Error updating profile", err);
            alert("Failed to update profile");
        }
    };

    const handleChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="text-foreground">
            <div className="mb-12">
                <h1 className="text-3xl font-bold mb-2 text-foreground">
                    Welcome, <span className="text-primary">{user?.name}</span>
                </h1>
                {!showProfileForm && (
                    <p className="text-gray-500 dark:text-gray-400">Manage your health records and appointments seamlessly.</p>
                )}
            </div>

            {showProfileForm ? (
                <Card className="max-w-2xl mx-auto bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-xl">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Complete Your Profile</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-8">Please provide additional details to continue.</p>
                    <form onSubmit={handleProfileSubmit} className="space-y-6">
                        <Input
                            label="Date of Birth*"
                            type="date"
                            name="dateOfBirth"
                            value={profileData.dateOfBirth}
                            onChange={handleChange}
                            required
                            max={new Date().toISOString().split('T')[0]}
                        />
                        <Select
                            label="Gender*"
                            name="gender"
                            value={profileData.gender}
                            onChange={handleChange}
                            options={[
                                { value: 'male', label: 'Male' },
                                { value: 'female', label: 'Female' },
                                { value: 'other', label: 'Other' }
                            ]}
                        />
                        <div>
                            <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Address*</label>
                            <textarea
                                name="address"
                                value={profileData.address}
                                onChange={handleChange}
                                required
                                className="appearance-none rounded-xl relative block w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm transition-all shadow-sm resize-none"
                                rows="3"
                                style={{ colorScheme: 'inherit' }}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Medical Notes</label>
                            <textarea
                                name="medicalNotes"
                                value={profileData.medicalNotes}
                                onChange={handleChange}
                                className="appearance-none rounded-xl relative block w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm transition-all shadow-sm resize-none"
                                rows="3"
                                style={{ colorScheme: 'inherit' }}
                            />
                        </div>
                        <Button type="submit" className="w-full py-3 shadow-lg shadow-primary/20">
                            Save Profile
                        </Button>
                    </form>
                </Card>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Medical Record Card */}
                    <div className="lg:col-span-1">
                        <Card className="h-fit bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 shadow-sm p-6 rounded-3xl">
                            <div className="flex justify-between items-center mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-primary/10 rounded-xl text-primary">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                        My Profile
                                    </h3>
                                </div>
                                <Link href={`/patients/${patientProfile?._id}`} className="px-4 py-1.5 rounded-full border border-primary/20 text-primary text-sm font-medium hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors flex items-center gap-1">
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                    Edit
                                </Link>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Date of Birth</p>
                                    <p className="text-lg font-bold text-gray-900 dark:text-gray-200">{new Date(patientProfile?.dateOfBirth).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Gender</p>
                                    <p className="text-lg font-bold text-gray-900 dark:text-gray-200 capitalize">{patientProfile?.gender}</p>
                                </div>
                                <div className="relative">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Address</p>
                                    <p className="text-lg font-bold text-gray-900 dark:text-gray-200 leading-snug">{patientProfile?.address}</p>
                                    {/* Decorative circle matching design */}
                                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none"></div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Appointments Section */}
                    {/* Appointments Section */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                Your Appointments
                                <span className="bg-purple-100 dark:bg-primary/20 text-primary text-sm font-bold px-2.5 py-0.5 rounded-full">{appointments.length}</span>
                            </h3>
                            <Link href="/appointments/book" className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-primary/25 flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                Book New
                            </Link>
                        </div>

                        {appointments.length === 0 ? (
                            <div className="border-2 border-dashed border-gray-200 dark:border-white/10 rounded-3xl p-12 flex flex-col items-center justify-center text-center bg-gray-50/50 dark:bg-white/5">
                                <div className="h-16 w-16 bg-gray-100 dark:bg-white/10 rounded-2xl flex items-center justify-center text-gray-400 mb-4">
                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <p className="text-gray-500 dark:text-gray-400 font-medium">No previous appointments found.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {appointments.map(app => (
                                    <div key={app._id} className="p-6 bg-white dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-6 group">
                                        <div className="flex items-start gap-6">
                                            <div className="p-4 bg-purple-50 dark:bg-primary/10 rounded-2xl text-primary flex-shrink-0">
                                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                                                    {new Date(app.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400">Scheduled</span>
                                                </h4>
                                                <p className="text-primary font-bold text-lg mb-1">{app.time}</p>
                                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                                    Dr. {app.doctorId.name} — General Consultation
                                                </div>
                                            </div>
                                        </div>

                                        <Link href={`/sessions/${app._id}`} className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-center sm:text-left">
                                            View Details
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
            {/* ... */}
        </div>
    );
}
