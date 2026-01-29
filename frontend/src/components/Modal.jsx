export default function Modal({ isOpen, onClose, title, children, footer }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop with blur */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-surface border border-white/5 rounded-2xl shadow-[0_0_50px_-10px_rgba(124,58,237,0.1)] w-full max-w-md transform transition-all scale-100 opacity-100 p-8">
                <div className="mb-4">
                    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                </div>

                <div className="text-gray-400 mb-8">
                    {children}
                </div>

                <div className="flex justify-end gap-3">
                    {footer}
                </div>
            </div>
        </div>
    );
}
