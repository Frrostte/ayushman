'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const [role, setRole] = useState(null);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            setRole(user.role);
        }

        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
    };

    const isActive = (path) => pathname === path;

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#0d0415]/90 backdrop-blur-md border-b border-white/5 shadow-2xl' : 'bg-[#0d0415]/60 backdrop-blur-sm border-b border-white/5'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link href={role === 'patient' ? "/patient-dashboard" : "/dashboard"} className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-light to-accent hover:opacity-80 transition-opacity">
                        Clinic App
                    </Link>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center gap-4">
                            {role === 'patient' ? (
                                <Link href="/patient-dashboard" className={`text-sm font-medium transition-colors ${isActive('/patient-dashboard') ? 'text-primary-light' : 'text-gray-400 hover:text-white'}`}>
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link href="/dashboard" className={`text-sm font-medium transition-colors ${isActive('/dashboard') ? 'text-primary-light' : 'text-gray-400 hover:text-white'}`}>
                                        Dashboard
                                    </Link>
                                    <Link href="/patients" className={`text-sm font-medium transition-colors ${isActive('/patients') ? 'text-primary-light' : 'text-gray-400 hover:text-white'}`}>
                                        Patients
                                    </Link>
                                    <Link href="/appointments" className={`text-sm font-medium transition-colors ${isActive('/appointments') ? 'text-primary-light' : 'text-gray-400 hover:text-white'}`}>
                                        Appointments
                                    </Link>
                                </>
                            )}
                        </div>
                        <button onClick={handleLogout} className="px-4 py-2 rounded-lg text-sm font-medium text-white border border-white/10 hover:bg-white/5 transition-all">
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
