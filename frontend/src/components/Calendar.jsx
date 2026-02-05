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
            <div className="flex items-center justify-between mb-4 px-2">
                <button
                    onClick={prevMonth}
                    type="button"
                    className="p-1 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <div className="text-lg font-semibold text-white">
                    {format(currentMonth, 'MMMM yyyy')}
                </div>
                <button
                    onClick={nextMonth}
                    type="button"
                    className="p-1 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
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
                <div className="text-center text-xs font-medium text-gray-500 py-2" key={i}>
                    {format(addDays(startDate, i), dateFormat)}
                </div>
            );
        }

        return <div className="grid grid-cols-7 mb-2">{days}</div>;
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
              relative flex flex-col items-center justify-center p-2 cursor-pointer rounded-lg transition-all
              ${!isCurrentMonth ? 'text-gray-700 opacity-50' : 'text-gray-300'}
              ${isSelected ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'hover:bg-white/5'}
            `}
                        key={day}
                        onClick={() => {
                            // Return YYYY-MM-DD string
                            onChange(format(cloneDay, 'yyyy-MM-dd'));
                        }}
                    >
                        <span className={`text-sm ${isToday(day) && !isSelected ? 'text-primary font-bold' : ''}`}>
                            {formattedDate}
                        </span>

                        {/* Availability Indicator */}
                        <div className="mt-1 h-1.5 w-1.5 rounded-full">
                            {isCurrentMonth && (
                                <div className={`
                        w-1.5 h-1.5 rounded-full 
                        ${isAvailable ? 'bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.6)]' : 'bg-red-500/50'}
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
        <div className="bg-black/30 border border-white/10 rounded-xl p-4 w-full max-w-sm mx-auto backdrop-blur-sm">
            {renderHeader()}
            {renderDays()}
            {renderCells()}

            <div className="mt-4 flex items-center justify-center space-x-4 text-xs text-gray-400">
                <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2 shadow-[0_0_5px_rgba(34,197,94,0.6)]"></div>
                    <span>Available</span>
                </div>
                <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-red-500/50 mr-2"></div>
                    <span>Unavailable</span>
                </div>
            </div>
        </div>
    );
}
