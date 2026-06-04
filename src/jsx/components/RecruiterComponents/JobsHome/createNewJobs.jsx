import React, { Fragment, useState, useEffect, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import InstructionIcon from "../../Dashboard/SearchJobs/instructionIcon.svg";
import "react-datepicker/dist/react-datepicker.css";
import { addDays } from "date-fns";
import { Link } from "react-router-dom";
import { ThemeContext } from "../../../../context/ThemeContext";
import "../css/jobDashboard.css?ver0.5";
import createIcons from "../images/CreateIcons.png";
import HistoryIcons from "../images/HistoryIcons.png";
import createIconsHover from "../images/IconHover.png";
import HistoryIconsHover from "../images/HistoryHover.png";
import addIcon from "../images/addIcon.png";
import celanderIcon from "../images/celanderIcon.png";
import locationIcon from "../images/locationIcon.png";
import EyeIcon from "../images/EyeIcon.png";
import jobIcon from "../images/jobIcon.png";
import JDIcon from "../images/JDIcon.png";
import JobResponsibilitiesSection from './JobResponsibilitiesSection';
import JobQualificationsSection from './QualificationsRequirements';
import JobBenefitsSection from './benefits';
import YellowEyeIcon from "../images/Yelloweye.png";
import ChooseIcon from "../images/Choose.png";
import { setJobId  } from "../../../../store/actions/actions";
import AiIcon from "../../Dashboard/SearchJobs/aiIcon.gif";
const CreateNewJobs = () => {
    const { jobId } = useSelector((state) => state.profile);
    const dispatch = useDispatch();
    const location = useLocation();
    const [aiLoader, setAiLoader] = useState(false);
    const [error, setError] = useState("");
    useEffect(() => {
            const queryParams = new URLSearchParams(location.search);
            const tokenFromUrl = queryParams.get("id");
            if (tokenFromUrl) {
                updatePost()
            }
        }, [location.search]);
    const [jobMenu, setJobMenu] = useState("");
    const [selectedJob, setSelectedJob] = useState("");
    const [overview, setOverview] = useState("");
    const [requirements, setRequirements] =useState("")
    const userEmail = useSelector(state => state.auth.auth.email);
    const navigate = useNavigate();
    const [paymentType, setPaymentType] = useState("Annually");
    const [jobPost, setJobPost] = useState({
        "employer_name": "",
        "employer_website": "",
        "employer_company_type": "",
        "employer_linkedin": "",
        "job_publisher": "",
        "job_employment_type": "",
        "job_title": "",
        "job_apply_link": "",
        "job_apply_quality_score": "",
        "job_city": "",
        "job_state": "",
        "job_country": "",
        "job_highlights": {
            "Qualifications": [""],
            "Responsibilities": [""],
            "Benefits": [""]
        },
        "job_is_remote": null,
        "job_description": {
            "overview": "",
            "requirements": "",
            "compensation": "",
            "additional_info": ""
        },
        "job_posted_by": "",
        "job_status": ""
    });

    const [errors, setErrors] = useState({
        compensation: "",
        no_of_people: "",
        startDate: "",
    });

    const validateCompensation = (value) => {
        if (paymentType === "Hourly") {
            const regex = /^\d{1,9}-\d{1,9}\/hr$/; // e.g., 30-50/hr
            return regex.test(value) ? "" : "Invalid format! Use: 30-50/hr";
        } else {
            const regex = /^\d{1,9}(,\d{3})?-\d{1,9}(,\d{3})?\/?yr?$/; // e.g., 75,000 - 90,000/yr
            return regex.test(value) ? "" : "Invalid format! Use: 75,000 - 90,000/yr";
        }
    };

    const validateNoOfPeople = (value) => {
        return value === "" || (Number(value) >= 1 && Number(value) <= 500)
            ? ""
            : "Please enter a number between 1 and 500.";
    };


    function startNew(){
        navigate("/createjobs?");
        setJobPost({
            "employer_name": "",
            "employer_website": "",
            "employer_company_type": "",
            "employer_linkedin": "",
            "job_publisher": "",
            "job_employment_type": "",
            "job_title": "",
            "job_apply_link": "",
            "job_apply_quality_score": "",
            "job_city": "",
            "job_state": "",
            "job_country": "",
            "job_highlights": {
                "Qualifications": [""],
                "Responsibilities": [""],
                "Benefits": [""]
            },
            "job_is_remote": null,
            "job_description": {
                "overview": "",
                "requirements": "",
                "compensation": "",
                "additional_info": ""
            },
            "job_posted_by": "",
            "job_status": ""
        })
    }
    

    const [createJobsPage, setCreateJobsPage] = useState("page1");
    useEffect(()=>{
        if(jobId&&userEmail!==""&&createJobsPage=="page1"&&jobMenu=="upgrade"){
            updatePost();
        }
    },[userEmail,jobId])
    const updatePost = async () => {
        setAiLoader(true);
        if (!jobId) {
            console.error("No job_id found in URL");
            return;
        }
    
        try {
            const queryObj = {
                task_name: "update",
                job_id: jobId,
                data: {
                    job_posted_by: userEmail
                }
            };
    
            const response = await fetch("https://us-east1-foursssolutions.cloudfunctions.net/save_employer_job_post_v2", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(queryObj),
            });
    
            if (!response.ok) {
                throw new Error("Failed to update job post");
            }
    
            const data = await response.json();
            // Convert the date string to a Date object if it exists
            const updatedData = {
                ...data.data[0],
                job_posted_at_datetime_utc: data.data[0].job_posted_at_datetime_utc ? 
                    new Date(data.data[0].job_posted_at_datetime_utc) : 
                    null
            };
            setJobPost(updatedData);
            setCreateJobsPage("page2");
            setJobMenu("upgrade");
            setAiLoader(false);
        } catch (error) {
            console.error("File Error:", error);
        }
    };
    
    const updateJobPost = async () => {
        setAiLoader(true);
        if (!jobId) {
            console.error("No job_id found in URL");
            return;
        }
    
        // Create an object with only the updated fields
        const updatedData = Object.fromEntries(
            Object.entries(jobPost).filter(([_, value]) => value !== "" && value !== null && value !== undefined)
        );
    
        if (Object.keys(updatedData).length === 0) {
            console.error("No fields to update");
            return;
        }
    
        try {
            const queryObj = {
                task_name: "update",
                job_id: jobId, // Use extracted job_id
                data: updatedData, // Only updated fields
            };
    
            const response = await fetch("https://us-east1-foursssolutions.cloudfunctions.net/save_employer_job_post_v2", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(queryObj),
            });
    
            if (!response.ok) {
                throw new Error("Failed to update job post");
            }
    
            const data = await response.json();
            setAiLoader(true)
            setJobPost(data.data[0]); // Update local state with the response
            alert("Job updated successfully");

            setCreateJobsPage("page1"); // Navigate to the next page
            navigate("/createjobs?");
            
        } catch (error) {
            console.error("File Error:", error);
        }
    };
    
    const [areaPincode, setAreaPincode] = useState("")
    useEffect(() => {
        if (areaPincode.length > 4) {
            pinCodeFetch();
        }
    }, [areaPincode]);
    const [compensation, setCompensation] = useState("")
    useEffect(()=>{
        setJobPost(prevState => ({
            ...prevState,
            job_is_remote: selectedJob === "Remote"
        }));
        setJobPost(prevState => ({
        ...prevState,
        job_status: "open"
    }));
    setJobPost(prevState => ({
        ...prevState,
        job_posted_by: `${userEmail}`
    }));
    },[selectedJob]);
    useEffect(()=>{
        setJobPost(prevState => ({
        ...prevState,
        job_description: {
            ...prevState.job_description,
            compensation: `${compensation}` // Change this to your desired value
        }
    }));
    },[compensation]);
    useEffect(()=>{
        setJobPost(prevState => ({
        ...prevState,
        job_description: {
            ...prevState.job_description,
            overview: `${overview}` // Change this to your desired value
        }
    }));
        setJobPost(prevState => ({
        ...prevState,
        job_description: {
            ...prevState.job_description,
            requirements: `${requirements}` // Change this to your desired value
        }
    }));
    },[overview, requirements]);
    const pinCodeFetch = async () => {
        try {
        const queryObj = {
            "zip_code": areaPincode
          };
    
        const response = await fetch("https://us-central1-foursssolutions.cloudfunctions.net/retrieve_location_details_v2", {
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
        setJobPost(prevState => ({
            ...prevState,
            job_city: data.data?.city
        }));
        setJobPost(prevState => ({
            ...prevState,
            job_country: data.data?.country
        }));
        setJobPost(prevState => ({
            ...prevState,
            job_state: data.data?.state
        }));
        
        } catch (error) {
        console.error("File Error:", error);
        }
    };
    const [copyWriter,setCopyWriter] = useState(false);
    const [preferredTone, setPreferredTone] = useState("");
    const [levelOfDetail, setLevelOfDetail] = useState("");
    const [guideLines, setGuideLines] = useState("");
    function aiSuggestion(){
        setCopyWriter(true);
    }
    function CreateJobPost(){
        
        CreateNewPost();
    }

    const aiJobPost = async () => { 
        setAiLoader(true);
        try {
            const queryObj = {
                "guidelines_for_ai": guideLines,
                "tone_selection": preferredTone,
                "level_of_detail": levelOfDetail,
                "prompt_type": "job_overview",
                "user_email": userEmail
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
    
            setJobPost(prevState => ({
                ...prevState,
                job_title: data?.roleDetails?.title || prevState.job_title,
                job_employment_type: data?.roleDetails?.jobType || prevState.job_employment_type,
                job_description: {
                    ...prevState.job_description,
                    overview: data?.roleDetails?.overview || prevState.job_description.overview,
                    requirements: data?.projectPrerequisites?.requiredSkills?.join(", ") || prevState.job_description.requirements,
                    // compensation: data?.benefits?.compensation?.join(", ") || prevState.job_description.compensation,
                },
                job_highlights: {
                    ...prevState.job_highlights,
                    Responsibilities: data?.keyResponsibilities || [""],
                    Qualifications: [
                        ...(data?.projectPrerequisites?.mandatoryCertifications || []),
                        ...(data?.projectPrerequisites?.preferredCertifications || []),
                        ...(data?.desiredSkills?.technicalSkills || []),
                        data?.desiredSkills?.experienceLevel || "",
                        ...(data?.desiredSkills?.toolsAndPlatforms || []),
                        ...(data?.desiredSkills?.certifications?.required || []),
                        ...(data?.desiredSkills?.certifications?.preferred || []),
                        data?.educationAndQualifications?.education || "",
                        data?.educationAndQualifications?.alternativeQualifications || ""
                    ].filter(Boolean), // Remove empty strings
                    Benefits: [
                        ...(data?.benefits?.compensation || []),
                        ...(data?.benefits?.healthAndWellness || []),
                        ...(data?.benefits?.timeOff || []),
                        ...(data?.benefits?.professionalDevelopment || []),
                        ...(data?.benefits?.workLifeBalance || [])
                    ].filter(Boolean) // Remove empty strings
                }
            }));
            setAiLoader(false);
        } catch (error) {
            console.error("Error fetching AI-generated job post:", error);
        }
    };
    
    const CreateNewPost = async () => {
        setAiLoader(true);
        
        try {
            const queryObj =  {
                "task_name": "create",
                "data": {
                    "employer_name": jobPost.employer_name || "",
                    "employer_website": jobPost.employer_website || "",
                    "employer_company_type": jobPost.employer_company_type || "",
                    "employer_linkedin": jobPost.employer_linkedin || "",
                    "job_publisher": jobPost.job_publisher || "Internal",
                    "job_employment_type": jobPost.job_employment_type === "Full TimeOnsite" ? "Full-time" : jobPost.job_employment_type || "",
                    "job_title": jobPost.job_title || "",
                    "job_apply_link": jobPost.job_apply_link || "",
                    "job_apply_quality_score": jobPost.job_apply_quality_score || 0.95, // Ensure it's a number
                    "job_city": jobPost.job_city || "",
                    "job_state": jobPost.job_state || "",
                    "job_country": jobPost.job_country || "",
                    "job_highlights": {
                        "Qualifications": Array.isArray(jobPost.job_highlights?.Qualifications) ? jobPost.job_highlights.Qualifications : [""],
                        "Responsibilities": Array.isArray(jobPost.job_highlights?.Responsibilities) ? jobPost.job_highlights.Responsibilities : [""],
                        "Benefits": Array.isArray(jobPost.job_highlights?.Benefits) ? jobPost.job_highlights.Benefits : [""]
                    },
                    "job_is_remote": jobPost.job_is_remote ?? false, // Ensure it's a boolean
                    "job_description": {
                        "overview": jobPost.job_description?.overview || "",
                        "requirements": jobPost.job_description?.requirements || "",
                        "compensation": jobPost.job_description?.compensation || "",
                        "additional_info": jobPost.job_description?.additional_info || ""
                    },
                    "job_posted_by": jobPost.job_posted_by || userEmail,
                    "job_status": jobPost.job_status || "active"
                }
            };
    
            const response = await fetch("https://us-east1-foursssolutions.cloudfunctions.net/save_employer_job_post_v2", {
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
            setAiLoader(false);
            alert("Job Created Successfully");
            setCreateJobsPage("page1");
            setJobMenu("create");
            console.log(data);
    
        } catch (error) {
            console.error("File Error:", error);
        }
    };
    


    // Handle Input Change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setJobPost((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };
    
    const [ jobsData, setJobsData ] = useState([]);
        useEffect(()=>{
            if(userEmail!==""){
                retrieveJobPost();
            }
        },[userEmail]);
    const retrieveJobPost = async () => {
        setAiLoader(true);
        try {
        const queryObj = {
            "task_name": "retrieve",
            "job_posted_by": userEmail
        };
    
        const response = await fetch("https://us-east1-foursssolutions.cloudfunctions.net/save_employer_job_post_v2", {
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
        setAiLoader(false);
        setJobsData(data.data)
        } catch (error) {
        console.error("File Error:", error);
        }
    };
    useEffect(()=>{
        console.log(jobPost);
    },[jobPost])
  return (
    <>
    <Fragment>
        <div className="createJobs row"> 
            {createJobsPage=="page1"&&(
                <>
                    <div className="col-md-6">
                        <div className={`jobsMenu ${jobMenu=="create"?"active":""}`} onClick={()=>{setJobMenu("create");startNew()}}>
                            <div className="Icons">
                                <img src={createIcons} alt="icons" className="iconformenu"/>
                                <img src={createIconsHover} alt="icons" className="IconHover"/>
                            </div>
                            <h3 className="head">Launch Fresh Career Opportunities</h3>
                            <p className="para">Draft and publish a detailed job posting to attract<br></br> suitable candidates.</p>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className={`jobsMenu ${jobMenu=="upgrade"?"active":""}`} onClick={()=>setJobMenu("upgrade")}>
                            <div className="Icons">
                                <img src={HistoryIcons} alt="" className="iconformenu"/>
                                <img src={HistoryIconsHover} alt="" className="IconHover"/>
                            </div>
                            <h3 className="head">Update Your Existing Job Posts</h3>
                            <p className="para">Revise and enhance your current job postings<br></br> to attract potential candidates.</p>
                        </div>
                    </div>
                    {jobMenu=="create"&&(
                        <>
                            <div className="col-md-12">
                                <div className="dashJobList">
                                    <div className="topHead">
                                        <div className="head">
                                            <img src={addIcon} alt="addIcon" className="icon" />
                                            Add Basic Details
                                        </div>
                                    </div>
                                    <div className="f-w-divider"></div>
                                    <div className="CreateForm row">
                                        <div className="col-md-6 text-inputs d-flex">
                                            <h6 className="inputTitle">Job Title</h6>
                                            <input
                                                type="text"
                                                name="job_title"
                                                value={jobPost.job_title}
                                                onChange={handleInputChange}
                                                className="simpleInputs"
                                                placeholder="Enter Job Title"
                                            />
                                        </div>
                                        <div className="col-md-6 text-inputs d-flex flex-column">
                                            <h6 className="inputTitle">Job Location</h6>
                                            <div className="d-flex radio-row">
                                                <label className={`radio-button ${selectedJob === "Remote" ? "selected" : ""}`}>
                                                <span className="radio-circle">
                                                    <input
                                                        type="radio"
                                                        name="jobLocation"
                                                        value="Remote"
                                                        checked={selectedJob === "Remote"}
                                                        onChange={() => setSelectedJob("Remote")}
                                                        className="hidden"
                                                    />
                                                </span>
                                                <span className="radio-text">Remote</span>
                                                </label>

                                                <label className={`radio-button ${selectedJob === "Onsite" ? "selected" : ""}`}>
                                                <span className="radio-circle">
                                                <input
                                                    type="radio"
                                                    name="jobLocation"
                                                    value="Onsite"
                                                    checked={selectedJob === "Onsite"}
                                                    onChange={() => setSelectedJob("Onsite")}
                                                    className="hidden"
                                                />
                                                </span>
                                                <span className="radio-text">Onsite</span>
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-md-6 text-inputs d-flex mt-4">
                                            <h6 className="inputTitle">Pin Code</h6>
                                            <input 
                                                type="text" 
                                                className="simpleInputs" 
                                                placeholder="Enter Your Area Pincode" 
                                                onChange={(e) => setAreaPincode(e.target.value)} 
                                            />
                                        </div>

                                        <div className="col-md-3 text-inputs d-flex mt-4">
                                            <h6 className="inputTitle">City</h6>
                                            <input
                                                type="text"
                                                name="job_city"
                                                value={jobPost.job_city}
                                                onChange={handleInputChange}
                                                className="simpleInputs"
                                                placeholder="Enter Your City"
                                            />
                                        </div>
                                        <div className="col-md-3 text-inputs d-flex mt-4">
                                            <h6 className="inputTitle">State</h6>
                                            <input
                                                type="text"
                                                name="job_state"
                                                value={jobPost.job_state}
                                                onChange={handleInputChange}
                                                className="simpleInputs"
                                                placeholder="Enter Your State"
                                            />
                                        </div>
                                        <div className="col-md-6 text-inputs d-flex mt-4">
                                                <h6 className="inputTitle">Country</h6>
                                                <input
                                                    type="text"
                                                    name="job_country"
                                                    value={jobPost.job_country}
                                                    onChange={handleInputChange}
                                                    className="simpleInputs"
                                                    placeholder="Enter Your Country"
                                                />
                                            </div>
                                            <div className="col-md-3 text-inputs d-flex mt-4">
                                                <h6 className="inputTitle">Company Name</h6>
                                                <input
                                                    type="text"
                                                    name="employer_name"
                                                    value={jobPost.employer_name}
                                                    onChange={handleInputChange}
                                                    className="simpleInputs"
                                                    placeholder="Enter Your Company"
                                                />
                                            </div>
                                            <div className="col-md-3 text-inputs d-flex mt-4">
                                                <h6 className="inputTitle">Job Type</h6>
                                                <select
                                                    className="simpleInputs"
                                                    name="job_employment_type"
                                                    value={jobPost.job_employment_type}
                                                    placeholder="Choose Job Type"
                                                    onChange={handleInputChange}
                                                >
                                                    <option value="">Choose Role</option>
                                                    <option key="Full Time" value="Full Time">Full Time</option>
                                                    <option key="Part Time" value="Part Time">Part Time</option>
                                                    <option key="Internship" value="Internship">Internship</option>
                                                    <option key="Contract" value="Contract">Contract</option>
                                                </select>

                                            </div>
                                        <div className="col-md-12">
                                            <div className="navigations">
                                                <button className="continue" onClick={()=>setCreateJobsPage("page2")}>
                                                    Continue
                                                    <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M1 6.15C0.530558 6.15 0.15 6.53056 0.15 7C0.15 7.46944 0.530558 7.85 1 7.85L1 6.15ZM14.601 7.60104C14.933 7.26909 14.933 6.7309 14.601 6.39896L9.19167 0.989591C8.85973 0.657646 8.32154 0.657646 7.98959 0.989591C7.65765 1.32154 7.65765 1.85973 7.98959 2.19167L12.7979 7L7.98959 11.8083C7.65765 12.1403 7.65765 12.6785 7.98959 13.0104C8.32154 13.3424 8.85973 13.3424 9.19167 13.0104L14.601 7.60104ZM1 7.85L14 7.85L14 6.15L1 6.15L1 7.85Z" fill="#0051FF"/>
                                                    </svg>
                        
                                                </button>
                                            </div>
                                            
                                        </div>
                                        
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                    {jobMenu=="upgrade"&&(
                        <>
                            <div className="col-md-12">
                                <div className="dashJobList">
                                    <div className="topHead">
                                        <div className="head">
                                            <img src={ChooseIcon} alt="addIcon" className="icon" />
                                            Add Job details
                                        </div>
                                    </div>
                                    <div className="jobList">
                                        {jobsData.map((item, index) => (
                                            <div key={index}>
                                                <div className="item">
                                                    <div className="jobRow">
                                                        <div className="Micon">CI</div>
                                                        <div className="compTitle">
                                                            <h4 className="compName">{item.employer_name}</h4>
                                                            <h3 className="mHead">{item.job_title}</h3>
                                                        </div>
                                                    </div>
                                                    <div className="jobInfo">
                                                        <div className="colorTags">
                                                            <div className="tags">
                                                                {item.job_is_remote ? "Remote" : "Onsite"}
                                                            </div>
                                                            <div className="tags">
                                                                {item.job_employment_type}
                                                            </div>
                                                            <div className="tags">
                                                                {item.job_description?.compensation || "N/A"}
                                                            </div>
                                                        </div>
                                                        <div className="infoGraph">
                                                            <div className="info">
                                                                <img src={celanderIcon} alt="Calendar" className="icon" />
                                                                {new Date(item.job_posted_at_datetime_utc).toLocaleDateString('en-US')}
                                                            </div>
                                                            <div className="info">
                                                                <img src={locationIcon} alt="Location" className="icon" />
                                                                {(item.job_city || "Unknown City")}, {(item.job_state || "Unknown State")}, {(item.job_country || "Unknown Country")}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="actionButton">
                                                        <button className="applybutton" onClick={() => dispatch(setJobId(item.job_id))}>
                                                            Upgrade
                                                        </button>
                                                        <button className="applybutton yellow" onClick={()=>{dispatch(setJobId(item.job_id)); navigate("/overviewPage")}} style={{marginLeft:"12px"}}>
                                                            Overview
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="f-w-divider"></div>
                                            </div>
                                        ))}

                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </>
            )}
            {createJobsPage=="page2"&&(
                <>
                    <div className="col-md-12">
                        <div className="dashJobList">
                            <div className="topHead live">
                                <div className="head centerAlign">
                                    <img src={EyeIcon} alt="addIcon" className="icon" />
                                    Live Post View
                                </div>
                            </div>
                             <div className="jobList">
                                    <div className="item">
                                        <div className="jobRow">
                                            <div className="Micon">
                                                CI
                                            </div>
                                            <div className="compTitle">
                                                <h4 className="compName">{jobPost?.employer_name}</h4>
                                                <h3 className="mHead">{jobPost?.job_title}</h3>
                                            </div>
                                        </div>
                                        <div className="jobInfo">
                                            <div className="colorTags">
                                                <div className="tags">
                                                    {jobPost?.job_is_remote ? "Remote" : "Onsite"}
                                                </div>
                                                <div className="tags">
                                                    {jobPost?.job_employment_type}
                                                </div>
                                                <div className="tags">
                                                    {jobPost?.job_description.compensation}
                                                </div>
                                            </div>
                                            <div className="infoGraph">
                                                <div className="info">
                                                    <img src={celanderIcon} alt="" className="icon" />
                                                    {new Date(jobPost?.job_posted_at_datetime_utc).toLocaleDateString('en-US')}
                                                </div>
                                                <div className="info">
                                                    <img src={locationIcon} alt="" className="icon" />
                                                    {jobPost?.job_city}, {jobPost?.job_state}, {jobPost?.job_country}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="actionButton">
                                            <button className="applybutton yellow" onClick={()=>{navigate("/dashboard")}}>
                                                <img src={YellowEyeIcon} alt="addIcon" className="icon" />
                                                Overview
                                            </button>
                                        </div>
                                    </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-12">
                        <div className="dashJobList">
                            <div className="topHead">
                                <div className="head">
                                    <img src={jobIcon} alt="addIcon" className="icon" />
                                    Add Job details
                                </div>
                            </div>
                            <div className="f-w-divider"></div>
                            <div className="CreateForm row">
                                <div className="col-md-3 text-inputs d-flex flex-column">
                                    <h6 className="inputTitle">Payment Type</h6>
                                    <select
                                        className="simpleInputs"
                                        value={paymentType}
                                        onChange={(e) => setPaymentType(e.target.value)}
                                    >
                                        <option key="Hourly" value="Hourly">Hourly</option>
                                        <option key="Annually" value="Annually">Annually</option>
                                    </select>
                                </div>

                                {/* Payment Range */}
                                <div className="col-md-3 text-inputs d-flex flex-column">
                                    <h6 className="inputTitle">Payment Range</h6>
                                    <input
                                        className="simpleInputs"
                                        placeholder={
                                            paymentType === "Hourly"
                                                ? "Enter rate per hour (e.g., 30-50/hr)"
                                                : "Enter salary range (e.g., 75,000 - 90,000)"
                                        }
                                        value={jobPost.job_description.compensation}
                                        onChange={(e) => {
                                            setJobPost({
                                                ...jobPost,
                                                job_description: { compensation: e.target.value },
                                            });
                                        }}
                                        onBlur={(e) => {
                                            const error = validateCompensation(e.target.value);
                                            setErrors({ ...errors, compensation: error });
                                        }}
                                    />
                                    {errors.compensation && <span className="text-danger">{errors.compensation}</span>}
                                </div>

                                {/* No. of People to be Hired */}
                                <div className="col-md-3 text-inputs d-flex flex-column">
                                    <h6 className="inputTitle">No. of People to be Hired</h6>
                                    <input
                                        type="number"
                                        className="simpleInputs"
                                        placeholder="Enter number of hires (e.g., 5)"
                                        value={jobPost.no_of_people}
                                        onChange={(e) => {
                                            setJobPost({ ...jobPost, no_of_people: e.target.value });
                                        }}
                                        onBlur={(e) => {
                                            const error = validateNoOfPeople(e.target.value);
                                            setErrors({ ...errors, no_of_people: error });
                                        }}
                                        min="1"
                                        max="500"
                                    />
                                    {errors.no_of_people && <span className="text-danger">{errors.no_of_people}</span>}
                                </div>

                                {/* Expected Start Date */}
                                <div className="col-md-3 text-inputs d-flex flex-column">
                                    <h6 className="inputTitle">Expected Start Date</h6>
                                    <DatePicker
                                        selected={jobPost.job_posted_at_datetime_utc ? new Date(jobPost.job_posted_at_datetime_utc) : null}
                                        onChange={(date) => {
                                            if (!date) {
                                                setErrors({ ...errors, startDate: "Please select a valid date" });
                                            } else {
                                                setErrors({ ...errors, startDate: "" });
                                                setJobPost(prevState => ({
                                                    ...prevState,
                                                    job_posted_at_datetime_utc: date
                                                }));
                                            }
                                        }}
                                        minDate={new Date()}
                                        placeholderText="Select Expected Start Date"
                                        className="simpleInputs"
                                        dateFormat="yyyy-MM-dd"
                                        isClearable
                                    />
                                    {errors.startDate && <span className="text-danger">{errors.startDate}</span>}
                                </div>

                                <div className="col-md-12 text-inputs d-flex mt-4">
                                    <div className="inputIconHead">
                                        <h6 className="inputTitle">Apply Link</h6>
                                    </div>
                                    <input name="job_apply_link" id="" className="simpleInputs" placeholder="Add Apply Link Here" onChange={handleInputChange} />
                                </div>
                               

                                {/* Replace the existing responsibilities section with this */}
                                <JobResponsibilitiesSection 
                                    jobPost={jobPost}
                                    setJobPost={setJobPost}
                                    overview={overview}
                                    setOverview={setOverview}
                                    aiSuggestion={aiSuggestion}
                                />
                                {/* Replace the existing responsibilities section with this */}
                                <JobQualificationsSection 
                                    jobPost={jobPost}
                                    setJobPost={setJobPost}
                                    requirements={requirements}
                                    setRequirements={setRequirements}
                                />
                                {/* Replace the existing responsibilities section with this */}
                                <JobBenefitsSection 
                                    jobPost={jobPost}
                                    setJobPost={setJobPost}
                                />
                                <div className="col-md-12 text-inputs d-flex mt-4">
                                    <h6 className="inputTitle mt-2">Additional Comments (Optional)</h6>
                                    <textarea 
                                        className="simpleInputs" 
                                        name="job_comments"
                                        placeholder={`Enter any special instructions or job restrictions (e.g., "Looking for only GC/US Citizens" or "Security clearance required").`}
                                        value={jobPost.job_comments} 
                                        onChange={handleInputChange} 
                                    />
                                </div>

                                
                                
                                
                                <div className="col-md-12">
                                    <div className="navigations">
                                        {jobMenu=="upgrade"?(<>
                                            <button className="continue" onClick={()=>{setCreateJobsPage("page1")}} style={{marginLeft:"0"}}>
                                            <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg" style={{rotate:"180deg"}}>
                                                <path d="M1 6.15C0.530558 6.15 0.15 6.53056 0.15 7C0.15 7.46944 0.530558 7.85 1 7.85L1 6.15ZM14.601 7.60104C14.933 7.26909 14.933 6.7309 14.601 6.39896L9.19167 0.989591C8.85973 0.657646 8.32154 0.657646 7.98959 0.989591C7.65765 1.32154 7.65765 1.85973 7.98959 2.19167L12.7979 7L7.98959 11.8083C7.65765 12.1403 7.65765 12.6785 7.98959 13.0104C8.32154 13.3424 8.85973 13.3424 9.19167 13.0104L14.601 7.60104ZM1 7.85L14 7.85L14 6.15L1 6.15L1 7.85Z" fill="#0051FF"/>
                                            </svg>
                                            Go Back
                                        </button>
                                            </>):(<>
                                                <button className="continue" onClick={()=>{setCreateJobsPage("page1");setJobMenu("create")}} style={{marginLeft:"0"}}>
                                            <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg" style={{rotate:"180deg"}}>
                                                <path d="M1 6.15C0.530558 6.15 0.15 6.53056 0.15 7C0.15 7.46944 0.530558 7.85 1 7.85L1 6.15ZM14.601 7.60104C14.933 7.26909 14.933 6.7309 14.601 6.39896L9.19167 0.989591C8.85973 0.657646 8.32154 0.657646 7.98959 0.989591C7.65765 1.32154 7.65765 1.85973 7.98959 2.19167L12.7979 7L7.98959 11.8083C7.65765 12.1403 7.65765 12.6785 7.98959 13.0104C8.32154 13.3424 8.85973 13.3424 9.19167 13.0104L14.601 7.60104ZM1 7.85L14 7.85L14 6.15L1 6.15L1 7.85Z" fill="#0051FF"/>
                                            </svg>
                                            Go Back
                                        </button></>)}
                                        
                                        {jobMenu=="upgrade"?(<>
                                        <button className="continue" onClick={updateJobPost}>
                                            <img src={EyeIcon} alt="eye" className="icon" />
                                            Update Jobs Post
                                        </button>
                                        </>):(<>
                                            <button className="continue" onClick={CreateJobPost}>
                                            <img src={EyeIcon} alt="eye" className="icon" />
                                            Submit Job Post
                                        </button></>)}
                                        
                                    </div>
                                    
                                </div>
                                
                            </div>
                        </div>
                    </div>
                    {copyWriter&&(
                        <>
                        <div className={`resumeOuter resumeAi light`}>
                        <div className="resumeTab AiCopywriter">
                            <div className="popup-Top-Head">
                                <img src={AiIcon} alt="aiicon" className="icon" />
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
                    )}
                    
                </>
            )}
            
            {aiLoader&&(
                <>
                <div className="LoaderAnimation">
                    <div className="gptAnimate"></div>
                    <img className="gptIcon" src={AiIcon} alt="gptIcon"/>
                </div> 
                </>
            )}
            
        </div>
    </Fragment>
    </>
  )
}
export default CreateNewJobs;
