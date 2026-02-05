'use client';

import { useState } from 'react';
import api from '../lib/api'; // Adjust path based on location
import Button from './Button';
import Modal from './Modal';

export default function AvailabilityList({ availability, onUpdate }) {
    // Sort availability by date
    const sortedAvailability = [...availability].sort((a, b) => new Date(a.date) - new Date(b.date));

    // Filter out past dates to keep list clean
    const upcomingAvailability = sortedAvailability.filter(a => {
        const d = new Date(a.date);
        d.setHours(23, 59, 59, 999);
        return d >= new Date();
    });

    const [editingDate, setEditingDate] = useState(null);
    const [editForm, setEditForm] = useState({ startTime: '', endTime: '' });

    // Delete Confirmation State
    const [deleteDate, setDeleteDate] = useState(null);

    const startEdit = (slot) => {
        setEditingDate(new Date(slot.date).toISOString().split('T')[0]);
        setEditForm({ startTime: slot.startTime, endTime: slot.endTime });
    };

    const cancelEdit = () => {
        setEditingDate(null);
        setEditForm({ startTime: '', endTime: '' });
    };

    const saveEdit = async (date) => {
        try {
            await api.put('/doctors/availability', {
                date,
                startTime: editForm.startTime,
                endTime: editForm.endTime
            });
            if (onUpdate) onUpdate();
            setEditingDate(null);
        } catch (err) {
            console.error(err);
            alert('Failed to update slot');
        }
    };

    const confirmDelete = (date) => {
        setDeleteDate(date);
    };

    const executeDelete = async () => {
        if (!deleteDate) return;

        try {
            await api.delete(`/doctors/availability?date=${deleteDate}`);
            if (onUpdate) onUpdate();
            setDeleteDate(null);
        } catch (e) {
            console.error('Delete error', e);
            alert('Failed to delete availability');
        }
    };

    return (
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {upcomingAvailability.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 dark:bg-white/5 rounded-3xl border border-dashed border-gray-200 dark:border-white/10">
                    <p className="text-gray-400 font-medium italic">No upcoming availability found.</p>
                </div>
            ) : upcomingAvailability.map((slot, idx) => {
                const dateObj = new Date(slot.date);
                const dateStr = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
                const isoDate = dateObj.toISOString().split('T')[0];
                const isEditing = editingDate === isoDate;

                return (
                    <div key={idx} className="group flex items-center justify-between p-5 rounded-3xl bg-gray-50 dark:bg-white/5 border border-transparent hover:border-primary/30 hover:bg-white dark:hover:bg-white/10 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                        {isEditing ? (
                            <div className="flex-1 flex flex-col sm:flex-row items-center gap-4">
                                <div className="text-sm font-bold text-gray-900 dark:text-white sm:w-32">{dateStr}</div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="time"
                                        value={editForm.startTime}
                                        onChange={e => setEditForm({ ...editForm, startTime: e.target.value })}
                                        className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer shadow-sm"
                                        style={{ colorScheme: 'light dark' }}
                                    />
                                    <span className="text-gray-400 font-bold">to</span>
                                    <input
                                        type="time"
                                        value={editForm.endTime}
                                        onChange={e => setEditForm({ ...editForm, endTime: e.target.value })}
                                        className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer shadow-sm"
                                        style={{ colorScheme: 'light dark' }}
                                    />
                                </div>
                                <div className="flex gap-2 ml-auto">
                                    <button onClick={() => saveEdit(isoDate)} className="p-2.5 bg-green-500/10 text-green-600 rounded-xl hover:bg-green-500 hover:text-white transition-all shadow-sm">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                                    </button>
                                    <button onClick={cancelEdit} className="p-2.5 bg-gray-200/50 dark:bg-white/5 text-gray-500 dark:text-gray-400 rounded-xl hover:bg-gray-300 dark:hover:bg-white/10 transition-all shadow-sm">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center gap-6">
                                    <div className="flex flex-col items-center justify-center bg-primary/10 rounded-2xl px-5 py-3 min-w-[80px] shadow-sm transform group-hover:scale-105 transition-transform">
                                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{dateObj.toLocaleString('default', { month: 'short' })}</span>
                                        <span className="text-2xl font-black text-primary tracking-tighter">{dateObj.getDate()}</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white text-xl tracking-tight mb-1">{dateStr.split(',')[0]}</p>
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                            <div className="p-1 bg-primary/5 rounded-md">
                                                <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            {slot.startTime} - {slot.endTime}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => startEdit(slot)}
                                        className="p-2.5 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all md:opacity-0 md:group-hover:opacity-100"
                                        title="Edit Hours"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => confirmDelete(isoDate)}
                                        className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all md:opacity-0 md:group-hover:opacity-100"
                                        title="Remove Availability"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                );
            })}

            <Modal
                isOpen={!!deleteDate}
                onClose={() => setDeleteDate(null)}
                title="Remove Availability"
                footer={
                    <div className="grid grid-cols-2 gap-4 w-full">
                        <button
                            onClick={() => setDeleteDate(null)}
                            className="w-full px-4 py-2 text-sm text-secondary hover:text-foreground border border-border rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <Button
                            onClick={executeDelete}
                            className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white shadow-none"
                            style={{ padding: '0.5rem 1rem' }}
                        >
                            Confirm
                        </Button>
                    </div>
                }
            >
                <p>Are you sure you want to remove your availability for <strong>{deleteDate}</strong>?</p>
                <p className="text-sm mt-2 text-gray-400">Patients will no longer be able to book appointments for this date.</p>
            </Modal>
        </div>
    );
}
