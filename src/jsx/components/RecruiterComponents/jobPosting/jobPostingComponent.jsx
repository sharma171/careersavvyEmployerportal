import React, { Fragment, useState, useEffect, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ThemeContext } from "../../../../context/ThemeContext";
import { setJobId } from "../../../../store/actions/actions";
import { FaCalendarAlt, FaClock, FaCog, FaUsers } from "react-icons/fa";
import JobPostModal from './JobPostModal';
import styles from "../css/jobPosting.module.css";
import JobListingBoard from "./jobListing";
import { RefreshCcw } from "lucide-react";
const JobPostingComponent = () => {
  const userEmail = useSelector(state => state.auth.auth.email);
  const dispatch = useDispatch();
  const [jobData, setJobData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editJob, setEditJob] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [showLoader, setShowLoader] = useState("");


  const handleSuccess = (updatedData) => {
    console.log('Updated Job List:', updatedData);
    // Refresh job list or notify
  };
  return (
    <Fragment>
      <div className={styles["job-posting-wrapper"]}>
        <div className={`d-flex justify-content-between align-items-center mb-4 ${styles.topMenu}`}>
          <h2 className={` ${styles.pageHeading}`}>Job Postings</h2>
          <div className={styles.buttonRow}>
            <button
              className={`${styles.editJobBtn} d-flex align-items-center`}
              onClick={() => {
                setRefresh(!refresh);
                // setShowLoader("Refreshing")
              }}
            >
              <RefreshCcw size={16} />
              Refresh
            </button>
            <button className={`${styles.createJobPostBtn} d-flex align-items-center`} onClick={() => { setEditJob(null);setShowModal(true);setModalOpen(true);setShowLoader("Create New Job Post") }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus h-4 w-4 mr-2"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg> Post a New Job
            </button>
            
          </div>
        </div>

        <div className="row g-3">
          <div className="col-md-3">
            <div className={`${styles.cardBox} d-flex justify-content-between align-items-center`}>
              <div>
                <p className={`mb-0 ${styles.boxText}`}>Total Jobs</p>
                <h4 className="fw-semibold fs-3 lh-base mb-0">{jobData?.length}</h4>
              </div>
              <div className={`${styles.iconWrapper} ${styles.purple}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar h-5 w-5 text-purple-600"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className={`${styles.cardBox} d-flex justify-content-between align-items-center`}>
              <div>
                <p className={`mb-0 ${styles.boxText}`}>Active Jobs</p>
                <h4 className="fw-semibold fs-3 lh-base mb-0">
                  {
                    jobData?.filter(
                      job => job.job_status && job.job_status.toLowerCase() === 'active'
                    ).length
                  }
                </h4>
              </div>
              <div className={`${styles.iconWrapper} ${styles.green}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clock h-5 w-5 text-green-600"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className={`${styles.cardBox} d-flex justify-content-between align-items-center`}>
              <div>
                <p className={`mb-0 ${styles.boxText}`}>Pending Review</p>
                <h4 className="fw-semibold fs-3 lh-base mb-0">
                  {
                    jobData?.filter(
                      job => job.job_status && job.job_status.toLowerCase() === 'review'
                    ).length
                  }
                </h4>
              </div>
              <div className={`${styles.iconWrapper} ${styles.yellow}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-settings h-5 w-5 text-amber-600"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className={`${styles.cardBox} d-flex justify-content-between align-items-center`}>
              <div>
                <p className={`mb-0 ${styles.boxText}`}>Total Applicants</p>
                <h4 className="fw-semibold fs-3 lh-base mb-0">
                  {
                    jobData?.reduce((total, job) => {
                      return total + (job.application_count || 0);
                    }, 0)
                  }
                </h4>
              </div>
              <div className={`${styles.iconWrapper} ${styles.blue}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-users h-5 w-5 text-blue-600"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
            </div>
          </div>
        </div>

        <JobListingBoard jobData={jobData} setJobData={setJobData}
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          modalData={showModal}
          refresh={refresh}
          showLoader={showLoader} setShowLoader={setShowLoader}
        />
      </div>
      <JobPostModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSuccess={handleSuccess}
        editJobData={editJob}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
      />

    </Fragment>
  )
}

export default JobPostingComponent