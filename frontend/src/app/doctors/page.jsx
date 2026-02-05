'use client';

import { useState, useEffect } from 'react';

import api from '../../lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '../../components/Button';

export default function Doctors() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const res = await api.get('/doctors');
                setDoctors(res.data);
            } catch (err) {
                console.error(err);
                if (err.response?.status === 401) router.push('/login');
            } finally {
                setLoading(false);
            }
        };
        fetchDoctors();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="text-foreground">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-6">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-light to-accent mb-2">
                        Doctors
                    </h1>
                    <p className="text-gray-400">Manage doctor profiles and details.</p>
                </div>

                <div className="w-full sm:w-auto">
                    <Button
                        className={`w-full sm:w-auto px-6 shadow-lg bg-primary hover:bg-primary-dark`}
                        onClick={() => router.push('/doctors/new')}
                    >
                        <span className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add New Doctor
                        </span>
                    </Button>
                </div>
            </div >

            <div className="bg-surface rounded-2xl border border-white/5 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/5">
                                <th className="px-6 py-4 text-sm font-medium text-gray-400">Doctor</th>
                                <th className="px-6 py-4 text-sm font-medium text-gray-400">ID</th>
                                <th className="px-6 py-4 text-sm font-medium text-gray-400">Email</th>
                                <th className="px-6 py-4 text-sm font-medium text-gray-400">Contact</th>
                                <th className="px-6 py-4 text-sm font-medium text-gray-400">Joined Date</th>
                                <th className="px-6 py-4 text-sm font-medium text-gray-400">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {doctors.map(d => (
                                <tr key={d._id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shadow-inner">
                                                {d.name.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="font-medium text-white group-hover:text-primary-light transition-colors">{d.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-400 font-mono text-xs">
                                        {d._id.slice(-6)}
                                    </td>
                                    <td className="px-6 py-4 text-gray-300 text-sm">
                                        {d.email}
                                    </td>
                                    <td className="px-6 py-4 text-gray-300 text-sm">
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                            {d.phone}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-300 text-sm">
                                        {d.createdAt ? new Date(d.createdAt).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link
                                            href={`/doctors/${d._id}`}
                                            className="inline-flex items-center px-3 py-1 bg-white/5 hover:bg-primary/20 text-gray-300 hover:text-primary-light text-xs font-medium rounded-md transition-colors border border-white/10 hover:border-primary/30"
                                        >
                                            View Profile
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {
                doctors.length === 0 && (
                    <div className="bg-surface rounded-2xl border border-white/5 p-12 text-center shadow-xl mt-8">
                        <div className="mx-auto h-20 w-20 bg-white/5 rounded-full flex items-center justify-center mb-6 text-gray-600">
                            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No Doctors Found</h3>
                        <p className="text-gray-400 max-w-sm mx-auto mb-8">Get started by adding a new doctor to the system.</p>
                        <Button
                            className="bg-primary hover:bg-primary-dark text-white shadow-lg shadow-purple-900/20"
                            onClick={() => router.push('/doctors/new')}
                        >
                            Add New Doctor
                        </Button>
                    </div>
                )
            }
        </div >
    );
}
