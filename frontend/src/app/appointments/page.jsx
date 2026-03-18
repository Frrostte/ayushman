'use client';

import { useState, useEffect } from 'react';


import api from '../../lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '../../components/Button';

export default function Appointments() {
    const [appointments, setAppointments] = useState([]);

    const [user, setUser] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [appointmentToDelete, setAppointmentToDelete] = useState(null);
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

    const confirmDelete = (id) => {
        setAppointmentToDelete(id);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        if (!appointmentToDelete) return;

        try {
            await api.delete(`/appointments/${appointmentToDelete}`);
            setAppointments(appointments.filter(a => a._id !== appointmentToDelete));
            setShowDeleteModal(false);
            setAppointmentToDelete(null);
        } catch (e) {
            console.error(e);
            // Optional: You could add an error state here to show in the modal instead of alert
            // For now, failure silently logs or we could keep the alert if the modal deletion fails
        }
    };

    return (
        <div className="text-foreground">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-6">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-light to-accent mb-2">
                        Appointments
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">View and manage upcoming scheduled appointments.</p>
                </div>
                {user && user.role !== 'doctor' && (
                    <div className="w-full sm:w-auto">
                        <Button
                            className="w-full sm:w-auto px-6 font-bold shadow-lg shadow-primary/25 hover:scale-105 transition-transform"
                            onClick={() => router.push('/appointments/book')}
                        >
                            <span className="flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                New Appointment
                            </span>
                        </Button>
                    </div>
                )}
            </div>



            <div className="bg-white dark:bg-surface rounded-3xl border border-gray-100 dark:border-white/5 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/5">
                                <th className="px-6 py-4 text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Time</th>
                                <th className="px-6 py-4 text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Patient</th>
                                <th className="px-6 py-4 text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Doctor</th>
                                <th className="px-6 py-4 text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                            {appointments.map(appt => (
                                <tr key={appt._id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4 text-gray-900 dark:text-gray-300 font-medium">
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            {new Date(appt.date).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-900 dark:text-gray-300 font-bold">{appt.time}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                                {appt.patientId?.userId?.name?.charAt(0)}
                                            </div>
                                            <span className="text-gray-900 dark:text-white font-medium">{appt.patientId?.userId?.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">Dr. {appt.doctorId?.name}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${appt.status === 'completed' ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20' :
                                            appt.status === 'cancelled' ? 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20' :
                                                'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20'
                                            }`}>
                                            {appt.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {appt.status === 'scheduled' && (
                                            <div className="flex items-center gap-2">
                                                <Link href={`/sessions/${appt._id}`} className="inline-flex items-center px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-white text-xs font-bold rounded-lg transition-colors border border-primary/10 hover:border-primary/30">
                                                    Start
                                                </Link>
                                                <button
                                                    onClick={() => confirmDelete(appt._id)}
                                                    className="inline-flex items-center px-3 py-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold rounded-lg transition-colors border border-red-200 dark:border-red-500/20 hover:border-red-300"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        )}
                                        {appt.status === 'completed' && (
                                            <div className="flex items-center gap-2">
                                                <Link href={`/sessions/${appt._id}`} className="inline-flex items-center px-3 py-1.5 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-lg transition-colors border border-gray-200 dark:border-white/10">
                                                    View
                                                </Link>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {appointments.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="">
                                        <div className="flex flex-col items-center justify-center py-16 text-center">
                                            <div className="h-16 w-16 bg-gray-50 dark:bg-white/5 rounded-3xl flex items-center justify-center text-gray-400 mb-4">
                                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">No appointments found</p>
                                            <p className="text-gray-400 dark:text-gray-500 text-sm">New appointments will appear here.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {
                showDeleteModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-white dark:bg-surface border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl max-w-sm w-full p-8 relative overflow-hidden transform transition-all scale-100">
                            <div className="mx-auto w-12 h-12 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center mb-4 text-red-600 dark:text-red-400">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 text-center">Cancel Appointment?</h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-8 text-center text-sm leading-relaxed">
                                Are you sure you want to cancel this appointment? This action cannot be undone.
                            </p>
                            <div className="flex gap-3 justify-center">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="bg-gray-100 hover:bg-gray-200 dark:bg-black dark:hover:bg-white/5 text-gray-700 dark:text-gray-300 border-transparent w-full py-2.5 rounded-xl font-bold transition-colors"
                                >
                                    No, Keep It
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="bg-red-500 hover:bg-red-600 text-white w-full py-2.5 rounded-xl font-bold shadow-lg shadow-red-500/25 transition-all"
                                >
                                    Yes, Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    );
}
