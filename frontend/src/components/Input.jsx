export default function Input({ label, error, className = '', ...props }) {
    const isDateTime = props.type === 'date' || props.type === 'time';
    return (
        <div className={className}>
            {label && (
                <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-1 tracking-wider">
                    {label}
                </label>
            )}
            <input
                className={`${isDateTime ? '' : 'appearance-none'} rounded-xl relative block w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm transition-all shadow-sm ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                style={{ colorScheme: 'inherit', ...props.style }}
                {...props}
            />
            {error && <p className="mt-1.5 text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wide">{error}</p>}
        </div>
    );
}
