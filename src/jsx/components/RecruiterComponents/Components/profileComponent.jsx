import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./style/profileTop.css?ver0.5";
import OverviewDashboard from "./overviewDashboard";
import { Dropdown } from "react-bootstrap";
import InterviewHistory from "./interviewHistory";
import styles from "../css/jobPosting.module.css";
import { Phone, Eye, Download, MessageSquare, Redo, SendToBack, Send, LucideFileWarning, CircleCheckBigIcon } from 'lucide-react';
import { CheckCircle, Calendar, Mail, ArrowRight, RefreshCcw } from "lucide-react";
import { FaEnvelope, FaPhone, FaCalendarAlt, FaDownload, FaVideo, FaUserCheck, FaStar, FaPaperPlane } from 'react-icons/fa';
import SubmissionList from "./submissionComponents/submissionList";
import RateConfirmation from "./rateConfirmations/rateConfirmationProfile";
import DetaiiledList from "./detaiiledList";

const tabs = ["Overview", "Interview History", "References", "Submission Info", "Rate Confirmations"];

const ProfileComponent = ({ profileClicked, setMessage, message, setType, setProfileClicked, getCandidatesDetails, setShowLoader, matchSummary, referencesData, setReferenceData, missingSkills, selectedProfile, DownloadPdf, setShowPdfPopup, setInterviewViewActive, setPopupType, centerViewType, setCenterViewType, refereeData, setRefereeData, profileactiveTab, setProfileActiveTab, submissionSelected, setSubmissionSelected, inviteReminder, setInviteReminder }) => {

  const { jobId, detailedJobData, userInterviewList } = useSelector((state) => state.profile);
  const [overviewDashData, setOverviewDashData] = useState([]);
  const [subsmissionLoaded, setSubmissionLoaded] = useState(false);
  const [referenceFullData, setReferenceFullData] = useState([]);
  const [detailedList, setDetailedList] = useState([]);
  const [showInterviewList, setShowInterviewList] = useState(false);

  // const referencesData = matchSummary?.candidate_profile?.key_skills || [];
  const matchedSkills = matchSummary?.candidate_profile?.key_skills || [];
  const matchScore = matchSummary?.overall_match || 0;
  const profile = selectedProfile || {};
  const interviewCompleted = userInterviewList?.filter((item) => item?.doc_id && item?.status !== "in_progress").length
  useEffect(() => {
    getReference();
  }, [jobId, centerViewType]);
  const getReference = async () => {
    try {
      const listQuery = {
        "stage": 1,
        "job_id": jobId,
        "candidate_email": profile.email
      }
      const response = await fetch("https://operations-for-reference-api-v10-737421501165.us-east1.run.app", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(listQuery),
      })
      const data = await response.json();

      console.log("referenceData", data);
      setReferenceFullData(data.data);
      if (data.data.other_reference_details.latest_invite_sent_at !== null) {
        setInviteReminder(false);
      }
      setOverviewDashData({
        "in_progess": data.data.in_progress,
        "pending": data.data.pending,
        "total_completed": data.data.total_completed,
        "total_requested": data.data.total_requested
      })
      setDetailedList({
        "data": data.data.referees
      })

    } catch (error) {
      console.log(error)
    }
  }

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

  const handleRefreshProfile = (email) => {
    getReference();
    getCandidatesDetails(email);
    setMessage("Profile refreshed");
    setType("success");
  };

  const formatUSDateTime = (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';

    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const yyyy = date.getFullYear();

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;

    return `${mm}/${dd}/${yyyy} at ${hours}:${minutes} ${ampm}`;
  };

  // JSX
  const ord = referenceFullData?.other_reference_details;
  const latest = ord?.latest_invite_sent_at;
  const first = ord?.invite_sent_at ?? ord?.first_invite_sent_at ?? ord?.created_at;


  return (
    <>
      <div className="userProfileTop">
        <div className="nameLogo">{profile?.first_name?.charAt(0)}</div>
        <div className="profileInfo">
          <h4 className="candidateName">{`${profile?.first_name} ${profile?.last_name}`}</h4>
          <span className="textProfile">Candidate Profile</span>
        </div>
      </div>
      <div className="ProfilePopupTop">
        <div className="candidateOuter">
          <div className="candidate-card-Profile">
            <div className="candidate-avatar">{`${profile?.first_name}`.charAt(0).toUpperCase()}</div>
            <div className="candidate-info">
              <h3 className="candidate-name">{`${profile?.first_name} ${profile?.last_name}`}</h3>
              <div className="candidate-contact">
                <span><Mail size={16} className="icon" />{profile?.email}</span>
                <span>{profile.phone && (<><Phone size={16} className="icon" /> {profile?.phone}</>)}</span>
              </div>
            </div>
            <div className="candidate-match">
              <div className="match-score">
                Match Score: <span className="score-bold">{matchScore?.toFixed(0)}%</span>
                {/* Refresh Button */}
                <button
                  className="refresh-btn"
                  onClick={() => handleRefreshProfile(profile?.email)}
                  aria-label="Refresh Candidate Profile"
                  title="Refresh Profile"
                >
                  <RefreshCcw size={16} />
                  <span>Refresh</span>
                </button>
              </div>
              <div className={`match-badge ${matchSummary?.evaluation?.verdict === 'NOT_RECOMMENDED' ? 'not-recommended' : 'recommended'}`}>
                {matchSummary?.evaluation?.verdict === 'NOT_RECOMMENDED' ? (<><><LucideFileWarning size={12} /></></>) : (<><CircleCheckBigIcon size={13} /></>)}{matchSummary?.evaluation?.verdict.replace("_", " ")}
              </div>
            </div>

          </div>

          {matchSummary?.candidate_profile?.current_role ? (
            <>
              <div className="candidate-JobInfo">
                {console.log("Missing Data", missingSkills)}
                {console.log("Matched Data", matchSummary)}
                <h3 className="profile-title">Candidate Profile</h3>

                <div className="profile-rows">
                  <div className="profile-section profile-width">
                    <div className="profile-label">Current Role</div>
                    <div className="profile-value">{matchSummary?.candidate_profile?.current_role}</div>
                  </div>
                  <div className="profile-section profile-width">
                    <div className="profile-label">Total Experience</div>
                    <div className="profile-value">{matchSummary?.candidate_profile?.total_experience}</div>
                  </div>
                </div>

                <div className="profile-section">
                  <div className="profile-label">Domain Expertise</div>
                  <div className="profile-value">{matchSummary?.candidate_profile?.domain_expertise}</div>
                </div>

                <div className="profile-section">
                  <div className="profile-label">Key Skills</div>
                  <div className="skill-tags">
                    {matchedSkills?.map((skill, index) => (
                      <span key={index} className="skill-chip">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="score-card-profile">
                <h3 className="score-title">Detailed Score Breakdown</h3>
                {Object.entries(matchSummary?.component_scores || {}).map(([key, value], index) => {
                  // Determine label
                  const label = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

                  // Determine color
                  let color = '';
                  if (value === 100) color = 'green';
                  else if (value === 0) color = 'red';
                  else color = 'orange';

                  return (
                    <div key={index} className="score-item">
                      <div className="score-label-row">
                        <span className="score-label">{label}</span>
                        <span className={`score-percent ${color}`}>{value}%</span>
                      </div>
                      <div className="score-bar-bg">
                        <div
                          className="score-bar-fill"
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="ai-eval-profile">
                <h3 className="ai-eval-title">AI Evaluation</h3>
                <p className="ai-eval-text">
                  {matchSummary?.evaluation?.explanation}
                </p>
              </div>
              <div className="analysis-card-profile">
                <h3 className="analysis-title">Analysis & Recommendations</h3>

                {matchSummary?.gaps_and_recommendations?.critical_gaps?.length > 0 && (
                  <div className="section">
                    <h4 className="section-heading critical">Critical Gaps</h4>
                    <ul className="section-list critical-list">
                      {matchSummary.gaps_and_recommendations.critical_gaps.map((gap, index) => (
                        <li key={index}>{gap}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {matchSummary?.gaps_and_recommendations?.development_areas?.length > 0 && (
                  <div className="section">
                    <h4 className="section-heading dev">Development Areas</h4>
                    <ul className="section-list dev-list">
                      {matchSummary.gaps_and_recommendations.development_areas.map((area, index) => (
                        <li key={index}>{area}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {matchSummary?.gaps_and_recommendations?.certification_needs?.length > 0 && (
                  <div className="section">
                    <h4 className="section-heading">Certification Needs</h4>
                    <ul className="section-list">
                      {matchSummary.gaps_and_recommendations.certification_needs.map((cert, index) => (
                        <li key={index}>{cert}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {matchSummary?.gaps_and_recommendations?.immediate_actions?.length > 0 && (
                  <div className="section">
                    <h4 className="section-heading">Immediate Actions</h4>
                    <ul className="section-list">
                      {matchSummary.gaps_and_recommendations.immediate_actions.map((action, index) => (
                        <li key={index}>{action}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              {missingSkills.length > 0 && (<>
                <div className="missing-skills-profile">
                  <h3 className="missing-skills-title">Missing Skills</h3>
                  <div className="skills-container">
                    {missingSkills.map((skill, index) => (
                      <div className="skill-chip" key={index}>
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>
              </>)}

            </>
          ) : (
            <>
              <div className="loading-container">
                <div className=" miniSmallLoader"></div>
                <span className="loading-text">Loading detailed analysis...</span>
              </div>
            </>
          )}

        </div>

        <div className="quick-actions-Profile">
          <h3 className="quick-actions-title">Quick Actions</h3>
          {matchSummary?.candidate_profile?.current_role ? (<>
            <div className="quick-action-item" onClick={() => setShowPdfPopup(true)}>
              <Eye size={18} className="quick-action-icon" />
              <div>
                <div className="quick-action-label">View Resume</div>
                <div className="quick-action-subtext">Open in browser</div>
              </div>
            </div>

            <div className="quick-action-item" onClick={() => DownloadPdf()}>
              <Download size={18} className="quick-action-icon" />
              <div>
                <div className="quick-action-label">Download Resume</div>
                <div className="quick-action-subtext">Save as PDF</div>
              </div>
            </div>
          </>) : (<></>)}



          <div className="quick-action-item primary" onClick={() => { setPopupType("scheduleInterview"); setProfileClicked(false) }}>
            <MessageSquare size={18} className="quick-action-icon white-icon" />
            <div>
              <div className="quick-action-label white-text">Send Interview Invite</div>
              <div className="quick-action-subtext white-text">Schedule interview</div>
            </div>
          </div>
        </div>
      </div>

      <div className="divider"></div>

      <div className="profilePopupBottom">
        <div className={`d-flex gap-3 tabNavigator ${styles.bgtabs}`}>
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setProfileActiveTab(tab)}
              className={`equalwidth ${profileactiveTab === tab ? styles.btntabactive : styles.btntab}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {profileactiveTab === "Overview" && (
          <div className="tabContentContainer">
            <div className="OverViewTAb">
              <div className="info-card">
                <h4 className="info-title">Personal Information</h4>
                <p><strong>Email:</strong> {profile?.email}</p>
                {console.log("profileData", profile)}
                {profile.phone && (<><p><strong>Phone:</strong> {formatUSPhoneNumber(profile?.phone)}</p></>)}
                {/* <p><strong>Location:</strong> Not provided</p> */}
              </div>

              <div className="info-card">
                <h4 className="info-title">Application Details</h4>
                <p><strong>Applied:</strong> {new Date(profile.interview_status.applied_at).toLocaleString('en-US', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
                })}
                </p>
                <p>
                  <strong>Status:</strong>
                  <span className="status-badge">{profile.application_status}</span>
                </p>
                <p><strong>Match Score:</strong> {profile.resume_match_score} %</p>
              </div>
            </div>
          </div>
        )}

        {profileactiveTab === "Interview History" && (
          <>
            {userInterviewList?.length === 0 ? (<>
              <div className="tabContentContainer">
                <div className="interview-history-container">
                  <h4 className="interview-history-title">Interview History</h4>

                  <div className="interview-history-content">
                    <MessageSquare className="interview-icon" />
                    <p className="no-interview-text">No interviews scheduled yet</p>
                    <p className="invite-hint">Send an interview invitation to get started</p>

                    <button className="invite-button" onClick={() => { setPopupType("scheduleInterview"); setProfileClicked(false) }}>
                      <MessageSquare className="button-icon" />
                      Send Interview Invite
                    </button>
                  </div>
                </div>

              </div>
            </>) : (<>
              {interviewCompleted > 0&&showInterviewList ? (<>
                <div className="tabContentContainer">
                  <div className="interview-completed-profile topheader">
                    <div className="interview-header">
                      <div className="columnref">
                        <div className="interview-title">
                          <MessageSquare className="interview-icon" />
                          <h4>Interview History</h4>
                        </div>
                        <span className="text">View and download completed interview recordings</span>
                      </div>
                      {interviewCompleted > 0 && (
                        <>
                          <div className="interview-status">{interviewCompleted} completed</div>
                        </>
                      )}
                    </div>
                    <InterviewHistory setMessage={setMessage} setType={setType} selectedProfile={selectedProfile} setPopupType={setPopupType} DownloadPdf={DownloadPdf} matchSummary={matchSummary} />
                  </div>
                </div>
              </>) : (<>
                <div className="tabContentContainer">
                  <div className="interview-completed-profile interview-history-container">
                    <div className="interview-header">
                      <div className="interview-title">
                        <MessageSquare className="interview-icon" />
                        <h4>Interview History</h4>
                      </div>
                      {interviewCompleted > 0 && (
                        <>
                          <div className="interview-status">{interviewCompleted} completed</div>
                        </>
                      )}
                    </div>
                    {console.log(userInterviewList)
                    }

                    <p className="interview-description">
                      This candidate has  {interviewCompleted > 0 ? (<>completed</>) : (<>not yet completed</>)}  {interviewCompleted < 2 ? "interview" : "interviews"}. View detailed results and analysis.
                    </p>
                    {interviewCompleted > 0 ? (<>
                      <button className="view-history-button" onClick={() => setShowInterviewList(true)}>
                        <Eye className="eye-icon" />
                        View Interview History
                      </button>
                    </>) : (<>
                      <button className="invite-button" style={{ margin: "0 auto" }} onClick={() => { setPopupType("scheduleInterview"); setProfileClicked(false) }}>
                        <MessageSquare className="button-icon" />
                        Send Interview Invite
                      </button>
                    </>)}

                  </div>
                </div>
              </>)}

            </>)}

          </>
        )}
        {profileactiveTab === "References" && (
          <>
            {overviewDashData.total_requested !== 0 ? (
              <>
                <div className="tabContentContainer">
                  <OverviewDashboard overviewDashData={overviewDashData} />
                  <DetaiiledList detailedList={detailedList} centerViewType={centerViewType} setCenterViewType={setCenterViewType} refereeData={refereeData} setRefereeData={setRefereeData} setInviteReminder={setInviteReminder} />
                </div>
                {referenceFullData.other_reference_details?.created_at ? (<>
                  {latest && (<>
                    <div className="pending-container" style={{ marginTop: "-14px", borderTop: "1px solid #0000001a" }}>
                      <h3 className="pending-title">Pending References</h3>

                      <div className="reference-card">
                        <div className="reference-info">
                          <div className="ref-name">{`${referenceFullData.candidate_name}`}</div>
                          {console.log(overviewDashData)
                          }
                          <div className="ref-role">
                            {latest ? (<>
                              <span>Awaiting candidate’s response</span>
                            </>) : (<>
                              <span>Candidate responded successfully</span>
                            </>)}
                          </div>
                          <div className="ref-date">
                            {first
                              ? `Sent on ${formatUSDateTime(first)}`
                              : 'Sent date unavailable'}
                          </div>
                          <div className="ref-date">

                            {latest && (<>
                              {`Last reminder sent on ${formatUSDateTime(latest)}`}
                            </>)}
                          </div>

                        </div>

                        <div className="reference-actions">
                          <div className="status-pill">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-clock"
                            >
                              <circle cx="12" cy="12" r="10" />
                              <polyline points="12 6 12 12 16 14" />
                            </svg>
                            {latest ? (<>
                              <span>Pending</span>
                            </>) : (<>
                              <span>Completed</span>
                            </>)}
                          </div>
                          <button className="remind-btn" onClick={() => { setInviteReminder(true); setCenterViewType("sendReferRequest") }}>Remind</button>
                        </div>
                      </div>
                    </div>
                  </>)}

                </>) : (<></>)}

              </>) : (
              <>
                {referencesData.has_reference_check == true || referenceFullData.other_reference_details?.created_at ? (<>
                  {/* <div className="tabContentContainer">
                    <div className="interview-history-container">
                      <h4 className="interview-history-title">Reference</h4>
                      <div className="interview-history-content">
                        <MessageSquare className="interview-icon" />
                        <p className="no-interview-text">Reference request created</p>
                        <p className="invite-hint">Reference request is already sent to the user.</p>

                        <button className="invite-button" onClick={() => setCenterViewType("sendReferRequest")}>
                          <Send size={20} className="button-icon" />
                          Resend Reference Request
                        </button>
                      </div>
                    </div>
                  </div> */}
                  <div className="pending-container">
                    <h3 className="pending-title">Pending References</h3>

                    <div className="reference-card">
                      <div className="reference-info">
                        <div className="ref-name">{`${referenceFullData.candidate_name}`}</div>
                        {console.log(overviewDashData)
                        }
                        <div className="ref-role">Awaiting candidate’s response</div>
                        <div className="ref-date">
                          {first
                            ? `Sent on ${formatUSDateTime(first)}`
                            : 'Sent date unavailable'}
                        </div>
                        <div className="ref-date">

                          {latest && (<>
                            {`Last reminder sent on ${formatUSDateTime(latest)}`}
                          </>)}
                        </div>

                      </div>

                      <div className="reference-actions">
                        <div className="status-pill">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-clock"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                          <span>Pending</span>
                        </div>
                        <button className="remind-btn" onClick={() => { setCenterViewType("sendReferRequest"); setInviteReminder(true) }}>Remind</button>
                      </div>
                    </div>
                  </div>
                </>) : (<>

                  <div className="tabContentContainer">
                    <div className="interview-history-container">
                      <h4 className="interview-history-title">Reference</h4>
                      <div className="interview-history-content">
                        <MessageSquare className="interview-icon" />
                        <p className="no-interview-text">No references added yet</p>
                        <p className="invite-hint">Send Reference Request to get started</p>

                        <button className="invite-button" onClick={() => setCenterViewType("sendReferRequest")}>
                          <MessageSquare className="button-icon" />
                          Send Reference Request
                        </button>
                      </div>
                    </div>
                  </div>
                </>)}
              </>
            )}


          </>
        )}
        {profileactiveTab === "Submission Info" && (
          <>
            <SubmissionList profile={profile} setType={setType} message={message} setMessage={setMessage} setShowLoader={setShowLoader} subsmissionLoaded={subsmissionLoaded} setSubmissionLoaded={setSubmissionLoaded} jobId={jobId} centerViewType={centerViewType} setCenterViewType={setCenterViewType} submissionSelected={submissionSelected} setSubmissionSelected={setSubmissionSelected} />
          </>
        )}
        {profileactiveTab === "Rate Confirmations" && (<>
          <RateConfirmation profile={profile} setType={setType} message={message} setMessage={setMessage} setShowLoader={setShowLoader} subsmissionLoaded={subsmissionLoaded} setSubmissionLoaded={setSubmissionLoaded} jobId={jobId} centerViewType={centerViewType} setCenterViewType={setCenterViewType} submissionSelected={submissionSelected} setSubmissionSelected={setSubmissionSelected} profileactiveTab={profileactiveTab} setProfileActiveTab={setProfileActiveTab} />
        </>)}
      </div>
    </>
  );
};

export default ProfileComponent;
