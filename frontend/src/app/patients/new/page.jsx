'use client';


import PatientForm from '../../../components/PatientForm';
import { useRouter } from 'next/navigation';

export default function NewPatientPage() {
    const router = useRouter();

    return (
        <div className="text-foreground max-w-3xl mx-auto">
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-light to-accent mb-2">
                            New Patient Registration
                        </h1>
                        <p className="text-gray-400">Enter patient details to create a new record.</p>
                    </div>

                    <PatientForm onSuccess={() => {
                        router.push('/patients');
                    }} />
            </div >
        </div >
        );
}
