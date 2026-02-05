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
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {upcomingAvailability.length === 0 ? (
                <p className="text-gray-400">No upcoming availability found.</p>
            ) : upcomingAvailability.map((slot, idx) => {
                const dateObj = new Date(slot.date);
                const dateStr = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
                const isoDate = dateObj.toISOString().split('T')[0];
                const isEditing = editingDate === isoDate;

                return (
                    <div key={idx} className="group flex items-center justify-between p-4 rounded-xl bg-white dark:bg-white/5 border border-transparent hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all mb-3">
                        {isEditing ? (
                            <div className="flex-1 flex items-center gap-2">
                                <div className="text-sm text-gray-300 w-24">{dateStr}</div>
                                <input
                                    type="time"
                                    value={editForm.startTime}
                                    onChange={e => setEditForm({ ...editForm, startTime: e.target.value })}
                                    onClick={e => e.target.showPicker && e.target.showPicker()}
                                    className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-primary cursor-pointer w-36"
                                    style={{ colorScheme: 'dark' }}
                                />
                                <span className="text-gray-400">-</span>
                                <input
                                    type="time"
                                    value={editForm.endTime}
                                    onChange={e => setEditForm({ ...editForm, endTime: e.target.value })}
                                    onClick={e => e.target.showPicker && e.target.showPicker()}
                                    className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-primary cursor-pointer w-36"
                                    style={{ colorScheme: 'dark' }}
                                />
                                <div className="flex gap-1 ml-auto">
                                    <button onClick={() => saveEdit(isoDate)} className="p-1 text-green-400 hover:bg-green-500/10 rounded">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    </button>
                                    <button onClick={cancelEdit} className="p-1 text-gray-400 hover:bg-gray-500/10 rounded">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center gap-4">
                                    <div className="flex flex-col items-center justify-center bg-primary/10 rounded-xl px-4 py-2 min-w-[70px]">
                                        <span className="text-xs font-bold text-primary uppercase tracking-wider">{dateObj.toLocaleString('default', { month: 'short' })}</span>
                                        <span className="text-xl font-bold text-primary">{dateObj.getDate()}</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-foreground text-lg">{dateStr.split(',')[0]}</p>
                                        <p className="text-sm text-secondary flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {slot.startTime} - {slot.endTime}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => confirmDelete(isoDate)}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                        title="Remove Availability"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
