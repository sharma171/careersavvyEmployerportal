import React, { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import "./style/interviewHistory.css";
import "./style/profileTop.css?ver0.4";
import {
  Video,
  Text,
  CircleCheckBig,
  Calendar,
  Clock,
  Eye,
  Star,
  Loader2, Download, TrendingUp, MessageSquare,
  Loader,
  LucideFileVideo,
  LucideFileArchive,
  LucideInfo
} from "lucide-react";

// Helpers
const fmtDate = (iso) =>
  iso
    ? new Date(iso).toLocaleString("en-US", {
      month: "short",   // e.g., Oct
      day: "2-digit",   // 24
      year: "numeric",  // 2025
      hour: "2-digit",  // 02
      minute: "2-digit",// 30
      hour12: true      // 12-hour format with AM/PM
    })
    : "—";


const fmtDuration = (sec) =>
  sec ? `${Math.round(sec / 60)} minutes` : "0 minutes";


const RatingCard = ({ label, value = 0, colorClass = "yellow" }) => {
  // value is expected to be a number between 0 and 10 (can be float)
  const percent = Math.max(0, Math.min(100, (Number(value) || 0) * 10)); // percent 0-100

  return (
    <div className="rating-card">
      <div className="rating-card-header">
        <span className="rating-label">{label}</span>
        <span className={`rating-pill ${colorClass}`}>{Number(value).toFixed(1)}/10</span>
      </div>

      <div className="rating-bar-outer" aria-hidden>
        <div className="rating-bar-inner" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
};

const StatCard = ({ label, value, highlighted }) => (
  <div className={`qs-card ${highlighted ? "highlight" : ""}`}>
    <div className="qs-number">{value}</div>
    <div className="qs-label">{label}</div>
  </div>
);

const InterviewHistory = ({ selectedProfile, setMessage, setType, matchSummary }) => {
  const { userInterviewList } = useSelector((state) => state.profile);
  const [docid, setDocId] = useState("");
  const userEmail = useSelector(state => state.auth.auth.email);
  const [interviewData, setInterviewData] = useState([]);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const profile = selectedProfile || {};
  useEffect(() => {
    if (docid !== "") {
      InterviewByDocument()
    }
  }, [docid])

  const getDurationFromTimestamps = (start, end) => {
    if (!start || !end) return "0 minutes";

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (isNaN(startDate) || isNaN(endDate)) return "0 minutes";

    const diffMs = endDate - startDate;          // milliseconds
    const diffSec = Math.max(0, diffMs / 1000);  // seconds
    const minutes = Math.round(diffSec / 60);    // rounded minutes

    return `${minutes} minutes`;
  };

  const [base64Pdf, setBase64Pdf] = useState("");
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(now.getDate()).padStart(2, '0');
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const currentDateTime = `${month}-${day}-${year}_${hours}-${minutes}-${seconds}`;
  const DownloadPdf = () => {


    if (!base64Pdf) {
      // alert("No PDF data available!");
      setType("interview");
      setMessage([{ topName: "Report Unavailable", para: "No interview summary available to generate report" }]);
    }
    else {

      // Convert Base64 to Blob
      const byteCharacters = atob(base64Pdf);
      const byteNumbers = Array.from(byteCharacters).map((char) => char.charCodeAt(0));
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });

      // Create a link and trigger download
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${"InterviewReport".replace(".docx", "")}_${currentDateTime}.pdf`;
      link.click();

      // Clean up
      URL.revokeObjectURL(link.href);
    }
  };


  const InterviewByDocument = async () => {
    try {
      const listQuery = {
        "action": "fetch_by_id",
        "recruiter_email": userEmail,
        "doc_id": docid
      }
      const response = await fetch("https://fetch-all-interviews-feedback-v10-737421501165.us-east1.run.app", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(listQuery),
      })
      const data = await response.json();

      console.log("InterviewList By Id", data);
      setInterviewData(data);

    } catch (error) {
      console.log(error)
    }
  }
  const generateInterviewReport = async () => {
    setBase64Pdf("");
    setDownloadLoading(true);
    try {
      const listQuery = {
        "action": "generate_pdf",
        "recruiter_email": userEmail,
        "doc_id": docid
      }
      const response = await fetch("https://fetch-all-interviews-feedback-v10-737421501165.us-east1.run.app", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(listQuery),
      })
      const data = await response.json();

      setBase64Pdf(data.pdf_data);
      setDownloadLoading(false);

    } catch (error) {
      setBase64Pdf("");
      setDownloadLoading(false);
      console.log(error)
    }
  }


  useEffect(() => {

    if (base64Pdf !== "") {
      DownloadPdf();
      setDownloadLoading(false);
    }
  }, [base64Pdf])

  const interview = interviewData?.interview;

  const formatDate = (iso) => {
    const date = new Date(iso);
    return date.toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  const durationMinutes = Math.floor((interview?.max_duration_seconds || 0) / 60);
  //component helpers
  const r = interview?.formatted_feedback?.ratings || {};

  const technical = interview?.question_count?.technical || 0;
  const behavioral = interview?.question_count?.behavioral || 0;
  const introduction = interview?.question_count?.introduction || 0;
  const total = technical + behavioral + introduction;
  // --- helpers (add inside component scope, near other helpers) ---
  const isWithinDays = (interviewObj, days = 3) => {
    if (!interviewObj) return false;
    // Prefer timestamp_completed, fallback to timestamp_started
    const endIso = interviewObj.timestamp_completed || interviewObj.timestamp_started;
    if (!endIso) return false;
    const endTs = new Date(endIso).getTime();
    if (isNaN(endTs)) return false;
    const expiryTs = endTs + days * 24 * 60 * 60 * 1000;
    return Date.now() < expiryTs;
  };

  // ---- add inside InterviewHistory component ----

  const downloadInterviewVideo = async () => {
  try {
    setDownloadLoading(true);

    // Call the API to get the download_url
    const url = `https://video-recording-functionality-v10-737421501165.us-east1.run.app?action=download&job_id=${encodeURIComponent(
      interview?.job_id
    )}&candidate_email=${encodeURIComponent(
      interview?.candidate_email || userEmail
    )}`;

    const resp = await fetch(url);
    const json = await resp.json();

    if (!json?.data?.download_url) {
      setType("interview");
      setMessage([{ topName: "Download failed", para: "No download URL returned" }]);
      setDownloadLoading(false);
      return;
    }

    const downloadUrl = json.data.download_url;

    // ✅ Open video in new tab (CORS safe, correct way)
    window.open(downloadUrl, "_blank", "noopener,noreferrer");

    setDownloadLoading(false);
  } catch (err) {
    console.error(err);
    setType("interview");
    setMessage([{ topName: "Download failed", para: "An error occurred while opening the video." }]);
    setDownloadLoading(false);
  }
};



  const getRemainingTimeText = (interviewObj, days = 3) => {
    if (!interviewObj) return "";
    const endIso = interviewObj.timestamp_completed || interviewObj.timestamp_started;
    if (!endIso) return "";
    const endTs = new Date(endIso).getTime();
    if (isNaN(endTs)) return "";
    const expiryTs = endTs + days * 24 * 60 * 60 * 1000;
    const diff = expiryTs - Date.now();
    if (diff <= 0) return "Expired";

    const mins = Math.floor(diff / (1000 * 60));
    const daysLeft = Math.floor(mins / (60 * 24));
    const hoursLeft = Math.floor((mins % (60 * 24)) / 60);
    const minutesLeft = mins % 60;

    let parts = [];
    if (daysLeft > 0) parts.push(`${daysLeft} day${daysLeft > 1 ? "s" : ""}`);
    if (hoursLeft > 0) parts.push(`${hoursLeft} hour${hoursLeft > 1 ? "s" : ""}`);
    if (daysLeft === 0 && hoursLeft === 0 && minutesLeft > 0) parts.push(`${minutesLeft} minute${minutesLeft > 1 ? "s" : ""}`);

    return parts.join(" ");
  };



  return (
    <>
      <div className="bordered">
      </div>

      <div className="profileInterviewHistory">

        {console.log("interviewData", userInterviewList)}
        <div className="HistoryTabs">
          {userInterviewList?.map((interview, index) => {
            const statusLabel =
              interview.status === "completed" ? "Completed" : "In Progress";
            const statusClass =
              interview.status === "completed" ? "completed" : "in-progress";

            const modeLabel =
              interview.mode === "video"
                ? "Video Interview"
                : "Text Interview";

            return (<>
              {interview?.doc_id && interview.status !== "in_progress" ? (<>
                <div className={`interview-card ${interview.doc_id == docid ? "active" : ""}`} key={interview.doc_id} onClick={() => setDocId(interview.doc_id)}>
                  <div className="interview-card-header">
                    <div className="tags">
                      <span className="tag video">
                        {modeLabel == "Text Interview" ? (
                          <>
                            <LucideFileArchive className="icon" /> {modeLabel}
                          </>
                        ) : (
                          <>
                            <LucideFileVideo className="icon" /> {modeLabel}
                          </>
                        )}
                        {/* <Video className="icon" /> {modeLabel} */}
                      </span>
                      <span className={`tag`} style={{ marginRight: "auto" }}>
                        <Clock size={14} className="icon" />
                        {getDurationFromTimestamps(
                          interview.timestamp_started,
                          interview.timestamp_completed
                        )}
                      </span>

                      <span className={`tag ${statusClass}`}>
                        {interview.status === "completed" ? (
                          <CircleCheckBig className="icon" />
                        ) : (
                          <Loader2 className="icon spin" />
                        )}
                        {statusLabel}
                      </span>

                    </div>

                    {/* <div className="interview-number">#{index + 1}</div> */}
                  </div>

                  <div className="interview-date-time">
                    <p style={{ fontSize: "15px" }}>
                      <strong>
                        {matchSummary?.candidate_profile?.current_role}
                      </strong>
                    </p>
                    <p>
                      <Calendar size={14} className="icon" />{" "}
                      {fmtDate(interview.timestamp_started)}
                    </p>
                    {/* <p>
                      <Clock size={14} className="icon" /> Duration:{" "}
                      {getDurationFromTimestamps(
                        interview.timestamp_started,
                        interview.timestamp_completed
                      )}
                    </p> */}
                  </div>

                  {interview.rating && (
                    <div className="interview-rating">
                      <Star className="star-icon" />
                      <span className="rating-text">
                        {interview.rating} Overall Fit
                      </span>
                    </div>
                  )}

                  <p className="interview-summary">
                    {interview.summary || "No summary available yet."}
                  </p>
                </div>
              </>) : (<></>)}
            </>

            );
          })}
        </div>
        <div className="HistoryTabs">
          {interviewData.length == 0 ? (
            <>
              <div className="placeholder-container">
                <div className="placeholder-icon"><Eye /></div>
                <div className="placeholder-text">
                  Select an interview from the list to <br /> view detailed results
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="interview-details-container">
                <div className="interview-header">
                  <h2>Interview Details</h2>
                  <button className="download-btn" onClick={() => generateInterviewReport()}>
                    {downloadLoading ? (
                      <>
                        <Loader className="downloadLoading" />
                        <span>Downloading ...</span>
                      </>
                    ) : (
                      <>
                        <Download size={16} />
                        <span>Download Report</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="interview-mode-tag">
                  {interview?.interview_type?.includes('audio') ? (
                    <>
                      <LucideFileArchive className="icon" />
                    </>
                  ) : (
                    <>
                      <LucideFileVideo className="icon" />
                    </>
                  )}
                  <span>{interview?.interview_type?.includes('audio') ? 'Text Interview' : 'Video Interview'}</span>
                </div>

                <div className="interview-timestamp">
                  <div className="dateData">
                    <strong>Started:</strong>
                    <p>{formatDate(interview?.questions?.[0]?.timestamp)}</p>
                  </div>
                  <div className="dateData">
                    <strong>Duration:</strong>
                    <p>{durationMinutes} minutes</p>
                  </div>
                </div>
                {(!interview?.interview_type?.includes('audio') && isWithinDays(interview, 3)) && (
                  <>
                    <div className="videoRecordBox">
                      <div className="topHeading">
                        <LucideInfo size={16} className="headIcons" />
                        Available to download for: {getRemainingTimeText(interview, 3) || "Less than a minute"}
                      </div>
                      <p className="text">
                        Available until: {formatDate(
                          // expiry ISO: timestamp_completed (or started) + 3 days
                          (() => {
                            const endIso = interview?.timestamp_completed || interview?.timestamp_started;
                            if (!endIso) return "";
                            const expiry = new Date(endIso);
                            expiry.setDate(expiry.getDate() + 3);
                            return expiry.toISOString();
                          })()
                        )}
                      </p>
                      <p className="text">
                        Interview recordings are stored securely and remain available for download for up to 3 days after completion.
                      </p>
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <button
                        className="download-btn filled"
                        onClick={downloadInterviewVideo}
                        disabled={downloadLoading}
                      >
                        {downloadLoading ? (
                          <>
                            <Loader className="downloadLoading" />
                            <span>Downloading ...</span>
                          </>
                        ) : (
                          <>
                            <Download className="icon" />
                            Open Video
                          </>
                        )}
                      </button>

                    </div>
                  </>
                )}




                {interview?.formatted_feedback && (
                  <>
                    <hr />
                    <div className="perf-section">
                      <div className="perf-title">
                        <TrendingUp className="perf-icon" />
                        <h4>Performance Ratings</h4>
                      </div>

                      <div className="perf-grid">
                        <RatingCard label="Overall Fit" value={r.overall_fit ?? 0} colorClass="orange" />
                        <RatingCard label="Technical Knowledge" value={r.technical_knowledge ?? 0} colorClass="green" />
                        <RatingCard label="Communication Skills" value={r.communication_skills ?? 0} colorClass="orange" />
                        <RatingCard label="Problem Solving Approach" value={r.problem_solving_approach ?? 0} colorClass="green" />
                      </div>
                    </div>
                  </>
                )}


                <hr />

                <div className="qs-section">
                  <div className="qs-title">
                    <MessageSquare className="qs-icon" />
                    <h4>Questions Summary</h4>
                  </div>

                  <div className="qs-cards">
                    <StatCard label="Total Questions" value={total} highlighted />
                    <StatCard label="Technical" value={technical} />
                    <StatCard label="Behavioral" value={behavioral} />
                    <StatCard label="Introduction" value={introduction} />
                  </div>

                  <div className="qs-summary-box">
                    <div className="qs-summary-title">Summary</div>
                    <div className="qs-summary-text">
                      {interview?.formatted_feedback?.summary
                        ? interview?.formatted_feedback?.summary
                        : 'Interview is not yet completed.'}
                    </div>
                  </div>
                </div>



                {interview?.formatted_feedback && (<>
                  <hr />

                  <div className="section">
                    <h4 className="section-heading green-text">Key Strengths</h4>
                    <ul className="strengths-list">
                      {interview?.formatted_feedback.analysis_highlights.map((strength) => (<>
                        <li>
                          <span className="check-icon"><CircleCheckBig /></span>
                          {strength}
                        </li>
                      </>))}
                    </ul>
                  </div>
                </>)}
                {interview?.formatted_feedback && (<>
                  <hr />

                  <div className="section">
                    <h4 className="section-heading orange-text">Areas for Improvement</h4>
                    <ul className="improvements-list">
                      {interview?.formatted_feedback?.areas_for_improvement.map((improvement) => (
                        <>

                          <li>
                            <span className="arrow-icon"><TrendingUp /></span>
                            {improvement}
                          </li>
                        </>
                      ))}

                    </ul>
                  </div>
                </>)}

              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default InterviewHistory;
