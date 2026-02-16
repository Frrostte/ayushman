'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../lib/api';

import Card from '../../../components/Card';
import Select from '../../../components/Select';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import Calendar from '../../../components/Calendar';

export default function BookingPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [patientId, setPatientId] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [slots, setSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [availableDates, setAvailableDates] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }
        const userStr = localStorage.getItem('user');
        const parsedUser = JSON.parse(userStr);
        setUser(parsedUser);

        if (parsedUser.role === 'patient') {
            checkPatientProfile();
        } else if (parsedUser.role === 'doctor' || parsedUser.role === 'admin') {
            fetchPatients();
        }

        fetchDoctors();
    }, []);

    const fetchPatients = async () => {
        try {
            const res = await api.get('/patients');
            setPatients(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const checkPatientProfile = async () => {
        try {
            const res = await api.get('/patients/me');
            setPatientId(res.data._id);
        } catch (err) {
            if (err.response && err.response.status === 404) {
                alert('Please complete your patient profile in the Dashboard before booking.');
                router.push('/patient-dashboard');
            } else {
                setError('Failed to load patient profile');
            }
        }
    };

    const fetchDoctors = async () => {
        try {
            const res = await api.get('/doctors');
            setDoctors(res.data);
        } catch (err) {
            setError('Failed to load doctors');
        }
    };

    const fetchSlots = async (doctorId, date) => {
        if (!doctorId || !date) return;
        setLoading(true);
        try {
            const res = await api.get(`/appointments/slots?doctorId=${doctorId}&date=${date}`);
            setSlots(res.data);
        } catch (err) {
            setError('Failed to load slots');
        } finally {
            setLoading(false);
        }
    };

    const fetchDoctorDetails = async (doctorId) => {
        try {
            console.log('Fetching availability for doctor:', doctorId);
            const res = await api.get(`/doctors/${doctorId}`);
            console.log('Doctor details response:', res.data);

            // Extract availability dates
            if (res.data.availability && Array.isArray(res.data.availability)) {
                // availability.date is likely a full ISO string (from backend Date type)
                // We need YYYY-MM-DD
                const dates = res.data.availability.map(a => {
                    const d = new Date(a.date);
                    const iso = d.toISOString().split('T')[0];
                    console.log(`Original: ${a.date}, Parsed: ${iso}`);
                    return iso;
                });
                console.log('Setting available dates:', dates);
                setAvailableDates(dates);
            } else {
                console.log('No availability found or invalid format');
                setAvailableDates([]);
            }
        } catch (err) {
            console.error('Failed to fetch doctor details', err);
            setAvailableDates([]);
        }
    };

    const handleDoctorChange = (e) => {
        const doctorId = e.target.value;
        setSelectedDoctor(doctorId);
        setSelectedSlot('');
        setSelectedDate(''); // Reset date when doctor changes
        setAvailableDates([]); // Clear previous availability

        if (doctorId) {
            // We can't fetch slots yet because date isn't selected
            // But we SHOULD fetch availability for the calendar
            fetchDoctorDetails(doctorId);
        }
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
        setSelectedSlot('');
        fetchSlots(selectedDoctor, date);
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        setError('');
        try {

            if (!patientId) {
                setError('Please select a patient.');
                return;
            }

            await api.post('/appointments', {
                patientId,
                doctorId: selectedDoctor,
                date: selectedDate,
                time: selectedSlot
            });

            // Redirect to patient dashboard or show success
            // Show success modal
            setShowSuccess(true);
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.msg || 'Booking failed';
            setError(msg);
        }
    };

    return (
        <>
            <Card className="relative overflow-hidden bg-white dark:bg-surface border border-gray-100 dark:border-white/5 rounded-3xl shadow-xl">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <svg className="w-32 h-32 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>

                {error && <div className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-4 rounded-xl mb-6 font-medium">{error}</div>}

                <form onSubmit={handleBooking} className="space-y-8 relative z-10">
                    {(user?.role === 'doctor' || user?.role === 'admin') && (
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Select Patient</label>
                            <div className="relative">
                                <select
                                    value={patientId}
                                    onChange={(e) => setPatientId(e.target.value)}
                                    className="appearance-none rounded-xl relative block w-full px-4 py-3.5 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary sm:text-sm transition-all shadow-sm"
                                    required
                                >
                                    <option value="">Select a patient</option>
                                    {patients.map(p => (
                                        <option key={p._id} value={p._id}>
                                            {p.userId?.name} (ID: {p._id.slice(-6)})
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                    <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    )}
                    <Select
                        label="Select Doctor"
                        value={selectedDoctor}
                        onChange={handleDoctorChange}
                        required
                        options={[
                            { value: '', label: '-- Choose a Doctor --' },
                            ...doctors.map(doc => ({ value: doc._id, label: `Dr. ${doc.name}` }))
                        ]}
                        className="bg-gray-50 dark:bg-black/50 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-xl"
                    />

                    <div className="space-y-4">
                        <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Select Date</label>
                        {selectedDoctor ? (
                            <Calendar
                                value={selectedDate}
                                onChange={handleDateChange}
                                availableDates={availableDates}
                            />
                        ) : (
                            <div className="p-12 text-center border-2 border-dashed border-gray-200 dark:border-white/10 rounded-3xl bg-gray-50 dark:bg-white/5 text-gray-500 flex flex-col items-center gap-3">
                                <div className="p-3 bg-white dark:bg-white/10 rounded-2xl shadow-sm">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <p className="font-medium">Pick a doctor to see their schedule</p>
                            </div>
                        )}
                    </div>

                    {selectedDoctor && selectedDate && (
                        <div className="animate-in fade-in slide-in-from-top-4 duration-300 space-y-4">
                            <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Available Slots</label>
                            {loading ? (
                                <div className="flex items-center justify-center p-8 bg-gray-50 dark:bg-white/5 rounded-3xl">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                                </div>
                            ) : slots.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {slots.map(slot => (
                                        <button
                                            key={slot}
                                            type="button"
                                            onClick={() => setSelectedSlot(slot)}
                                            className={`p-3.5 rounded-2xl text-sm font-bold transition-all duration-300 border ${selectedSlot === slot
                                                ? 'bg-primary border-primary text-white shadow-lg shadow-primary/25 scale-105'
                                                : 'bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 hover:border-primary/20 dark:hover:border-primary/20'
                                                }`}
                                        >
                                            {slot}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center p-8 bg-red-50 dark:bg-red-500/5 rounded-3xl border border-red-100 dark:border-red-500/10">
                                    <p className="text-red-600 dark:text-red-400 font-medium">No slots available for this date.</p>
                                </div>
                            )}
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={!selectedSlot}
                        className="w-full py-4 text-lg font-bold shadow-xl shadow-primary/25 rounded-2xl"
                    >
                        Confirm Appointment
                    </Button>
                </form>
            </Card>

            {showSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-surface border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl max-w-md w-full p-10 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-accent"></div>

                        <div className="w-24 h-24 bg-green-100 dark:bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8 ring-8 ring-green-50 dark:ring-green-500/5">
                            <svg className="w-12 h-12 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>

                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">All Set!</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-10 text-lg leading-relaxed">
                            Your appointment has been successfully scheduled. We've sent the details to your doctor.
                        </p>

                        <Button
                            onClick={() => {
                                if (user?.role === 'doctor' || user?.role === 'admin') {
                                    router.push('/dashboard');
                                } else {
                                    router.push('/patient-dashboard');
                                }
                            }}
                            className="w-full py-4 text-lg font-bold shadow-lg shadow-green-500/20 hover:scale-[1.02] transition-transform rounded-2xl"
                        >
                            Go to Dashboard
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
}
