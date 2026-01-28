export default function Button({ children, isLoading, className = '', ...props }) {
    return (
        <button
            disabled={isLoading || props.disabled}
            className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-black transition-all duration-300 shadow-[0_0_20px_-5px_rgba(124,58,237,0.5)] ${isLoading || props.disabled ? 'bg-primary/50 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark'} ${className}`}
            {...props}
        >
            {isLoading ? (
                <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {children}
                </span>
            ) : (
                children
            )}
        </button>
    );
}
