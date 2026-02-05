'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';

export default function LayoutWrapper({ children }) {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const isAuthPage = ['/login', '/register', '/'].includes(pathname);

    if (isAuthPage) {
        return children;
    }

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
            {/* Mobile Header */}
            <header className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-surface border-b border-gray-100 dark:border-white/5 flex items-center justify-between px-6 z-30 md:hidden">
                <h1 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-light tracking-tighter">
                    AYUSHMAN
                </h1>
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-all"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </header>

            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 md:ml-64 pt-16 md:pt-0">
                <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
