import React, { useEffect, useState } from "react";
import { IoMdClose } from 'react-icons/io';
import { Upload, FileText } from 'lucide-react';
import './style/referencePopup.css?ver0.2';
import Spinner from "./spinner";

const ImportCandidate = ({ popupType, setPopupType, setShowLoader, setMessage, setType, detailedJobData, paginatedCandidates }) => {
  const [loadingState, setLoadingState] = useState(false);
  const [candidateSubmit, setCandidateSubmit] = useState(false);
  useEffect(() => {

  }, [popupType])
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    resume: null,
  });
  const [emailError, setEmailError] = useState("");

  // Add near the top (outside or inside the component)
  const allowedTldRegex = /^[^\s@]+@[^\s@]+\.(com|org|in|ai|us)$/i;


  const job_id = detailedJobData.job_id;

  // Update handleChange
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'email') {
      const emailVal = value.trim();
      // Duplicate check (case-insensitive)
      const emailExists = paginatedCandidates.some(
        (candidate) => (candidate.email || '').toLowerCase() === emailVal.toLowerCase()
      );

      if (emailExists) {
        setEmailError("This email already exists in the candidate list.");
      } else if (emailVal && !allowedTldRegex.test(emailVal)) {
        setEmailError("Email must end with .com, .org, .in, .ai, or .us.");
      } else {
        setEmailError("");
      }

      setFormData((prev) => ({ ...prev, [name]: value }));
      return;
    }

    if (name === 'phone') {
      setFormData((prev) => ({
        ...prev,
        [name]: formatUSPhoneNumber(value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };



  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      resume: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {

    setLoadingState(true);
    setCandidateSubmit(true);
    e.preventDefault();
    // If current error exists, stop
    if (emailError) {
      alert(emailError);
      setLoadingState(false);
      setCandidateSubmit(false);
      return;
    }
    // Hard guard for allowed TLDs
    if (!allowedTldRegex.test((formData.email || '').trim())) {
      const msg = "Email must end with .com, .org, .in, .ai, or .us.";
      setEmailError(msg);
      alert(msg);
      setLoadingState(false);
      setCandidateSubmit(false);
      return;
    }
    if (!formData.first_name || !formData.last_name || !formData.email || !formData.resume) {
      alert("Please fill all required fields and upload a resume.");
      setLoadingState(false);
      setCandidateSubmit(false);
      return;
    }

    const submission = new FormData();
    submission.append('first_name', formData.first_name);
    submission.append('last_name', formData.last_name);
    submission.append('email', formData.email);
    submission.append('phone', formData.phone);
    submission.append('job_id', job_id);
    submission.append('resume', formData.resume);

    try {
      const response = await fetch('https://manual-upload-applicant-job-id-v10-737421501165.us-east1.run.app/', {
        method: 'POST',
        body: submission,
      });
      const data = await response.json();
      if (response.ok) {
        setMessage("Candidate Imported Successfully")
        setCandidateSubmit(false);
        setType("success");
        setPopupType(""); // Close modal
      } else {
        setMessage(data.message);
        setCandidateSubmit(false);
        setType("unsuccessful")
        //  console.log(data);

      }
    } catch (error) {
      console.error("Upload Error:", error);
      //   alert("An error occurred while uploading.");
      setMessage("An error occurred while uploading", error.message)
      setCandidateSubmit(false);
    }
    finally {
      setLoadingState(false);
      setCandidateSubmit(false);
    }
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


  return (
    <div className="ref-container">
      <div className="sideViewTop noBorder">
        <div className="ref-header">
          <h2 className="ref-title">Import Candidate</h2>
          <IoMdClose className="ref-close-icon" onClick={() => { setPopupType("") }} />
        </div>
        <div className="ref-details">
          <p className="ref-role">Add a new candidate manually for the position: {detailedJobData.job_title}</p>
        </div>
      </div>

      <div className="importCandidateForm">
        <form className="candidate-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>First Name <span className="asterisk">*</span></label>
              <input type="text" name="first_name" placeholder="John" required value={formData.first_name} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Last Name <span className="asterisk">*</span></label>
              <input type="text" name="last_name" placeholder="Doe" required value={formData.last_name} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group full-width">
            <label>Email <span className="asterisk">*</span></label>
            <input
              type="email"
              name="email"
              placeholder="john.doe@example.com"
              required
              value={formData.email}
              onChange={handleChange}
              pattern="^[^\s@]+@[^\s@]+\.(com|org|in|ai|us)$"
              title="Email must end with .com, .org, .in, .ai, or .us"
            />
            {emailError && <p className="error-message" style={{ color: "red", marginTop: "4px" }}>{emailError}</p>}
          </div>


          <div className="form-group full-width">
            <label>Phone Number <span className="asterisk">*</span></label>
            <input
              type="tel"
              name="phone"
              placeholder="+1 (555) 123-4567"
              maxLength={17}
              value={formData.phone}
              onChange={handleChange}
              required
            />

          </div>

          <div className="form-group full-width">
            <label>Resume <span className="asterisk">*</span></label>
            {!formData.resume ? (
              <div className="upload-box">
                <FileText size={24} />
                <p>Click to upload or drag and drop</p>
                <span>PDF, DOCX up to 10MB</span>
                <input
                  type="file"
                  className="file-input"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  required
                />
              </div>
            ) : (
              <div className="file-preview-box">
                <div className="file-info">
                  <FileText size={20} /> <span className="file-name">{formData.resume.name}</span>
                  <span className="file-size">
                    ({(formData.resume.size / (1024 * 1024)).toFixed(2)} MB)
                  </span>
                </div>
                <button
                  type="button"
                  className="remove-file-btn"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, resume: null }))
                  }
                >
                  ×
                </button>
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="button" className="btn cancel-btn" onClick={() => setPopupType("")}>Cancel</button>
            {emailError == "" && (<>
              <button type="submit" className="btn primary-btn"
                disabled={candidateSubmit}>
                {loadingState ? (<>
                  <div className="icon">
                    <Spinner />
                  </div>

                </>) : (<>

                </>)}
                Import Candidate</button>
            </>)}

          </div>
        </form>
      </div>
    </div>
  );
};

export default ImportCandidate;
