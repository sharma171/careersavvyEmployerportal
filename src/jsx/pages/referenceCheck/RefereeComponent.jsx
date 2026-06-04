import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserRoundCheck, Phone, Mail, UserCircle2, Check } from "lucide-react";
import CSavvyPageLoader from "../../components/RecruiterComponents/cSavvvyPageLoader";
import styling from "./css/bottomSidePopup.module.css"
import ToastSuccess from "../../components/RecruiterComponents/toastSucces";
import CsLogo from "../Home/icons & images/careerSavvy.svg";
import "./css/ReferenceCheck.css?ver0.7";

const FULL_SCREEN_LOADER_STYLE = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(255,255,255,0.8)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
  fontSize: "1.8rem",
  fontWeight: "600",
  color: "#2563eb",
};

// StarRating component for 0-10 star rating input
const StarRating = ({ rating, setRating, maxRating = 10 }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: 4, cursor: 'pointer', userSelect: 'none' }}>
      {Array.from({ length: maxRating }, (_, i) => i + 1).map((star) => (
        <span
          key={star}
          onClick={() => setRating(star)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') setRating(star);
          }}
          role="button"
          tabIndex={0}
          aria-label={`${star} star${star > 1 ? 's' : ''}`}
          style={{
            fontSize: 24,
            color: star <= rating ? '#f5b301' : '#ccc',
            outline: 'none',
          }}
        >
          {star <= rating ? '★' : '☆'}
        </span>
      ))}
    </div>
  );
};

const ReferenceComponent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const fromMonthRef = useRef(null);
  const fromYearRef = useRef(null);
  const toMonthRef = useRef(null);
  const toYearRef = useRef(null);
  const [linkExpired, setLinkExpired] = useState(false);

  // Store related states
  const [token, setToken] = useState("");
  const [refereeEmail, setRefereeEmail] = useState("");
  const [refereeData, setRefereeData] = useState(null);
  const [docId, setDocId] = useState("");
  const [jobId, setJobId] = useState("");
  const [tokenVerified, setTokenVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");
  const [overallRating, setOverallRating] = useState(0); // numeric 0-10
  const [rehire, setRehire] = useState(""); // "yes" or "no" (string)
  const [additionComments, setAdditionalComments] = useState("");
  const [companyWorked, setCompanyWorked] = useState("");
  
  const [candidateRelation, setCandidateRelation] = useState("");
  const [fromMonth, setFromMonth] = useState("");
const [fromYear, setFromYear] = useState("");
const [toMonth, setToMonth] = useState("");
const [toYear, setToYear] = useState("");

const [fromMonthOpen, setFromMonthOpen] = useState(false);
const [fromYearOpen, setFromYearOpen] = useState(false);
const [toMonthOpen, setToMonthOpen] = useState(false);
const [toYearOpen, setToYearOpen] = useState(false);
useEffect(() => {
    function handleClickOutside(event) {
      if (
        fromMonthRef.current && !fromMonthRef.current.contains(event.target)
      ) {
        setFromMonthOpen(false);
      }
      if (
        fromYearRef.current && !fromYearRef.current.contains(event.target)
      ) {
        setFromYearOpen(false);
      }
      if (
        toMonthRef.current && !toMonthRef.current.contains(event.target)
      ) {
        setToMonthOpen(false);
      }
      if (
        toYearRef.current && !toYearRef.current.contains(event.target)
      ) {
        setToYearOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const years = Array.from({ length: 30 }, (_, i) => (2025 - i).toString());
  
  // Store final recommendation
  const [finalRecommendation, setFinalRecommendation] = useState("");

  // Store answers to questions (5 questions)
  const [answers, setAnswers] = useState({
    "Question 1": "",
    "Question 2": "",
    "Question 3": "",
    "Question 4": "",
    "Question 5": "",
    // "final_recommendation": finalRecommendation,
    //     "overall_rating": [overallRating,
    //     rehire],
    //     "additional_comments": additionComments,
  });


  // --- Parse URL for token and referee_email and doc_id
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenFromUrl = queryParams.get("token");
    const emailFromUrl = queryParams.get("email");
    const docIdFromUrl = queryParams.get("doc_id");
    if (tokenFromUrl) setToken(tokenFromUrl);
    if (emailFromUrl) setRefereeEmail(emailFromUrl);
    if (docIdFromUrl) setDocId(docIdFromUrl);
  }, [location.search]);

  // Verify referee token when all required info is available
  useEffect(() => {
    if (!token || !refereeEmail || !docId) return;
    verifyRefereeToken();
    // eslint-disable-next-line
  }, [token, refereeEmail, docId]);

  const verifyRefereeToken = async () => {
    setLoading("Getting Details...");
    try {
      const listQuery = {
        action: "verify_referee_token",
        referee_email: refereeEmail,
        token,
        doc_id: docId,
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
      // setRefereeEmail(data.referee_email);
      setJobId(data.job_id);
      setTokenVerified(true);
      setRefereeData(data);
      if(!response.ok){
        setLinkExpired(true);
      }
    } catch (error) {
      navigate("/");
      setLinkExpired(true);
    } finally {
      setLoading(false);
    }
  };

  // Handle textarea answer change
  const handleAnswerChange = (question, value) => {
    setAnswers((prev) => ({ ...prev, [question]: value }));
  };

  // Handle final recommendation change (radio buttons)
  const handleRecommendationChange = (e) => {
    setFinalRecommendation(e.target.value);
  };
  // 🔹 Compare From and To (returns true if valid range)
  const isDurationValid = () => {
    if (!fromMonth || !fromYear || !toMonth || !toYear) return false;

    const fromIndex = months.indexOf(fromMonth);
    const toIndex = months.indexOf(toMonth);

    const from = new Date(parseInt(fromYear), fromIndex);
    const to = new Date(parseInt(toYear), toIndex);

    return to > from; // must be later
  };


 const isFormValid =
  Object.values(answers).every((a) => a.trim() !== "") &&
  finalRecommendation.trim() !== "" &&
  overallRating > 0 &&
  overallRating <= 10 &&
  (rehire === "yes" || rehire === "no") &&
  companyWorked.trim() !== "" &&
  candidateRelation.trim() !== "" && // mandatory
  isDurationValid(); // 🔹 mandatory + valid date check


  const sendReferenceAnswer = async (e) => {
    e.preventDefault();
    if (!isFormValid || loading) return;

    setLoading("Submitting Answers");
    try {
      const payload = {
        action: "referee_feedback",
        referee_email: refereeEmail,
        doc_id: docId,
        token: token,
        referee_responses: {
    "Question 1": answers["Question 1"],
    "Question 2": answers["Question 2"],
    "Question 3": answers["Question 3"],
    "Question 4": answers["Question 4"],
    "Question 5": answers["Question 5"],
    "final_recommendation": finalRecommendation,
        "overall_rating": [overallRating,
        rehire],
        "additional_comments": additionComments,
        "companyWorked":companyWorked,
        "candidateRelation":candidateRelation,
        "from_month":fromMonth,
        "from_year":fromYear,
        "to_year":toYear,
        "to_month":toMonth
  },
        final_recommendation: finalRecommendation,
        overall_rating: overallRating,
        rehire,
        additional_comments: additionComments,
      };

      const response = await fetch(
        "https://reference-check-auth-storing-referee-responses-737421501165.us-east1.run.app",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit");
      }
      setType("success");
      setMessage("Submitted successfully");
      setTimeout(() => {
        window.location.href = "https://careersavvy.ai";
      }, 300);
    } catch (error) {
      alert("Failed to submit responses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading !== false && (
        <CSavvyPageLoader loaderText={`${loading}`} />
      )}
      {message !== "" && (
        <ToastSuccess
          message={message}
          type={type}
          setMessage={setMessage}
          setType={setType}
        />
      )}
      <div className="ref-bg">
        <div className="rs-header">

        
          <div className="rs-logo-text">
            <img src={CsLogo} alt="" className="careerSavvyIcon" />
            CareerSavvy.ai
          </div>
            <div className="rs-title">Reference Check</div>
            <div className="rs-subtext">
              Hi <span className="rs-bold">{refereeData?.referee_name || "User"}</span>
              {", "}Please complete the reference check in one sitting.
            </div>
        </div>
        <div className="ref-container">
          <div className="ref-header">
            <div className="ref-info">
              <strong>Important:</strong> This link is personalized and can only
              be used once. Please complete the reference check in one sitting.
            </div>
          </div>

          <div className="ref-section candidateSection">
            <div className="ref-block-title">Candidate Information</div>
            <div className="ref-row">
              <div>
                <label>Candidate Name</label>
                <input
                  type="text"
                  value={refereeData?.candidate_name || ""}
                  readOnly
                  className="ref-readonly"
                />
              </div>
              <div>
                <label>Applied Position</label>
                <input
                  type="text"
                  value={refereeData?.job_title || ""}
                  readOnly
                  className="ref-readonly"
                />
              </div>
            </div>
          </div>

          <div className="ref-section">
            <div className="ref-block-title">Your Information</div>
            <div className="ref-row">
              <div>
                <label>
                  Your Full Name 
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={refereeData?.referee_name || ""}
                  readOnly
                  className="ref-readonly"
                  autoComplete="off"
                />
              </div>
              <div>
                <label>Your Email</label>
                <input
                  type="email"
                  value={refereeData?.referee_email || ""}
                  readOnly
                  className="ref-readonly"
                  placeholder="e.g., sarah.wilson@techcorp.com"
                  autoComplete="off"
                />
              </div>
            </div>
            <div className="ref-row">
              <div>
                <label>Your Phone Number</label>
                <input
                  type="text"
                  placeholder="Your Phone number"
                  value={refereeData?.referee_phone_number || ""}
                  readOnly
                  className="ref-readonly"
                  autoComplete="off"
                />
              </div>
              <div>
                <label>
                  Relationship to Candidate
                </label>
                <input
                  type="text"
                  placeholder="Relationship to Candidate"
                  value={refereeData?.relationship_to_candidate || ""}
                  readOnly
                  className="ref-readonly"
                  autoComplete="off"
                />
              </div>
            </div>
            <div className="ref-row">
              <div>
                <label>Company Name (Where You Worked Together)<span className="ref-star">*</span></label>
                <input
                  type="text"
                  placeholder="Enter company you worked together"
                  value={companyWorked || ""}
                  autoComplete="off"
                  onChange={(e) => setCompanyWorked(e.target.value)}
                />
              </div>
              
            </div>
            
            <div className="ref-row">
              <div>
                <label style={{marginBottom:"10px"}}>Duration of Working Together <span className="ref-star">*</span></label>
                <div style={{ display: "flex", flexDirection: "row", gap: "24px", alignItems: "center" }}>
                  
                  {/* FROM fields */}
                  <div style={{width:"50%"}}>
                    <label style={{ display: "block" }}>From</label>
                    <div style={{ display: "flex", gap: "12px" }}>
                      {/* Month */}
                      <div className="dropdown" ref={fromMonthRef}>
                        <button
                          className="btn btn-outline-secondary dropdown-toggle w-100 text-start customDropDown"
                          type="button"
                          onClick={() => setFromMonthOpen(o => !o)}
                          style={{ maxHeight: '50px' }}
                        >
                          {fromMonth || "Month"}
                        </button>
                        <ul className={`dropdown-menu w-100 ${fromMonthOpen ? "show" : ""}`}
                          style={{ maxHeight: '200px', overflowY: 'auto', position: 'absolute', zIndex: 1000 }}>
                          {months.map(month => (
                            <li key={month}>
                              <button
                                className="dropdown-item"
                                type="button"
                                onClick={() => {
                                  setFromMonth(month);
                                  setFromMonthOpen(false);
                                }}
                              >
                                {month}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Year */}
                      <div className="dropdown" ref={fromYearRef}>
                        <button
                          className="btn btn-outline-secondary dropdown-toggle w-100 text-start customDropDown"
                          type="button"
                          onClick={() => setFromYearOpen(o => !o)}
                          style={{ maxHeight: '50px' }}
                        >
                          {fromYear || "Year"}
                        </button>
                        <ul className={`dropdown-menu w-100 ${fromYearOpen ? "show" : ""}`}
                          style={{ maxHeight: '200px', overflowY: 'auto', position: 'absolute', zIndex: 1000 }}>
                          {years.map(year => (
                            <li key={year}>
                              <button
                                className="dropdown-item"
                                type="button"
                                onClick={() => {
                                  setFromYear(year);
                                  setFromYearOpen(false);
                                }}
                              >
                                {year}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  {/* TO fields */}
                  <div style={{width:"50%"}}>
                    <label style={{ display: "block" }}>To</label>
                    <div style={{ display: "flex", gap: "12px" }}>
                      {/* Month */}
                     <div className="dropdown" ref={toMonthRef}>
                        <button
                          className="btn btn-outline-secondary dropdown-toggle w-100 text-start customDropDown"
                          type="button"
                          onClick={() => setToMonthOpen(o => !o)}
                          style={{ maxHeight: '50px' }}
                        >
                          {toMonth || "Month"}
                        </button>
                        <ul className={`dropdown-menu w-100 ${toMonthOpen ? "show" : ""}`}
                          style={{ maxHeight: '200px', overflowY: 'auto', position: 'absolute', zIndex: 1000 }}>
                          {months.map(month => (
                            <li key={month}>
                              <button
                                className="dropdown-item"
                                type="button"
                                onClick={() => {
                                  setToMonth(month);
                                  setToMonthOpen(false);
                                }}
                              >
                                {month}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Year */}
                      <div className="dropdown" ref={toYearRef}>
                        <button
                          className="btn btn-outline-secondary dropdown-toggle w-100 text-start customDropDown"
                          type="button"
                          onClick={() => setToYearOpen(o => !o)}
                          style={{ maxHeight: '50px' }}
                        >
                          {toYear || "Year"}
                        </button>
                        <ul className={`dropdown-menu w-100 ${toYearOpen ? "show" : ""}`}
                          style={{ maxHeight: '200px', overflowY: 'auto', position: 'absolute', zIndex: 1000 }}>
                          {years.map(year => (
                            <li key={year}>
                              <button
                                className="dropdown-item"
                                type="button"
                                onClick={() => {
                                  setToYear(year);
                                  setToYearOpen(false);
                                }}
                              >
                                {year}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
            {fromMonth && fromYear && toMonth && toYear && !isDurationValid() && (
              <p style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                "To" date must be later than "From" date
              </p>
            )}

            <div className="ref-row">
              <div>
                <label>How long have you known this candidate? <span className="ref-star">*</span></label>
                <input
                  type="text"
                  placeholder="3 years total, 18 months"
                  value={candidateRelation || ""}
                  autoComplete="off"
                  onChange={(e) => setCandidateRelation(e.target.value)}
                />
              </div>
              
            </div>
                            
          </div>

          <form onSubmit={sendReferenceAnswer}>
            <div className="ref-section">
              <div className="ref-block-title">Reference Questions</div>

              {[
                {
                  key: "Question 1",
                  question:
                    "How would you describe the candidate's ability to handle deadlines and pressure in a real work environment? (Please share an example if possible.)",
                },
                {
                  key: "Question 2",
                  question:
                    "Was the candidate punctual and reliable in completing tasks or attending work/meetings? Did you face any concerns in this area?",
                },
                {
                  key: "Question 3",
                  question:
                    "Can you recall a time when the candidate took initiative or went above and beyond their responsibilities? What was the outcome?",
                },
                {
                  key: "Question 4",
                  question:
                    "If you had the opportunity, would you hire or work with this candidate again? Please explain your reasoning?",
                },
                {
                  key: "Question 5",
                  question:
                    "Have you ever observed the candidate managing conflicts or disagreements within a team? How did they approach it?",
                },
              ].map(({ key, question }) => (
                <div className="ref-qblock" key={key}>
                  <div className="ref-qtitle">
                    {key} <span className="ref-star">*</span>
                  </div>
                  <label>{question}</label>
                  <textarea
                    placeholder="Please provide your detailed response..."
                    rows={3}
                    value={answers[key]}
                    onChange={(e) => handleAnswerChange(key, e.target.value)}
                    required
                  />
                </div>
              ))}

              {/* Updated Overall Rating input with StarRating */}
              <div className="ref-row">
                <div style={{ width: "100%" }}>
                  <label>
                    Overall Rating for the candidate <span className="ref-star">*</span>
                  </label>
                  <StarRating
                    rating={overallRating}
                    setRating={setOverallRating}
                    maxRating={10}
                  />
                </div>
              </div>

              {/* Additional Comments (keep as input text or consider textarea) */}
              <div className="ref-row">
                <div style={{ width: "100%" }}>
                  <label>Additional Comments</label>
                  <textarea
                    placeholder="Enter Additional Comments"
                    autoComplete="off"
                    value={additionComments}
                    onChange={(e) => setAdditionalComments(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              {/* Rehire field as Yes/No radio buttons */}
              <div className="ref-row">
                <div style={{ width: "100%" }}>
                  <label>
                    Would you Rehire this candidate? <span className="ref-star">*</span>
                  </label>
                  <div>
                    <label style={{ marginRight: 15 }} className="ref-radio">
                      <input
                        type="radio"
                        name="rehire"
                        value="yes"
                        checked={rehire === "yes"}
                        onChange={() => setRehire("yes")}
                        required
                      />{" "}
                      Yes
                    </label>
                    <label className="ref-radio">
                      <input
                        type="radio"
                        name="rehire"
                        value="no"
                        checked={rehire === "no"}
                        onChange={() => setRehire("no")}
                        required
                      />{" "}
                      No
                    </label>
                  </div>
                </div>
              </div>

              <div className="ref-final-group">
                <div
                  style={{
                    fontWeight: "500",
                    marginBottom: 10,
                    fontSize: "16px",
                    color: "#020817",
                  }}
                >
                  Final Recommendation <span className="ref-star">*</span>
                </div>
                {[
                  "Strongly Recommend",
                  "Recommend",
                  "Neutral",
                  "Do Not Recommend",
                ].map((rec) => (
                  <label key={rec} className="ref-radio">
                    <input
                      name="recommend"
                      type="radio"
                      value={rec}
                      onChange={handleRecommendationChange}
                      checked={finalRecommendation === rec}
                      required
                    />
                    {rec}
                  </label>
                ))}
              </div>
              {linkExpired?(<>
              
              </>):(<>
              <button
                type="submit"
                className="ref-submit-btn"
                disabled={!isFormValid || loading}
                style={{
                  opacity: isFormValid && !loading ? 1 : 0.6,
                  cursor: isFormValid && !loading ? "pointer" : "not-allowed",
                }}
              >
                {loading ? "Submitting..." : "Submit Reference Check"}
              </button>
              </>)}
              
            </div>
          </form>
        </div>
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
    </>
  );
};

export default ReferenceComponent;
