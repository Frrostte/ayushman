import './globals.css';

export const metadata = {
    title: 'Clinic Management System',
    description: 'Manage patients, appointments, and sessions',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
