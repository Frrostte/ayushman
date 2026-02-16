export default function Select({ label, options = [], className = '', ...props }) {
    return (
        <div className={className}>
            {label && (
                <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">
                    {label}
                </label>
            )}
            <div className="relative">
                <select
                    className={`appearance-none rounded-xl relative block w-full px-4 py-3 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm transition-all shadow-sm ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    {...props}
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-white dark:bg-surface text-gray-900 dark:text-white">
                            {opt.label}
                        </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
        </div>
    );
}
