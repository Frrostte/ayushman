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

    return (
        <div style={{ marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
            <h4>Prescription</h4>
            {medications.map((med, index) => (
                <div key={index} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'end' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label style={{ fontSize: '0.8rem' }}>Medicine Name</label>
                        <input
                            type="text"
                            value={med.name}
                            onChange={(e) => handleChange(index, 'name', e.target.value)}
                            placeholder="Name"
                            required
                        />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label style={{ fontSize: '0.8rem' }}>Dosage</label>
                        <input
                            type="text"
                            value={med.dosage}
                            onChange={(e) => handleChange(index, 'dosage', e.target.value)}
                            placeholder="500mg"
                        />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label style={{ fontSize: '0.8rem' }}>Frequency</label>
                        <input
                            type="text"
                            value={med.frequency}
                            onChange={(e) => handleChange(index, 'frequency', e.target.value)}
                            placeholder="2x daily"
                        />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label style={{ fontSize: '0.8rem' }}>Duration</label>
                        <input
                            type="text"
                            value={med.duration}
                            onChange={(e) => handleChange(index, 'duration', e.target.value)}
                            placeholder="5 days"
                        />
                    </div>
                    <button type="button" onClick={() => removeMedication(index)} style={{ background: 'red', color: 'white', border: 'none', padding: '0.5rem', cursor: 'pointer' }}>X</button>
                </div>
            ))}
            <button type="button" onClick={addMedication} className="btn" style={{ background: '#eee', marginTop: '0.5rem' }}>+ Add Medication</button>
        </div>
    );
}
