import React, { useState, useEffect } from "react";
import Responsibilities from "../images/Responsibilities.png";
import AiIcon from "../../Dashboard/SearchJobs/aiIcon.gif";

const JobResponsibilitiesSection = ({ jobPost, setJobPost, overview, setOverview, aiSuggestion }) => {
    // Initialize responsibilities array and update when jobPost changes
    const [responsibilities, setResponsibilities] = useState(
        jobPost?.job_highlights?.Responsibilities || [""]
    );

    // Sync responsibilities with jobPost when it updates
    useEffect(() => {
        setResponsibilities(jobPost?.job_highlights?.Responsibilities || [""]);
    }, [jobPost.job_highlights.Responsibilities]);

    // Handle input change for a specific responsibility
    const handleChange = (index, value) => {
        const newResponsibilities = [...responsibilities];
        newResponsibilities[index] = value;
        
        setResponsibilities(newResponsibilities);
        
        // Update the parent state
        setJobPost((prevState) => ({
            ...prevState,
            job_highlights: {
                ...prevState.job_highlights,
                Responsibilities: newResponsibilities
            }
        }));
    };

    // Add new responsibility field
    const addNewResponsibility = () => {
        const newResponsibilities = [...responsibilities, ""];
        setResponsibilities(newResponsibilities);
        setJobPost((prevState) => ({
            ...prevState,
            job_highlights: {
                ...prevState.job_highlights,
                Responsibilities: newResponsibilities
            }
        }));
    };

    // Remove responsibility field
    const removeResponsibility = (index) => {
        const newResponsibilities = responsibilities.filter((_, i) => i !== index);
        setResponsibilities(newResponsibilities);
        
        // Update the parent state
        setJobPost((prevState) => ({
            ...prevState,
            job_highlights: {
                ...prevState.job_highlights,
                Responsibilities: newResponsibilities
            }
        }));
    };

    return (
        <div className="col-md-12 text-inputs d-flex flex-column mt-4">
            <div className="inputIconHead d-flex align-items-center">
                <img src={Responsibilities} alt="icon" className="icon" />
                <h6 className="inputTitle green">Job Overview & Responsibilities</h6>
                <div className="aicopywriter" onClick={aiSuggestion}>
                    <img src={AiIcon} alt="ai icon" className="icon" />
                    AI Copywriter
                </div>
            </div>
            {/* <h6 className="inputTitle mt-2">Overview</h6>
            <textarea 
                className="simpleInputs" 
                placeholder="Add Job Overview here" 
                value={jobPost.job_description.overview} 
                onChange={(e) => setOverview(e.target.value)} 
            /> */}
            <h6 className="inputTitle mt-2">Responsibilities</h6>

            {responsibilities.map((responsibility, index) => (
                <div key={index} className="d-flex align-items-center mt-2">
                    <input
                        className="simpleInputs responsibility"
                        placeholder="Enter responsibility"
                        value={responsibility}
                        onChange={(e) => handleChange(index, e.target.value)}
                        name={`job_responsibility_${index}`}
                    />
                    {index > 0 && (
                        <button 
                            className="removeBtn mx-2"
                            onClick={() => removeResponsibility(index)}
                            style={{
                                border: "none",
                                background: "none",
                                cursor: "pointer",
                                padding: "4px"
                            }}
                        >
                            ❌
                        </button>
                    )}
                </div>
            ))}

            <button 
                className="addnewline mt-2"
                onClick={addNewResponsibility}
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    border: "none",
                    background: "none",
                    color: "#0051FF",
                    cursor: "pointer",
                    padding: "8px 0"
                }}
            >
                ➕ Add New Line
            </button>
        </div>
    );
};

export default JobResponsibilitiesSection;
