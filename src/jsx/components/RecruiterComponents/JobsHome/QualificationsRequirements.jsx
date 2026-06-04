import React, { useState, useEffect } from 'react';
import Qualification from "../images/Qualication.png";

const JobQualificationsSection = ({ jobPost, setJobPost, requirements, setRequirements }) => {
    // State for qualifications
    const [qualifications, setQualifications] = useState(jobPost?.job_highlights?.Qualifications || [""]);

    // Sync component state when jobPost updates
    useEffect(() => {
        setQualifications(jobPost?.job_highlights?.Qualifications || [""]);
    }, [jobPost]);

    // Handle input change for a specific qualification
    const handleChange = (index, value) => {
        const newQualifications = [...qualifications];
        newQualifications[index] = value;
        
        setQualifications(newQualifications);
        
        // Update the parent state
        setJobPost(prevState => ({
            ...prevState,
            job_highlights: {
                ...prevState.job_highlights,
                Qualifications: newQualifications
            }
        }));
    };

    // Add new qualification field
    const addNewQualifications = () => {
        setQualifications([...qualifications, ""]);
    };

    // Remove qualification field
    const removeQualifications = (index) => {
        const newQualifications = qualifications.filter((_, i) => i !== index);
        setQualifications(newQualifications);
        
        // Update the parent state
        setJobPost(prevState => ({
            ...prevState,
            job_highlights: {
                ...prevState.job_highlights,
                Qualifications: newQualifications
            }
        }));
    };

    return (
        <div className="col-md-12 text-inputs d-flex flex-column mt-4">
            <div className="inputIconHead d-flex align-items-center">
                <img src={Qualification} alt="icon" className="icon" />
                <h6 className="inputTitle blue">Job Qualifications & Requirements</h6>
            </div>
            
            <h6 className="inputTitle mt-2">Qualifications</h6>

            {qualifications.map((qualification, index) => (
                <div key={index} className="d-flex align-items-center mt-2">
                    <input
                        className="simpleInputs responsibility"
                        placeholder="Enter list of Qualifications & Requirements"
                        value={qualification}
                        onChange={(e) => handleChange(index, e.target.value)}
                        name={`job_qualification_${index}`}
                    />
                    {index > 0 && (
                        <button 
                            className="removeBtn mx-2"
                            onClick={() => removeQualifications(index)}
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

            <h6 className="inputTitle mt-2">Requirements</h6>
            <textarea 
                className="simpleInputs" 
                placeholder="Add Job Requirements Here" 
                value={jobPost.job_description.requirements} 
                onChange={(e) => setRequirements(e.target.value)} 
            />

            <button 
                className="addnewline mt-2"
                onClick={addNewQualifications}
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

export default JobQualificationsSection;
