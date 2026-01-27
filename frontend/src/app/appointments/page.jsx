'use client';

import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import AppointmentForm from '../../components/AppointmentForm';
import api from '../../lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '../../components/Button';

export default function Appointments() {
    const [appointments, setAppointments] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            if (user.role === 'patient') {
                router.push('/patient-dashboard');
                return;
            }
            setUser(user);
        } else {
            router.push('/login');
            return;
        }
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const res = await api.get('/appointments');
            setAppointments(res.data);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="min-h-screen bg-background text-white">
            <Navbar />
            <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-light to-accent">
                        Appointments
                    </h1>
                    <div className="w-full sm:w-auto">
                        <Button
                            className="w-full sm:w-auto px-6 font-medium shadow-[0_0_20px_-5px_rgba(124,58,237,0.5)] hover:scale-105"
                            onClick={() => setShowForm(!showForm)}
                        >
                            {showForm ? 'Cancel' : 'New Appointment'}
                        </Button>
                    </div>
                </div>

                {showForm && (
                    <div className="mb-8 bg-surface rounded-2xl border border-white/5 p-6 shadow-xl animate-fade-in">
                        <h3 className="text-xl font-semibold mb-4 text-white">Book Appointment</h3>
                        <AppointmentForm onSuccess={() => { setShowForm(false); fetchAppointments(); }} />
                    </div>
                )}

                <div className="bg-surface rounded-2xl border border-white/5 shadow-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/5">
                                    <th className="px-6 py-4 text-sm font-medium text-gray-400">Date</th>
                                    <th className="px-6 py-4 text-sm font-medium text-gray-400">Time</th>
                                    <th className="px-6 py-4 text-sm font-medium text-gray-400">Patient</th>
                                    <th className="px-6 py-4 text-sm font-medium text-gray-400">Doctor</th>
                                    <th className="px-6 py-4 text-sm font-medium text-gray-400">Status</th>
                                    <th className="px-6 py-4 text-sm font-medium text-gray-400">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {appointments.map(appt => (
                                    <tr key={appt._id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 text-gray-300">{new Date(appt.date).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-gray-300">{appt.time}</td>
                                        <td className="px-6 py-4 text-white font-medium">{appt.patientId?.userId?.name}</td>
                                        <td className="px-6 py-4 text-gray-300">{appt.doctorId?.name}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-medium uppercase tracking-wider ${appt.status === 'completed' ? 'bg-green-500/20 text-green-400 border border-green-500/20' :
                                                appt.status === 'cancelled' ? 'bg-red-500/20 text-red-400 border border-red-500/20' :
                                                    'bg-blue-500/20 text-blue-400 border border-blue-500/20'
                                                }`}>
                                                {appt.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {appt.status === 'scheduled' && (
                                                <Link href={`/sessions/${appt._id}`} className="inline-flex items-center px-3 py-1 bg-primary/20 hover:bg-primary/30 text-primary-light text-xs font-medium rounded-md transition-colors border border-primary/20">
                                                    Start Session
                                                </Link>
                                            )}
                                            {appt.status === 'completed' && (
                                                <Link href={`/sessions/${appt._id}`} className="inline-flex items-center px-3 py-1 bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-medium rounded-md transition-colors border border-white/10">
                                                    View Session
                                                </Link>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {appointments.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                                            No appointments found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
