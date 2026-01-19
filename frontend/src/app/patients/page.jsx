'use client';

import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import PatientForm from '../../components/PatientForm';
import api from '../../lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Patients() {
    const [patients, setPatients] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const router = useRouter();

    const fetchPatients = async () => {
        try {
            const res = await api.get('/patients');
            setPatients(res.data);
        } catch (e) {
            console.error(e);
            if (e.response?.status === 401) router.push('/login');
        }
    };

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            if (user.role === 'patient') {
                router.push('/patient-dashboard');
                return;
            }
        } else {
            router.push('/login');
            return;
        }
        fetchPatients();
    }, []);

    return (
        <div>
            <Navbar />
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h1>Patients</h1>
                    <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                        {showForm ? 'Cancel' : 'Add Patient'}
                    </button>
                </div>

                {showForm && (
                    <div className="card">
                        <h3>New Patient</h3>
                        <PatientForm onSuccess={() => { setShowForm(false); fetchPatients(); }} />
                    </div>
                )}

                <div className="card">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Phone</th>
                                <th>Gender</th>
                                <th>DOB</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {patients.map(p => (
                                <tr key={p._id}>
                                    <td>
                                        <Link href={`/patients/${p._id}`} style={{ fontWeight: 'bold', textDecoration: 'none', color: '#0070f3' }}>
                                            {p.userId?.name}
                                        </Link>
                                    </td>
                                    <td>{p.userId?.phone}</td>
                                    <td style={{ textTransform: 'capitalize' }}>{p.gender}</td>
                                    <td>{p.dateOfBirth ? new Date(p.dateOfBirth).toLocaleDateString() : ''}</td>
                                    <td>
                                        <Link href={`/patients/${p._id}`} className="btn" style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem', background: '#eee', textDecoration: 'none', color: 'black' }}>
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {patients.length === 0 && (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center' }}>No patients found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
