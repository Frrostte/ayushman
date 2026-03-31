'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../lib/api';
import Link from 'next/link';
import Card from '../../../components/Card';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import Select from '../../../components/Select';

export default function UsersList() {
    const router = useRouter();
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const [clinics, setClinics] = useState([]);
    const [filters, setFilters] = useState({ clinicId: '', role: '' });
    const [appliedFilters, setAppliedFilters] = useState({ clinicId: '', role: '' });

    // Edit Modal State
    const [editingUser, setEditingUser] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editFormData, setEditFormData] = useState({
        name: '', email: '', phone: '', role: '', password: '', clinicId: ''
    });
    const [editError, setEditError] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Delete Modal State
    const [userToDelete, setUserToDelete] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/users');
            setUsers(res.data);
        } catch (err) {
            console.error('Failed to fetch users:', err);
            setError('Failed to load users. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const checkAdmin = async () => {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                if (user.role !== 'admin' && user.role !== 'superadmin') {
                    router.push('/dashboard');
                } else {
                    setCurrentUser(user);
                    if (user.role === 'superadmin') {
                        try {
                            const res = await api.get('/clinics');
                            setClinics(res.data);
                        } catch (err) {
                            console.error('Failed to fetch clinics', err);
                        }
                    }
                    fetchUsers();
                }
            } else {
                router.push('/login');
            }
        };

        checkAdmin();
    }, [router]);

    const openEditModal = (user) => {
        setEditingUser(user);
        setEditFormData({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            role: user.role || 'patient',
            clinicId: user.clinicId?._id || '',
            password: '' // Keep empty, only send if changing
        });
        setEditError('');
        setIsEditModalOpen(true);
    };

    const handleEditChange = (e) => {
        setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setEditError('');
        setIsSaving(true);

        try {
            // Only send password if it's not empty
            const dataToUpdate = { ...editFormData };
            if (!dataToUpdate.password) {
                delete dataToUpdate.password;
            }

            await api.put(`/users/${editingUser._id}`, dataToUpdate);
            setIsEditModalOpen(false);
            fetchUsers(); // Refresh list to get updated data
        } catch (err) {
            setEditError(err.response?.data?.msg || 'Failed to update user');
        } finally {
            setIsSaving(false);
        }
    };

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'admin': return 'bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400 border-purple-200 dark:border-purple-500/20';
            case 'doctor': return 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200 dark:border-blue-500/20';
            case 'patient': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20';
            default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700';
        }
    };

    const toggleUserStatus = async (user) => {
        try {
            await api.put(`/users/${user._id}`, { isActive: !user.isActive });
            fetchUsers();
        } catch (err) {
            console.error('Failed to toggle status', err);
            setError(err.response?.data?.msg || 'Failed to update user status');
        }
    };

    const openDeleteModal = (user) => {
        setUserToDelete(user);
        setIsDeleteModalOpen(true);
    };

    const confirmDeleteUser = async () => {
        if (!userToDelete) return;
        setIsDeleting(true);
        try {
            await api.delete(`/users/${userToDelete._id}`);
            setIsDeleteModalOpen(false);
            fetchUsers();
            setUserToDelete(null);
        } catch (err) {
            console.error('Failed to delete user', err);
            setError(err.response?.data?.msg || 'Failed to delete user');
            setIsDeleteModalOpen(false);
        } finally {
            setIsDeleting(false);
        }
    };

    useEffect(() => {
        let result = users;
        
        if (appliedFilters.clinicId === 'system') {
            result = result.filter(u => !u.clinicId);
        } else if (appliedFilters.clinicId) {
            result = result.filter(u => u.clinicId?._id === appliedFilters.clinicId);
        }

        if (appliedFilters.role) {
            result = result.filter(u => u.role === appliedFilters.role);
        }

        setFilteredUsers(result);
    }, [users, appliedFilters]);

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
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">System Users</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Manage administrators, doctors, and patients.</p>
                </div>
                <div className="flex gap-4">
                    <Link href="/admin/users/new">
                        <Button className="flex items-center gap-2 shadow-xl shadow-primary/20">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add New User
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

            {/* Users Table & Filters */}
            <Card className="bg-white dark:bg-surface border border-gray-100 dark:border-white/5 rounded-3xl shadow-xl overflow-hidden flex flex-col">
                {/* Super Admin Filters */}
                {currentUser?.role === 'superadmin' && (
                    <div className="p-6 border-b border-gray-100 dark:border-white/5 bg-gray-50/30 dark:bg-white/[0.01] relative z-10 w-full">
                        <div className="flex flex-col md:flex-row gap-4 items-end">
                            <div className="flex-1 w-full">
                                <Select
                                    label="Filter by Clinic"
                                    name="clinicId"
                                    value={filters.clinicId}
                                    onChange={(e) => setFilters({ ...filters, clinicId: e.target.value })}
                                    options={[
                                        { value: '', label: 'All Clinics' },
                                        ...clinics.map(c => ({ value: c._id, label: c.name })),
                                        { value: 'system', label: 'System Level (No Clinic)' }
                                    ]}
                                />
                            </div>
                            <div className="flex-1 w-full">
                                <Select
                                    label="Filter by Role"
                                    name="role"
                                    value={filters.role}
                                    onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                                    options={[
                                        { value: '', label: 'All Roles' },
                                        { value: 'admin', label: 'Administrator' },
                                        { value: 'doctor', label: 'Doctor' },
                                        { value: 'patient', label: 'Patient' },
                                        { value: 'superadmin', label: 'Super Admin' }
                                    ]}
                                />
                            </div>
                            <Button 
                                onClick={() => setAppliedFilters(filters)}
                                className="w-full md:w-auto px-8 shadow-xl shadow-primary/20 h-[52px]" 
                            >
                                <span className="flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                    </svg>
                                    Filter Users
                                </span>
                            </Button>
                        </div>
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5">
                                <th className="p-6 text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 w-1/4">User Details</th>
                                <th className="p-6 text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 w-[15%]">Role</th>
                                <th className="p-6 text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 w-1/4">Clinic</th>
                                <th className="p-6 text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 w-[15%]">Contact</th>
                                <th className="p-6 text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 w-[10%]">Joined</th>
                                <th className="p-6 text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 w-[10%] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                            {filteredUsers.map((u) => (
                                <tr key={u._id} className={`group transition-colors ${u.isActive === false ? 'bg-gray-100/50 dark:bg-white/5 opacity-75' : 'hover:bg-gray-50 dark:hover:bg-white/[0.02]'}`}>
                                    <td className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold shadow-sm group-hover:scale-105 transition-transform">
                                                {u.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="font-bold text-gray-900 dark:text-white tracking-tight">{u.name}</p>
                                                    {u.isActive === false && (
                                                        <span className="text-[9px] font-black uppercase tracking-widest text-red-500 bg-red-50 dark:bg-red-500/10 px-1.5 py-0.5 rounded border border-red-100 dark:border-red-500/20">
                                                            Inactive
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{u.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg border ${getRoleBadgeColor(u.role)}`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="p-6">
                                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 line-clamp-1">
                                            {u.clinicId?.name || (u.role === 'superadmin' ? 'System Level' : 'Unassigned')}
                                        </p>
                                    </td>
                                    <td className="p-6">
                                        <p className="text-sm text-gray-600 dark:text-gray-300 font-medium font-mono bg-gray-50 dark:bg-white/5 inline-block px-2 py-1 rounded-md border border-gray-100 dark:border-white/5">
                                            {u.phone}
                                        </p>
                                    </td>
                                    <td className="p-6 text-sm text-gray-500 dark:text-gray-400 font-medium">
                                        {new Date(u.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center justify-end gap-2">
                                            {/* Deactivate/Activate Button */}
                                            {u._id !== currentUser?.id && (
                                                <button
                                                    onClick={() => toggleUserStatus(u)}
                                                    className={`p-2 rounded-xl transition-all ${
                                                        u.isActive === false 
                                                        ? 'text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10' 
                                                        : 'text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10'
                                                    }`}
                                                    title={u.isActive === false ? 'Activate User' : 'Deactivate User'}
                                                >
                                                    {u.isActive === false ? (
                                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                                        </svg>
                                                    )}
                                                </button>
                                            )}

                                            {/* Edit Button */}
                                            <button
                                                onClick={() => openEditModal(u)}
                                                className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
                                                title="Edit User"
                                            >
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>

                                            {/* Delete Button */}
                                            {u._id !== currentUser?.id && (
                                                <button
                                                    onClick={() => openDeleteModal(u)}
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"
                                                    title="Delete User"
                                                >
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="p-12 text-center text-gray-500 dark:text-gray-400">
                                        <div className="flex flex-col items-center gap-3">
                                            <svg className="w-12 h-12 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                            </svg>
                                            <p className="font-medium text-lg">No users found</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Edit User Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)} />
                    <Card className="relative w-full max-w-2xl bg-white dark:bg-surface shadow-2xl rounded-3xl overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">
                        <div className="px-8 py-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.02] shrink-0">
                            <div>
                                <h3 className="text-xl font-black text-gray-900 dark:text-white">Edit User details</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Updating profile for {editingUser?.name}</p>
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

                        <div className="overflow-y-auto w-full">
                            <form onSubmit={handleEditSubmit} className="p-8">
                                {editError && (
                                    <div className="mb-6 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/50 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm font-bold">
                                        {editError}
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input
                                        label="Full Name*"
                                        name="name"
                                        value={editFormData.name}
                                        onChange={handleEditChange}
                                        required
                                    />
                                    <Input
                                        label="Email Address*"
                                        type="email"
                                        name="email"
                                        value={editFormData.email}
                                        onChange={handleEditChange}
                                        required
                                    />
                                    <Input
                                        label="Phone Number*"
                                        name="phone"
                                        value={editFormData.phone}
                                        onChange={handleEditChange}
                                        required
                                    />
                                    <Select
                                        label="Role"
                                        name="role"
                                        value={editFormData.role}
                                        onChange={handleEditChange}
                                        options={[
                                            { value: 'doctor', label: 'Doctor' },
                                            { value: 'admin', label: 'Administrator' },
                                            { value: 'patient', label: 'Patient' }
                                        ]}
                                    />
                                    {currentUser?.role === 'superadmin' && editFormData.role !== 'superadmin' && (
                                        <Select
                                            label="Assign to Clinic"
                                            name="clinicId"
                                            value={editFormData.clinicId}
                                            onChange={handleEditChange}
                                            options={[
                                                { value: '', label: 'System Level (Unassigned)' },
                                                ...clinics.map(c => ({ value: c._id, label: c.name }))
                                            ]}
                                        />
                                    )}
                                    <div className="md:col-span-2">
                                        <Input
                                            label="New Password (Optional)"
                                            type="password"
                                            name="password"
                                            value={editFormData.password}
                                            onChange={handleEditChange}
                                            placeholder="Leave blank to keep current password"
                                        />
                                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 font-medium ml-1">
                                            Only enter a password if you wish to overwrite the users current login credentials.
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-white/5">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditModalOpen(false)}
                                        className="px-4 py-3 w-full flex justify-center text-sm rounded-lg font-bold bg-red-500 hover:bg-red-600 text-white transition-all shadow-[0_0_20px_-5px_rgba(239,68,68,0.5)] items-center"
                                    >
                                        Cancel
                                    </button>
                                    <Button
                                        type="submit"
                                        isLoading={isSaving}
                                        className="px-8 shadow-[0_0_20px_-5px_rgba(124,58,237,0.5)] text-sm"
                                    >
                                        Save Changes
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </Card>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isDeleting && setIsDeleteModalOpen(false)} />
                    <Card className="relative w-full max-w-md bg-white dark:bg-surface shadow-2xl rounded-3xl overflow-hidden animate-slide-up p-8 text-center">
                        <div className="mx-auto w-16 h-16 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-6 border border-red-100 dark:border-red-500/20">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Delete User?</h3>
                        <p className="text-gray-500 dark:text-gray-400 font-medium mb-8">
                            Are you sure you want to permanently delete <span className="text-gray-900 dark:text-white font-bold">{userToDelete?.name}</span>? This will also wipe out any associated clinical profiles permanently. This action cannot be undone.
                        </p>

                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => setIsDeleteModalOpen(false)}
                                disabled={isDeleting}
                                className="flex-1 px-4 py-3 text-sm rounded-xl font-bold bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={confirmDeleteUser}
                                disabled={isDeleting}
                                className="flex-1 px-4 py-3 text-sm rounded-xl font-bold bg-red-500 hover:bg-red-600 text-white transition-all shadow-[0_0_20px_-5px_rgba(239,68,68,0.5)] flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isDeleting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white"></div>
                                        Deleting...
                                    </>
                                ) : (
                                    'Yes, Delete'
                                )}
                            </button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}
