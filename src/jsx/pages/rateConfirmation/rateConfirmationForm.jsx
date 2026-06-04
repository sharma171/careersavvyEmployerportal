import React from 'react';
import { useEffect, useState } from 'react';
import CSavvyPageLoader from "../../components/RecruiterComponents/cSavvvyPageLoader";
import { useLocation, useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaClock, FaUser } from "react-icons/fa";
import styling from "../referenceCheck/css/bottomSidePopup.module.css";
import "./css/rateConfirmation.css";
import ToastSuccess from "../../components/RecruiterComponents/toastSucces";
import { Building, Check, CircleCheckBig, Clock, FileText, MapPin, Shield, TriangleAlert, User, User2Icon } from 'lucide-react';
const RateConfirmationForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formInfo, setFormInfo] = useState("");
    const [token, setToken] = useState("");
    const [rateAmount, setRateAmount] = useState("");
    const [docId, setDocId] = useState("");
    const [email, setEmail] = useState("");
    const [selected, setSelected] = useState("accept");
    const [signature, setSignature] = useState("");
    const [reason, setReason] = useState("");
    const [type, setType] = useState("");
    const [message, setMessage] = useState("");
    const [employerTitle, setEmployerTitle] = useState("");
    const [linkExpired, setLinkExpired] = useState("");
    // Add these new states at the top (with your existing useState calls)
    const [counterRate, setCounterRate] = useState("");
    const [counterJustification, setCounterJustification] = useState("");
    const [errors, setErrors] = useState({});

    const validateFields = () => {
        const tempErrors = {};

        const isEmployeePath =
            formInfo.preferred_employment_type === "W2 (I can work on your payroll)" ||
            formInfo.preferred_employment_type === "1099 (Independent Contractor)" ||
            formInfo.preferred_employment_type === "Open to Multiple Options";

        // Signature required in both paths (message tailored if desired)
        if (!signature.trim()) {
            tempErrors.signature = isEmployeePath
                ? "Digital signature is required."
                : "Authorized signatory name is required.";
        }

        if (selected === "counter") {
            const raw = (counterRate ?? "").toString().trim();
            const numeric = parseFloat(raw.replace(/[^0-9.]/g, ""));
            if (!raw) {
                tempErrors.counterRate = "Please enter your counter rate.";
            } else if (isNaN(numeric) || numeric <= 0) {
                tempErrors.counterRate = "Enter a valid positive rate (e.g., 90 or 90.00).";
            }
            if (!counterJustification.trim()) {
                tempErrors.counterJustification = "Please provide justification for your counter rate.";
            }
        }

        if (selected === "decline") {
            if (!reason) {
                tempErrors.reason = "Please select a reason for declining.";
            }
        }

        // Make Title/Position mandatory for C2C signatory flow
        if (!isEmployeePath) {
            if (!employerTitle.trim()) {
                tempErrors.employerTitle = "Title/Position is required.";
            }
        }

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };




    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const tokenFromUrl = queryParams.get("token");
        const amount = queryParams.get("amount");
        const documentId = queryParams.get("doc_id");
        const email = queryParams.get("email");
        if (tokenFromUrl) {
            setToken(tokenFromUrl)
        }
        if (amount) {
            setRateAmount(amount);
        }
        if (documentId) {
            setDocId(documentId);
        }
        if (email) {
            setEmail(email);
        }
    }, [location.search]);

    useEffect(() => {
        if (!token || !email) return;
        verifySessionToken();
    }, [token, email]);


    const verifySessionToken = async () => {
        setLoading("Getting Details...");
        try {
            const listQuery = {
                "action": "verify_token_rate_confirmation",
                "doc_id": docId,
                "token": token
            };
            const response = await fetch(
                "https://send-rate-confirmation-email-store-data-v10-737421501165.us-east1.run.app",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(listQuery),
                }
            );
            const data = await response.json();
            console.log(data);
            setLoading(false);
            setFormInfo(data);
            if (!response.ok) {
                setLinkExpired(true);
            }
        } catch (error) {
            setLoading(false);
            // navigate("/");
            setLinkExpired("");
            // Optionally show error in UI
        }
    };
    const submistRateConfirmation = async () => {
        // Perform validation
        if (!validateFields()) {
            // Do not submit, errors will display
            return;
        }
        setLoading("Submitting Details...");
        try {
            const listQuery = {
                "action": "submit_candidate_rate_confirmation_detail",
                "candidate_mail_id": email,
                "doc_id": docId,
                "token": token,
                "token_expire": true,
                "data": {
                    "candidate_confirmation": selected,
                    "accepted_rate": selected === "counter" ? counterRate : rateAmount,
                    "reason_for_declining": selected === "decline" ? reason : "",
                    "digital_signature": signature,
                    "justification_for_counter_rate": selected === "counter" ? counterJustification : "",
                    "employer_title": employerTitle,
                    "note": "All good from my side"
                }
            }
            const response = await fetch(
                "https://send-rate-confirmation-email-store-data-v10-737421501165.us-east1.run.app",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(listQuery),
                }
            );
            const data = await response.json();
            setLoading(false);
            setType("success");
            setMessage("Rate confirmation completed successfully");
            setTimeout(() => {
                window.location.href = "https://careersavvy.ai";
            }, 500)
        } catch (error) {
            setLoading(false);
            navigate("/");
        }
    };

    const formatToUSDate = (dateString) => {
        if (!dateString) return "start date";
        const date = new Date(dateString);
        if (isNaN(date)) return "start date";
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    };

    return (
        <>
            {loading !== false && (<>
                <CSavvyPageLoader loaderText={`${loading}`} />
            </>)}
            {message !== "" && (
                <>
                    <ToastSuccess message={message} type={type} setMessage={setMessage} setType={setType} />
                </>
            )}
            <div className="mainscreen">
                <div className="rateComfirmationFormWrapper">
                    <div className="topHead">
                        {formInfo.preferred_employment_type === "W2 (I can work on your payroll)" || formInfo.preferred_employment_type === "1099 (Independent Contractor)" || formInfo.preferred_employment_type === "Open to Multiple Options" ? (<>
                            <h3 className="colouredHead">
                                $ W2 Rate Confirmation
                            </h3>
                        </>) : (<>
                            <h3 className="colouredHead">
                                <Building size={20} className='header-icon' /> C2C Rate Confirmation
                            </h3>
                        </>)}


                        {formInfo.preferred_employment_type === "W2 (I can work on your payroll)" || formInfo.preferred_employment_type === "1099 (Independent Contractor)" || formInfo.preferred_employment_type === "Open to Multiple Options" ? (<>
                            <h1 className="mainHead">Please Confirm Your W2 Employment Rate</h1>
                        </>) : (<>
                            <h1 className="mainHead">Consultant Rate Confirmation Required</h1>
                        </>)}
                        {formInfo.preferred_employment_type === "W2 (I can work on your payroll)" || formInfo.preferred_employment_type === "1099 (Independent Contractor)" || formInfo.preferred_employment_type === "Open to Multiple Options" ? (<>

                            <p className="subHead">Hi <strong style={{ color: "#020817" }}>{formInfo.Candidate_name}</strong>, please review and confirm the proposed W2 employment rate below</p>
                        </>) : (<>
                            <p className="subHead">Please review and confirm the rate proposal for your consultant: <strong style={{ color: "#020817" }}>{formInfo.Candidate_name}</strong></p>
                        </>)}
                    </div>
                    <div className="position-card">
                        <div className="card-header">
                            {formInfo.preferred_employment_type === "W2 (I can work on your payroll)" || formInfo.preferred_employment_type === "1099 (Independent Contractor)" || formInfo.preferred_employment_type === "Open to Multiple Options" ? (<>
                                <Building size={20} className='header-icon' />
                                <h2 className='head'>Position Details</h2>
                            </>) : (<>
                                <User size={20} className='header-icon' />
                                <h2 className='head'>Consultant & Engagement Details</h2>
                            </>)}

                        </div>
                        <div className="card-content">
                            <div className="left-section">
                                <h3 className="job-title">{formInfo?.Job_title || "Job title"}</h3>
                                <p className="company-name">{formInfo?.Company || "Company Name"}</p>

                                <div className="job-info">
                                    <p>
                                        <MapPin className="icon" /> {formInfo?.Location || "Location"}
                                    </p>
                                    <p>
                                        <User2Icon className="icon" /> Start Date: {formatToUSDate(formInfo?.Start_date)}
                                    </p>
                                </div>
                            </div>

                            <div className="right-section">
                                <div className="employment-type">
                                    <h4>Employment Type</h4>
                                    {formInfo.preferred_employment_type === "W2 (I can work on your payroll)" || formInfo.preferred_employment_type === "1099 (Independent Contractor)" || formInfo.preferred_employment_type === "Open to Multiple Options" ? (<>
                                        <span className="badge">W2 Employee</span>
                                    </>) : (<>
                                        <span className="badge">C2C Employee</span>
                                    </>)}

                                </div>
                                {formInfo.preferred_employment_type === "W2 (I can work on your payroll)" || formInfo.preferred_employment_type === "1099 (Independent Contractor)" || formInfo.preferred_employment_type === "Open to Multiple Options" ? (<>
                                    <div className="benefits-box">
                                        <h4>Benefits Included</h4>
                                        <ul>
                                            <li><CircleCheckBig size={12} className='checkIcon' /> Health Insurance</li>
                                            <li><CircleCheckBig size={12} className='checkIcon' /> Dental Insurance</li>
                                            <li><CircleCheckBig size={12} className='checkIcon' /> Vision Insurance</li>
                                            <li><CircleCheckBig size={12} className='checkIcon' /> 401k Match</li>
                                        </ul>
                                    </div>
                                </>) : (<>
                                    <div className="business-entity">
                                        <h4>Business Entity</h4>
                                        <p className='colortext'>{formInfo?.Company}</p>
                                    </div>
                                </>)}

                            </div>
                        </div>
                    </div>
                    <div className="rate-card">
                        <div className="rate-header">
                            {formInfo.preferred_employment_type === "W2 (I can work on your payroll)" || formInfo.preferred_employment_type === "1099 (Independent Contractor)" || formInfo.preferred_employment_type === "Open to Multiple Options" ? (<>
                                <span className="rate-icon">$</span>
                                <span className="rate-title">W2 Rate Proposal</span>
                            </>) : (<>
                                <span className="rate-icon">$</span>
                                <span className="rate-title">C2C Rate Proposal</span>
                            </>)}

                        </div>
                        <div className="rate-body">
                            <div className="rate-left">
                                <div className={`proposed-rate-box ${formInfo.preferred_employment_type === "W2 (I can work on your payroll)" || formInfo.preferred_employment_type === "1099 (Independent Contractor)" || formInfo.preferred_employment_type === "Open to Multiple Options" ? "green" : "green"}`}>
                                    {formInfo.preferred_employment_type === "W2 (I can work on your payroll)" || formInfo.preferred_employment_type === "1099 (Independent Contractor)" || formInfo.preferred_employment_type === "Open to Multiple Options" ? (<>
                                        <h3 className="proposed-title">Proposed W2 Rate</h3>
                                        <h2 className="rate-amount">$ {String(rateAmount).trim()
                                            .replace(/^\$/, '')         // remove leading $
                                            .replace(/\s*\/\s*hr$/i, '') // remove existing /hr (any spacing/case)
                                        }/hr</h2>
                                        <p className="rate-subtext">W2 hourly rate</p>
                                    </>) : (<>
                                        <h3 className="proposed-title">Proposed C2C Rate</h3>
                                        <h2 className="rate-amount">$ {String(rateAmount).trim()
                                            .replace(/^\$/, '')         // remove leading $
                                            .replace(/\s*\/\s*hr$/i, '') // remove existing /hr (any spacing/case)
                                        }/hr</h2>
                                        <p className="rate-subtext">Bill rate for contractor services</p>
                                    </>)}

                                </div>

                                {/* <div className="rate-details">
                                    <p>
                                        <strong>Overtime Eligible:</strong> Yes (1.5x after 40 hours)
                                    </p>
                                    <p>
                                        <strong>Payment:</strong> Bi-weekly direct deposit
                                    </p>
                                    <p>
                                        <strong>Tax Status:</strong> W2 Employee (taxes withheld)
                                    </p>
                                </div> */}
                            </div>

                            <div className="rate-right">
                                <h4>Your Submitted Rates (Reference)</h4>
                                <p>
                                    {formInfo.preferred_employment_type === "W2 (I can work on your payroll)" || formInfo.preferred_employment_type === "1099 (Independent Contractor)" || formInfo.preferred_employment_type === "Open to Multiple Options" ? (<>
                                        Expected Rate: <span className="bold">${formInfo.w2_expected_hourly_rate||formInfo.contractor_expected_hourly_rate}.00/hr</span>
                                    </>) : (<>
                                        Expected Rate: <span className="bold">${formInfo.c2c_expected_hourly_rate}.00/hr</span>
                                    </>)}
                                </p>
                                <p>
                                    {formInfo.preferred_employment_type === "W2 (I can work on your payroll)" || formInfo.preferred_employment_type === "1099 (Independent Contractor)" || formInfo.preferred_employment_type === "Open to Multiple Options" ? (<>
                                        Minimum Rate: <span className="bold">${formInfo.w2_min_rate||formInfo.contractor_min_rate}.00/hr</span>
                                    </>) : (<>
                                        Minimum Rate: <span className="bold">${formInfo.c2c_min_rate}.00/hr</span>
                                    </>)}
                                </p>
                                <hr />
                                <p>
                                    <strong>Rate Comparison: </strong>
                                    {formInfo.preferred_employment_type === "W2 (I can work on your payroll)" || formInfo.preferred_employment_type === "1099 (Independent Contractor)" || formInfo.preferred_employment_type === "Open to Multiple Options" ? (<>
                                        {formInfo.w2_expected_hourly_rate > String(rateAmount).trim().replace(/^\$/, '').replace(/\s*\/\s*hr$/i, '') ? "The proposed rate is below your expected rate." : "The proposed rate is above your expected rate."}
                                    </>) : (<>
                                        {formInfo.c2c_expected_hourly_rate > String(rateAmount).trim().replace(/^\$/, '').replace(/\s*\/\s*hr$/i, '') ? "The proposed rate is below your expected rate." : "The proposed rate is above your expected rate."}
                                    </>)}
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* {formInfo.preferred_employment_type !== "W2 (I can work on your payroll)" ? (<>
                        <div className="required-docs-card">
                            <div className="card-header">
                                <FileText size={20} className="header-icon" />
                                <h2>Required Documentation</h2>
                            </div>

                            <div className="alert-box">
                                <TriangleAlert size={20} className="alert-icon" />
                                <div>
                                    <strong>Documentation Required Upon Acceptance</strong>
                                    <p>
                                        The following documents must be provided before work can commence:
                                    </p>
                                </div>
                            </div>

                            <ul className="doc-list">
                                <li><Shield size={16} />W9 Form</li>
                                <li><Shield size={16} />Certificate of Insurance</li>
                                <li><Shield size={16} />Master Service Agreement (MSA)</li>
                                <li><Shield size={16} />Statement of Work (SOW)</li>
                            </ul>
                        </div>
                    </>) : (<>
                    </>)} */}

                    <div className="rateConfirmResponse">
                        <div className="response-header">
                            <FileText size={20} className="rate-icon" />
                            <span className="rate-title">Your Response</span>
                        </div>

                        <div className="response-content">
                            <p className="response-question">Please select your response:</p>

                            <label
                                className={`response-option ${selected === "accept" ? "active-accept" : ""
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="response"
                                    value="accept"
                                    checked={selected === "accept"}
                                    onChange={() => setSelected("accept")}
                                />
                                <div>
                                    <span className="option-title accept">Accept the proposed rate</span>
                                    <p className="option-desc">
                                        We accept the {formInfo.preferred_employment_type === "W2 (I can work on your payroll)" || formInfo.preferred_employment_type === "1099 (Independent Contractor)" || formInfo.preferred_employment_type === "Open to Multiple Options" ? (<>W2</>) : (<>C2C</>)} rate of $ {String(rateAmount).trim()
                                            .replace(/^\$/, '')         // remove leading $
                                            .replace(/\s*\/\s*hr$/i, '') // remove existing /hr (any spacing/case)
                                        }/hr for {formInfo.Candidate_name}
                                    </p>
                                </div>
                            </label>

                            <label
                                className={`response-option ${selected === "counter" ? "active-counter" : ""
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="response"
                                    value="counter"
                                    checked={selected === "counter"}
                                    onChange={() => setSelected("counter")}
                                />
                                <div>
                                    <span className="option-title counter">Counter with a different rate</span>
                                    <p className="option-desc">I’d like to propose a different rate</p>
                                </div>
                            </label>

                            <label
                                className={`response-option ${selected === "decline" ? "active-decline" : ""
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="response"
                                    value="decline"
                                    checked={selected === "decline"}
                                    onChange={() => setSelected("decline")}
                                />
                                <div>
                                    <span className="option-title decline">Decline the offer</span>
                                    <p className="option-desc">I cannot accept this rate</p>
                                </div>
                            </label>
                            {console.log(selected)}
                            {selected === "counter" && (<>

                                <div className="counter-container">
                                    <div className="form-group">
                                        <label className="form-label">
                                            Your Counter Rate ($/hour) <span className="required">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="e.g., $90.00"
                                            value={counterRate}
                                            onChange={e => setCounterRate(e.target.value)}
                                        />
                                        {errors.counterRate && <p className="error">{errors.counterRate}</p>}
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">
                                            Justification for Counter Rate <span className="required">*</span>
                                        </label>
                                        <textarea
                                            className="form-textarea"
                                            placeholder="Please explain why you believe this rate is appropriate (experience, market rates, specific skills, etc.)"
                                            value={counterJustification}
                                            onChange={e => setCounterJustification(e.target.value)}
                                        />
                                        {errors.counterJustification && <p className="error">{errors.counterJustification}</p>}
                                    </div>
                                </div>
                            </>)}
                            {selected === "decline" && (<>
                                <div className="decline-container">
                                    <label className="decline-label">
                                        Reason for Declining <span className="required">*</span>
                                    </label>
                                    <select
                                        className="decline-select"
                                        value={reason}
                                        onChange={e => setReason(e.target.value)}
                                    >
                                        <option value="">Select a reason...</option>
                                        <option value="Rate too low for my experience level">Rate too low for my experience level</option>
                                        <option value="Found another opportunity">Found another opportunity</option>
                                        <option value="Changed mind about the position">Changed mind about the position</option>
                                        <option value="Personal circumstances changed">Personal circumstances changed</option>
                                        <option value="Start date timing not suitable">Start date timing not suitable</option>
                                        <option value="Benefits package insufficient">Benefits package insufficient</option>
                                        <option value="other">Other</option>
                                    </select>
                                    {errors.reason && <p className="error">{errors.reason}</p>}
                                </div>
                            </>)}

                            {formInfo.preferred_employment_type === "W2 (I can work on your payroll)" || formInfo.preferred_employment_type === "1099 (Independent Contractor)" || formInfo.preferred_employment_type === "Open to Multiple Options" ? (<>
                                <div className="signature-box">
                                    <label className="signature-label">
                                        Digital Signature <span className="required">*</span>
                                    </label>
                                    <p className="signature-desc">
                                        Please type your full legal name as your digital signature
                                    </p>
                                    <input
                                        type="text"
                                        className="signature-input"
                                        placeholder="Your Full Legal Name"
                                        value={signature}
                                        onChange={e => setSignature(e.target.value)}
                                    />
                                    {errors.signature && <p className="error">{errors.signature}</p>}
                                </div>
                            </>) : (<>
                                <div className="signatory-card">
                                    <h3>Authorized Signatory Information</h3>

                                    <div className="form-group">
                                        <label>Business Entity Name </label>
                                        <input type="text" value={formInfo?.Company} readOnly disabled />
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Authorized Signatory Name <span className="required">*</span></label>
                                            <input type="text" placeholder="Full Legal Name" value={signature} onChange={e => setSignature(e.target.value)} />
                                        {errors.signature && <p className="error">{errors.signature}</p>}
                                        </div>
                                        <div className="form-group">
                                            <label>Title/Position <span className="required">*</span></label>
                                            <input
                                                type="text"
                                                placeholder="e.g., CEO, President, Authorized Representative"
                                                required
                                                value={employerTitle}
                                                onChange={e => setEmployerTitle(e.target.value)}
                                            />
                                            {errors.employerTitle && <p className="error">{errors.employerTitle}</p>}
                                        </div>
                                    </div>
                                    <p className="info-note">
                                        By providing this information, you confirm that you are authorized to
                                        enter into this agreement on behalf of your {formInfo?.Company}.
                                    </p>
                                    
                                </div>
                            </>)}





                            <div className="bottom">
                                {linkExpired ? (
                                    <>
                                        <button
                                            className="submit-btn"
                                        >
                                            Submit Response
                                        </button>
                                    </>
                                ) : (<>

                                    <button
                                        className="submit-btn"
                                        onClick={submistRateConfirmation}
                                    >
                                        Submit Response
                                    </button>
                                </>)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {linkExpired && (
                <>
                    <div className="fixedDisabledview"></div>
                    <div className={styling.linkExpiredPopup}>
                        <div className={styling.rowitems}>
                            <div className={styling.Info}>
                                <h3 className={styling.head}>Rate Confirmation Link Expired</h3>
                                <p className={styling.para}>It looks like this Rate Confirmation is already completed or expired - please contact employer if this seems incorrect.</p>
                            </div>
                            <button className={`${styling.OkayBtn} ${loading ? styling.loading : ''}`} onClick={() => {
                                window.location.href = "https://careersavvy.ai"
                            }} >
                                <Check size={18} /> Okay
                            </button>


                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default RateConfirmationForm