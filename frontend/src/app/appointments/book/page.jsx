'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../lib/api';
import Navbar from '../../../components/Navbar';
import Card from '../../../components/Card';
import Select from '../../../components/Select';
import Input from '../../../components/Input';
import Button from '../../../components/Button';

export default function BookingPage() {
    const router = useRouter();
    const [doctors, setDoctors] = useState([]);
    const [patientId, setPatientId] = useState(null);
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [slots, setSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }
        checkPatientProfile();
        fetchDoctors();
    }, []);

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

    const handleDoctorChange = (e) => {
        setSelectedDoctor(e.target.value);
        setSelectedSlot('');
        fetchSlots(e.target.value, selectedDate);
    };

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
        setSelectedSlot('');
        fetchSlots(selectedDoctor, e.target.value);
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (!patientId) {
                setError('Patient profile not found. Please complete your profile.');
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
        <div className="min-h-screen bg-background text-white selection:bg-primary selection:text-white">
            <Navbar />
            <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">
                        Book Appointment
                    </h1>
                    <p className="text-gray-400">Schedule a visit with one of our specialists.</p>
                </div>

                <Card className="relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <svg className="w-32 h-32 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>

                    {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg mb-6">{error}</div>}

                    <form onSubmit={handleBooking} className="space-y-6 relative z-10">
                        <Select
                            label="Select Doctor"
                            value={selectedDoctor}
                            onChange={handleDoctorChange}
                            required
                            options={[
                                { value: '', label: '-- Choose a Doctor --' },
                                ...doctors.map(doc => ({ value: doc._id, label: `Dr. ${doc.name}` }))
                            ]}
                        />

                        <Input
                            label="Select Date"
                            type="date"
                            value={selectedDate}
                            onChange={handleDateChange}
                            min={new Date().toISOString().split('T')[0]}
                            required
                            style={{ colorScheme: 'dark' }}
                        />

                        {selectedDoctor && selectedDate && (
                            <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                                <label className="block text-gray-400 mb-2 text-sm font-medium">Available Slots</label>
                                {loading ? (
                                    <div className="flex items-center justify-center p-4">
                                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
                                    </div>
                                ) : slots.length > 0 ? (
                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                        {slots.map(slot => (
                                            <button
                                                key={slot}
                                                type="button"
                                                onClick={() => setSelectedSlot(slot)}
                                                className={`p-2 rounded-lg text-sm font-medium transition-all duration-200 border ${selectedSlot === slot
                                                    ? 'bg-primary border-primary text-white shadow-[0_0_15px_-3px_rgba(124,58,237,0.5)] scale-105'
                                                    : 'bg-white/5 border-white/5 text-gray-300 hover:bg-white/10 hover:border-white/10'
                                                    }`}
                                            >
                                                {slot}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center p-4 bg-white/5 rounded-lg border border-white/5">
                                        <p className="text-gray-400 text-sm">No slots available for this date.</p>
                                    </div>
                                )}
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={!selectedSlot}
                            className="w-full"
                        >
                            Confirm Booking
                        </Button>
                    </form>
                </Card>
                {showSuccess && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
                        <div className="bg-surface border border-white/10 rounded-2xl shadow-2xl max-w-md w-full p-8 text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent"></div>

                            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 ring-4 ring-green-500/5">
                                <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>

                            <h2 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h2>
                            <p className="text-gray-400 mb-8">
                                Your appointment has been successfully scheduled. We look forward to seeing you.
                            </p>

                            <Button
                                onClick={() => router.push('/patient-dashboard')}
                                className="w-full shadow-lg shadow-green-500/20 hover:scale-[1.02]"
                            >
                                Go to Dashboard
                            </Button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
