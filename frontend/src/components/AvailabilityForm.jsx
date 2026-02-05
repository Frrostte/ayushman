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
        <div className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
                {msg && <div className={`p-3 rounded text-sm ${msg.toLowerCase().includes('failed') || msg.toLowerCase().includes('error') ? 'bg-red-500/20 text-red-400' :
                    msg.includes('No slots added') ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-green-500/20 text-green-400'
                    }`}>{msg}</div>}

                <div className="grid grid-cols-2 gap-3">
                    <Input
                        label="Start Date"
                        type="date"
                        value={formData.startDate}
                        onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                        min={new Date().toISOString().split('T')[0]}
                        required
                        style={{ colorScheme: 'dark' }}
                    />
                    <Input
                        label="End Date"
                        type="date"
                        value={formData.endDate}
                        onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                        min={new Date().toISOString().split('T')[0]} // better UX to prevent past ranges
                        // Actually user might paste date, better let validation handle it or auto-set min
                        // min={formData.startDate || new Date().toISOString().split('T')[0]}
                        required
                        style={{ colorScheme: 'dark' }}
                    />
                </div>

                {/* Days Selection for Bulk */}
                <div className="space-y-4">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Repeat On</label>
                    <div className="flex flex-wrap gap-3">
                        {days.map(d => (
                            <button
                                key={d.id}
                                type="button"
                                onClick={() => toggleDay(d.id)}
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all shadow-sm ${formData.daysOfWeek.includes(d.id)
                                    ? 'bg-primary text-white shadow-primary/30 shadow-lg scale-105'
                                    : 'bg-white dark:bg-zinc-800 text-gray-500 hover:bg-gray-50 border border-gray-200 dark:border-zinc-700'
                                    }`}
                            >
                                {d.label.charAt(0)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <Input
                        label="Start Time"
                        type="time"
                        value={formData.startTime}
                        onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                        style={{ colorScheme: 'dark' }}
                        required
                    />
                    <Input
                        label="End Time"
                        type="time"
                        value={formData.endTime}
                        onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                        style={{ colorScheme: 'dark' }}
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <Select
                        label="Interval"
                        name="slotDuration"
                        value={formData.slotDuration}
                        onChange={e => setFormData({ ...formData, slotDuration: e.target.value })}
                        options={[
                            { value: '15', label: '15 min' },
                            { value: '30', label: '30 min' },
                            { value: '45', label: '45 min' },
                            { value: '60', label: '60 min' }
                        ]}
                    />
                </div>

                <Button type="submit" disabled={loading} className="w-full py-2.5">
                    {loading ? 'Saving...' : 'Add Availability'}
                </Button>
            </form>
        </div>
    );
}
