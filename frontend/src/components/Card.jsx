export default function Card({ children, className = '', ...props }) {
    return (
        <div
            className={`bg-surface p-6 sm:p-10 rounded-2xl border border-white/5 shadow-[0_0_50px_-10px_rgba(124,58,237,0.1)] ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}
