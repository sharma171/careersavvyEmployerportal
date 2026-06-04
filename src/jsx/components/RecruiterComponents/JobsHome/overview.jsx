import React, { Fragment, useState, useEffect, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setOverviewPost  } from "../../../../store/actions/actions";
import "../css/jobDashboard.css?ver0.7";
import celanderIcon from "../images/celanderIcon.png";
import locationIcon from "../images/locationIcon.png";
import Responsibilities from "../images/Responsibilities.png";
import Qualification from "../images/Qualication.png";
import Benefits from "../images/Benefits.png";
import DropDownIcon from "../images/dropDownIcon.png";
import { setJobId  } from "../../../../store/actions/actions";
import EyeIcon from "../images/EyeIcon.png";
import genderIcon from "../images/genderIcon.png";
import DownloadIcon from "../images/downnliadIcon.png";
import AiAnalysisIcon from "../images/aibutton.png"
import CandidateAIAnalysis from "./CandidateAIAnalysis";
import AiIcon from "../../Dashboard/SearchJobs/aiIcon.gif";

const OverviewPage = () =>{
    const { jobId, overviewPost } = useSelector((state) => state.profile);
    const dispatch = useDispatch();
    const location = useLocation();
    const [aiLoader, setAiLoader] = useState(false);
    const [candidate, setCandidate] = useState(false);
    const [candidateList, setCandidateList] = useState([]);
    const [aiAnalysis, setAiAnalysis] = useState(false);
    const [candidateMail, setCanndidateMail] = useState("");
    const [candidateAi, setCanndidateAi] = useState([]);
    const [base64Pdf, setBase64Pdf] = useState(""); 
     useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const tokenFromUrl = queryParams.get("candidateList");
        if (tokenFromUrl) {
            setCandidate(true);
            CandidatesList();
        }
    }, [location.search]);
    const userEmail = useSelector(state => state.auth.auth.email);
    const navigate = useNavigate();
    const [openSections, setOpenSections] = useState({
        responsibilities: true,
        qualifications: false,
        benefits: false,
    });

    const toggleSection = (section) => {
        setOpenSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };
    useEffect(()=>{

        retrieveJobPost();
        if(jobId&&userEmail!==""){
        }
    },[userEmail,jobId])
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

    
    const retrieveJobPost = async () => {
        setAiLoader(true);
        
        try {
        const queryObj = {
            "task_name": "retrieve",
            "job_posted_by": userEmail,
            "job_id": jobId
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
        setJobPost(data.data[0]);
        setAiLoader(false);
        } catch (error) {
        console.error("File Error:", error);
        }
    };
    
    const CandidatesList = async () => {
        setAiLoader(true);
        
        try {
        const queryObj = {
            "job_id":"0BTgvyr3i5s76MgOi5UxnA==",
            "task":"basic"
        };
    
        const response = await fetch("https://candidate-details-applied-for-job-id-v2-980069659423.us-east1.run.app", {
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
        setCandidateList(data.data.candidates);
        
        setCanndidateMail(candidateList[0].email);
        setAiLoader(false)
        } catch (error) {
        console.error("File Error:", error);
        }
    };
    function candidatefn(item) {
        
        setCanndidateMail(displayedCandidates[item].email);
        console.log(item);
        
    
        // Wait for the state update to take effect
        setTimeout(() => {
            if (item) {  // Ensure candidateMail is not empty
                candidateDetails();
            }
        }, 600); // 300ms delay (adjust as needed)
    }
    const candidateDetails = async () => {
        setAiLoader(true);
        try {
        const queryObj = {
            "job_id":"0BTgvyr3i5s76MgOi5UxnA==",
            "task":"advanced",
            // candidate_email: candidateMail !== "" ? candidateMail : userEmail,
            candidate_email: candidateMail,
        };
    
        const response = await fetch("https://candidate-details-applied-for-job-id-v2-980069659423.us-east1.run.app", {
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
        setAiAnalysis(true);
        setCanndidateAi(data.data);
        setAiLoader(false);
        console.log(data);
        } catch (error) {
            setAiLoader(false);
        console.error("File Error:", error);
        }
    };
    const [sortedBy, setSortedBy] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const candidatesPerPage = 5;

    const sortCandidates = (criteria) => {
        let sortedList = [...candidateList];
        switch (criteria) {
            case "name":
                sortedList.sort((a, b) => a.first_name.localeCompare(b.first_name));
                break;
            case "email":
                sortedList.sort((a, b) => a.email.localeCompare(b.email));
                break;
            case "match_score":
                sortedList.sort((a, b) => b.resume_match_score - a.resume_match_score);
                break;
            case "experience":
                sortedList.sort((a, b) => b.years_of_experience - a.years_of_experience);
                break;
            default:
                break;
        }
        setSortedBy(criteria);
        setCandidateList(sortedList);
    };
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(now.getDate()).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const currentDateTime = `${month}-${day}-${year}_${hours}-${minutes}-${seconds}`;
    const resumeDownload = async () => {
        setAiLoader(true);
        try {
        const queryObj = {
            "job_id":"0BTgvyr3i5s76MgOi5UxnA==",
            "task":"advanced",
            candidate_email: candidateMail
        };
    
        const response = await fetch("https://candidate-details-applied-for-job-id-v2-980069659423.us-east1.run.app", {
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
        setBase64Pdf(data.data.resume);
        setAiLoader(false);
        console.log(data);
        DownloadPdf();
        } catch (error) {
            setAiLoader(false);
        console.error("File Error:", error);
        }
    };
     // Function to download PDF
    const DownloadPdf = () => {
        if (!base64Pdf) {
        alert("No PDF data available!");
        return;
        }
    
        // Convert Base64 to Blob
        const byteCharacters = atob(base64Pdf);
        const byteNumbers = Array.from(byteCharacters).map((char) => char.charCodeAt(0));
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "application/pdf" });
    
        // Create a link and trigger download
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${"resume".replace(".docx", "")}_${currentDateTime}.pdf`;
        link.click();
    
        // Clean up
        URL.revokeObjectURL(link.href);
    };

    const handlePageChange = (direction) => {
        if (direction === "next" && currentPage * candidatesPerPage < candidateList.length) {
            setCurrentPage(currentPage + 1);
        } else if (direction === "prev" && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const displayedCandidates = (Array.isArray(candidateList) ? candidateList : []).slice(
        (currentPage - 1) * candidatesPerPage,
        currentPage * candidatesPerPage
    );    
    return(
        <>
            <Fragment>
                {candidate?(
                    <>
                    <div className="JobOverview row">
                        <div className="col-md-12">
                            <div className="dashJobList">
                                <div className="topHead live">
                                    <div className="head centerAlign">
                                        <img src={EyeIcon} alt="addIcon" className="icon" />
                                        Job Detailed Overview
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
                                                    {jobPost?.job_description?.compensation}
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
                                            <button className="applybutton yellow" onClick={()=>{dispatch(setJobId(jobPost.job_id));navigate(`/createjobs?id=${jobPost.job_id}`)}}>
                                                Edit Post
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                            </div>
                            <div className="candidateList">
                                <div className="tableHead">
                                    <select className="Dropdown" onChange={(e) => sortCandidates(e.target.value)}>
                                        <option value="">Sort by : unset</option>
                                        <option value="name">Sort by: Name</option>
                                        <option value="email">Sort by: Email</option>
                                        <option value="match_score">Sort by: Match Score</option>
                                        <option value="experience">Sort by: Experience</option>
                                    </select>
                                    <div className="row-flex pageNavigate">
                                        <button className="leftNav" onClick={() => handlePageChange("prev")} disabled={currentPage === 1}>
                                            {`<`}
                                        </button>
                                        <div className="currentpage">Page: {currentPage}</div>
                                        <button className="rightNav" onClick={() => handlePageChange("next")} disabled={currentPage * candidatesPerPage >= candidateList.length}>
                                            {`>`}
                                        </button>
                                    </div>
                                </div>
                                <div className="CandidateTable">
                                    <div className="th-row">
                                            <span className="th">Full Name</span>
                                            <span className="th">Email</span>
                                            <span className="th">Phone</span>
                                            <span className="th">Match Score</span>
                                            <span className="th">Experience</span>
                                    </div>
                                    {displayedCandidates?.map((item,index) => (
                                        <div className="td-row" >
                                            <div className="td"><img src={genderIcon} alt="userIcon" style={{width:"28px",marginRight:"5px"}} className="userIcon" />{item.first_name} {item?.last_name}</div>
                                            <div className="td">{item?.email}</div>
                                            <div className="td">{item?.phone}</div>
                                            <div className="td">{item?.resume_match_score}</div>
                                            <div className="td">{item?.years_of_experience}</div>
                                            <div className="optionButton">
                                                <div className="buttons" onClick={resumeDownload}>
                                                    <img src={DownloadIcon} alt="icon" className="icon" />
                                                    Download Resume
                                                </div>
                                                <div className="divider"></div>
                                                <div className="buttons" onClick={()=>{candidatefn(index)}}>
                                                <img src={AiAnalysisIcon} alt="icon" className="icon" />
                                                        AI Analysis
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="overviewInfo list">
                                {/* Responsibilities Section */}
                                <div className="inputIconHead d-flex align-items-center" onClick={() => toggleSection("responsibilities")}
                                    style={{ cursor: "pointer" }}>
                                    <img src={Responsibilities} alt="icon" className="icon" />
                                    <h6 className="inputTitle green">Job Overview & Responsibilities</h6>
                                    <img 
                                        src={DropDownIcon} 
                                        alt="toggle" 
                                        className={`toggle-icon ${openSections?.responsibilities ? "open" : "closed"}`} 
                                        style={{ width: "30px", height: "30px", marginLeft:"auto", transform: openSections.responsibilities ? "rotate(180deg)" : "rotate(0deg)" }}
                                    />
                                </div>
                                {openSections.responsibilities && (
                                    <ul className="listing">
                                        {jobPost?.job_highlights?.Responsibilities?.map((item, index) => (
                                            <li key={index}>{item}</li>
                                        ))}
                                    </ul>
                                )}

                                {/* Qualifications Section */}
                                <div className="inputIconHead d-flex align-items-center mt-3" onClick={() => toggleSection("qualifications")}
                                    style={{ cursor: "pointer" }}>
                                    <img src={Qualification} alt="icon" className="icon" />
                                    <h6 className="inputTitle blue">Job Qualifications & Requirements</h6>
                                    <img 
                                        src={DropDownIcon} 
                                        alt="toggle" 
                                        className={`toggle-icon ${openSections.qualifications ? "open" : "closed"}`} 
                                        style={{ width: "30px", height: "30px", marginLeft:"auto", transform: openSections.qualifications ? "rotate(180deg)" : "rotate(0deg)" }}
                                    />
                                </div>
                                {openSections.qualifications && (
                                    <ul className="listing">
                                        {jobPost.job_highlights.Qualifications.map((item, index) => (
                                            <li key={index}>{item}</li>
                                        ))}
                                        <li>{jobPost?.job_description.requirements}</li>
                                    </ul>
                                )}

                                {/* Benefits Section */}
                                <div className="inputIconHead d-flex align-items-center mt-3" onClick={() => toggleSection("benefits")}
                                    style={{ cursor: "pointer" }}>
                                    <img src={Benefits} alt="icon" className="icon" />
                                    <h6 className="inputTitle voilet">Job Benefits & Perks</h6>
                                    <img 
                                        src={DropDownIcon} 
                                        alt="toggle" 
                                        className={`toggle-icon ${openSections.benefits ? "open" : "closed"}`} 
                                        style={{ width: "30px", height: "30px", marginLeft:"auto", transform: openSections.benefits ? "rotate(180deg)" : "rotate(0deg)" }}
                                    />
                                </div>
                                {openSections.benefits && (
                                    <ul className="listing">
                                        <li>{jobPost?.job_description.compensation}</li>
                                        {jobPost.job_highlights.Benefits.map((item, index) => (
                                            <li key={index}>{item}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                            
                    </div>
                    </>
                ):(
                    <>
                        <div className="JobOverview row">
                            <div className="col-md-12">
                                <div className="dashJobList">
                                    <div className="topHead live">
                                        <div className="head centerAlign">
                                            <img src={EyeIcon} alt="addIcon" className="icon" />
                                            Job Detailed Overview
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
                                                        {jobPost?.job_description?.compensation}
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
                                                <button className="applybutton yellow" onClick={()=>{dispatch(setJobId(jobPost.job_id));navigate(`/createjobs?id=${jobPost.job_id}`)}}>
                                                    Edit Post
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="overviewInfo">
                                        {/* Responsibilities Section */}
                                        <div className="inputIconHead d-flex align-items-center" onClick={() => toggleSection("responsibilities")}
                                            style={{ cursor: "pointer" }}>
                                            <img src={Responsibilities} alt="icon" className="icon" />
                                            <h6 className="inputTitle green">Job Overview & Responsibilities</h6>
                                            <img 
                                                src={DropDownIcon} 
                                                alt="toggle" 
                                                className={`toggle-icon ${openSections.responsibilities ? "open" : "closed"}`} 
                                                style={{ width: "30px", height: "30px", marginLeft:"auto", transform: openSections.responsibilities ? "rotate(180deg)" : "rotate(0deg)" }}
                                            />
                                        </div>
                                        {openSections.responsibilities && (
                                            <ul className="listing">
                                                {jobPost.job_highlights.Responsibilities.map((item, index) => (
                                                    <li key={index}>{item}</li>
                                                ))}
                                            </ul>
                                        )}

                                        {/* Qualifications Section */}
                                        <div className="inputIconHead d-flex align-items-center mt-3" onClick={() => toggleSection("qualifications")}
                                            style={{ cursor: "pointer" }}>
                                            <img src={Qualification} alt="icon" className="icon" />
                                            <h6 className="inputTitle blue">Job Qualifications & Requirements</h6>
                                            <img 
                                                src={DropDownIcon} 
                                                alt="toggle" 
                                                className={`toggle-icon ${openSections.qualifications ? "open" : "closed"}`} 
                                                style={{ width: "30px", height: "30px", marginLeft:"auto", transform: openSections.qualifications ? "rotate(180deg)" : "rotate(0deg)" }}
                                            />
                                        </div>
                                        {openSections.qualifications && (
                                            <ul className="listing">
                                                {jobPost.job_highlights.Qualifications.map((item, index) => (
                                                    <li key={index}>{item}</li>
                                                ))}
                                                <li>{jobPost?.job_description.requirements}</li>
                                            </ul>
                                        )}

                                        {/* Benefits Section */}
                                        <div className="inputIconHead d-flex align-items-center mt-3" onClick={() => toggleSection("benefits")}
                                            style={{ cursor: "pointer" }}>
                                            <img src={Benefits} alt="icon" className="icon" />
                                            <h6 className="inputTitle voilet">Job Benefits & Perks</h6>
                                            <img 
                                                src={DropDownIcon} 
                                                alt="toggle" 
                                                className={`toggle-icon ${openSections.benefits ? "open" : "closed"}`} 
                                                style={{ width: "30px", height: "30px", marginLeft:"auto", transform: openSections.benefits ? "rotate(180deg)" : "rotate(0deg)" }}
                                            />
                                        </div>
                                        {openSections.benefits && (
                                            <ul className="listing">
                                                <li>{jobPost?.job_description.compensation}</li>
                                                {jobPost.job_highlights.Benefits.map((item, index) => (
                                                    <li key={index}>{item}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            </div>
                                
                        </div>
                    </>
                )}
                {aiAnalysis && <CandidateAIAnalysis candidateAi={candidateAi} aiAnalysis={aiAnalysis} setAiAnalysis={setAiAnalysis} onClose={() => setAiAnalysis(false)} />}
                {aiLoader&&(
                    <>
                    <div className="LoaderAnimation">
                        <div className="gptAnimate"></div>
                        <img className="gptIcon" src={AiIcon} alt="gptIcon"/>
                    </div> 
                    </>
                )}
                
            </Fragment>
        </>
    )
}
export default OverviewPage;