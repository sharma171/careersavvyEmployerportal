import React from 'react'

const AiJobPost = ({copyWriter,setCopyWriter,preferredTone, setPreferredTone,levelOfDetail, setLevelOfDetail,guideLines, setGuideLines}) => {
    const aiJobPost = async () => { 
        try {
            const queryObj = {
                "guidelines_for_ai": guideLines,
                "tone_selection": preferredTone,
                "level_of_detail": levelOfDetail,
                "prompt_type": "job_overview",
                // "user_email": userEmail
            };
    
            const response = await fetch("https://us-east1-foursssolutions.cloudfunctions.net/generate_job_description_v2", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(queryObj),
            });
    
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
    
            const data = await response.json();
            console.log("AI Response:", data);
    
            // setJobPost(prevState => ({
            //     ...prevState,
            //     job_title: data?.roleDetails?.title || prevState.job_title,
            //     job_employment_type: data?.roleDetails?.jobType || prevState.job_employment_type,
            //     job_description: {
            //         ...prevState.job_description,
            //         overview: data?.roleDetails?.overview || prevState.job_description.overview,
            //         requirements: data?.projectPrerequisites?.requiredSkills?.join(", ") || prevState.job_description.requirements,
            //         // compensation: data?.benefits?.compensation?.join(", ") || prevState.job_description.compensation,
            //     },
            //     job_highlights: {
            //         ...prevState.job_highlights,
            //         Responsibilities: data?.keyResponsibilities || [""],
            //         Qualifications: [
            //             ...(data?.projectPrerequisites?.mandatoryCertifications || []),
            //             ...(data?.projectPrerequisites?.preferredCertifications || []),
            //             ...(data?.desiredSkills?.technicalSkills || []),
            //             data?.desiredSkills?.experienceLevel || "",
            //             ...(data?.desiredSkills?.toolsAndPlatforms || []),
            //             ...(data?.desiredSkills?.certifications?.required || []),
            //             ...(data?.desiredSkills?.certifications?.preferred || []),
            //             data?.educationAndQualifications?.education || "",
            //             data?.educationAndQualifications?.alternativeQualifications || ""
            //         ].filter(Boolean), // Remove empty strings
            //         Benefits: [
            //             ...(data?.benefits?.compensation || []),
            //             ...(data?.benefits?.healthAndWellness || []),
            //             ...(data?.benefits?.timeOff || []),
            //             ...(data?.benefits?.professionalDevelopment || []),
            //             ...(data?.benefits?.workLifeBalance || [])
            //         ].filter(Boolean) // Remove empty strings
            //     }
            // }));
        } catch (error) {
            console.error("Error fetching AI-generated job post:", error);
        }
    };
    
  return (
    <>
        <div className={`resumeOuter resumeAi light`}>
            <div className="resumeTab AiCopywriter">
                <div className="popup-Top-Head">
                    {/* <img src={AiIcon} alt="aiicon" className="icon" /> */}
                    <h4 className="head">
                        Generate with AI
                    </h4>
                <div class="close" onClick={()=>setCopyWriter(false)}>+</div>
                </div>
                {/* <div className="info">
                    
                    <p className="instructions"><img src={InstructionIcon} alt="" className="instruction-icon" />Guidelines for AI: eg.( We need a Front-End Developer with 7 years of experience. The candidate should have expertise in UI/UX design and API integration. Benefits include a 3% 401(k) match, a $10,000 yearly bonus, and comprehensive health insurance, including dental and vision coverage.)</p>
                </div> */}
                <div className="CreateForm row">
                    <div className="col-md-12 text-inputs d-flex flex-column">
                        <h6 className="inputTitle mt-2">Guidelines for AI</h6>
                        <textarea name="" id="" className="simpleInputs" value={guideLines}
                        placeholder="Guidelines for AI: eg.( We need a Front-End Developer with 7 years of experience. The candidate should have expertise in UI/UX design and API integration. Benefits include a 3% 401(k) match, a $10,000 yearly bonus, and comprehensive health insurance, including dental and vision coverage.)"
                            onChange={(e)=>setGuideLines(e.target.value)}></textarea>
                    </div>
                    <div className="col-md-12 text-inputs d-flex flex-column mt-4">
                        <h6 className="inputTitle">Preferred Tone</h6>
                        <select
                            className="simpleInputs"
                            value={preferredTone}
                            onChange={(e) => setPreferredTone(e.target.value)}
                        >
                            <option key="" value="">Choose Preferred Tone</option>
                            <option key="Professional" value="Professional">Professional</option>
                            <option key="Conversational" value="Conversational">Conversational</option>
                            <option key="Humorous" value="Humorous">Humorous</option>
                        </select>
                    </div>
                    <div className="col-md-12 text-inputs d-flex flex-column mt-4">
                        <h6 className="inputTitle">Level of Detail</h6>
                        <select
                            className="simpleInputs"
                            value={levelOfDetail}
                            onChange={(e) => setLevelOfDetail(e.target.value)}
                        >
                            <option key="" value="">Choose Preferred Tone</option>
                            <option key="Brief" value="Brief">Brief</option>
                            <option key="Standard" value="Standard">Standard</option>
                            <option key="Detailed" value="Detailed">Detailed</option>
                            <option key="Highly Detailed" value="Highly Detailed">Highly Detailed</option>
                        </select>
                        <button className="aiGenerate" onClick={()=>{aiJobPost();setCopyWriter(false)}}>
                            Generate with AI
                        </button>
                    </div>
                    
                </div>
            </div>

        </div>
    </>
  )
}

export default AiJobPost