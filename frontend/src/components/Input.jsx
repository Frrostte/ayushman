export default function Input({ label, error, className = '', ...props }) {
    return (
        <div className={className}>
            {label && (
                <label className="block text-sm font-medium text-gray-400 mb-1">
                    {label}
                </label>
            )}
            <input
                className={`appearance-none rounded-lg relative block w-full px-3 py-3 bg-black/50 border border-white/10 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm transition-all ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                {...props}
            />
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    );
}
