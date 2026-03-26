'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../lib/api';
import Link from 'next/link';
import Card from '../../../components/Card';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import Select from '../../../components/Select';

export default function ClinicsList() {
    const router = useRouter();
    const [clinics, setClinics] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // Edit Modal State
    const [editingClinic, setEditingClinic] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editFormData, setEditFormData] = useState({
        name: '', address: '', contactNumber: '', isActive: true
    });
    const [editError, setEditError] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const fetchClinics = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/clinics');
            setClinics(res.data);
        } catch (err) {
            console.error('Failed to fetch clinics:', err);
            setError('Failed to load clinics. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const checkSuperAdmin = () => {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                if (user.role !== 'superadmin') {
                    router.push('/dashboard');
                } else {
                    fetchClinics();
                }
            } else {
                router.push('/login');
            }
        };

        checkSuperAdmin();
    }, [router]);

    const openEditModal = (clinic) => {
        setEditingClinic(clinic);
        setEditFormData({
            name: clinic.name || '',
            address: clinic.address || '',
            contactNumber: clinic.contactNumber || '',
            isActive: clinic.isActive !== false // defaults to true if undefined
        });
        setEditError('');
        setIsEditModalOpen(true);
    };

    const handleEditChange = (e) => {
        const value = e.target.name === 'isActive' ? e.target.value === 'true' : e.target.value;
        setEditFormData({ ...editFormData, [e.target.name]: value });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setEditError('');
        setIsSaving(true);

        try {
            await api.put(`/clinics/${editingClinic._id}`, editFormData);
            setIsEditModalOpen(false);
            fetchClinics(); // Refresh list to get updated data
        } catch (err) {
            setEditError(err.response?.data?.msg || 'Failed to update clinic');
        } finally {
            setIsSaving(false);
        }
    };

    const getStatusBadgeColor = (isActive) => {
        return isActive 
            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20'
            : 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400 border-red-200 dark:border-red-500/20';
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">System Clinics</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Manage tenant clinics within the system.</p>
                </div>
                <div className="flex gap-4">
                    <Link href="/superadmin/clinics/new">
                        <Button className="flex items-center gap-2 shadow-xl shadow-primary/20">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add New Clinic
                        </Button>
                    </Link>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/50 text-red-600 dark:text-red-400 px-6 py-4 rounded-2xl text-sm font-bold flex items-center gap-3">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                </div>
            )}

            {/* Clinics Table */}
            <Card className="bg-white dark:bg-surface border border-gray-100 dark:border-white/5 rounded-3xl shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5">
                                <th className="p-6 text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 w-1/3">Clinic Name</th>
                                <th className="p-6 text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 w-1/4">Status</th>
                                <th className="p-6 text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 w-1/4">Contact</th>
                                <th className="p-6 text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 w-[15%]">Created</th>
                                <th className="p-6 text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 w-[10%] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                            {clinics.map((c) => (
                                <tr key={c._id} className="group hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                                    <td className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold shadow-sm group-hover:scale-105 transition-transform">
                                                {c.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 dark:text-white tracking-tight">{c.name}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium truncate max-w-[200px]">{c.address}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg border ${getStatusBadgeColor(c.isActive)}`}>
                                            {c.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="p-6">
                                        <p className="text-sm text-gray-600 dark:text-gray-300 font-medium font-mono bg-gray-50 dark:bg-white/5 inline-block px-2 py-1 rounded-md border border-gray-100 dark:border-white/5">
                                            {c.contactNumber || 'N/A'}
                                        </p>
                                    </td>
                                    <td className="p-6 text-sm text-gray-500 dark:text-gray-400 font-medium">
                                        {new Date(c.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </td>
                                    <td className="p-6 text-right">
                                        <button
                                            onClick={() => openEditModal(c)}
                                            className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
                                            title="Edit Clinic"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {clinics.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-12 text-center text-gray-500 dark:text-gray-400">
                                        <div className="flex flex-col items-center gap-3">
                                            <svg className="w-12 h-12 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                            <p className="font-medium text-lg">No clinics found</p>
                                            <Link href="/superadmin/clinics/new">
                                                <Button className="mt-2 text-sm">Add First Clinic</Button>
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Edit Clinic Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)} />
                    <Card className="relative w-full max-w-2xl bg-white dark:bg-surface shadow-2xl rounded-3xl overflow-hidden animate-slide-up">
                        <div className="px-8 py-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.02]">
                            <div>
                                <h3 className="text-xl font-black text-gray-900 dark:text-white">Edit Clinic details</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Updating profile for {editingClinic?.name}</p>
                            </div>
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-all"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleEditSubmit} className="p-8">
                            {editError && (
                                <div className="mb-6 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/50 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm font-bold">
                                    {editError}
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="Clinic Name*"
                                    name="name"
                                    value={editFormData.name}
                                    onChange={handleEditChange}
                                    required
                                />
                                <Input
                                    label="Contact Number"
                                    name="contactNumber"
                                    value={editFormData.contactNumber}
                                    onChange={handleEditChange}
                                />
                                <div className="md:col-span-2">
                                    <Input
                                        label="Address"
                                        name="address"
                                        value={editFormData.address}
                                        onChange={handleEditChange}
                                    />
                                </div>
                                <Select
                                    label="Status"
                                    name="isActive"
                                    value={editFormData.isActive.toString()}
                                    onChange={handleEditChange}
                                    options={[
                                        { value: 'true', label: 'Active' },
                                        { value: 'false', label: 'Inactive' }
                                    ]}
                                />
                            </div>

                            <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-white/5">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="px-4 py-3 w-full flex justify-center text-sm rounded-lg font-bold bg-red-500 hover:bg-red-600 text-white transition-all shadow-[0_0_20px_-5px_rgba(239,68,68,0.5)] items-center md:w-auto"
                                >
                                    Cancel
                                </button>
                                <Button
                                    type="submit"
                                    isLoading={isSaving}
                                    className="px-8 shadow-[0_0_20px_-5px_rgba(124,58,237,0.5)] text-sm w-full md:w-auto"
                                >
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
}
