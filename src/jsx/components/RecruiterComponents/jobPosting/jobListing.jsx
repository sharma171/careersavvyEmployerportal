import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styles from "../css/jobPosting.module.css";
import { Building, Calendar, Users, Eye, Pen, Clock, EyeIcon } from 'lucide-react';
import { FaUsers, FaFilter } from "react-icons/fa";
import "../css/paginationDefault.css";
import CSavvyPageLoader from "../cSavvvyPageLoader";
import ToastPopup from "../toastSucces";
import { Dropdown } from "react-bootstrap";
import JobPostModal from './JobPostModal';
import { setJobId, setDetailedJobData, setCreateJobStatus } from "../../../../store/actions/actions";
import "../css/jobTableStyles.css";

const tabs = ["All", "Active", "Review", "Draft", "Closed"];

// Single source of truth for values; label keeps legacy "All Status" in UI
const statusOptions = [
  { label: "All Status", value: "All" },
  { label: "Active", value: "Active" },
  { label: "Review", value: "Review" },
  { label: "Draft", value: "Draft" },
  { label: "Closed", value: "Closed" },
];

const JobCard = ({ job, onEditClick }) => {
  const {
    job_title,
    employer_name,
    job_city,
    job_state,
    job_country,
    job_is_remote,
    job_description,
    job_employment_type,
    job_posted_at_datetime_utc,
    job_status,
    job_id,
    num_of_hire,
    salary_range,
    salary_type,
    start_date
  } = job;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const openApplicants = (job) => {
    localStorage.removeItem("detailedJobData");
    localStorage.removeItem("jobId");
    dispatch(setDetailedJobData(job));
    dispatch(setJobId(job.job_id));
    localStorage.setItem("detailedJobData", JSON.stringify(job));
    localStorage.setItem("jobId", job.job_id);
    navigate("/candidatelist");
  };

  const locationType = job_is_remote ? "Remote" : `${job_city}, ${job_state}, ${job_country}`;
  const getDaysAgo = (postedDate) => {
    const posted = new Date(postedDate);
    const today = new Date();

    // Set both times to midnight for proper date-only comparison
    posted.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const differenceInDays = Math.floor(
      (today - posted) / (1000 * 60 * 60 * 24)
    );

    return differenceInDays <= 0
      ? "Today"
      : `${differenceInDays} day${differenceInDays > 1 ? "s" : ""} ago`;
  };

  const postedDaysAgo = getDaysAgo(job_posted_at_datetime_utc);


  return (
    <div className={`${styles.jobCard} JobCard${job_status} card`}>
      <div className={`card-body ${styles.cardinner}`}>
        <div className="d-flex justify-content-between align-items-start">
          <div className={styles.jobCardUpper}>
            <p className={` ${styles.jobCompany}`}><Building />{employer_name}</p>
            <h5 className={` ${styles.jobTitle}`}>{job_title}</h5>
            <div className={`d-flex ${styles.LocationWorkTime}`}>
              <div className={styles.locationDiv}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin h-3 w-3 flex-shrink-0"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path><circle cx="12" cy="10" r="3"></circle></svg>
                <p className={`text-muted ${styles.jobLocation}`}>{locationType}</p>
              </div>
              <div className={styles.locationDiv}>
                <Clock />
                <p className={`text-muted ${styles.jobLocation}`}>{job_employment_type}</p>
              </div>
            </div>

            <div className={styles.statusSalaryrow}>
              <span className={`${styles.statusTag} ${styles[job_status?.toLowerCase()] || ''}`}>
                {job_status}
              </span>
              <p className={`mb-0 ${styles.jobSalary}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-dollar-sign h-3 w-3"><line x1="12" x2="12" y1="2" y2="22"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                {salary_range !== "" && salary_range !== undefined
                  ? (<>{salary_range} {salary_type === "Hourly" ? (<>/hr</>) : (<>/yr</>)}</>)
                  : (<>{job_description?.compensation || "Not specified"} </>)}
              </p>
            </div>
          </div>
        </div>

        <div className={`d-flex justify-content-between align-items-start ${styles.postApplicantsRow}`} >
          <div className={styles.postSection}>
            <div className={styles.icon}><Calendar /></div>
            <div className={styles.postColumn}>
              <span className={styles.postTitle}>Posted</span>
              <span className={styles.postTime}>
                {/* {postedDaysAgo === 0 ? "Today" : `${postedDaysAgo} ${postedDaysAgo === 1 ? "day ago" : "days ago"}`} */}
                {postedDaysAgo == "-1 day ago" ? "Today" : (<>{postedDaysAgo}</>)}
              </span>
            </div>
          </div>

          <div className={styles.postSection}>
            <div className={styles.icon}><Users /></div>
            <div className={styles.postColumn}>
              <span className={styles.postTitle}>{job.application_count === 1 ? "Application" : "Applications"}</span>
              <span className={styles.postTime}>{job.application_count || 0}</span>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center pt-3 gap-2">
          <button className={styles.applicantButton} onClick={() => openApplicants(job)}><Eye />View Applicants</button>
          <button className={styles.cardEditbtn} onClick={() => onEditClick(job)}><Pen />Edit Job</button>
        </div>
      </div>
    </div>
  );
};

const JobTable = ({ job, onEditClick }) => {
  const {
    job_title,
    employer_name,
    job_city,
    job_state,
    job_country,
    job_is_remote,
    job_description,
    job_posted_at_datetime_utc,
    job_status,
    salary_range,
    salary_type,
    job_id,
  } = job;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const openApplicants = (job) => {
    localStorage.removeItem("detailedJobData");
    localStorage.removeItem("jobId");
    dispatch(setDetailedJobData(job));
    dispatch(setJobId(job.job_id));
    localStorage.setItem("detailedJobData", JSON.stringify(job));
    localStorage.setItem("jobId", job.job_id);
    navigate("/candidatelist");
  };

  const locationType = job_is_remote ? "Remote" : `${job_city}, ${job_state}, ${job_country}`;
  const getDaysAgo = (postedDate) => {
    const posted = new Date(postedDate);
    const today = new Date();

    // Set both times to midnight for proper date-only comparison
    posted.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const differenceInDays = Math.floor(
      (today - posted) / (1000 * 60 * 60 * 24)
    );

    return differenceInDays <= 0
      ? "Today"
      : `${differenceInDays} day${differenceInDays > 1 ? "s" : ""} ago`;
  };

  const postedDaysAgo = getDaysAgo(job_posted_at_datetime_utc);

  return (
    <tr>
      <td>
        <div className="job-title">{job_title}</div>
      </td>
      <td style={{ display: "flex", flexDirection: "row", gap: "0", alignItems: "center" }}>
        <div className="company-logo">{(employer_name || '').slice(0, 1)}</div>
        <div>
          <div className="company-name">{employer_name}</div>
        </div>
      </td>
      <td>
        <div className="job-location">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin h-3 w-3 flex-shrink-0"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path><circle cx="12" cy="10" r="3"></circle></svg> {locationType}
        </div>
      </td>
      <td>
        <span className="salary-text">
          {salary_range !== "" && salary_range !== undefined
            ? (<>$ {salary_range} {salary_type === "Hourly" ? (<>/hr</>) : (<>/yr</>)}</>)
            : (<>$ {job_description?.compensation || "Not specified"} </>)}
        </span>
      </td>
      <td>
        <span className={`status-tag ${job_status?.toLowerCase()}`}>{job_status}</span>
      </td>
      <td>
        <Users /> {job?.application_count || 0}
      </td>
      <td>
        <Calendar />
        {/* {postedDaysAgo === 0 ? "Today" : `${postedDaysAgo} ${postedDaysAgo === 1 ? "day ago" : "days ago"}`} */}
        {postedDaysAgo == "-1 day ago" ? "Today" : (<>{postedDaysAgo}</>)}
      </td>
      <td>
        <i className="bi bi-eye action-icon smallButtons" onClick={() => openApplicants(job)}>
          <EyeIcon size={12} /><span className="textView">View Job</span>
        </i>
        <i className="bi bi-three-dots action-icon smallButtons" onClick={() => onEditClick(job)}>
          <Pen size={12} /><span className="textView">Edit Job</span>
        </i>
      </td>
    </tr>
  );
};

const JobListingBoard = ({ jobData, setJobData, modalOpen, setModalOpen, modalData, refresh, showLoader, setShowLoader }) => {
  // single source of truth for tab/dropdown selection
  const [statusFilter, setStatusFilter] = useState("All");

  // const [showLoader, setShowLoader] = useState("");
  const [message, setMessage] = useState("");
  const { createJobStatus } = useSelector((state) => state.profile);
  const userEmail = useSelector(state => state.auth.auth.email);
  const [type, setType] = useState("");
  const [viewType, setViewType] = useState("Grid");

  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editJob, setEditJob] = useState(null);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const dispatch = useDispatch();

  useEffect(() => {
    if (userEmail !== "") {
      getJobListing();
      if (!modalOpen) {
        setShowLoader("Getting jobs");
      }
      if (createJobStatus) {
        if (modalOpen) {
          setShowLoader("Create New Job Post");

        }
        getJobListing();
        // keep original call as provided; if a dispatch is required, adapt accordingly
        setCreateJobStatus("");
      }
    }
  }, [createJobStatus, message, type, userEmail, modalData, refresh]);
  const getJobListing = async () => {
    try {
      const listQuery = {
        task_name: "retrieve",
        job_id: "",
        job_posted_by: "",
        email: userEmail,
      };
      const response = await fetch("https://save-employer-job-post-v10-737421501165.us-east1.run.app", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(listQuery),
      });
      const data = await response.json();
      setJobData(data.data);
      console.log("jobData", data);
    } catch (error) {
      console.log(error);
    } finally {
      setShowLoader("");
    }
  };

  const handleSuccess = () => {
    setShowModal(false);
    setEditJob(null);
    getJobListing();
  };

  // filter using single statusFilter
  const filteredJobs = (jobData || []).filter((job) => {
    const matchesStatus =
      statusFilter === "All" ||
      (job.job_status || "").toLowerCase() === statusFilter.toLowerCase();
    const matchesSearch = (job.job_title || "").toLowerCase().includes((searchTerm || "").toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage) || 1;
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  const paginatedJobs = filteredJobs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };
  const pageSizes = [5, 10, 20];

  const renderPagination = () => (
    <div className={`paginationC-Savvy-Emp d-flex justify-content-between align-items-center ${viewType === "Grid" ? "" : "mt-3"}`}>
      <div className="d-flex align-items-center gap-2">
        <span>Show</span>
        <Dropdown
          onSelect={(eventKey) => {
            if (!eventKey) return;
            const value = Number(eventKey);
            setItemsPerPage(value);
            setCurrentPage(1);
          }}
        >
          <Dropdown.Toggle id="dropdown-basic" className={`d-flex align-items-center pagination-dropdown ${styles.searchFilter} ${styles.jobPostingSearchFilter}`}>
            {/* <FaFilter className="me-2" /> */}
            {itemsPerPage}
          </Dropdown.Toggle>
          <Dropdown.Menu className={styles.DropDownMenu}>
            {pageSizes.map((num) => (
              <Dropdown.Item
                key={num}
                eventKey={String(num)}
                active={itemsPerPage === num}
                className={`${styles.DropDownItems} ${itemsPerPage === num ? styles.DpiActive : ''}`}
              >
                {num}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>

        <span>Rows</span>
      </div>

      <nav>
        <ul className="pagination mb-0">
          <li className={`page-item navigationButton ${currentPage === 1 && 'disabled'}`}>
            <button className="page-link rightLeft" onClick={() => handlePageChange(currentPage - 1)}>‹</button>
          </li>
          <li className={`page-item active mobileOnly`}>
            <button className="page-link" >{currentPage}</button>
          </li>
          {pageNumbers.slice(0, 5).map((number) => (
            <li key={number} className={`page-item mobileHide ${currentPage === number ? 'active' : ''}`}>
              <button className="page-link" onClick={() => handlePageChange(number)}>{number}</button>
            </li>
          ))}

          {totalPages > 5 && <li className="page-item mobileHide disabled"><span className="page-link">...</span></li>}

          {totalPages > 5 && (
            <li className={`page-item mobileHide ${currentPage === totalPages ? 'active' : ''}`}>
              <button className="page-link" onClick={() => handlePageChange(totalPages)}>{totalPages}</button>
            </li>
          )}

          <li className={`page-item navigationButton ${currentPage === totalPages && 'disabled'}`}>
            <button className="page-link rightLeft" onClick={() => handlePageChange(currentPage + 1)}>›</button>
          </li>
        </ul>
      </nav>
    </div>
  );

  return (
    <>
      {showLoader !== "" && (
        <>

          <CSavvyPageLoader loaderText={`${showLoader}`} /></>)}
      <ToastPopup message={message} type={type} setMessage={setMessage} setType={setType} />

      {/* Tabs */}
      <div className="d-flex justify-content-between JobListingCsavvy align-items-center mb-3 mt-4">
        <div className={`d-flex gap-3 ${styles.bgtabs}`}>
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setStatusFilter(tab);
                setCurrentPage(1);
              }}
              className={`${statusFilter === tab ? `${styles.btntabactive}` : `${styles.btntab}`}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Search & Filter */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div className={styles.searchbox}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
          <input
            type="text"
            placeholder=" Search jobs..."
            className={`form-control ${styles.searchInput}`}
            style={{ maxWidth: "600px" }}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <Dropdown
          onSelect={(value) => {
            if (!value) return;
            setStatusFilter(value);
            setCurrentPage(1);
          }}
        >
          <Dropdown.Toggle id="dropdown-basic" className={`d-flex align-items-center ${styles.searchFilter} ${styles.jobPostingSearchFilter}`}>
            <FaFilter className="me-2" />
            {statusOptions.find(o => o.value === statusFilter)?.label || "All Status"}
          </Dropdown.Toggle>
          <Dropdown.Menu className={styles.DropDownMenu}>
            {statusOptions.map((opt) => (
              <Dropdown.Item
                key={opt.value}
                eventKey={opt.value}
                active={statusFilter === opt.value}
                className={`${styles.DropDownItems} ${statusFilter === opt.value ? styles.DpiActive : ''}`}
              >
                {opt.label}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>

        <div className={styles.viewType}>
          <div
            className={`${styles.ListViewType} ${viewType === "Grid" ? (`${styles.click}`) : ""}`}
            onClick={() => setViewType("Grid")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-grid3x3 h-4 w-4"><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M3 9h18"></path><path d="M3 15h18"></path><path d="M9 3v18"></path><path d="M15 3v18"></path></svg>
          </div>
          <div
            className={`${styles.GridViewType} ${viewType === "Table" ? (`${styles.click}`) : ""}`}
            onClick={() => setViewType("Table")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list h-4 w-4"><path d="M3 12h.01"></path><path d="M3 18h.01"></path><path d="M3 6h.01"></path><path d="M8 12h13"></path><path d="M8 18h13"></path><path d="M8 6h13"></path></svg>
          </div>
        </div>
      </div>

      {/* Job Cards / Table */}
      {viewType === "Grid" ? (
        <div className="row g-4 Csavvy-ListOverFlow">
          {filteredJobs.length > 0 ? (
            paginatedJobs.map((job, index) => (
              <div className="col-md-4" key={index}>
                <JobCard
                  job={job}
                  onEditClick={(job) => {
                    setEditJob(job);
                    setShowModal(true);
                  }}
                />
              </div>
            ))
          ) : (
            <>
              {jobData[0]?.id ? (
                <div className="col-md-4">
                  <div className={`${styles.jobCard} JobCard card`}>
                    <div className={`card-body ${styles.cardinner}`}>
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <p className={` ${styles.jobCompany}`}><Building />----</p>
                          <h5 className={` ${styles.jobTitle}`}>No Jobs to Display</h5>
                          <div className={`d-flex ${styles.LocationWorkTime}`}>
                            <div className={styles.locationDiv}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin h-3 w-3 flex-shrink-0"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path><circle cx="12" cy="10" r="3"></circle></svg>
                              <p className={`text-muted ${styles.jobLocation}`}>------</p>
                            </div>
                            <div className={styles.locationDiv}>
                              <Clock />
                              <p className={`text-muted ${styles.jobLocation}`}>---</p>
                            </div>
                          </div>
                          <div className={styles.statusSalaryrow}>
                            <span className={`${styles.statusTag} `}>-----</span>
                            <p className={`mb-0 ${styles.jobSalary}`}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-dollar-sign h-3 w-3"><line x1="12" x2="12" y1="2" y2="22"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                              ------
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className={`d-flex justify-content-between align-items-start border-top border-bottom ${styles.postApplicantsRow}`} >
                        <div className={styles.postSection}>
                          <div className={styles.icon}><Calendar /></div>
                          <div className={styles.postColumn}>
                            <span className={styles.postTitle}>Posted</span>
                            <span className={styles.postTime}>--</span>
                          </div>
                        </div>
                        <div className={styles.postSection}>
                          <div className={styles.icon}><Users /></div>
                          <div className={styles.postColumn}>
                            <span className={styles.postTitle}>Applications</span>
                            <span className={styles.postTime}>---</span>
                          </div>
                        </div>
                      </div>
                      <div className="d-flex justify-content-between align-items-center pt-3 gap-2">
                        <button className={styles.applicantButton} > <Eye />No Applications </button>
                        <button className={styles.cardEditbtn} onClick={() => { setShowModal(true) }}> <Pen />Create Jobs</button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="col-md-4">
                  <div className={`${styles.jobCard} JobCard card`}>
                    <div className={`card-body ${styles.cardinner}`}>
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <p className={` ${styles.jobCompany}`}><Building />----</p>
                          <h5 className={` ${styles.jobTitle}`}>Loading Jobs</h5>
                          <div className={`d-flex ${styles.LocationWorkTime}`}>
                            <div className={styles.locationDiv}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin h-3 w-3 flex-shrink-0"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path><circle cx="12" cy="10" r="3"></circle></svg>
                              <p className={`text-muted ${styles.jobLocation}`}>------</p>
                            </div>
                            <div className={styles.locationDiv}>
                              <Clock />
                              <p className={`text-muted ${styles.jobLocation}`}>---</p>
                            </div>
                          </div>
                          <div className={styles.statusSalaryrow}>
                            <span className={`${styles.statusTag} `}>-----</span>
                            <p className={`mb-0 ${styles.jobSalary}`}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-dollar-sign h-3 w-3"><line x1="12" x2="12" y1="2" y2="22"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                              ------
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className={`d-flex justify-content-between align-items-start border-top border-bottom ${styles.postApplicantsRow}`} >
                        <div className={styles.postSection}>
                          <div className={styles.icon}><Calendar /></div>
                          <div className={styles.postColumn}>
                            <span className={styles.postTitle}>Posted</span>
                            <span className={styles.postTime}>--</span>
                          </div>
                        </div>
                        <div className={styles.postSection}>
                          <div className={styles.icon}><Users /></div>
                          <div className={styles.postColumn}>
                            <span className={styles.postTitle}>Applications</span>
                            <span className={styles.postTime}>---</span>
                          </div>
                        </div>
                      </div>
                      <div className="d-flex justify-content-between align-items-center pt-3 gap-2">
                        <button className={styles.applicantButton} > <Eye />No Applications </button>
                        <button className={styles.cardEditbtn} onClick={() => { setShowModal(true) }}> <Pen />Create Jobs</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="row g-4">
          {filteredJobs.length > 0 ? (
            <div className="job-table-container JobListingBoard">
              <table className="job-table">
                <thead>
                  <tr>
                    <th>Job Details</th>
                    <th>Company</th>
                    <th>Location</th>
                    <th>Salary Range</th>
                    <th>Status</th>
                    <th>Applications</th>
                    <th>Posted Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody className="">
                  {paginatedJobs.map((job, index) => (
                    <JobTable
                      key={index}
                      job={job}
                      onEditClick={(job) => {
                        setEditJob(job);
                        setShowModal(true);
                      }}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <>
              {jobData[0]?.id ? (
                <div className="job-table-container JobListingBoard">
                  <table className="job-table">
                    <thead>
                      <tr>
                        <th>Job Details</th>
                        <th>Company</th>
                        <th>Location</th>
                        <th>Salary Range</th>
                        <th>Status</th>
                        <th>Applications</th>
                        <th>Posted Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody className="">
                      <tr>
                        <td className="">No Jobs to Display</td>
                        <td className=""></td>
                        <td className=""></td>
                        <td className=""></td>
                        <td className=""></td>
                        <td className=""></td>
                        <td className=""></td>
                        <td className="">
                          <i className="bi bi-three-dots action-icon smallButtons" onClick={() => { setShowModal(true) }}>
                            <Pen size={12} /><span className="textView">Create Job</span>
                          </i>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="job-table-container JobListingBoard">
                  <table className="job-table">
                    <thead>
                      <tr>
                        <th>Job Details</th>
                        <th>Company</th>
                        <th>Location</th>
                        <th>Salary Range</th>
                        <th>Status</th>
                        <th>Applications</th>
                        <th>Posted Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody className="">
                      <tr>
                        <td className="">Loading Jobs</td>
                        <td className=""></td>
                        <td className=""></td>
                        <td className=""></td>
                        <td className=""></td>
                        <td className=""></td>
                        <td className=""></td>
                        <td className="">
                          <i className="bi bi-three-dots action-icon smallButtons" onClick={() => { setShowModal(true) }}>
                            <Pen size={12} /><span className="textView">Create Jobs</span>
                          </i>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {filteredJobs.length > 0 && renderPagination()}

      {showModal && (
        <JobPostModal
          show={showModal}
          onHide={() => setShowModal(false)}
          onSuccess={handleSuccess}
          editJobData={editJob}
          setEditJob={setEditJob}
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
        />
      )}
    </>
  );
};

export default JobListingBoard;
