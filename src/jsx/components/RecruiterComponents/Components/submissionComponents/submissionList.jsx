import React, { useEffect, useState, useCallback } from "react";
import "./submission.css";
import { FileText, PenLine, RefreshCcw, MessageSquare } from "lucide-react";
import Loader from "../spinner";
const SubmissionList = ({
  jobId,
  profile,
  setShowLoader,
  setType,
  message,
  setMessage,
  setCenterViewType,
  setSubmissionSelected,
}) => {
  const [submissionData, setSubmissionData] = useState([]);
  const [dataLoader, setDataLoader] = useState("");
  // useEffect(()=>{
  //   getReference();
  //   employmentSubmissionRequest();
  // },[message])

  // ---- API call: send submission request ----
  const employmentSubmissionRequest = useCallback(
    async (email) => {
      if (!email || !jobId) {
        setType("error");
        setMessage("Missing candidate email or job ID.");
        return;
      }

      setShowLoader("Sending Submission Request");
      try {
        const listQuery = {
          action: "notify_candidate_for_document_upload",
          candidate_mail_id: email,
          job_id: jobId,
        };

        const response = await fetch(
          "https://notify-candidate-employmnt-sub-and-store-data-v10-737421501165.us-east1.run.app",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(listQuery),
          }
        );

        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        setType("success");
        setMessage("Request sent successfully.");
        await response.json();

      } catch (error) {
        console.error("Error sending request:", error);
        setType("error");
        setMessage("Unable to send submission request.");
      } finally {
        setShowLoader("");
      }
    },
    [jobId, setMessage, setType, setShowLoader, message]
  );

  // ---- API call: get submission list ----
  const getReference = useCallback(async () => {
    setDataLoader("Loading Submissions");
    if (!profile?.email || !jobId) return;
    try {
      const listQuery = {
        action: "get_list_of_submission",
        candidate_email: profile.email,
        jobId: jobId,
      };
      const response = await fetch(
        "https://get-employment-data-v10-737421501165.us-east1.run.app",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(listQuery),
        }
      );

      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      const data = await response.json();
      setSubmissionData(Array.isArray(data?.submissions) ? data.submissions : []);
      setDataLoader("");
    } catch (error) {
      console.error("Error fetching submissions:", error);
      setSubmissionData([]);
      setDataLoader("");
    }
  }, [profile?.email, jobId, message]);

  useEffect(() => {
    getReference();
  }, [getReference]);

  // ---- RENDER CONDITIONAL UI ----  
  const renderNoSubmissionUI = () => (
    <>
    {dataLoader==""?(<>
      <div className="tabContentContainer">
      <div className="interview-history-container">
        <h4 className="interview-history-title">Submission Info</h4>
        <div className="interview-history-content">
          <MessageSquare className="interview-icon" />
          <p className="no-interview-text">No submission added yet</p>
          <p className="invite-hint">Send submission request to get started</p>

          <button
            className="invite-button"
            onClick={() => employmentSubmissionRequest(profile?.email)}
          >
            <MessageSquare className="button-icon" />
            Send Submission Request
          </button>
        </div>
      </div>
    </div>
      </>):(<>
      <div className="profileFacade">
                <div className="loaderout">

                    <Loader />
                </div>
                <h3 className="heading">{dataLoader}</h3>

            </div>
      </>)}
      </>
    
  );

  // Case 1: submissionData exists and first item is "not_started"
  if (submissionData[0]?.submission_status === "not_started") {
    return renderNoSubmissionUI();
  }

  // Case 2: there are submissions
  if (submissionData.length > 0) {
    return (
      <>
        {submissionData.map((item, idx) => (
          <div key={idx} className="tabContentContainer">
            <div className="submissionInfoList">
              <div className="submission-header">
                <div className="col-flex">
                  <h3>Submission Details</h3>
                  <span className="submitted-date">
                   Submitted on{" "}
                  {item.submission_submitted
                    ? new Date(item.submission_submitted).toLocaleDateString("en-US", {
                        month: "2-digit",
                        day: "2-digit",
                        year: "numeric",
                      })
                    : "N/A"}

                  </span>
                </div>
                <span
                  className={`status-badge ${
                    item.submission_status?.replace("_", " ") === "completed"
                      ? "completed"
                      : "pending"
                  }`}
                >
                  {item.submission_status?.replace("_", " ") || "unknown"}
                </span>
              </div>

              <div className="submission-card">
                <div className="submission-body">
                  <div className="info-grid">
                    <div>
                      <h4>Employment Types</h4>
                      <span className="badge">
                        {item.employment_type || "not specified"}
                      </span>
                    </div>
                    <div>
                      <h4>Available Start Date</h4>
                      <p>{item.available_start_date || "not specified"}</p>
                    </div>
                    <div>
                      <h4>Work Authorization</h4>
                      <p>{item.work_authorization || "not specified"}</p>
                    </div>
                    <div>
                      <h4>Current Employment</h4>
                      <p>{item.current_employment || "not specified"}</p>
                    </div>
                  </div>

                  <hr />

                  <div className="action-buttons">
                    <button
                      className="action-btn"
                      onClick={() => {
                        setSubmissionSelected(item);
                        setCenterViewType("submissiondetailed");
                      }}
                    >
                      <FileText size={16} className="icon" />
                      View Submission Details
                    </button>
                    <button
                      className="action-btn"
                      onClick={() => {
                        setSubmissionSelected(item);
                        setCenterViewType("requestDetailed");
                      }}
                    >
                      <FileText size={16} className="icon" />
                      View Additional Details
                    </button>
                    <button
                      className="action-btn"
                      onClick={() => setCenterViewType("requestAdditional")}
                    >
                      <PenLine size={16} className="icon" />
                      Request Additional Info
                    </button>
                    <button
                      className="action-btn"
                      onClick={() => employmentSubmissionRequest(profile?.email)}
                    >
                      <RefreshCcw size={16} className="icon" />
                      Resend Form
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </>
    );
  }

  // Case 3: if no submissions at all
  return renderNoSubmissionUI();
};

export default SubmissionList;
