'use client';

import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Link from 'next/link';
import api from '../../lib/api';

export default function PatientDashboard() {
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
        const userStr = localStorage.getItem('user');
        if (userStr) {
            setUser(JSON.parse(userStr));
        }

        const fetchData = async () => {
            try {
                // 1. Fetch Profile
                const res = await api.get('/patients/me');
                setPatientProfile(res.data);

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
            const payload = {
                ...profileData,
                userId: user.id
            };
            const res = await api.post('/patients', payload);
            setPatientProfile(res.data);
            setShowProfileForm(false);
        } catch (err) {
            console.error("Error creating profile", err);
            alert("Failed to create profile");
        }
    };

    const handleChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <Navbar />
            <div className="container">
                <h1>Welcome, {user?.name}</h1>

                {showProfileForm ? (
                    <div className="card">
                        <h3>Complete Your Profile</h3>
                        <p>Please provide additional details to continue.</p>
                        <form onSubmit={handleProfileSubmit}>
                            <div className="form-group">
                                <label>Date of Birth</label>
                                <input type="date" name="dateOfBirth" value={profileData.dateOfBirth} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Gender</label>
                                <select name="gender" value={profileData.gender} onChange={handleChange}>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Address</label>
                                <textarea name="address" value={profileData.address} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Medical Notes (Allergies, etc.)</label>
                                <textarea name="medicalNotes" value={profileData.medicalNotes} onChange={handleChange} />
                            </div>
                            <button type="submit" className="btn btn-primary">Save Profile</button>
                        </form>
                    </div>
                ) : (
                    <div className="card">
                        <h3>Your Medical Record</h3>
                        <p><strong>DOB:</strong> {new Date(patientProfile?.dateOfBirth).toLocaleDateString()}</p>
                        <p><strong>Gender:</strong> {patientProfile?.gender}</p>
                        <p><strong>Address:</strong> {patientProfile?.address}</p>
                        <hr />
                        <hr />
                        <h4>Appointments</h4>
                        {appointments.length === 0 ? (
                            <p>No appointments scheduled.</p>
                        ) : (
                            <ul>
                                {appointments.map(app => (
                                    <li key={app._id} style={{ marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span>
                                                <strong>{new Date(app.date).toLocaleDateString()}</strong> at {app.time} <br />
                                                Dr. {app.doctorId.name} <span style={{ marginLeft: '10px', fontSize: '0.85em', color: app.status === 'completed' ? 'green' : 'inherit' }}>({app.status})</span>
                                            </span>
                                            <Link href={`/sessions/${app._id}`} className="btn" style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem', background: '#eee', color: 'black', textDecoration: 'none' }}>
                                                View
                                            </Link>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
