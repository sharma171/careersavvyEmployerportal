import React, { useState } from "react";
import { IoMdClose } from 'react-icons/io';
import { useSelector } from "react-redux";
import { Upload, FileText } from 'lucide-react';
import './style/referencePopup.css?ver0.2';
import Spinner from "./spinner";

const ImportCandidate = ({ popupType, setPopupType, setShowLoader, setMessage, setType, detailedJobData }) => {
  const [loadingState, setLoadingState] = useState(false);
  const userEmail = useSelector((state) => state.auth.auth);
  const [errors, setErrors] = useState({ complaint: '' });
  const MIN_WORDS = 3;
  const countWords = (s = '') => s.trim().split(/\s+/).filter(Boolean).length;
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    complaint: "",
  });

  function formatUSPhoneNumber(value) {
    let cleaned = value.trim();
    if (cleaned.startsWith('+1')) {
      cleaned = cleaned.slice(2).trim();
    }
    let x = cleaned.replace(/[^\d]/g, '');
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


  // handleChange: keep existing logic, add this branch for complaint
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Base update
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'phone' ? formatUSPhoneNumber(value) : value,
    }));

    // Field-level validation
    if (name === 'complaint') {
      const words = countWords(value);
      const msg =
        words < MIN_WORDS
          ? `Please enter at least ${MIN_WORDS} words (currently ${words}).`
          : '';
      setErrors((prev) => ({ ...prev, complaint: msg }));
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
    e.preventDefault();
    // Required fields
    if (!formData.first_name || !formData.last_name) {
      setErrors((prev) => ({
        ...prev,
        complaint: prev.complaint, // unchanged
      }));
      alert("Please fill all required fields.");
      return;
    }

    // Complaint min-words validation
    const words = countWords(formData.complaint);
    if (words < MIN_WORDS) {
      setErrors((prev) => ({
        ...prev,
        complaint: `Please enter at least ${MIN_WORDS} words (currently ${words}).`,
      }));
      return;
    }


    const payload = {
      "action": "contactus",
      "email": userEmail,
      "message": formData.complaint,
      "first_name": formData.first_name,
      "last_name": formData.last_name,
      "phone_number": formData.phone
    };

    try {
      const response = await fetch('https://submit-feedback-update-profile-v10-737421501165.us-east1.run.app', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message + " successfully")
        setType("success");
        setPopupType(""); // Close modal
      } else {
        setMessage("Upload failed.", data.message);
        setType("Failed");
      }
    } catch (error) {
      console.error("Upload Error:", error);
      //   alert("An error occurred while uploading.");
      setMessage("An error occurred while uploading", error.message)
    }
    finally {
      setLoadingState(false);
    }
  };

  return (
    <div className="ref-container">
      <div className="sideViewTop noBorder">
        <div className="ref-header">
          <h2 className="ref-title">Contact Us</h2>
          <IoMdClose className="ref-close-icon" onClick={() => { setPopupType("") }} />
        </div>
        <div className="ref-details">
          <p className="ref-role">Have questions or need help? Feel free to contact us - we're here for you.</p>
        </div>
      </div>

      <div className="importCandidateForm" style={{ borderTop: "1px solid #dededef1" }}>
        <form className="candidate-form" onSubmit={handleSubmit}>
          <div className="form-group full-width">
            <label>First Name <span className="asterisk">*</span></label>
            <input type="text" name="first_name" placeholder="First Name" required value={formData.first_name} onChange={handleChange} />
          </div>
          <div className="form-group full-width">
            <label>Last Name <span className="asterisk">*</span></label>
            <input type="text" name="last_name" placeholder="Last Name" required value={formData.last_name} onChange={handleChange} />
          </div>
          {/* <div className="form-row">
          </div> */}

          <div className="form-group full-width">
            <label>Email <span className="asterisk">*</span></label>
            <input type="email" name="email" placeholder="john.doe@example.com" value={`${userEmail.email}`} readOnly />
          </div>

          <div className="form-group full-width">
            <label>Phone Number <span className="asterisk">*</span></label>
            <input type="tel" name="phone" placeholder="+1 (555) 123-4567" value={formData.phone} onChange={handleChange} required />
          </div>

          <div className="form-group full-width">
            <label>Enter your complaint <span className="asterisk">*</span></label>
            <textarea
              id="complaint"
              name="complaint"
              placeholder="Enter your complaint"
              className="textarea"
              required
              value={formData.complaint}
              onChange={handleChange}
              aria-invalid={Boolean(errors.complaint)}
              aria-describedby={errors.complaint ? "complaint-error" : undefined}
            />
            {errors.complaint && (
              <p id="complaint-error" role="alert" className="field-error">
                {errors.complaint}
              </p>
            )}
          </div>

          <div className="form-actions">
            <button type="button" className="btn cancel-btn" onClick={() => setPopupType("")}>Cancel</button>
            
            <button
              type="submit"
              className="btn primary-btn"
              disabled={
                Boolean(errors.complaint) ||
                !formData.first_name ||
                !formData.last_name ||
                !formData.phone ||
                countWords(formData.complaint) < MIN_WORDS
              }
            >
              {loadingState ? <div className="icon"><Spinner /></div> : null}
              Submit
            </button>

          </div>
        </form>
      </div>
    </div>
  );
};

export default ImportCandidate;
