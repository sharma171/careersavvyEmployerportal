import React, { useState, useEffect } from 'react';
import Benefits from "../images/Benefits.png";
const JobBenefitsSection = ({ jobPost, setJobPost }) => {
    // Initialize responsibilities array if it doesn't exist
    const [benefits, setBenefits] = useState(
        jobPost?.job_highlights?.Benefits || ['']
    );

    
    // Sync component state when jobPost updates
    useEffect(() => {
        setBenefits(jobPost?.job_highlights?.Benefits || [""]);
    }, [jobPost]);


    // Handle input change for a specific responsibility
    const handleChange = (index, value) => {
        const newBenefits = [...benefits];
        newBenefits[index] = value;
        
        setBenefits(newBenefits);
        
        // Update the parent state
        setJobPost(prevState => ({
            ...prevState,
            job_highlights: {
                ...prevState.job_highlights,
                Benefits: newBenefits
            }
        }));
    };

    // Add new responsibility field
    const addNewBenefits = () => {
        setBenefits([...benefits, '']);
    };

    // Remove responsibility field
    const removeBenefits = (index) => {
        const newBenefits = benefits.filter((_, i) => i !== index);
        setBenefits(newBenefits);
        
        // Update the parent state
        setJobPost(prevState => ({
            ...prevState,
            job_highlights: {
                ...prevState.job_highlights,
                Benefits: newBenefits
            }
        }));
    };

    return (
        <div className="col-md-12 text-inputs d-flex flex-column mt-4">
            <div className="inputIconHead d-flex align-items-center">
                <img src={Benefits} alt="icon" className="icon" />
                <h6 className="inputTitle voilet">Job Benefits & Perks</h6>
            </div>

            {benefits.map((benefits, index) => (
                <div key={index} className="d-flex align-items-center mt-2">
                    <input
                        className="simpleInputs responsibility"
                        placeholder="Enter Here List of Benefits"
                        value={benefits}
                        onChange={(e) => handleChange(index, e.target.value)}
                        name={`job_responsibility_${index}`}
                    />
                    {index > 0 && (
                        <button 
                            className="removeBtn mx-2"
                            onClick={() => removeBenefits(index)}
                            style={{
                                border: 'none',
                                background: 'none',
                                cursor: 'pointer',
                                padding: '4px'
                            }}
                        >
                            ❌
                        </button>
                    )}
                </div>
            ))}

            <button 
                className="addnewline mt-2"
                onClick={addNewBenefits}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    border: 'none',
                    background: 'none',
                    color: '#0051FF',
                    cursor: 'pointer',
                    padding: '8px 0'
                }}
            >
                ➕ Add New Line
            </button>
        </div>
    );
};

export default JobBenefitsSection;