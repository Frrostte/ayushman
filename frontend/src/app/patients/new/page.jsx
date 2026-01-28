'use client';

import Navbar from '../../../components/Navbar';
import PatientForm from '../../../components/PatientForm';
import { useRouter } from 'next/navigation';

export default function NewPatientPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-background text-white selection:bg-primary selection:text-white">
            <Navbar />
            <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
                <div className="bg-surface rounded-2xl border border-white/5 p-8 shadow-xl animate-fade-in relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent"></div>
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-light to-accent mb-2">
                            New Patient Registration
                        </h1>
                        <p className="text-gray-400">Enter patient details to create a new record.</p>
                    </div>

                    <PatientForm onSuccess={() => {
                        router.push('/patients');
                    }} />
                </div>
            </main>
        </div>
    );
}
