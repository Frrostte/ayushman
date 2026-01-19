'use client';

import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Link from 'next/link';
import api from '../../lib/api';

export default function Dashboard() {
    const [stats, setStats] = useState({ patients: 0, appointments: 0 });
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) setUser(JSON.parse(userStr));

        const fetchStats = async () => {
            try {
                const pRes = await api.get('/patients');
                const aRes = await api.get('/appointments');
                const today = new Date().toISOString().split('T')[0];
                const todayAppts = aRes.data.filter(a => a.date.startsWith(today)).length;

                setStats({
                    patients: pRes.data.length,
                    appointments: todayAppts
                });
            } catch (e) {
                console.error(e);
            }
        };
        fetchStats();
    }, []);

    return (
        <div>
            <Navbar />
            <div className="container">
                <h1>Welcome, Dr. {user?.name}</h1>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
                    <div className="card">
                        <h3>Total Patients</h3>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.patients}</p>
                        <Link href="/patients" className="btn btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>Manage Patients</Link>
                    </div>
                    <div className="card">
                        <h3>Today's Appointments</h3>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.appointments}</p>
                        <Link href="/appointments" className="btn btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>View Schedule</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
