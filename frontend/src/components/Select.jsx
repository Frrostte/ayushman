export default function Select({ label, options = [], className = '', ...props }) {
    return (
        <div className={className}>
            {label && (
                <label className="block text-sm font-medium text-gray-400 mb-1">
                    {label}
                </label>
            )}
            <div className="relative">
                <select
                    className={`appearance-none rounded-lg relative block w-full px-3 py-3 bg-black/50 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm transition-all ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    {...props}
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-surface text-white">
                            {opt.label}
                        </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
        </div>
    );
}
