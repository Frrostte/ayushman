'use client';

export default function PrescriptionForm({ medications, setMedications }) {
    const addMedication = () => {
        setMedications([...medications, { name: '', dosage: '', frequency: '', duration: '' }]);
    };

    const removeMedication = (index) => {
        const newMeds = medications.filter((_, i) => i !== index);
        setMedications(newMeds);
    };

    const handleChange = (index, field, value) => {
        const newMeds = [...medications];
        newMeds[index][field] = value;
        setMedications(newMeds);
    };

    const inputClasses = "appearance-none rounded-lg relative block w-full px-3 py-2 bg-black/50 border border-white/10 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition-all";
    const labelClasses = "block text-xs font-medium text-gray-400 mb-1";

    return (
        <div className="mt-8 border-t border-white/10 pt-6">
            <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-white">Prescription</h4>
                <button type="button" onClick={addMedication} className="text-sm text-primary hover:text-primary-light font-medium flex items-center gap-1 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Medication
                </button>
            </div>

            <div className="space-y-4">
                {medications.map((med, index) => (
                    <div key={index} className="grid grid-cols-12 gap-3 items-end bg-white/5 p-4 rounded-xl border border-white/5 relative group">
                        <div className="col-span-12 sm:col-span-4">
                            <label className={labelClasses}>Medicine Name</label>
                            <input
                                type="text"
                                value={med.name}
                                onChange={(e) => handleChange(index, 'name', e.target.value)}
                                placeholder="Name"
                                required
                                className={inputClasses}
                            />
                        </div>
                        <div className="col-span-6 sm:col-span-2">
                            <label className={labelClasses}>Dosage</label>
                            <input
                                type="text"
                                value={med.dosage}
                                onChange={(e) => handleChange(index, 'dosage', e.target.value)}
                                placeholder="500mg"
                                className={inputClasses}
                            />
                        </div>
                        <div className="col-span-6 sm:col-span-3">
                            <label className={labelClasses}>Frequency</label>
                            <input
                                type="text"
                                value={med.frequency}
                                onChange={(e) => handleChange(index, 'frequency', e.target.value)}
                                placeholder="2x daily"
                                className={inputClasses}
                            />
                        </div>
                        <div className="col-span-10 sm:col-span-2">
                            <label className={labelClasses}>Duration</label>
                            <input
                                type="text"
                                value={med.duration}
                                onChange={(e) => handleChange(index, 'duration', e.target.value)}
                                placeholder="5 days"
                                className={inputClasses}
                            />
                        </div>
                        <div className="col-span-2 sm:col-span-1 flex justify-end pb-1">
                            <button
                                type="button"
                                onClick={() => removeMedication(index)}
                                className="text-gray-500 hover:text-red-500 transition-colors p-2"
                                title="Remove"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}
                {medications.length === 0 && (
                    <p className="text-sm text-gray-500 italic text-center py-4 bg-white/5 rounded-lg border border-dashed border-white/10">
                        No medications added. Click "Add Medication" to prescribe.
                    </p>
                )}
            </div>
        </div>
    );
}
