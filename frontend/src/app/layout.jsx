import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '../components/ThemeProvider';
import ThemeToggle from '../components/ThemeToggle';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
    title: 'Clinic Management System',
    description: 'Manage patients, appointments, and sessions',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={`${inter.variable} font-sans bg-background text-foreground min-h-screen antialiased`}>
                <ThemeProvider>
                    <div className="fixed top-24 right-4 z-50">
                        <ThemeToggle />
                    </div>
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
