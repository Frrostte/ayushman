'use client';

import { useState, useEffect } from 'react';
import Navbar from '../../../components/Navbar';
import SessionForm from '../../../components/SessionForm';
import api from '../../../lib/api';

export default function SessionPage({ params }) {
    const { id } = params; // This is appointmentId based on my link in Appointments page
    const [appointment, setAppointment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [existingSession, setExistingSession] = useState(null);

    useEffect(() => {
        const fetchContext = async () => {
            try {
                setLoading(true);
                // 1. Check if session already exists for this appointment?
                // My backend doesn't have "get session by appointmentId".
                // It has "get all sessions for patient" and "get session by id".
                // Wait, I should have added that?
                // But "Session schema: appointmentId ref Appointment".
                // I can fetch all sessions for patient and find one with this appointmentId.
                // OR better, I need to know if I'm "Creating" or "Viewing".
                // The link /sessions/[id] passes appointment ID.
                // Let's first fetch the Appointment details to know who the patient is.

                // Is `id` an appointment ID or Session ID?
                // If I clicked "Start Session" from Appointment, I passed Appointment ID.
                // If I clicked "View Session" (completed), I passed Appointment ID? 
                // PROMPT: "Click appointment to create session". 
                // I'll assume `id` IS APPOINTMENT ID.

                // Fetch Appointment
                // But I don't have "GET /api/appointments/:id".
                // I only added "GET /api/appointments", "GET /api/appointments/doctor/:id"...
                // Oops. I missed "GET single appointment".
                // Verify routes... "routes/appointments.js" -> GET /, GET /doctor/:id, GET /patient/:id, POST /, PUT /:id.
                // I do NOT have GET /:id.
                // I should add it or I can't fetch appointment details easily.
                // BUT, I can pass data via state? No, refresh breaks it.
                // I should add GET /api/appointments/:id to backend.
                // OR, I can use "GET /api/sessions" and iterate? No.

                // I will add GET /api/appointments/:id quickly.
                // For now, I'll assume I can fetch it.

                // Wait, I can try to find session by ID if `id` was session ID.
                // But "Start Session" implies creating new.

                // Plan:
                // 1. Add GET /api/appointments/:id to backend. (Turbo fix).
                // Update: I can't do turbo fix easily without modifying file.
                // I'll modify `backend/routes/appointments.js` to add GET /:id.

            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        // fetchContext();
    }, [id]);

    // Placeholder while I fix the route
    return (
        <SessionPageContent id={id} />
    );
}

function SessionPageContent({ id }) {
    const [appointment, setAppointment] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    const [user, setUser] = useState(null);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) setUser(JSON.parse(userStr));

        const init = async () => {
            try {
                // Fetch appointment logic requires endpoint.
                // Assuming I add it.
                const res = await api.get(`/appointments/${id}`);
                setAppointment(res.data);

                // Now check if session exists
                // We don't have direct endpoint "get session by appointment".
                // We can fetch patient sessions and filter.
                if (res.data.patientId) {
                    const patSessionRes = await api.get(`/sessions/patient/${res.data.patientId._id || res.data.patientId}`);
                    // Find session linked to this appointment
                    const found = patSessionRes.data.find(s => s.appointmentId === id || s.appointmentId?._id === id);
                    if (found) setSession(found);
                }
            } catch (e) {
                console.error("Error loading session context", e);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (!appointment) return <div>Appointment not found (or endpoint missing)</div>;

    return (
        <div>
            <Navbar />
            <div className="container">
                <h1>Clinical Session</h1>
                <div className="card" style={{ background: '#f8f9fa' }}>
                    <p><strong>Patient:</strong> {appointment.patientId?.userId?.name}</p>
                    <p><strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}</p>
                </div>

                {session ? (
                    <div className="card">
                        <h3>Session Record (Completed)</h3>
                        <p><strong>Diagnosis:</strong> {session.diagnosis}</p>
                        <p><strong>Complaints:</strong> {session.complaints}</p>
                        <p><strong>Notes:</strong> {session.notes}</p>
                        <h4>Prescription</h4>
                        <ul>
                            {session.medications.map((m, i) => (
                                <li key={i}>{m.name} - {m.dosage} ({m.frequency}) for {m.duration}</li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <div className="card">
                        <h3>Session Status</h3>
                        {user?.role === 'patient' ? (
                            <p>This session has not been started by the doctor yet.</p>
                        ) : (
                            <>
                                <h3>New Session Record</h3>
                                <SessionForm appointment={appointment} onSuccess={() => window.location.reload()} />
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
