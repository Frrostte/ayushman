'use client';

import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';

export default function LayoutWrapper({ children }) {
    const pathname = usePathname();
    const isAuthPage = ['/login', '/register', '/'].includes(pathname);

    if (isAuthPage) {
        return children;
    }

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 md:ml-64">
                <main className="flex-1 p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
