import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./css/candidateReference.css";
import styling from "./css/bottomSidePopup.module.css"
import styles from "../../components/RecruiterComponents/css/jobPosting.module.css";
import Dropdown from 'react-bootstrap/Dropdown';
import { Users, X, Check } from "lucide-react";
import Spinner from  "../../components/RecruiterComponents/Components/spinner";
import CSavvyPageLoader from "../../components/RecruiterComponents/cSavvvyPageLoader";
import ToastSuccess from "../../components/RecruiterComponents/toastSucces";
import CsLogo from "../Home/icons & images/careerSavvy.svg";
const emptyReference = {
  referee_name: "",
  referee_title: "",
  referee_email: "",
  referee_phone_number: "",
  relationship_to_candidate: "",
  created_by: "candidate",
};

const CandidateReference = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Store related states
  const [token, setToken] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");
  const [jobId, setJobId] = useState("");
  const [tokenVerified, setTokenVerified] = useState(false);
  const [references, setReferences] = useState([ { ...emptyReference } ]);
  const [loading, setLoading] = useState(false);
  const [candidateData, setCandidateData] = useState([]);
  const [linkExpired, setLinkExpired] = useState(false);
  const [message, setMessage] = useState("");
  const [emailErrors, setEmailErrors] = useState([]);
  const [type, setType] = useState("");

  // --- Parse URL for token and candidate_email
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenFromUrl = queryParams.get("auth");
    const emailFromUrl = queryParams.get("candidate_email");
    const jobIdUrl = queryParams.get("job_id");
    if (jobIdUrl) {
      setJobId(jobIdUrl.replace(/ /g, "+"));
    }

    if (tokenFromUrl) setToken(tokenFromUrl);
    if (emailFromUrl) setCandidateEmail(emailFromUrl);
  }, [location.search]);

  useEffect(() => {
  function handleClickOutside(event) {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      // Close the dropdown here:
      setDropdownOpen(false);
    }
  }
  // Bind the event listener
  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    // Unbind the event listener on clean up
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [dropdownRef]);

  // --- Verify Token when both token & candidateEmail set
  useEffect(() => {
    if (!token || !candidateEmail) return;
    verifyCandidateToken();
    // eslint-disable-next-line
  }, [token, candidateEmail]);

  useEffect(() => {
  const emailCount = {};
  references.forEach((ref, idx) => {
    const email = (ref.referee_email || "").trim().toLowerCase();
    if (!email) return;
    if (!emailCount[email]) emailCount[email] = [];
    emailCount[email].push(idx);
  });

  const errorIndices = [];
  Object.values(emailCount).forEach(arr => {
    if (arr.length > 1) errorIndices.push(...arr);
  });

  setEmailErrors(errorIndices);

  if (errorIndices.length) {
    setType("error");
    setMessage("Each reference must have a unique email address.");
  } else {
    setType("");
    setMessage("");
  }
}, [references]);

// Helper function to validate specific email domain and general email format
const isEmailValid = (email) => {
  if (!email) return false;
  const trimmedEmail = email.trim().toLowerCase();
  // Check allowed domains specifically, or general valid email format
  const allowedDomains = ['.com', '@gmail.in', '@4spheresolution.com', '@careersavvy.ai', '@gmail.com', '.org', '.ai'];
  const domainValid = allowedDomains.some(domain =>
    trimmedEmail.endsWith(domain) || trimmedEmail.includes(domain)
  );
  
  // Basic email regex for overall pattern validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return domainValid && emailRegex.test(trimmedEmail);
};



  const verifyCandidateToken = async () => {
    setLoading("Getting Details...")
    try {
      const listQuery = {
        action: "verify_candidate_token",
        candidate_email: candidateEmail,
        token: token,
        job_id: jobId
      };
      const response = await fetch(
        "https://reference-check-auth-storing-referee-responses-737421501165.us-east1.run.app",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(listQuery),
        }
      );
      const data = await response.json();
      // Fallback for field names
      setCandidateEmail(data.candidate_email || data.candidateEmail || candidateEmail);
      setJobId(data.job_id);
      setTokenVerified(true);
      setCandidateData(data);
      setLoading(false);
      if(!response.ok){
        setLinkExpired(true);
      }
    } catch (error) {
    setLoading(false);
      navigate("/");
      // Optionally show error in UI
    }
  };
// check its form is valid or not
  const isValid = references.every(
  (ref) =>
    ref.referee_name &&
    ref.referee_title &&
    ref.referee_email &&
    isEmailValid(ref.referee_email) &&  // <-- new validation here
    ref.referee_phone_number &&
    ref.relationship_to_candidate
);


  // --- Add new reference
  const handleAddReference = () => {
    setReferences((prev) => [ ...prev, { ...emptyReference } ]);
  };

  // --- Remove a reference by index, but always at least 1 (the first)
  const handleRemoveReference = (idx) => {
    setReferences(refs => refs.length > 1 ? refs.filter((_, i) => i !== idx) : refs);
  };

  // --- Handle input changes
  const handleChange = (idx, field, value) => {
    setReferences((prev) =>
      prev.map((ref, i) =>
        i === idx
          ? { ...ref, [field]: value }
          : ref
      )
    );
  };

  // --- Submit handler
  const sendManualReference = async (e) => {
    e.preventDefault();
    if (!isValid || loading || emailErrors.length > 0) return;
    setLoading("Submitting Data...");
    try {
      const payload = {
        action: "manual_data_entry",
        candidate_email: candidateEmail,
        job_id: jobId,
        token:token,
        created_by: "candidate",
        referees: references,
        "token_expire": true,
      };
      await fetch(
        "https://insert-referee-details-in-db-v10-737421501165.us-east1.run.app",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      setType("success");
      setMessage("All references are submitted successfully")
      setTimeout(()=>{
        window.location.href = "https://careersavvy.ai";
      },300)
    } catch (error) {
        setLoading(false);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const relationshipOptions = [
    { key: "Manager", label: "Manager" },
    { key: "Colleague", label: "Colleague" },
    { key: "Peer", label: "Peer" },
    { key: "Mentor", label: "Mentor" },
    { key: "Client", label: "Client" },
    { key: "Supervisor", label: "Supervisor" }
  ];
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

  
  return (
    <>
        {loading!==false&&(<>
            <CSavvyPageLoader loaderText={`${loading}`}/>
        </>)}
        {message!==""&&(
            <>
            <ToastSuccess message={message} type={type} setMessage={setMessage} setType={setType}/>
            </>
        )}
      {tokenVerified && (
        <div className="rs-background">
          <div className="rs-wrapper">
            <div className="rs-header">
              <div className="rs-logo-text">
                <img src={CsLogo} alt="" className="careerSavvyIcon" />
                CareerSavvy.ai
              </div>
              <div className="rs-title">Reference Submission</div>
              <div className="rs-subtext">
                Hi <span className="rs-bold">{candidateData.candidate_name}</span>
                {", "}please provide your professional references.
              </div>
            </div>
            <div className="rs-card">
              <div className="rs-card-header">
                <Users size={20} strokeWidth={2.2} style={{ marginRight: 10 }} />
                Professional References
              </div>
              <form onSubmit={sendManualReference}>
                {references.map((ref, idx) => (
                  <div className="rs-ref-section" key={idx}>
                    <div className="rs-ref-row" style={{ display: "flex", justifyContent: "space-between" }}>
                      <div className="rs-ref-title">{`Reference ${idx + 1}`}</div>
                      {references.length > 1 && (
                        <button
                          type="button"
                          title="Remove"
                          aria-label="Remove"
                          className="remove-ref-btn"
                          onClick={() => handleRemoveReference(idx)}
                          
                        >
                          <X size={18} />
                        </button>
                      )}
                    </div>
                    <div className="rs-form-row">
                      <div className="rs-form-group">
                        <label>
                          Referee Name <span className="rs-required">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Full name"
                          value={ref.referee_name}
                          onChange={(e) => handleChange(idx, "referee_name", e.target.value)}
                          required
                        />
                      </div>
                      <div className="rs-form-group">
                        <label>
                          Referee Title <span className="rs-required">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Job title"
                          value={ref.referee_title}
                          onChange={(e) => handleChange(idx, "referee_title", e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="rs-form-row">
                      <div className="rs-form-group">
                        <label>
                          Referee Email <span className="rs-required">*</span>
                        </label>
                        <input
                          type="email"
                          placeholder="email@company.com"
                          value={ref.referee_email}
                          onChange={(e) => handleChange(idx, "referee_email", e.target.value)}
                          required
                          style={{
                            border: emailErrors.includes(idx) ? "2px solid #FF5555" : "",
                            background: emailErrors.includes(idx) ? "#FFF7F7" : "",
                            borderRadius: "12px"
                          }}
                        />

                      </div>
                      <div className="rs-form-group">
                        <label>
                          Referee Phone Number <span className="rs-required">*</span>
                        </label>
                        <input
                          type="tel"
                          placeholder="+1 (555) 123-4567"
                          value={ref.referee_phone_number}
                          maxLength={17}
                          onChange={e =>
                            handleChange(idx, "referee_phone_number", formatUSPhoneNumber(e.target.value))
                          }
                          required
                        />

                      </div>
                    </div>
                    <div className="rs-form-group">
                      <label>
                        Relationship to You <span className="rs-required">*</span>
                      </label>
                      <div className="filterDropdown" style={{ width: "100%" }}>
                        <Dropdown
                          onSelect={(selectedKey) => handleChange(idx, 'relationship_to_candidate', selectedKey)} ref={dropdownRef}
                          
                        >
                          <Dropdown.Toggle
                            id={`dropdown-relationship-${idx}`}
                            className="input-field"
                            required
                            style={{
                                background: "transparent",
                                color: "#020817",
                                height: "42.6px",
                                padding: "5px 14px",
                                width: "100%",
                                borderRadius: "12px !important",
                                border: "1px solid #d1d5db",
                                textAlign: "left"
                          }}
                          >
                            {
                              relationshipOptions.find(
                                (option) => option.key === ref.relationship_to_candidate
                              )?.label || "Select relationship"
                            }
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            {relationshipOptions.map((option) => (
                              <Dropdown.Item
                                key={option.key}
                                eventKey={option.key}
                                active={ref.relationship_to_candidate === option.key}
                                className={`${styles.DropDownItems} ${ref.relationship_to_candidate === option.key ? styles.DpiActive : ''}`}
                              >
                                {option.label}
                              </Dropdown.Item>
                            ))}
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>

                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  className="rs-add-btn"
                  onClick={handleAddReference}
                >
                  + Add Another Reference
                </button>
                <div className="formNote">
                  <strong>Note: </strong>
                  Your references will be contacted directly by our hiring team.
                  Please ensure all contact information is accurate and that you have obtained permission from your references before submitting.
                </div>
                <button
                  type="submit"
                  className="rs-ref-button"
                  style={{
                    opacity: isValid && !loading && emailErrors.length===0 ? 1 : 0.6,
                    cursor: isValid && !loading && emailErrors.length===0 ? "pointer" : "not-allowed",
                  }}
                  disabled={!isValid || loading || emailErrors.length > 0}
                >
                  {loading ? (<><Spinner/> Submitting References</>) : "Submit References"}
                </button>
              </form>
            </div>
            {linkExpired&&(
              <>
              <div className="fixedDisabledview"></div>
              <div className={styling.linkExpiredPopup}>
                <div className={styling.rowitems}>
                  <div className={styling.Info}>
                    <h3 className={styling.head}>Reference Link Expired</h3>
                    <p className={styling.para}>It looks like this reference check is already completed or expired - please contact employer if this seems incorrect.</p>
                  </div>
                  <button className={`${styling.OkayBtn} ${loading ? styling.loading : ''}`} onClick={()=>{
                    window.location.href = "https://careersavvy.ai";
                  }} >
                    <Check size={18} /> Okay
                  </button>


                </div>
              </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CandidateReference;
