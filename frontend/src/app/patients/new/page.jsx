'use client';


import PatientForm from '../../../components/PatientForm';
import { useRouter } from 'next/navigation';

export default function NewPatientPage() {
    const router = useRouter();

    return (
        <div className="text-foreground max-w-3xl mx-auto">
            <div className="mb-10">
                <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-light tracking-tight mb-2">
                    New Patient Registration
                </h1>
                <p className="text-gray-500 dark:text-gray-400 font-medium">Enter patient details to create a new clinical record.</p>
            </div>

            <div className="bg-white dark:bg-surface border border-gray-100 dark:border-white/5 rounded-3xl shadow-xl p-8">
                <PatientForm onSuccess={() => {
                    router.push('/patients');
                }} />
            </div>
        </div>
    );
}
