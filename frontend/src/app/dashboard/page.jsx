'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Link from 'next/link';
import api from '../../lib/api';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Select from '../../components/Select';
import Modal from '../../components/Modal';

export default function Dashboard() {
    const router = useRouter();
    const [stats, setStats] = useState({ patients: 0, appointments: 0 });
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            // Fetch User (with availability)
            const userRes = await api.get('/auth/user');
            setUser(userRes.data);

            if (userRes.data.role === 'patient') {
                router.push('/patient-dashboard');
                return;
            }

            // Fetch Stats
            const pRes = await api.get('/patients');
            const aRes = await api.get('/appointments');
            const today = new Date().toISOString().split('T')[0];
            const todayAppts = aRes.data.filter(a => a.date.startsWith(today)).length;

            setStats({
                patients: pRes.data.length,
                appointments: todayAppts
            });

            // If Admin, fetch doctors
            if (userRes.data.role === 'admin') {
                try {
                    const dRes = await api.get('/doctors');
                    setStats(prev => ({ ...prev, doctors: dRes.data.length }));
                } catch (e) { console.error('Error fetching doctors', e); }
            }
        } catch (e) {
            console.error(e);
            if (e.response && e.response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                router.push('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const refreshUser = async () => {
        try {
            const res = await api.get('/auth/user');
            setUser(res.data);
        } catch (e) { console.error(e); }
    };

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
                    <p className="text-gray-400 text-lg">Here's what's happening in your clinic today.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Patients Card */}
                    <Card className="group hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_-5px_rgba(124,58,237,0.3)] relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <svg className="w-24 h-24 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h3 className="text-gray-400 font-medium mb-2">Total Patients</h3>
                        <p className="text-5xl font-bold text-white mb-6">{stats.patients}</p>
                        <Link href="/patients" className="inline-flex items-center text-primary-light hover:text-white transition-colors group-hover:translate-x-1 duration-300">
                            Manage Patients
                            <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </Card>

                    {/* Appointments Card */}
                    <Card className="group hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_-5px_rgba(124,58,237,0.3)] relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <svg className="w-24 h-24 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                            <h3 className="text-gray-400 font-medium">Today's Appointments</h3>
                        </div>

                        <p className="text-5xl font-bold text-white mb-6">{stats.appointments}</p>
                        <Link href="/appointments" className="inline-flex items-center text-primary-light hover:text-white transition-colors group-hover:translate-x-1 duration-300">
                            View Schedule
                            <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </Card>

                    {/* Admin: Doctors Card */}
                    {user?.role === 'admin' && (
                        <Card className="group hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_-5px_rgba(124,58,237,0.3)] relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                <svg className="w-24 h-24 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <h3 className="text-gray-400 font-medium mb-2">Total Doctors</h3>
                            <p className="text-5xl font-bold text-white mb-6">{stats.doctors || 0}</p>
                            <Link href="/doctors" className="inline-flex items-center text-primary-light hover:text-white transition-colors group-hover:translate-x-1 duration-300">
                                Manage Doctors
                                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                        </Card>
                    )}
                </div>

                {/* Availability Section - Only for Doctors */}
                {user?.role === 'doctor' && (
                    <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Form Section */}
                        <div className="lg:col-span-1">
                            <Card>
                                <h2 className="text-xl font-bold mb-6">Manage Availability</h2>
                                <AvailabilityForm onUpdate={refreshUser} />
                            </Card>
                        </div>

                        {/* List Section */}
                        <div className="lg:col-span-2">
                            <Card className="h-full">
                                <h2 className="text-xl font-bold mb-6">Upcoming Availability</h2>
                                {user?.availability && user.availability.length > 0 ? (
                                    <AvailabilityList availability={user.availability} onUpdate={refreshUser} />
                                ) : (
                                    <p className="text-gray-400">No availability set. Please add some slots.</p>
                                )}
                            </Card>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

function AvailabilityForm({ onUpdate }) {
    const [formData, setFormData] = useState({
        startDate: '',
        endDate: '',
        startTime: '09:00',
        endTime: '17:00',
        daysOfWeek: [], // 0-6
        slotDuration: '30' // default to string for select, convert to number on submit
    });
    const [msg, setMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const days = [
        { id: 1, label: 'Mon' },
        { id: 2, label: 'Tue' },
        { id: 3, label: 'Wed' },
        { id: 4, label: 'Thu' },
        { id: 5, label: 'Fri' },
        { id: 6, label: 'Sat' },
        { id: 0, label: 'Sun' },
    ];

    const toggleDay = (id) => {
        setFormData(prev => {
            const currentDays = prev.daysOfWeek;
            if (currentDays.includes(id)) {
                return { ...prev, daysOfWeek: currentDays.filter(d => d !== id) };
            } else {
                return { ...prev, daysOfWeek: [...currentDays, id] };
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg('');

        try {
            if (formData.daysOfWeek.length === 0) {
                setMsg('Please select at least one day of the week.');
                setLoading(false);
                return;
            }

            const payload = {
                startDate: formData.startDate,
                endDate: formData.endDate,
                startTime: formData.startTime,
                endTime: formData.endTime,
                daysOfWeek: formData.daysOfWeek,
                slotDuration: parseInt(formData.slotDuration)
            };

            await api.post('/doctors/availability/bulk', payload);
            setMsg('Availability added successfully!');

            if (onUpdate) onUpdate();

            // Clear msg after 3s
            setTimeout(() => setMsg(''), 3000);

        } catch (err) {
            console.error(err);
            setMsg(err.response?.data?.msg || 'Failed to update availability');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
                {msg && <div className={`p-3 rounded text-sm ${msg.includes('successfully') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{msg}</div>}

                <div className="grid grid-cols-2 gap-3">
                    <Input
                        label="Start Date"
                        type="date"
                        value={formData.startDate}
                        onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                        min={new Date().toISOString().split('T')[0]}
                        required
                        style={{ colorScheme: 'dark' }}
                    />
                    <Input
                        label="End Date"
                        type="date"
                        value={formData.endDate}
                        onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                        min={new Date().toISOString().split('T')[0]} // better UX to prevent past ranges
                        // Actually user might paste date, better let validation handle it or auto-set min
                        // min={formData.startDate || new Date().toISOString().split('T')[0]}
                        required
                        style={{ colorScheme: 'dark' }}
                    />
                </div>

                {/* Days Selection for Bulk */}
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-300">Repeat On</label>
                    <div className="flex flex-wrap gap-2">
                        {days.map(d => (
                            <button
                                key={d.id}
                                type="button"
                                onClick={() => toggleDay(d.id)}
                                className={`w-9 h-9 rounded-full text-xs font-bold transition-all border ${formData.daysOfWeek.includes(d.id)
                                    ? 'bg-primary border-primary text-white'
                                    : 'bg-transparent border-gray-600 text-gray-400 hover:border-gray-500'
                                    }`}
                            >
                                {d.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <Input
                        label="Start Time"
                        type="time"
                        value={formData.startTime}
                        onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                        style={{ colorScheme: 'dark' }}
                        required
                    />
                    <Input
                        label="End Time"
                        type="time"
                        value={formData.endTime}
                        onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                        style={{ colorScheme: 'dark' }}
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <Select
                        label="Interval"
                        name="slotDuration"
                        value={formData.slotDuration}
                        onChange={e => setFormData({ ...formData, slotDuration: e.target.value })}
                        options={[
                            { value: '15', label: '15 min' },
                            { value: '30', label: '30 min' },
                            { value: '45', label: '45 min' },
                            { value: '60', label: '60 min' }
                        ]}
                    />
                </div>

                <Button type="submit" disabled={loading} className="w-full py-2.5">
                    {loading ? 'Saving...' : 'Add Availability'}
                </Button>
            </form>
        </div>
    );
}



function AvailabilityList({ availability, onUpdate }) {
    // Sort availability by date
    const sortedAvailability = [...availability].sort((a, b) => new Date(a.date) - new Date(b.date));

    // Filter out past dates to keep list clean
    const upcomingAvailability = sortedAvailability.filter(a => {
        const d = new Date(a.date);
        d.setHours(23, 59, 59, 999);
        return d >= new Date();
    });

    const [editingDate, setEditingDate] = useState(null);
    const [editForm, setEditForm] = useState({ startTime: '', endTime: '' });

    // Delete Confirmation State
    const [deleteDate, setDeleteDate] = useState(null);

    const startEdit = (slot) => {
        setEditingDate(new Date(slot.date).toISOString().split('T')[0]);
        setEditForm({ startTime: slot.startTime, endTime: slot.endTime });
    };

    const cancelEdit = () => {
        setEditingDate(null);
        setEditForm({ startTime: '', endTime: '' });
    };

    const saveEdit = async (date) => {
        try {
            await api.put('/doctors/availability', {
                date,
                startTime: editForm.startTime,
                endTime: editForm.endTime
            });
            if (onUpdate) onUpdate();
            setEditingDate(null);
        } catch (err) {
            console.error(err);
            alert('Failed to update slot');
        }
    };

    const confirmDelete = (date) => {
        setDeleteDate(date);
    };

    const executeDelete = async () => {
        if (!deleteDate) return;

        try {
            await api.delete(`/doctors/availability?date=${deleteDate}`);
            if (onUpdate) onUpdate();
            setDeleteDate(null);
        } catch (e) {
            console.error('Delete error', e);
            alert('Failed to delete availability');
        }
    };

    return (
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {upcomingAvailability.length === 0 ? (
                <p className="text-gray-400">No upcoming availability found.</p>
            ) : upcomingAvailability.map((slot, idx) => {
                const dateObj = new Date(slot.date);
                const dateStr = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
                const isoDate = dateObj.toISOString().split('T')[0];
                const isEditing = editingDate === isoDate;

                return (
                    <div key={idx} className="flex items-center justify-between p-4 rounded-lg bg-background/30 border border-white/5 hover:border-white/10 transition-colors">
                        {isEditing ? (
                            <div className="flex-1 flex items-center gap-2">
                                <div className="text-sm text-gray-300 w-24">{dateStr}</div>
                                <input
                                    type="time"
                                    value={editForm.startTime}
                                    onChange={e => setEditForm({ ...editForm, startTime: e.target.value })}
                                    onClick={e => e.target.showPicker && e.target.showPicker()}
                                    className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-primary cursor-pointer w-36"
                                    style={{ colorScheme: 'dark' }}
                                />
                                <span className="text-gray-400">-</span>
                                <input
                                    type="time"
                                    value={editForm.endTime}
                                    onChange={e => setEditForm({ ...editForm, endTime: e.target.value })}
                                    onClick={e => e.target.showPicker && e.target.showPicker()}
                                    className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-primary cursor-pointer w-36"
                                    style={{ colorScheme: 'dark' }}
                                />
                                <div className="flex gap-1 ml-auto">
                                    <button onClick={() => saveEdit(isoDate)} className="p-1 text-green-400 hover:bg-green-500/10 rounded">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    </button>
                                    <button onClick={cancelEdit} className="p-1 text-gray-400 hover:bg-gray-500/10 rounded">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div>
                                    <p className="font-medium text-white">{dateStr}</p>
                                    <p className="text-sm text-gray-400">{slot.startTime} - {slot.endTime}</p>
                                </div>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => startEdit(slot)}
                                        className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-full transition-colors"
                                        title="Edit Slot"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => confirmDelete(isoDate)}
                                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-full transition-colors"
                                        title="Remove Availability"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                );
            })}

            <Modal
                isOpen={!!deleteDate}
                onClose={() => setDeleteDate(null)}
                title="Remove Availability"
                footer={
                    <>
                        <button
                            onClick={() => setDeleteDate(null)}
                            className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <Button
                            onClick={executeDelete}
                            className="w-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white shadow-none"
                            style={{ padding: '0.5rem 1rem' }}
                        >
                            Confirm
                        </Button>
                    </>
                }
            >
                <p>Are you sure you want to remove your availability for <strong>{deleteDate}</strong>?</p>
                <p className="text-sm mt-2 text-gray-400">Patients will no longer be able to book appointments for this date.</p>
            </Modal>
        </div>
    );
}
