'use client';

import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import AppointmentForm from '../../components/AppointmentForm';
import api from '../../lib/api';
import Link from 'next/link';

export default function Appointments() {
    const [appointments, setAppointments] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [user, setUser] = useState(null);

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
            // If doctor, get /appointments/doctor/:id? 
            // Prompt says "GET /api/appointments - Get all appointments"
            // I'll use that for simplicity or filtered.
            // prompt: "GET /api/appointments/doctor/:doctorId - Get doctor's appointments"
            // I'll fetch ALL for now as the prompt says "Doctor can view all appointments".
            const res = await api.get('/appointments');
            setAppointments(res.data);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h1>Appointments</h1>
                    <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                        {showForm ? 'Cancel' : 'New Appointment'}
                    </button>
                </div>

                {showForm && (
                    <div className="card">
                        <h3>Book Appointment</h3>
                        <AppointmentForm onSuccess={() => { setShowForm(false); fetchAppointments(); }} />
                    </div>
                )}

                <div className="card">
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Patient</th>
                                <th>Doctor</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map(appt => (
                                <tr key={appt._id}>
                                    <td>{new Date(appt.date).toLocaleDateString()}</td>
                                    <td>{appt.time}</td>
                                    <td>{appt.patientId?.userId?.name}</td>
                                    <td>{appt.doctorId?.name}</td>
                                    <td>
                                        <span style={{
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '4px',
                                            fontSize: '0.8rem',
                                            background: appt.status === 'completed' ? '#d4edda' : appt.status === 'cancelled' ? '#f8d7da' : '#cce5ff',
                                            color: appt.status === 'completed' ? '#155724' : appt.status === 'cancelled' ? '#721c24' : '#004085'
                                        }}>
                                            {appt.status}
                                        </span>
                                    </td>
                                    <td>
                                        {appt.status === 'scheduled' && (
                                            <Link href={`/sessions/${appt._id}`} className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem', textDecoration: 'none' }}>
                                                Start Session
                                            </Link>
                                        )}
                                        {appt.status === 'completed' && (
                                            <Link href={`/sessions/${appt._id}`} className="btn" style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem', background: '#eee', color: 'black', textDecoration: 'none' }}>
                                                View Session
                                            </Link>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {appointments.length === 0 && (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center' }}>No appointments found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
