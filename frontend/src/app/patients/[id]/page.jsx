'use client';

import { useState, useEffect } from 'react';
import Navbar from '../../../components/Navbar';
import PatientForm from '../../../components/PatientForm';
import AppointmentForm from '../../../components/AppointmentForm';
import api from '../../../lib/api';
import { useRouter } from 'next/navigation';

export default function PatientDetails({ params }) {
    const [patient, setPatient] = useState(null);
    const [history, setHistory] = useState([]);
    const [showEdit, setShowEdit] = useState(false);
    const [showApptForm, setShowApptForm] = useState(false);
    const router = useRouter();
    const { id } = params;

    const fetchData = async () => {
        try {
            const pRes = await api.get(`/patients/${id}`);
            setPatient(pRes.data);

            const hRes = await api.get(`/sessions/patient/${pRes.data._id}`);
            setHistory(hRes.data);
        } catch (e) {
            console.error(e);
            if (e.response?.status === 404) router.push('/patients');
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    if (!patient) return <div>Loading...</div>;

    return (
        <div>
            <Navbar />
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div>
                        <h1>{patient.userId?.name}</h1>
                        <p>DOB: {new Date(patient.dateOfBirth).toLocaleDateString()} | Gender: {patient.gender}</p>
                        <p>Phone: {patient.userId?.phone}</p>
                        <p>Address: {patient.address}</p>
                        <p><strong>Medical Notes:</strong> {patient.medicalNotes}</p>
                    </div>
                    <div>
                        <button className="btn btn-primary" onClick={() => setShowApptForm(!showApptForm)} style={{ marginBottom: '0.5rem', display: 'block', width: '200px' }}>
                            {showApptForm ? 'Cancel Booking' : 'Book Appointment'}
                        </button>
                        <button className="btn" onClick={() => setShowEdit(!showEdit)} style={{ background: '#eee', display: 'block', width: '200px' }}>
                            {showEdit ? 'Cancel Edit' : 'Edit Patient'}
                        </button>
                    </div>
                </div>

                {showEdit && (
                    <div className="card" style={{ marginTop: '1rem' }}>
                        <h3>Edit Patient</h3>
                        <PatientForm initialData={patient} onSuccess={() => { setShowEdit(false); fetchData(); }} />
                    </div>
                )}

                {showApptForm && (
                    <div className="card" style={{ marginTop: '1rem' }}>
                        <h3>Book Appointment</h3>
                        <AppointmentForm
                            patients={[patient]} // Pass this patient as single option
                            onSuccess={() => { setShowApptForm(false); alert('Appointment Booked!'); }}
                        />
                    </div>
                )}

                <hr style={{ margin: '2rem 0' }} />

                <h2>Patient History</h2>
                {history.length === 0 ? <p>No previous sessions recorded.</p> : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {history.map(session => (
                            <div key={session._id} className="card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
                                    <strong>Date: {new Date(session.sessionDate).toLocaleDateString()}</strong>
                                    <span>Doctor: {session.doctorId?.name}</span>
                                </div>
                                <p><strong>Diagnosis:</strong> {session.diagnosis}</p>
                                <p><strong>Complaints:</strong> {session.complaints}</p>
                                {session.medications.length > 0 && (
                                    <div style={{ marginTop: '0.5rem', background: '#f9f9f9', padding: '0.5rem' }}>
                                        <strong>Prescription:</strong>
                                        <ul style={{ margin: '0.5rem 0 0 1rem' }}>
                                            {session.medications.map((m, i) => (
                                                <li key={i}>{m.name} - {m.dosage} ({m.frequency}) for {m.duration}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {session.notes && <p style={{ marginTop: '0.5rem', fontStyle: 'italic' }}>Note: {session.notes}</p>}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
