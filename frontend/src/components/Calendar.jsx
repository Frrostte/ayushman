import React, { useState } from 'react';
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    addDays,
    isSameMonth,
    isSameDay,
    isToday,
    parseISO
} from 'date-fns';

export default function Calendar({ value, onChange, availableDates = [] }) {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    // Normalize available dates to ensure string comparison works
    // Assumption: availableDates are 'YYYY-MM-DD' strings

    const nextMonth = () => {
        setCurrentMonth(addMonths(currentMonth, 1));
    };

    const prevMonth = () => {
        setCurrentMonth(subMonths(currentMonth, 1));
    };

    const renderHeader = () => {
        return (
            <div className="flex items-center justify-between mb-6 px-2">
                <button
                    onClick={prevMonth}
                    type="button"
                    className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-xl transition-all text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-white shadow-sm hover:shadow-md"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {format(currentMonth, 'MMMM yyyy')}
                </div>
                <button
                    onClick={nextMonth}
                    type="button"
                    className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-xl transition-all text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-white shadow-sm hover:shadow-md"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        );
    };

    const renderDays = () => {
        const dateFormat = "EEEEE";
        const days = [];
        let startDate = startOfWeek(currentMonth);

        for (let i = 0; i < 7; i++) {
            days.push(
                <div className="text-center text-[10px] font-bold text-gray-400 dark:text-gray-500 py-2 uppercase tracking-widest" key={i}>
                    {format(addDays(startDate, i), dateFormat)}
                </div>
            );
        }

        return <div className="grid grid-cols-7 mb-2 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5">{days}</div>;
    };

    const renderCells = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);

        const dateFormat = "d";
        const rows = [];
        let days = [];
        let day = startDate;
        let formattedDate = "";

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                formattedDate = format(day, dateFormat);
                const cloneDay = day;

                // Check availability
                const dateStr = format(day, 'yyyy-MM-dd');
                const isAvailable = availableDates.includes(dateStr);
                const isSelected = value ? isSameDay(day, new Date(value)) : false;
                const isCurrentMonth = isSameMonth(day, monthStart);

                days.push(
                    <div
                        className={`
                            relative flex flex-col items-center justify-center p-3 cursor-pointer rounded-xl transition-all duration-300
                            ${!isCurrentMonth ? 'text-gray-300 dark:text-gray-700 opacity-30 shadow-none' : 'text-gray-700 dark:text-gray-200'}
                            ${isSelected ? 'bg-primary text-white shadow-lg shadow-primary/25 scale-105 z-10' : 'hover:bg-gray-100 dark:hover:bg-white/5'}
                        `}
                        key={day}
                        onClick={() => {
                            // Return YYYY-MM-DD string
                            onChange(format(cloneDay, 'yyyy-MM-dd'));
                        }}
                    >
                        <span className={`text-sm font-bold ${isToday(day) && !isSelected ? 'text-primary' : ''}`}>
                            {formattedDate}
                        </span>

                        {/* Availability Indicator */}
                        <div className="mt-1 h-1 w-1 rounded-full">
                            {isCurrentMonth && (
                                <div className={`
                                    w-1 h-1 rounded-full 
                                    ${isAvailable ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]' : 'bg-red-400 dark:bg-red-500/50'}
                                `}></div>
                            )}
                        </div>
                    </div>
                );
                day = addDays(day, 1);
            }
            rows.push(
                <div className="grid grid-cols-7 gap-1" key={day}>
                    {days}
                </div>
            );
            days = [];
        }
        return <div className="space-y-1">{rows}</div>;
    };

    return (
        <div className="bg-white dark:bg-black/30 border border-gray-100 dark:border-white/10 rounded-3xl p-6 w-full max-w-sm mx-auto shadow-xl dark:backdrop-blur-sm">
            {renderHeader()}
            {renderDays()}
            {renderCells()}

            <div className="mt-8 flex items-center justify-center space-x-6 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                <div className="flex items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500 mr-2 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                    <span>Available</span>
                </div>
                <div className="flex items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400 dark:bg-red-500/50 mr-2"></div>
                    <span>Unavailable</span>
                </div>
            </div>
        </div>
    );
}
