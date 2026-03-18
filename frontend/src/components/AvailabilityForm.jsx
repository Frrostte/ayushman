'use client';

import { useState } from 'react';
import api from '../lib/api'; // Adjust path based on location
import Input from './Input';
import Button from './Button';
import Select from './Select';

export default function AvailabilityForm({ onUpdate }) {
    const [formData, setFormData] = useState({
        startDate: '',
        endDate: '',
        startTime: '09:00',
        endTime: '17:00',
        daysOfWeek: [], // 0-6
        slotDuration: '30' // default to string for select, convert to number on submit
    });
    const [msg, setMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const days = [
        { id: 1, label: 'Mon' },
        { id: 2, label: 'Tue' },
        { id: 3, label: 'Wed' },
        { id: 4, label: 'Thu' },
        { id: 5, label: 'Fri' },
        { id: 6, label: 'Sat' },
        { id: 0, label: 'Sun' },
    ];

    const toggleDay = (id) => {
        setFormData(prev => {
            const currentDays = prev.daysOfWeek;
            if (currentDays.includes(id)) {
                return { ...prev, daysOfWeek: currentDays.filter(d => d !== id) };
            } else {
                return { ...prev, daysOfWeek: [...currentDays, id] };
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg('');

        try {
            if (formData.daysOfWeek.length === 0) {
                setMsg('Please select at least one day of the week.');
                setLoading(false);
                return;
            }

            const payload = {
                startDate: formData.startDate,
                endDate: formData.endDate,
                startTime: formData.startTime,
                endTime: formData.endTime,
                daysOfWeek: formData.daysOfWeek,
                slotDuration: parseInt(formData.slotDuration)
            };

            const res = await api.post('/doctors/availability/bulk', payload);

            setMsg(res.data.msg);
            // If count is 0 (or undefined/null which shouldn't happen with new backend), show warning style
            if (res.data.count === 0) {
                // Warning style handled in render
            } else {
                if (onUpdate) onUpdate();
            }

            // Clear msg after 3s
            setTimeout(() => setMsg(''), 5000); // Increased duration for reading

        } catch (err) {
            console.error(err);
            setMsg(err.response?.data?.msg || 'Failed to update availability');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
                {msg && (
                    <div className={`p-4 rounded-2xl text-xs font-bold uppercase tracking-widest text-center border animate-fade-in ${msg.toLowerCase().includes('failed') || msg.toLowerCase().includes('error')
                        ? 'bg-red-50 dark:bg-red-500/10 border-red-100 dark:border-red-500/50 text-red-600 dark:text-red-400' :
                        msg.includes('No slots added')
                            ? 'bg-yellow-50 dark:bg-yellow-500/10 border-yellow-100 dark:border-yellow-500/50 text-yellow-600 dark:text-yellow-400' :
                            'bg-green-50 dark:bg-green-500/10 border-green-100 dark:border-green-500/50 text-green-600 dark:text-green-400'
                        }`}>
                        {msg}
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Start Date"
                        type="date"
                        value={formData.startDate}
                        onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                        min={new Date().toISOString().split('T')[0]}
                        required
                    />
                    <Input
                        label="End Date"
                        type="date"
                        value={formData.endDate}
                        onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                        min={new Date().toISOString().split('T')[0]}
                        required
                    />
                </div>

                {/* Days Selection for Bulk */}
                <div className="space-y-4">
                    <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest block">Repeat On</label>
                    <div className="flex flex-wrap gap-2.5">
                        {days.map(d => (
                            <button
                                key={d.id}
                                type="button"
                                onClick={() => toggleDay(d.id)}
                                className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xs font-black transition-all duration-300 shadow-sm ${formData.daysOfWeek.includes(d.id)
                                    ? 'bg-primary text-white shadow-primary/20 shadow-xl scale-110 ring-4 ring-primary/5'
                                    : 'bg-gray-50 dark:bg-white/5 text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 border border-gray-100 dark:border-white/10'
                                    }`}
                            >
                                {d.label.charAt(0)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Start Time"
                        type="time"
                        value={formData.startTime}
                        onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                        required
                    />
                    <Input
                        label="End Time"
                        type="time"
                        value={formData.endTime}
                        onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                        required
                    />
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <Select
                        label="Slot Duration"
                        name="slotDuration"
                        value={formData.slotDuration}
                        onChange={e => setFormData({ ...formData, slotDuration: e.target.value })}
                        options={[
                            { value: '15', label: '15 minutes' },
                            { value: '30', label: '30 minutes' },
                            { value: '45', label: '45 minutes' },
                            { value: '60', label: '1 hour' }
                        ]}
                    />
                </div>

                <div className="pt-2">
                    <Button type="submit" disabled={loading} className="w-full py-4 text-xs font-bold uppercase tracking-widest shadow-xl shadow-primary/10 hover:scale-[1.02] transition-transform rounded-2xl">
                        {loading ? 'Creating Schedule...' : 'Generate Slots'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
