import React, { useState } from "react";
import { useSelector } from "react-redux";
import "./style/interviewHistory.css";
import "./style/sendReference.css";
import "./style/profileTop.css?ver0.5";
import styles from "../css/jobPosting.module.css";
import Dropdown from 'react-bootstrap/Dropdown';
import {
  Video,
  Users,
  User,
  Plus,
  Mail,
  Edit,
  CheckCircle,
  ArrowRight,
  CircleCheckBig,
  Phone,
  Trash2,
  Building,
  Briefcase,
  ChevronDown, Send, Save
} from "lucide-react";

const defaultReferee = {
  referee_name: "",
  referee_email: "",
  referee_title: "",
  referee_company: "",
  referee_phone_number: "",
  relationship_to_candidate: ""
};

const InterviewHistory = ({ selectedProfile, setMessage, setType, setShowLoader, referencesData, setReferenceData, setCenterViewType, setProfileClicked, inviteReminder, setInviteReminder}) => {
  const { jobId, detailedJobData, userInterviewList } = useSelector(
    (state) => state.profile
  );
  const profile = selectedProfile || {};
  console.log(profile);
  const [manualReference, setManualReference] = useState(false);
  const [referees, setReferees] = useState([{ ...defaultReferee }]);
  const [referenceRequestCount, setReferenceRequestCount] = useState(referencesData.referenceRequestCount || 0);

  const [additionalNotes, setAdditionalNotes] = useState("");
  const [emailErrors, setEmailErrors] = useState([]); // indices of fields with duplicate email
  React.useEffect(() => {
  // Build tracker for emails (case insensitive, trimmed)
  const emailCount = {};
  referees.forEach((ref, idx) => {
    const email = (ref.referee_email || '').trim().toLowerCase();
    if (!email) return;
    if (!emailCount[email]) emailCount[email] = [];
    emailCount[email].push(idx);
  });

  // Find all indices that are part of a duplicate
  const errorIndices = [];
  Object.values(emailCount).forEach(idxArr => {
    if (idxArr.length > 1) errorIndices.push(...idxArr);
  });

  setEmailErrors(errorIndices);

  // Handle message and type
  if (errorIndices.length > 0) {
    setType("error");
    setMessage("email should not be same for multiple references");
  } else {
    // setType("");
    // setMessage("");
  }
}, [referees, setType, setMessage]);

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
        return `(${x.slice(0,3)}) ${x.slice(3)}`;
      } else {
        return `+1 (${x.slice(0,3)}) ${x.slice(3,6)}-${x.slice(6)}`;
      }
    }



  const autoCollectReference = async () => {
  if ((referencesData.referenceRequestCount || 0) >= 2) {
    setType("error");
    setMessage("You have already sent the reference collection request twice.");
    return;
  }

  setShowLoader("Sending Reference Request");
  try {
    const listQuery = {
      action: "notify_candidate_for_referee",
      candidate_email: profile.email,
      job_id: jobId,
      created_by: "hr_system",
      reminder:inviteReminder,
    };
    const response = await fetch(
      "https://insert-referee-details-in-db-v10-737421501165.us-east1.run.app",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(listQuery)
      }
    );
    const data = await response.json();
    setShowLoader("");
    if (!response.ok || data.status === "error") {
      setType("error");
      if (data.message) {
        setMessage(data.message);
      } else {
        setMessage("Submission failed. Please check your candidate email and try again.");
      }
      return
    }
    setType("success");
    setMessage("Collect References Automatically request sent sucessfully");
    setCenterViewType("");
    setProfileClicked(true);
    // Notify parent to update referenceData (so UI reflects new count)
    if (typeof setReferenceData === "function") {
      setReferenceData({
        ...referencesData,
        referenceRequestCount: (referencesData.referenceRequestCount || 0) + 1,
        has_reference_check: true,
      });
    }
    
  } catch (error) {
    setShowLoader("");
    setType("error");
    setMessage("Encountering error while sending request");
  }
};


  // Show manual input form
  function addManuallyReference() {
    setManualReference(true);
  }

  // Add a new blank referee form
  function addRefereeForm() {
    setReferees((prev) => [...prev, { ...defaultReferee }]);
  }

  // Remove referee form by index
  function removeRefereeForm(idx) {
    setReferees((prev) => {
      if (prev.length === 1) return prev; // Prevent removing all referees
      const updated = [...prev];
      updated.splice(idx, 1);
      return updated;
    });
  }
  const handleRefereeChange = (idx, e) => {
  let { name, value } = e.target;
  if (name === "referee_phone_number") {
    value = formatUSPhoneNumber(value);
  }
  setReferees((prev) => {
    const updated = [...prev];
    updated[idx] = { ...updated[idx], [name]: value };
    return updated;
  });
};


  // Submit manual referee data to API
  const sendManuallReference = async () => {
     
    try {
      // Basic validation: all required fields filled
      for (let i = 0; i < referees.length; i++) {
        const r = referees[i];
        if (
          !r.referee_name.trim() ||
          !r.referee_email.trim() ||
          !r.referee_title.trim() ||
          !r.referee_phone_number.trim() ||
          !r.relationship_to_candidate.trim()
        ) {
          // alert(`Please complete all required fields for Referee ${i + 1}`);
          setType("failed");
          setMessage(`Please complete all required fields for Referee ${i + 1}`);
          return;
        }
      }
        // Prevent if emailDuplicates detected:
      if (emailErrors.length > 0) {
        setType("error");
        setMessage("email should not be same for multiple references");
        return;
      }

    setShowLoader("Submitting List of Referee.");
      const listQuery = {
        action: "manual_data_entry",
        candidate_email: profile.email,
        job_id: jobId ,
        created_by: "hr_system",
        referees: referees.map((r) => ({
          referee_name: r.referee_name,
          referee_title: r.referee_title,
          referee_email: r.referee_email,
          referee_phone_number: r.referee_phone_number,
          relationship_to_candidate: r.relationship_to_candidate,
          referee_company: r.referee_company || "",
          created_by : "hr_system"
        })),
        additional_notes: additionalNotes
      };

      const response = await fetch(
        "https://insert-referee-details-in-db-v10-737421501165.us-east1.run.app",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(listQuery)
        }
      );
      const data = await response.json();
      setShowLoader("");
      if (response.ok) {
        setReferees([{ ...defaultReferee }]);
        setMessage("We have submitted the list of referees.");
        setType("success");
        setCenterViewType("");
        setProfileClicked(true);
      }
       else if (!response.ok || data.status === "error") {
        setType("error");
        if (data.message) {
          setMessage(data.message);
        } else {
          setMessage("Submission failed. Please check your candidate email and try again.");
        }
      }
     
    } catch (error) {
      setShowLoader("");
      setType("error");
      setMessage(
        typeof error === "string"
          ? error
          : "An unexpected error occurred while submitting references. Please check your connection or try again later."
      );

    }
  };
  
  const relationshipOptions = [
    { key: "Manager", label: "Manager" },
    { key: "Peer", label: "Peer" },
    { key: "DirectReport", label: "Direct Report" },
    { key: "Other", label: "Other" },
  ];

  return (
    <>
      <div className="userProfileTop bordered">
        <div className="profileInfo">
          <h3 className="bigHead">
            <Users size={18} /> Send Reference Request -{" "}
            {`${profile?.first_name || ""} ${profile?.last_name || ""}`}
          </h3>
          <p className="smallHead">
            Choose how you’d like to collect references for this candidate. Each method offers different benefits and timelines. 

          </p>
        </div>
      </div>
      {referencesData.has_reference_check === true && (
        <div className="ref-success-banner" style={{
          background: "rgb(255 255 255)",
          border: "1.5px solid rgb(222 233 252)",
          borderRadius: "10px",
          color: "#0369a1",
          display: "flex",
          alignItems: "center",
          gap: "9px",
          padding: "12px 12px",
          lineHeight:"18px",
          fontSize: "1rem",
          fontWeight: 500,
          margin: "20px 28px 0 28px"
        }}>
          <CheckCircle size={21} style={{ color: "#14b8a6" }} />
          <span>
            You have already sent reference collection request successfully.
          </span>
        </div>
      )}

      {console.log(selectedProfile)}
      {manualReference ? (
        <>
        <div className="refereeComponent">
          <div className="referee-form-card" style={{ paddingBottom: 30 }}>
            {referees.map((referee, idx) => (
              <div key={idx} className="referee-group" style={{ position: "relative" }}>
                <div className="headRow">
                  <div
                    className="referee-header"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >
                    <span>Referee {idx + 1}</span>
                  </div>
                    {referees.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRefereeForm(idx)}
                        aria-label={`Delete Referee ${idx + 1}`}
                        className="buttonsDelete"
                        
                        title="Delete Referee"
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                </div>
                
                <div className="referee-form-row">
                  <div className="referee-form-col">
                    <label className="label">
                      Full Name <span className="asterisk">*</span>
                    </label>
                    <div className="input-icon-wrapper">
                      <User className="input-icon" size={16} />
                      <input
                        className="input-field"
                        placeholder="John Smith"
                        name="referee_name"
                        value={referee.referee_name}
                        required
                        autoComplete="off"
                        type="text"
                        onChange={(e) => handleRefereeChange(idx, e)}
                      />
                    </div>
                  </div>
                  <div className="referee-form-col">
                    <label className="label">
                      Email Address <span className="asterisk">*</span>
                    </label>
                    <div className="input-icon-wrapper">
                      <Mail className="input-icon" size={16} />
                      <input
                        className="input-field"
                        style={{
                          border: emailErrors.includes(idx) ? "2px solid #FF5555" : "",
                          background: emailErrors.includes(idx) ? "#FFF7F7" : "",
                          borderRadius: "8px"
                        }}
                        placeholder="john@company.com"
                        name="referee_email"
                        value={referee.referee_email}
                        autoComplete="off"
                        required
                        type="email"
                        onChange={(e) => handleRefereeChange(idx, e)}
                      />

                    </div>
                  </div>
                </div>
                <div className="referee-form-row">
                  <div className="referee-form-col">
                    <label className="label">
                      Job Title <span className="asterisk">*</span>
                    </label>
                    <div className="input-icon-wrapper">
                      <Briefcase className="input-icon" size={16} />
                      <input
                        className="input-field"
                        placeholder="Senior Manager"
                        name="referee_title"
                        value={referee.referee_title}
                        autoComplete="off"
                        required
                        type="text"
                        onChange={(e) => handleRefereeChange(idx, e)}
                      />
                    </div>
                  </div>
                  {/* <div className="referee-form-col">
                    <label className="label">Company</label>
                    <div className="input-icon-wrapper">
                      <Building className="input-icon" size={16} />
                      <input
                        className="input-field"
                        placeholder="ABC Corporation"
                        name="referee_company"
                        value={referee.referee_company || ""}
                        autoComplete="off"
                        type="text"
                        onChange={(e) => handleRefereeChange(idx, e)}
                      />
                    </div>
                  </div> */}
                </div>
                <div className="referee-form-row">
                  <div className="referee-form-col">
                    <label className="label">Phone Number <span className="asterisk">*</span></label>
                    <div className="input-icon-wrapper">
                      <Phone className="input-icon" size={17} />
                      <input
                        className="input-field"
                        placeholder="+1(555) 123-4567"
                        name="referee_phone_number"
                        autoComplete="off"
                        value={referee.referee_phone_number}
                        type="tel"
                        maxLength={17}
                        onChange={(e) => handleRefereeChange(idx, e)}
                      />

                    </div>
                  </div>
                  <div className="referee-form-col">
                    <label className="label">
                      Relationship to Candidate <span className="asterisk">*</span>
                    </label>
                    <div className="input-icon-wrapper">
                      <div className="filterDropdown" style={{width:"100%"}}>
                        <Dropdown
                          onSelect={(selectedKey) => {
                            // Simulate event to comply with your handleRefereeChange
                            handleRefereeChange(idx, {
                              target: {
                                name: 'relationship_to_candidate',
                                value: selectedKey
                              }
                            });
                          }}
                        >
                          <Dropdown.Toggle
                            id={`dropdown-relationship-${idx}`}
                            className="input-field"
                            required
                          >
                            {relationshipOptions.find(
                              (option) => option.key === referee.relationship_to_candidate
                            )?.label || "Select relationship to candidate"}
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            {relationshipOptions.map((option) => (
                              <Dropdown.Item
                                key={option.key}
                                eventKey={option.key}
                                active={referee.relationship_to_candidate === option.key}
                                className={`${styles.DropDownItems} ${referee.relationship_to_candidate === option.key ? styles.DpiActive : ''}`}
                              >
                                {option.label}
                              </Dropdown.Item>
                            ))}
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                      {/* <select
                        className="input-field"
                        name="relationship_to_candidate"
                        value={referee.relationship_to_candidate}
                        required
                        onChange={(e) => handleRefereeChange(idx, e)}
                      >
                        <option value="" disabled>
                          Select relationship
                        </option>
                        <option>Manager</option>
                        <option>Peer</option>
                        <option>Direct Report</option>
                        <option>Other</option>
                      </select> */}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
            <button
              type="button"
              className="add-referee-btn"
              onClick={addRefereeForm}
              style={{ marginBottom: 20 }}
            >
              <Plus size={16} /> Add Another Referee
            </button>

            {/* <div className="additional-notes-block">
              <label className="additional-label">Additional Notes (Optional)</label>
              <textarea
                className="additional-textarea"
                placeholder="Any special instructions or context for the reference requests..."
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
              />
            </div> */}

            {/* <button
              type="button"
              className="send-btn"
              onClick={sendManuallReference}
            >
              <Mail size={16} /> Send
            </button> */}
            </div>
             <div className="ref-send-panel-wrapper">
                <div className="ref-send-panel-box">
                  <div className="ref-send-panel-content">
                    <div className="ref-send-title">Send Reference Requests</div>
                    <div className="ref-send-desc">
                      Reference requests will be sent instantly once you click the 'Send Now' button.
                    </div>
                  </div>
                  <div className="ref-send-btns">
                    <button
                      className="ref-send-btn-primary"
                      type="button"
                      onClick={sendManuallReference}
                    >
                      <Send size={18} strokeWidth={2} style={{marginRight: '5px'}} />
                      Send Now
                    </button>
                    {/* <button
                      className="ref-send-btn-secondary"
                      type="button"
                    >
                      <Save size={17} strokeWidth={2.1} style={{marginRight: '6px'}} />
                      Save Only
                    </button> */}
                  </div>
                </div>
              </div>
        </>
      ) : (
        <>
          {/* AUTO and MANUAL SELECTION PANES */}
          <div className="ref-pane-root">
            <div className="ref-card auto">
              <div className="ref-headrow">
                <Mail size={36} strokeWidth={1.4} className="ref-icon" />
                <div className="headrowCol">
                  <span className="ref-title">
                    Collect References Automatically
                  </span>
                  <span className="recommended-badge">Recommended</span>
                </div>
              </div>
              <div className="ref-desc">
                Send email to candidate to collect referee details first, then
                automatically send requests to referees.
              </div>
              <div className="ref-section-label">Process Flow:</div>
              <ul className="ref-list">
                <li>
                  <span className="process-step">1</span>
                  <strong>Email sent to {`${profile?.first_name || ""} ${profile?.last_name || ""}`}</strong>
                </li>
                <li><span className="process-step">2</span> Candidate provides referee details via secure form</li>
                <li>
                  <span className="process-step">3</span>
                  Reference requests automatically sent to referees
                </li>
                <li>
                  <span className="process-step">4</span>
                  Referees complete online reference forms
                </li>
              </ul>
              <div className="ref-benefits">
                <div className="ref-benefits-title">Benefits:</div>
                <ul className="ref-benefits-list">
                  <li>
                    <CircleCheckBig size={14} />
                    Higher response rates from referees
                  </li>
                  <li>
                    <CircleCheckBig size={14} />
                    Candidate controls the communication
                  </li>
                  <li>
                    <CircleCheckBig size={14} />
                    Automated follow-ups and reminders
                  </li>
                  <li>
                    <CircleCheckBig size={14} />
                    Full audit trail and progress tracking
                  </li>
                </ul>
              </div>
              <button
                className="ref-btn"
                onClick={() => autoCollectReference()}
                disabled={(referencesData.referenceRequestCount || 0) >= 2}
                style={{
                  opacity: (referencesData.referenceRequestCount || 0) >= 2 ? 0.6 : 1,
                  cursor: (referencesData.referenceRequestCount || 0) >= 2 ? "not-allowed" : "pointer",
                }}
              >
                <Mail size={15} strokeWidth={1} />
                {referencesData.has_reference_check === true ?(<>
                Send new Email to Candidate
                </>):(<>
                Send Email to Candidate
                </>)}
                 
              </button>

            </div>
            {/* Manual Entry Panel */}
            <div className="ref-card manual">
              <div className="ref-headrow">
                <Edit size={36} strokeWidth={1.4} className="manref-icon" />
                <div className="headrowCol">
                  <span className="ref-title">Manual Entry</span>
                  <span className="quickstart-badge">Quick Start</span>
                </div>
              </div>
              <div className="ref-desc">
                Enter referee details directly and send requests immediately. Best
                when you already have the information.
              </div>
              <div className="ref-section-label">Process Flow:</div>
              <ul className="ref-list">
                <li>
                  <span className="process-step">1</span>
                  <strong>You enter referee details manually</strong>
                </li>
                <li>
                  <span className="process-step">2</span>
                  Reference requests immediately sent to referees
                </li>
                <li>
                  <span className="process-step">3</span>
                  Referees complete online reference forms
                </li>
              </ul>
              <div className="ref-benefits">
                <div className="ref-benefits-title" style={{ color: "#c2410c" }}>
                  Benefits:
                </div>
                <ul className="manref-benefits-list">
                  <li>
                    <CircleCheckBig size={14} />
                    Immediate sending of requests
                  </li>
                  <li>
                    <CircleCheckBig size={14} />
                    Full control over referee selection
                  </li>
                  <li>
                    <CircleCheckBig size={14} />
                    Faster turnaround time
                  </li>
                  <li>
                    <CircleCheckBig size={14} />
                    Requires existing referee information
                  </li>
                </ul>
              </div>
              <button
                className="manual-btn"
                onClick={() => addManuallyReference()}
              >
                <Edit size={15} strokeWidth={1} />
                Enter Referee Details
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default InterviewHistory;
