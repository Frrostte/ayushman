'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const router = useRouter();
    const [role, setRole] = useState(null);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            setRole(user.role);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
    };

    return (
        <nav className="navbar">
            <div className="container navbar-content">
                <Link href={role === 'patient' ? "/patient-dashboard" : "/dashboard"} style={{ fontWeight: 'bold', fontSize: '1.2rem', textDecoration: 'none', color: '#0070f3' }}>
                    Clinic App
                </Link>
                <div className="nav-links">
                    {role === 'patient' ? (
                        <Link href="/patient-dashboard">Dashboard</Link>
                    ) : (
                        <>
                            <Link href="/dashboard">Dashboard</Link>
                            <Link href="/patients">Patients</Link>
                            <Link href="/appointments">Appointments</Link>
                        </>
                    )}
                    <button onClick={handleLogout} className="btn" style={{ background: 'transparent', border: '1px solid #ccc' }}>
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
}
