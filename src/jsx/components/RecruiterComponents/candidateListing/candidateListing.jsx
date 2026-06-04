import React, { Fragment, useState, useEffect, useContext, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./pdfModal.css";
import { Dropdown } from "react-bootstrap";
import Sidepopup from "../Components/sidePopup";
import "../css/searchFilter.css"
import "../css/candidatesListing.css?ver0.99"
import { Filter as FilterIcon, ChevronDown, SendIcon, ArrowBigUpDashIcon, SquarePen, FileCheck, DollarSign, User, Users, BoxSelectIcon, DeleteIcon, LucideDelete, CopyIcon, LucideBookOpenText, TextIcon, RefreshCcw, BuildingIcon } from 'lucide-react';
// import {Star} as Component from '../JobsHome/CandidateAIAnalysis.svg';
import { useDispatch, useSelector } from "react-redux";
import { FileText, Mail, Phone, Search, Star, Video, BadgeCheck, Eye, X } from "lucide-react";
import candidatestyles from '../css/JobPostModal.module.css';
import { Link } from "react-router-dom";
import { ThemeContext } from "../../../../context/ThemeContext";
import { FaCalendarAlt, FaClock, FaCog, FaUsers } from "react-icons/fa";
import CSavvyPageLoader from "../cSavvvyPageLoader";
import CenterViewPopup from "../Components/centerViewPopup";
import { Tab, Nav } from 'react-bootstrap';
// import PageUI from "./developer ui.png"
import styles from "../css/jobPosting.module.css";
import { setJobId, setDetailedJobData, setUserInterviewList } from "../../../../store/actions/actions";
import { FaBriefcase, FaEnvelope } from 'react-icons/fa';
import ToastSuccess from "../toastSucces";
import ApplicationProcessing from "../Components/applicationProcessing";
import UpdateStatus from "../Components/updateStatus";

const CandidateListing = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [centerPopup, setCenterPopup] = useState("");
    const [allInterview, setAllInterview] = useState([]);
    const [updateStatusPopup, setUpdateStatusPopup] = useState(false);
    function closeUpdateStatus() {
        setUpdateStatusPopup(false);
    }
    const [popupType, setPopupType] = useState('')
    const [applicantProcess, setApplicantProcess] = useState(false);
    const [message, setMessage] = useState("");
    const [type, setType] = useState("");
    const [refereeData, setRefereeData] = useState("");
    const [inviteReminder, setInviteReminder] = useState(false);
    const [submissionSelected, setSubmissionSelected] = useState([]);
    const [centerViewType, setCenterViewType] = useState("");
    const [moreToggle, setMoreToggle] = useState(false);
    const [candidatesData, setCandidatesData] = useState([]);
    const [activeMoreIndex, setActiveMoreIndex] = useState(null);
    const [profileProcessing, setProfileProcessing] = useState("");
    const [showLoader, setShowLoader] = useState("");
    const [candidatelist, setCandidatesList] = useState([]);
    const [matchSummary, setMatchSummary] = useState([]);
    const [profileClicked, setProfileClicked] = useState(false);
    const [downloadResumeClicked, setDownloadResumeClicked] = useState(false);
    const [missingSkills, setMissingSkills] = useState([]);
    const [selectedProfile, setSelectedProfile] = useState([]);
    const [activeTab, setActiveTab] = useState('CandiatesList');
    const [profileactiveTab, setProfileActiveTab] = useState('Overview');
    const [inteviewViewActive, setInterviewViewActive] = useState(false);
    const [showPdfPopup, setShowPdfPopup] = useState(false);
    const [advancedDetails, setAdvancedDetails] = useState('CandiatesList');
    const userEmail = useSelector(state => state.auth.auth.email);
    const [base64Pdf, setBase64Pdf] = useState("");
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(now.getDate()).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const currentDateTime = `${month}-${day}-${year}_${hours}-${minutes}-${seconds}`;



    const { jobId, detailedJobData, userInterviewList } = useSelector((state) => state.profile);
    useEffect(() => { console.log(showPdfPopup) }, [showPdfPopup]);
    useEffect(() => {
        if (detailedJobData?.job_id) {
            getCandidatesList();
            // InterviewById();
        } else {
            const storedJob = localStorage.getItem("detailedJobData");
            const storedID = localStorage.getItem("jobId");
            if (storedJob) {
                dispatch(setDetailedJobData(JSON.parse(storedJob)));
                dispatch(setJobId(storedID));
            }
        }
    }, [detailedJobData?.job_id, popupType]); // this will rerun when job_id becomes available

    useEffect(() => {
        const intervalId = setInterval(() => {

            getCandidatesList();

        }, 400 * 60 * 1000);
        return () => clearInterval(intervalId);
    }, [])

    const checkApplicantStatus = async (job_id, email) => {
        try {
            const candidatequery = {
                "job_id": job_id,
                "email": email
            }
            const response = await fetch("https://manual-job-applicants-status-check-v10-737421501165.us-east1.run.app", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(candidatequery),
            })
            const data = await response.json();
            console.log("candidate status", data);
            if (data.processing_status == "processing") {
                setApplicantProcess(true);
                setProfileClicked(false);
                setProfileProcessing(email);
                setTimeout(() => {
                    setApplicantProcess(false);
                }, 5000);
            }




            setShowLoader("")
        } catch (error) {
            console.log(error)
        }
    }





    useEffect(() => {
        if (showLoader !== "") {
            setTimeout(() => {
                setShowLoader("")
            }, 3000)
        }
    }, [showLoader])

    const DownloadPdf = () => {
        setShowLoader("Generating Resume");
        if (!base64Pdf) {
            alert("No PDF data available!");
            setShowLoader("");
            return;
        }
        setShowLoader("Generating Resume");

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
        setShowLoader("");
    };


    const [candidateLoading, setCandidateLoading] = useState(false);
    const [referencesData, setReferenceData] = useState([]);
    const getCandidatesList = async () => {
        setCandidateLoading(true);
        try {
            const listQuery = {
                "job_id": detailedJobData.job_id,
                "task": "basic"
            }
            const response = await fetch("https://candidate-details-applied-for-job-id-v10-737421501165.us-east1.run.app", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(listQuery),
            })
            const data = await response.json();
            setCandidatesList(data.data.candidates);
            setCandidatesData(data.data);
            console.log("candidatelist", candidatelist);

            setShowLoader("")
            setCandidateLoading(false);
        } catch (error) {
            console.log(error);
            setCandidateLoading(false);
        }
    }
    const getCandidatesDetails = async (email) => {
        setBase64Pdf("")
        setMatchSummary([]);
        // setShowLoader("Downloading Resume");
        // console.log("Fetching details for:", email);
        try {
            const listQuery = {
                "job_id": detailedJobData.job_id,
                "task": "advanced",
                "candidate_email": email
            }
            const response = await fetch("https://candidate-details-applied-for-job-id-v10-737421501165.us-east1.run.app", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(listQuery),
            })
            const data = await response.json();
            setTimeout(() => {

                setBase64Pdf(data?.data?.resume);
                setMatchSummary(data?.data?.match_summary);
                setReferenceData(data?.data?.reference_status);
                setMissingSkills(data?.data?.missing_skills)
                console.log("missingSkills", data?.data?.missingSkills)
                console.log("missingSkills", data?.data?.match_summary)
                if (
                    Array.isArray(data?.data?.missingSkills) &&
                    data?.data?.missingSkills?.length === 0 &&
                    data?.data?.interview_status?.error.includes("500 Server Error")
                ) {
                    setProfileClicked(false);
                    setMessage("Processing Resume, Please wait");
                }
            }, 2000)
            console.log(base64Pdf);

        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        console.log("ProfileAdded selected", selectedProfile);
        if (profileClicked == "true") {
            if (missingSkills == []) {
                // setShowLoader("Fetching Profile");
            }
            else if (missingSkills != []) {
                setShowLoader("");
            }
        }
        if (downloadResumeClicked == true) {
            if (base64Pdf == "") {
                setShowLoader("Fetching Resume");
            }
            else if (base64Pdf !== "") {
                setShowLoader("");
                setShowPdfPopup(true)
                setDownloadResumeClicked(false);
            }
        }
    }, [missingSkills, profileClicked, base64Pdf])

    function proFileButton(list) {

        setSelectedProfile(list);
        setProfileClicked(true);
        checkApplicantStatus(detailedJobData.job_id, list.email);
    }
    const rowRefs = useRef([]);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                activeMoreIndex !== null &&
                rowRefs.current[activeMoreIndex] &&
                !rowRefs.current[activeMoreIndex].contains(event.target)
            ) {
                setActiveMoreIndex(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [activeMoreIndex]);


    const InterviewById = async (email) => {
        // setShowLoader("Downloading Resume");
        // console.log("Fetching details for:", email);
        try {
            const listQuery = {
                "action": "fetch_by_job",
                "job_id": detailedJobData.job_id
            }
            const response = await fetch("https://fetch-all-interviews-feedback-v10-737421501165.us-east1.run.app", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(listQuery),
            })
            const data = await response.json();
            setAllInterview(data.interviews);

            console.log("InterviewList By Id", data);

        } catch (error) {
            console.log(error)
        }
    }
    const InterviewByEmail = async (email) => {
        // setShowLoader("Downloading Resume");
        // console.log("Fetching details for:", email);
        try {
            const listQuery = {
                "action": "fetch_by_job_and_candidate",
                "candidate_email": email,
                "job_id": detailedJobData.job_id,
                "recruiter_email": userEmail
            }
            const response = await fetch("https://fetch-all-interviews-feedback-v10-737421501165.us-east1.run.app", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(listQuery),
            })
            const data = await response.json();
            console.log("lsit pf", data.interviews);
            if(data.interviews){
                dispatch(setUserInterviewList(data.interviews));
            }
            else {
                dispatch(setUserInterviewList(data.interview));
            }
            console.log("InterviewList By Email", data);
            if (!response.ok) {
                dispatch(setUserInterviewList([]));
            }
        } catch (error) {
            dispatch(setUserInterviewList([]));
            console.log(error)
        }
    }
    const employmentSubmissionRequest = async (email) => {
        setShowLoader("Sending Request");
        try {
            const listQuery = {
                "action": "notify_candidate_for_document_upload",
                "candidate_mail_id": email,
                "job_id": detailedJobData.job_id
            }
            const response = await fetch("https://notify-candidate-employmnt-sub-and-store-data-v10-737421501165.us-east1.run.app", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(listQuery),
            })
            const data = await response.json();
            setShowLoader("");
            setType("success");
            setMessage(data.message);
        } catch (error) {
            console.log(error);
            setShowLoader("");
        }
    }
    const [searchValue, setSearchValue] = useState('');
    const [filterMatchScore, setFilterMatchScore] = useState('');
    const [filterInterviewType, setFilterInterviewType] = useState('');
    const [filterInterviewStatus, setFilterInterviewStatus] = useState('');


    // Helper to check if score is within a selected range
    const isScoreInRange = (score, range) => {
        if (!range) return true;
        const [min, max] = range.split('-').map(Number);
        return score >= min && score <= max;
    };

    // Filtered candidates
    const filteredCandidates = candidatelist?.filter((candidate) => {
        const fullName = `${candidate.first_name} ${candidate.last_name}`.toLowerCase();
        const email = candidate.email?.toLowerCase() || '';
        const score = Math.round(candidate.resume_match_score);

        const matchScoreValid = isScoreInRange(score, filterMatchScore);
        const typeValid = !filterInterviewType || candidate.interview_status?.interview_type?.toLowerCase() === filterInterviewType.toLowerCase();
        const statusValid =
            !filterInterviewStatus ||
            candidate.interview_status?.has_interview_invite === (filterInterviewStatus === 'true');

        const searchTerm = searchValue.toLowerCase();

        const matchesNameOrEmail = fullName.includes(searchTerm) || email.includes(searchTerm);
        return matchesNameOrEmail && matchScoreValid && typeValid && statusValid;
    });


    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const totalCandidates = filteredCandidates.length;

    const totalPages = Math.ceil(totalCandidates / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalCandidates);
    const paginatedCandidates = filteredCandidates.slice(startIndex, endIndex);
    const handleClearFilters = () => {
        setSearchValue('');
        setFilterMatchScore('');
        setFilterInterviewType('');
        setFilterInterviewStatus('');
        setCurrentPage(1); // Optional: reset pagination to first page
    };

    //checkbox code start
    // Unique key to track selection (email assumed unique per candidate)
    const [checkedIds, setCheckedIds] = useState(new Set());
    const [checkedCandidatesCount, setCheckedCandidatesCount] = useState("");

    // Always up-to-date array of selected candidate objects
    const checkedCandidates = useMemo(
        () => candidatelist.filter(c => checkedIds.has(c.email)),
        [candidatelist, checkedIds]
    );

    useEffect(() => {
        console.log("checked Id's : ", checkedIds);
    }, [checkedIds])

    // Optional: clear selection when job changes
    useEffect(() => {
        setCheckedIds(new Set());
    }, [detailedJobData?.job_id]);
    const isSelected = (email) => checkedIds.has(email);

    const toggleCandidate = (candidate) => {
        setCheckedIds(prev => {
            const next = new Set(prev);
            const key = candidate.email; // use a truly unique key if available
            if (next.has(key)) next.delete(key);
            else next.add(key);
            return next;
        });
    };


    // "Select all on this page" behavior for the header checkbox
    const toggleAllOnPage = () => {
        const emailsOnPage = paginatedCandidates.map(c => c.email);
        const allCheckedOnPage = emailsOnPage.length > 0 && emailsOnPage.every(e => checkedIds.has(e));
        setCheckedIds(prev => {
            const next = new Set(prev);
            if (allCheckedOnPage) {
                emailsOnPage.forEach(e => next.delete(e));
            } else {
                emailsOnPage.forEach(e => next.add(e));
            }
            return next;
        });
    };
    function formatUSPhoneNumber(value) {
        let cleaned = value.trim();
        // Remove "+1" if present at the start
        if (cleaned.startsWith('+1')) {
            cleaned = cleaned.slice(2).trim();
        }
        // Remove all non-numeric characters
        let x = cleaned.replace(/[^\d]/g, '');
        // Only use first 10 digits
        x = x.substring(0, 10);

        if (!x) return '';
        if (x.length < 4) {
            return '(' + x;
        } else if (x.length < 7) {
            return `(${x.slice(0, 3)}) ${x.slice(3)}`;
        } else {
            return `+1 (${x.slice(0, 3)}) ${x.slice(3, 6)}-${x.slice(6)}`;
        }
    }

    // Indeterminate state for header checkbox (visual cue)
    const headerCheckboxRef = useRef(null);
    useEffect(() => {
        if (!headerCheckboxRef.current) return;
        const emailsOnPage = paginatedCandidates.map(c => c.email);
        const checkedCount = emailsOnPage.filter(e => checkedIds.has(e)).length;
        headerCheckboxRef.current.indeterminate =
            checkedCount > 0 && checkedCount < emailsOnPage.length;
    }, [paginatedCandidates, checkedIds]);

    //checkbox code end

    // Bulk status options shown in the dropdown (add/remove as needed)
    const STATUS_OPTIONS = [
        { value: "Applied", label: "Applied" },
        { value: "In review", label: "In review" },
        { value: "Submitted to Client", label: "Submitted to Client" },
        { value: "Interview Stage", label: "Interview Stage" },
        { value: "Offer Stage", label: "Offer Stage" },
        { value: "Hired", label: "Hired" },
        { value: "Not Selected", label: "Not Selected" },
        // Example from cURL; include if desired by workflow:
        { value: "Shortlisted", label: "Shortlisted" },
    ];

    const [bulkStatus, setBulkStatus] = useState("");

    // Bulk update API call on dropdown change
    const handleBulkStatusChange = async (statusValue) => {
        if (!statusValue) return;
        if (!detailedJobData?.job_id) {
            setType("error");
            setMessage("Job ID not available.");
            return;
        }
        const emails = Array.from(checkedIds);
        if (emails.length === 0) {
            setType("error");
            setMessage("No candidates selected.");
            return;
        }

        setShowLoader("Updating status...");
        try {
            const payload = {
                job_id: detailedJobData.job_id,
                task: "update_status",
                update_status: statusValue,
                emails,
            };

            const response = await fetch(
                "https://candidate-details-applied-for-job-id-v10-737421501165.us-east1.run.app",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                }
            );

            const data = await response.json().catch(() => ({}));
            if (!response.ok) {
                throw new Error(data?.message || "Failed to update status");
            }

            setBulkStatus(statusValue);
            setType("success");
            setMessage(`Updated ${emails.length} candidate(s) to ${statusValue}.`);
            await getCandidatesList(); // refresh UI from server truth
            clearSelection();
            setBulkStatus("");
        } catch (err) {
            setType("error");
            setMessage(err.message || "Error updating status.");
        } finally {
            setShowLoader("");
        }
    };

    // Optional: clear current selection
    const clearSelection = () => setCheckedIds(new Set());

    const [copied, setCopied] = useState(false);

    const handleCopyLink = async () => {
        const url = detailedJobData?.job_apply_link?.trim();
        if (!url) return;

        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(url);
            } else {
                const textarea = document.createElement('textarea');
                textarea.value = url;
                textarea.setAttribute('readonly', '');
                textarea.style.position = 'fixed';
                textarea.style.top = '-9999px';
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
            }
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
            // setType("success");
            // setMessage("Job link copied successfully.");
        } catch (err) {
            console.error('Copy failed', err);
        }
    };

    return (
        <>
            <Fragment>
                {showLoader !== "" && (<>
                    <CSavvyPageLoader loaderText={`${showLoader}`} />
                </>)}
                {updateStatusPopup && (<>
                    <UpdateStatus updateStatusPopup={updateStatusPopup} setUpdateStatusPopup={setUpdateStatusPopup} selectedProfile={selectedProfile} detailedJobData={detailedJobData} closeUpdateStatus={closeUpdateStatus} setShowLoader={setShowLoader} setType={setType} setMessage={setMessage} getCandidatesList={getCandidatesList} />
                </>)}
                <div className={`{styles["job-posting-wrapper"]} CandidatesListingWrapper`}>
                    <div className={`d-flex justify-content-between mb-4 ${styles.pageheadWrap}`} >
                        <div className="col-flex">

                            <h2 className={` ${styles.pageHeading}`}>{detailedJobData.job_title}</h2>
                            <div className="row-flex">
                                <div className={styles.companyLocation}>
                                    <span className={styles.companyName}>{detailedJobData.employer_name}</span>
                                    <span className={styles.dotSeparator}>•</span>
                                    <span className={styles.location}>{detailedJobData.job_city}, {detailedJobData.job_state}, {detailedJobData.job_country}</span>
                                </div>
                            </div>
                        </div>
                        <div className={styles.buttonRow}>
                            <button
                                className={`${styles.editJobBtn} d-flex align-items-center`}
                                onClick={() => {
                                    getCandidatesList();
                                    setShowLoader("Getting Applicants")
                                }}
                            >
                                <RefreshCcw size={16} />
                                Refresh
                            </button>
                            <button
                                className={`${styles.editJobBtn} d-flex align-items-center copyLink`}
                                onClick={handleCopyLink}
                                aria-live="polite"
                            >
                                <CopyIcon size={16} />
                                {copied ? 'Copied!' : 'Copy Link'}
                                {copied ? (<>
                                    <div className="messagePopup">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" height="20" width="20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                                        </svg>
                                        Job link copied successfully.
                                    </div>
                                </>) : (<>

                                </>)}

                            </button>

                            <button
                                className={`${styles.editJobBtn} d-flex align-items-center`}
                                onClick={() => {
                                    if (detailedJobData?.job_apply_link) {
                                        window.open(detailedJobData.job_apply_link, '_blank');
                                    }
                                }}
                            >
                                <Eye size={16} />
                                Preview Link
                            </button>
                            <button className={`${styles.createJobPostBtn} d-flex align-items-center`} onClick={() => setPopupType("importCandidate")}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus h-4 w-4 mr-2"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg> Import Candidate
                            </button>
                        </div>
                    </div>
                    <div className="d-flex">
                        <div className="job-info-card">
                            <div className="job-info-item">
                                <div className="job-info-label statusbold">Job Status</div>
                                <span className="job-status active">{detailedJobData.job_status}</span>
                            </div>
                            <div className="job-info-item">
                                <div className="job-info-label">Job Type</div>
                                <div className="job-info-value">{detailedJobData?.job_employment_type}</div>
                            </div>
                            <div className="job-info-item">
                                <div className="job-info-label">Salary Range</div>
                                <div className="job-info-value">${detailedJobData?.salary_range || "0"} {detailedJobData?.salary_type == "Yearly" ? (<>
                                    /yr</>) : (<>/hr</>)}</div>
                            </div>
                            <div className="job-info-item">
                                <div className="job-info-label">Posted Date</div>
                                <div className="job-info-value">
                                    {new Date(detailedJobData?.job_posted_at_datetime_utc).toLocaleDateString('en-US')}
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="col-flex TabsData">
                        <Tab.Container className={candidatestyles.fwidthTabs} activeKey={activeTab} onSelect={setActiveTab}>
                            <Nav className={candidatestyles.navBar}>
                                <Nav.Item className={candidatestyles.navItems}>
                                    <Nav.Link eventKey="CandiatesList" className={`${candidatestyles.navigationLink} ${activeTab == 'CandiatesList' ? candidatestyles.navigationLinkActive : ""}`}>
                                        Basic Details
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item className={candidatestyles.navItems}>
                                    <Nav.Link eventKey="JobDescription" className={`${candidatestyles.navigationLink} ${activeTab == 'JobDescription' ? candidatestyles.navigationLinkActive : ""}`}>Job Description</Nav.Link>
                                </Nav.Item>
                            </Nav>
                            <Tab.Content className="tabContent">
                                <Tab.Pane eventKey="CandiatesList">
                                    <div className="application-status-container">
                                        <div className="status-card">
                                            <div className="status-label">Total Applications</div>
                                            <div className="status-count">{totalCandidates}</div>
                                        </div>
                                        <div className="status-card">
                                            <div className="status-label">Candidates Applied</div>
                                            <div className="status-count">{candidatesData?.status_breakdown?.applied}</div>
                                        </div>
                                        <div className="status-card">
                                            <div className="status-label">Interviews Done</div>
                                            <div className="status-count">{candidatesData?.status_breakdown?.with_interviews}</div>
                                        </div>
                                        <div className="status-card">
                                            <div className="status-label">References</div>
                                            <div className="status-count">{candidatesData?.status_breakdown?.with_references}</div>
                                        </div>
                                    </div>
                                    <div className="SearchFilters">
                                        <div className="searchFilter">
                                            <input
                                                type="text"
                                                className="searchInput"
                                                placeholder="Search Candidates by Name or Email..."
                                                value={searchValue}
                                                onChange={(e) => setSearchValue(e.target.value)}
                                            />
                                            <button className="searchButton search" onClick={() => { handleClearFilters() }}>
                                                <X size={16} />
                                                Clear All
                                            </button>
                                        </div>
                                        <div className="dropDownFilters">
                                            <div className="filterDropdown">
                                                <Star />
                                                <Dropdown onSelect={(value) => setFilterMatchScore(value)}>
                                                    <Dropdown.Toggle
                                                        id="dropdown-basic"
                                                        className={`d-flex align-items-center ${styles.searchFilter} newFilter`}
                                                    >

                                                        {filterMatchScore ? (<>
                                                            {filterMatchScore == "0-25" && (<>
                                                                0% - 25%
                                                            </>)}
                                                            {filterMatchScore == "26-50" && (<>
                                                                26% - 50%
                                                            </>)}
                                                            {filterMatchScore == "51-75" && (<>
                                                                51% - 75%
                                                            </>)}
                                                            {filterMatchScore == "76-100" && (<>
                                                                76% - 100%
                                                            </>)}
                                                        </>) : (<>Filter by Match Score</>)}
                                                    </Dropdown.Toggle>

                                                    <Dropdown.Menu className={styles.DropDownMenu}>
                                                        <Dropdown.Item
                                                            key=""
                                                            eventKey=""
                                                            active={filterMatchScore === ""}
                                                            className={`${styles.DropDownItems} ${filterMatchScore === "" ? styles.DpiActive : ''}`}
                                                        >
                                                            Filter by Match Score
                                                        </Dropdown.Item>
                                                        <Dropdown.Item
                                                            key="0-25"
                                                            eventKey="0-25"
                                                            active={filterMatchScore === "0-25"}
                                                            className={`${styles.DropDownItems} ${filterMatchScore === "0-25" ? styles.DpiActive : ''}`}
                                                        >
                                                            0% - 25%
                                                        </Dropdown.Item>
                                                        <Dropdown.Item
                                                            key="26-50"
                                                            eventKey="26-50"
                                                            active={filterMatchScore === "26-50"}
                                                            className={`${styles.DropDownItems} ${filterMatchScore === "26-50" ? styles.DpiActive : ''}`}
                                                        >
                                                            26% - 50%
                                                        </Dropdown.Item>
                                                        <Dropdown.Item
                                                            key="51-75"
                                                            eventKey="51-75"
                                                            active={filterMatchScore === "51-75"}
                                                            className={`${styles.DropDownItems} ${filterMatchScore === "51-75" ? styles.DpiActive : ''}`}
                                                        >
                                                            51% - 75%
                                                        </Dropdown.Item>
                                                        <Dropdown.Item
                                                            key="76-100"
                                                            eventKey="76-100"
                                                            active={filterMatchScore === "76-100"}
                                                            className={`${styles.DropDownItems} ${filterMatchScore === "76-100" ? styles.DpiActive : ''}`}
                                                        >
                                                            76% - 100%
                                                        </Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>

                                            </div>



                                            <div className="filterDropdown">
                                                {filterInterviewType == "text" ? (<>

                                                    <TextIcon />
                                                </>) : (<>
                                                    <Video />

                                                </>)}
                                                <Dropdown onSelect={(value) => setFilterInterviewType(value)}>
                                                    <Dropdown.Toggle
                                                        id="dropdown-basic"
                                                        className={`d-flex align-items-center ${styles.searchFilter} newFilter`}
                                                    >

                                                        {filterInterviewType || "Filter by Interview Type"}
                                                    </Dropdown.Toggle>

                                                    <Dropdown.Menu className={styles.DropDownMenu}>
                                                        <Dropdown.Item
                                                            key=""
                                                            eventKey=""
                                                            active={filterInterviewType === ""}
                                                            className={`${styles.DropDownItems} ${filterInterviewType === "" ? styles.DpiActive : ''}`}
                                                        >
                                                            Filter by Interview Type
                                                        </Dropdown.Item>
                                                        <Dropdown.Item
                                                            key="text"
                                                            eventKey="text"
                                                            active={filterInterviewType === "text"}
                                                            className={`${styles.DropDownItems} ${filterInterviewType === "text" ? styles.DpiActive : ''}`}
                                                        >
                                                            Text
                                                        </Dropdown.Item>
                                                        <Dropdown.Item
                                                            key="video"
                                                            eventKey="video"
                                                            active={filterInterviewType === "video"}
                                                            className={`${styles.DropDownItems} ${filterInterviewType === "video" ? styles.DpiActive : ''}`}
                                                        >
                                                            Video
                                                        </Dropdown.Item>

                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </div>
                                            <div className="filterDropdown">
                                                <BadgeCheck />

                                                <Dropdown onSelect={(value) => setFilterInterviewStatus(value)}>
                                                    <Dropdown.Toggle
                                                        id="dropdown-interview-status"
                                                        className={`d-flex align-items-center ${styles.searchFilter} newFilter`}
                                                    >
                                                        {filterInterviewStatus === "true"
                                                            ? "Invited"
                                                            : filterInterviewStatus === "false"
                                                                ? "Not Invited"
                                                                : "Filter by Interview Status"}
                                                    </Dropdown.Toggle>

                                                    <Dropdown.Menu className={styles.DropDownMenu}>
                                                        <Dropdown.Item
                                                            key=""
                                                            eventKey=""
                                                            active={filterInterviewStatus === ""}
                                                            className={`${styles.DropDownItems} ${filterInterviewStatus === "" ? styles.DpiActive : ''}`}
                                                        >
                                                            Filter by Interview Status
                                                        </Dropdown.Item>
                                                        <Dropdown.Item
                                                            key="true"
                                                            eventKey="true"
                                                            active={filterInterviewStatus === "true"}
                                                            className={`${styles.DropDownItems} ${filterInterviewStatus === "true" ? styles.DpiActive : ''}`}
                                                        >
                                                            Invited
                                                        </Dropdown.Item>
                                                        <Dropdown.Item
                                                            key="false"
                                                            eventKey="false"
                                                            active={filterInterviewStatus === "false"}
                                                            className={`${styles.DropDownItems} ${filterInterviewStatus === "false" ? styles.DpiActive : ''}`}
                                                        >
                                                            Not Invited
                                                        </Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </div>
                                        </div>
                                    </div>
                                    {checkedIds.size > 0 ? (
                                        <>
                                            <div className="selectedCandidates">
                                                <div className="selectedCount">
                                                    {checkedIds.size || 0} selected <span className="heavyText">Bulk actions:</span>
                                                </div>

                                                <div className="UpdateStatus">
                                                    <div className="dropdown">
                                                        <Dropdown onSelect={handleBulkStatusChange}>
                                                            <Dropdown.Toggle
                                                                id="dropdown-bulk-status"
                                                                className={`d-flex align-items-center filled-dropdown newFilter`}
                                                            >
                                                                {bulkStatus ? `Status: ${bulkStatus}` : "Update status"}
                                                            </Dropdown.Toggle>

                                                            <Dropdown.Menu className={styles.DropDownMenu}>
                                                                {STATUS_OPTIONS.map(opt => (
                                                                    <Dropdown.Item
                                                                        key={opt.value}
                                                                        eventKey={opt.value}
                                                                        active={bulkStatus === opt.value}
                                                                        className={`${styles.DropDownItems}`}
                                                                    >
                                                                        {opt.label}
                                                                    </Dropdown.Item>
                                                                ))}
                                                            </Dropdown.Menu>
                                                        </Dropdown>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        className="clearBtn"
                                                        onClick={clearSelection}
                                                        style={{ marginLeft: 12 }}
                                                    >
                                                        {/* <LucideDelete size={16}/> */}
                                                        Clear selection
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <></>
                                    )}


                                    <div className="tableOuter">
                                        <div className="table-wrapper">

                                            <table className="candidate-table">
                                                <thead>
                                                    <tr>
                                                        <th>
                                                            <input
                                                                type="checkbox"
                                                                ref={headerCheckboxRef}
                                                                onChange={toggleAllOnPage}
                                                                checked={
                                                                    paginatedCandidates.length > 0 &&
                                                                    paginatedCandidates.every(c => checkedIds.has(c.email))
                                                                }
                                                                aria-label="Select all candidates on this page"
                                                            />
                                                        </th>
                                                        <th>Candidate</th>
                                                        <th>Application Date</th>
                                                        <th>Status</th>
                                                        <th>Match Score</th>
                                                        <th>Process Status</th>
                                                        {/* <th>Interview Type</th>
                                                    <th>Interview Status</th>
                                                    <th>Interview Invited</th> */}
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {candidateLoading ? (<>
                                                        <tr>
                                                            <td colSpan="8" style={{ textAlign: 'center', padding: '1rem' }}>
                                                                <div className="skeleton-row">Loading candidates...</div>
                                                            </td>
                                                        </tr>
                                                    </>
                                                    ) : (<>
                                                        {paginatedCandidates?.length > 0 ? (<>
                                                            {paginatedCandidates?.map((list, index) => (
                                                                <tr key={index} ref={(el) => (rowRefs.current[index] = el)}>
                                                                    <td>
                                                                        <div className="tdRow">
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={isSelected(list.email)}
                                                                                onChange={() => toggleCandidate(list)}
                                                                                aria-label={`Select ${list.first_name} ${list.last_name}`}
                                                                            />
                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        <div className="tdRow">
                                                                            <div className="alphabet">{list.first_name.charAt(0)}</div>
                                                                            <div className="tdColumn">
                                                                                <div><strong>{list.first_name} {list.last_name}</strong></div>
                                                                                <div className="subtext">
                                                                                    {/* {detailedJobData.job_title} */}
                                                                                    <div className="mailContactRow">
                                                                                        <div className="iconData"><Mail />{list.email}</div>
                                                                                        {list?.phone?.length ? (<>
                                                                                            <div className="iconData"><Phone />{formatUSPhoneNumber(list.phone)}</div>
                                                                                        </>) : (<><div className="iconData"></div></>)}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        {new Date(list.interview_status.applied_at).toLocaleString('en-US', {
                                                                            year: 'numeric',
                                                                            month: '2-digit',
                                                                            day: '2-digit',
                                                                            hour: 'numeric',
                                                                            minute: '2-digit',
                                                                            hour12: true
                                                                        })}
                                                                    </td>

                                                                    <td>
                                                                        <span className={`borderText ${list.application_status.replace(" ", "-").replace(" ", "-") || "Applying"}`} onClick={() => InterviewByEmail(list.email)}>
                                                                            {/* {list.application_status == "Applied" ? ("Applied") : ("Applying")} */}
                                                                            {list.application_status || "Applying"}
                                                                        </span>
                                                                    </td>

                                                                    <td>
                                                                        <div className="progressShower">
                                                                            <div className="progressBar">
                                                                                <div className="percent" style={{ width: `${Math.round(list.resume_match_score)}%` }}></div>
                                                                            </div>
                                                                            <span className="percentText">{Math.round(list.resume_match_score)}%</span>
                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        <div className="processButtonRow">
                                                                            <div className={`processBtn ${list.interview_status.has_interview_invite === true ? "submitted" : ""} ${list.interview_status.interview_completed === true ? "submitted" : ""}`}
                                                                                onClick={() => {
                                                                                    setActiveMoreIndex(activeMoreIndex === index ? null : index);
                                                                                    getCandidatesDetails(list.email);
                                                                                    InterviewByEmail(list.email);
                                                                                    setProfileActiveTab('Interview History');
                                                                                    setSelectedProfile(list);
                                                                                    proFileButton(list)
                                                                                }}>
                                                                                <Video />
                                                                                <span className="text">Interview</span>
                                                                                <span className="toptext">Status : {list.interview_status.interview_type || "not started"}</span>
                                                                            </div>

                                                                            <div className={`processBtn ${list.form_submission !== "pending" ? "submitted" : ""}`}
                                                                                onClick={() => {
                                                                                    setActiveMoreIndex(activeMoreIndex === index ? null : index);
                                                                                    getCandidatesDetails(list.email);
                                                                                    InterviewByEmail(list.email);
                                                                                    setProfileActiveTab('Submission Info');
                                                                                    setSelectedProfile(list);
                                                                                    proFileButton(list)
                                                                                }}>
                                                                                <FileCheck />
                                                                                <span className="text">
                                                                                    Submission
                                                                                </span>
                                                                                <span className="toptext">Submissions : {list.form_submission}</span>
                                                                            </div>
                                                                            <div className={`processBtn ${list.rate_confirmation !== "pending" ? "submitted" : ""}`}
                                                                                onClick={() => {
                                                                                    setActiveMoreIndex(activeMoreIndex === index ? null : index);
                                                                                    getCandidatesDetails(list.email);
                                                                                    InterviewByEmail(list.email);
                                                                                    setProfileActiveTab('Rate Confirmations');
                                                                                    setSelectedProfile(list);
                                                                                    proFileButton(list)
                                                                                }}>
                                                                                <DollarSign />
                                                                                <span className="text">
                                                                                    Rate
                                                                                </span>
                                                                                <span className="toptext">Confirmation : {list.rate_confirmation}</span>
                                                                            </div>
                                                                            <div className={`processBtn ${list.reference_status.has_reference_check == true ? "submitted" : ""}`}
                                                                                onClick={() => {
                                                                                    setActiveMoreIndex(activeMoreIndex === index ? null : index);
                                                                                    getCandidatesDetails(list.email);
                                                                                    InterviewByEmail(list.email);
                                                                                    setProfileActiveTab('References');
                                                                                    setSelectedProfile(list);
                                                                                    proFileButton(list)
                                                                                }}>
                                                                                <Users />
                                                                                <span className="text">
                                                                                    References
                                                                                </span>
                                                                                <span className="toptext">References : {list.reference_status.reference_status || "Not Started"}</span>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td
                                                                        className="moreButton"
                                                                        onClick={() => {
                                                                            setActiveMoreIndex(activeMoreIndex === index ? null : index);
                                                                            getCandidatesDetails(list.email);
                                                                            InterviewByEmail(list.email);
                                                                            setProfileActiveTab('Overview');
                                                                        }
                                                                        }
                                                                    >
                                                                        ⋯
                                                                        {activeMoreIndex === index && (
                                                                            <div className="moreOptions">
                                                                                <div className="clickButtons" onClick={() => { setSelectedProfile(list); proFileButton(list) }}>
                                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye mr-2 h-4 w-4"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                                                                    View Profile
                                                                                </div>
                                                                                <div className="clickButtons" onClick={() => { setSelectedProfile(list); setPopupType("scheduleInterview") }}>
                                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-video mr-2 h-4 w-4"><path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"></path><rect x="2" y="6" width="14" height="12" rx="2"></rect></svg>
                                                                                    Send Interview Request
                                                                                </div>
                                                                                <div className="clickButtons" onClick={() => { setProfileClicked(true); setCenterViewType("sendReferRequest"); setSelectedProfile(list) }}>
                                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mail mr-2 h-4 w-4"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
                                                                                    Send Reference Form
                                                                                </div>
                                                                                {/* <div className="clickButtons"  onClick={() => setShowPdfPopup(true)}> */}
                                                                                <div className="clickButtons" onClick={() => { setSelectedProfile(list); setDownloadResumeClicked(true); setShowLoader("Loading Resume") }}>
                                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text mr-2 h-4 w-4"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path></svg>
                                                                                    View Resume
                                                                                </div>
                                                                                <div className="clickButtons" onClick={() => { employmentSubmissionRequest(list.email); setSelectedProfile(list) }}>
                                                                                    <SendIcon size={15} />
                                                                                    {/* <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text mr-2 h-4 w-4"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path></svg> */}
                                                                                    Send Submission Form
                                                                                </div>
                                                                                <div className="clickButtons" onClick={() => { setSelectedProfile(list); setUpdateStatusPopup(true) }}>
                                                                                    <SquarePen size={15} />

                                                                                    Update Status
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </>) : (<>
                                                            <tr>
                                                                <td colSpan="8" style={{ textAlign: 'center', padding: '3rem' }}>
                                                                    Oops! Looks like there are no candidates to display.
                                                                </td>
                                                            </tr>
                                                        </>)}
                                                    </>)}





                                                </tbody>
                                            </table>
                                        </div>
                                        {paginatedCandidates?.length > 0 && (<>

                                            <div className="paginationOuter">
                                                <div className="pagination-footer">
                                                    <div className="pagination-info">
                                                        Showing {paginatedCandidates?.length > 0 && (<>{startIndex + 1}</>)} to {endIndex} of {totalCandidates} Candidates
                                                    </div>
                                                    <div className="pagination-controls">
                                                        {paginatedCandidates?.length > 0 && (<>
                                                            <button
                                                                className="pagination-button"
                                                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                                                disabled={currentPage === 1}
                                                            >
                                                                Previous
                                                            </button>

                                                            {[...Array(totalPages)].map((_, i) => (
                                                                <button
                                                                    key={i}
                                                                    className={`pagination-number mobHidden ${currentPage === i + 1 ? 'active' : ''}`}
                                                                    onClick={() => setCurrentPage(i + 1)}
                                                                >
                                                                    {i + 1}
                                                                </button>
                                                            ))}

                                                            <button
                                                                className="pagination-button"
                                                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                                                disabled={currentPage === totalPages}
                                                            >
                                                                Next
                                                            </button>
                                                        </>)}

                                                    </div>
                                                </div>
                                            </div>
                                        </>)}
                                    </div>


                                </Tab.Pane>
                                <Tab.Pane eventKey="JobDescription">
                                    <div className="job-card tabtwo">
                                        <h3 className="section-title">Job Description</h3>
                                        <div
                                            className="job-description"
                                            dangerouslySetInnerHTML={{
                                                __html: detailedJobData.job_description?.overview || ""
                                            }}
                                        ></div>

                                        <h3 className="section-title">Job Requirements</h3>
                                        <ul className="job-requirements">
                                            {detailedJobData.job_highlights?.requirements?.map((item, index) => (
                                                <li key={index}>{item}</li>
                                            ))}
                                        </ul>


                                        <h3 className="section-title">Responsibilities</h3>
                                        <ul className="job-requirements">
                                            {detailedJobData.job_highlights?.responsibilities?.map((item, index) => (
                                                <li key={index}>{item}</li>
                                            ))}
                                        </ul>
                                        {Array.isArray(detailedJobData.job_highlights?.benefits) &&
                                            detailedJobData.job_highlights?.benefits[0]?.trim().length > 0 && (<>
                                                <h3 className="section-title">Benefits</h3>
                                                <ul className="job-requirements">

                                                    {detailedJobData.job_highlights?.benefits?.map((item, index) => (
                                                        <li key={index}>{item}</li>
                                                    ))}
                                                </ul>
                                            </>)}
                                        {detailedJobData.job_description?.additional_comments !== "" && (
                                            <>
                                                <h3 className="section-title">Additional Comments</h3>
                                                <div
                                                    className="job-description"
                                                    dangerouslySetInnerHTML={{
                                                        __html: detailedJobData.job_description?.additional_comments || ""
                                                    }}
                                                ></div>
                                            </>
                                        )}




                                        <div className="job-info-row">
                                            <div className="job-info-section">
                                                <h4 className="info-title">Job Details</h4>
                                                <div className="info-item">
                                                    <FaBriefcase className="info-icon" />
                                                    <span>{detailedJobData.job_employment_type}</span>
                                                </div>
                                                <div className="info-item">
                                                    <FaUsers className="info-icon" />
                                                    <span>{totalCandidates} {totalCandidates == 1 ? "Applicant" : "Applicants"}</span> {/* Update if you have dynamic data */}
                                                </div>
                                                <div className="info-item">
                                                    <FaCalendarAlt className="info-icon" />
                                                    <span>
                                                        Start date : {new Date(detailedJobData.start_date).toLocaleDateString('en-US')}
                                                    </span>

                                                </div>
                                                

                                            </div>

                                            <div className="job-info-section">
                                                <h4 className="info-title">Job posted by</h4>
                                                <div className="info-item">
                                                    <FaEnvelope className="info-icon" />
                                                    <span>{detailedJobData.job_posted_by}</span>
                                                </div>
                                                <div className="info-item">
                                                    <BuildingIcon className="info-icon" size={14} />
                                                    <span>{detailedJobData.job_publisher}</span>
                                                </div>
                                                <div className="info-item">
                                                    <FaCalendarAlt className="info-icon" />
                                                    <span>
                                                        Posted on {new Date(detailedJobData.job_posted_at_datetime_utc).toLocaleDateString('en-US')}
                                                    </span>

                                                </div>
                                            </div>
                                            
                                            {/* <div className="job-info-section">
                                            <h4 className="info-title">Job Publisher</h4>
                                            <div className="info-item">
                                                <FaEnvelope className="info-icon" />
                                                <span>{detailedJobData.job_posted_by}</span>
                                            </div>
                                            </div> */}
                                        </div>


                                    </div>


                                </Tab.Pane>
                            </Tab.Content>
                        </Tab.Container>
                    </div>
                </div>
                {applicantProcess && (<>
                    <ApplicationProcessing visible={applicantProcess} />
                </>)}
                {popupType !== "" && (
                    <Sidepopup detailedJobData={detailedJobData} selectedProfile={selectedProfile} popupType={popupType} setPopupType={setPopupType} setMessage={setMessage} setType={setType} setShowLoader={setShowLoader} paginatedCandidates={paginatedCandidates} />
                )}
                {profileClicked == true && (<>
                    <CenterViewPopup profileactiveTab={profileactiveTab} base64Pdf={base64Pdf} setBase64Pdf={setBase64Pdf} referencesData={referencesData} getCandidatesDetails={getCandidatesDetails} message={message} setReferenceData={setReferenceData} setProfileActiveTab={setProfileActiveTab} setMessage={setMessage} setType={setType} DownloadPdf={DownloadPdf} setShowPdfPopup={setShowPdfPopup} detailedJobData={detailedJobData} profileClicked={profileClicked} setProfileClicked={setProfileClicked} matchSummary={matchSummary} missingSkills={missingSkills} selectedProfile={selectedProfile} inteviewViewActive={inteviewViewActive} setInterviewViewActive={setInterviewViewActive} setPopupType={setPopupType} centerViewType={centerViewType} setCenterViewType={setCenterViewType} refereeData={refereeData} setRefereeData={setRefereeData} setShowLoader={setShowLoader} submissionSelected={submissionSelected} setSubmissionSelected={setSubmissionSelected} inviteReminder={inviteReminder} setInviteReminder={setInviteReminder} />
                </>)}
                {
                    showPdfPopup && (
                        <div className={`pdf-modal-overlay ${showPdfPopup ? "popupOpen" : ""}`}>
                            <div className="pdf-modal-container">
                                <div className="pdf-modal-header">
                                    <div className="pdf-modal-title">
                                        <FileText />
                                        <span>{selectedProfile.first_name} {selectedProfile.last_name} - Resume</span>
                                    </div>
                                    <button
                                        className="pdf-modal-close"
                                        onClick={() => setShowPdfPopup(false)}
                                    >
                                        ×
                                    </button>
                                </div>
                                <div className="divider"></div>
                                <iframe
                                    title="Resume PDF"
                                    src={`data:application/pdf;base64,${base64Pdf}`}
                                    className="pdf-iframe"
                                />
                            </div>
                        </div>
                    )
                }
                {message !== "" && (
                    <>
                        <ToastSuccess message={message} type={type} setMessage={setMessage} setType={setType} />
                    </>
                )}
            </Fragment>

        </>
    )
}

export default CandidateListing