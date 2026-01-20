import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
    title: 'Clinic Management System',
    description: 'Manage patients, appointments, and sessions',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={`${inter.variable} font-sans bg-background text-white min-h-screen antialiased`}>
                {children}
            </body>
        </html>
    );
}
