import React, { useState, useEffect, } from "react";
import './style/referencePopup.css?ver0.2';
import candidatestyles from '../css/JobPostModal.module.css';
import { FaUserFriends } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { FaUser, FaEnvelope, FaPhone, FaClock, FaCalendarAlt } from 'react-icons/fa';
import { FaCheckCircle } from 'react-icons/fa';
import { useDispatch, useSelector } from "react-redux";
import Spinner from "./spinner";


export const ScheduleInterview = ({ setPopupType, popupType, selectedProfile, detailedJobData, setMessage, setType }) => {
  const [inviteStatus, setInviteStatus] = useState(null);
  const userEmail = useSelector(state => state.auth.auth.email);
  const [loadSpinner, setLoadSpinner] = useState(false);
  const [interviewType, setInterviewType] = useState("video");
  const [interviewLevel, setInterviewLevel] = useState("intermediate");
  const [interviewFormat, setInterviewFormat] = useState("scenario");
  const [focusAreas, setFocusAreas] = useState("");
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    checkInterviewInnvite();
  }, [userEmail, popupType]);

  const sendInterviewInnvite = async () => {
    setLoadSpinner(true);
    try {
      setErrorMessage("");

      const focusList = focusAreas
        .split(",")
        .map(item => item.trim())
        .filter(item => item);

      const customInstructions = `Interview Type: ${interviewType}, Level: ${interviewLevel}, Format: ${interviewFormat}, Description: ${description}`;

      const listQuery = {
        action: "resend-interview-invite",
        // recruiter_email: "amit@4spheresolutions.com", // Replace with userEmail if needed
        recruiter_email: userEmail, // Replace with userEmail if needed
        invite_id: inviteStatus?.invite_details?.invite_id || 2,
        interview_type: interviewType,
        interview_level: interviewLevel,
        focus_areas: focusList,
        custom_instructions: customInstructions
      };

      const response = await fetch("https://send-interview-invites-recruiter-v10-737421501165.us-east1.run.app", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(listQuery),
      });

      const data = await response.json();
      if (data.status == "success") {
        console.log("Interview invite response:", data);
        setLoadSpinner(false);
        setType("success");
        setMessage(`Interview Request Sent to ${selectedProfile.first_name} ${selectedProfile.last_name}`);
        setPopupType("")
      }
      else {
        setType("success");
        setMessage(data.message);
      }

    } catch (error) {
      console.log(error);
      setType("success");
      setMessage(error.message);
    }
    finally {
      setLoadSpinner(false);
    }
  };
  const startInterviewInnvite = async () => {
    setLoadSpinner(true);
    try {

      setErrorMessage("");

      const focusList = focusAreas
        .split(",")
        .map(item => item.trim())
        .filter(item => item);

      const customInstructions = `Interview Type: ${interviewType}, Level: ${interviewLevel}, Format: ${interviewFormat}, Description: ${description}`;

      const listQuery =
      {
        "action": "send-interview-invite",
        "recruiter_email": userEmail,
        // recruiter_email: "amit@4spheresolutions.com", // Replace with userEmail if needed
        "job_id": detailedJobData.job_id,
        "candidate_email": selectedProfile.email,
        "interview_type": interviewType,
        "interview_level": interviewLevel,
        "focus_areas": focusList,
        "custom_instructions": customInstructions
      }


      const response = await fetch("https://send-interview-invites-recruiter-v10-737421501165.us-east1.run.app", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(listQuery),
      });

      const data = await response.json();
      if (data.status == "success") {
        console.log("Interview invite response:", data);
        setLoadSpinner(false);
        setType("success");
        setMessage(`Interview Request Sent to ${selectedProfile.first_name} ${selectedProfile.last_name}`);
        setPopupType("")
      }
      else {
        setType("success");
        setMessage(data.message);
      }

    } catch (error) {
      console.log(error);
      setType("success");
      setMessage(error.message);
    }
    finally {
      setLoadSpinner(false);
    }
  };

  const checkInterviewInnvite = async () => {
    setLoadSpinner(true);
    try {
      const listQuery = {
        action: "check-existing-interview-invite",
        recruiter_email: userEmail, // Replace with userEmail if needed
        // recruiter_email: "amit@4spheresolutions.com", // Replace with userEmail if needed
        job_id: detailedJobData.job_id,
        candidate_email: selectedProfile.email
      };

      const response = await fetch("https://send-interview-invites-recruiter-v10-737421501165.us-east1.run.app", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(listQuery),
      });

      const data = await response.json();
      setInviteStatus(data);
      setLoadSpinner(false);
      console.log("interview status", data);


    } catch (error) {
      console.log(error);
    }
    finally {
      setLoadSpinner(false);
    }
  };

  const formatUS = (value) =>
    value
      ? new Date(value).toLocaleString('en-US', {
        dateStyle: 'short',
        timeStyle: 'short',
        hour12: true,
      })
      : '';
  return (
    <div className="ref-container">
      <div className="sideViewTop">
        <div className="ref-header">
          <h2 className="ref-title">Configure Your Interview</h2>
          <IoMdClose className="ref-close-icon" onClick={() => { setPopupType("") }} />
        </div>
        <div className="ref-details">
          <h3 className="ref-name">{selectedProfile.first_name} {selectedProfile.last_name}</h3>
          <p className="ref-role">Customize your interview experience</p>
        </div>
      </div>
      <div className="scheduleformContainer">
        {inviteStatus?.invite_exists ? (
          <>
            <div className="existingInterview">
              <div className="icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-check-big h-4 w-4" data-lov-id="src/components/candidates/SendVideoInterviewSidebar.tsx:189:18" data-lov-name="CheckCircle" data-component-path="src/components/candidates/SendVideoInterviewSidebar.tsx" data-component-line="189" data-component-file="SendVideoInterviewSidebar.tsx" data-component-name="CheckCircle" data-component-content="%7B%22className%22%3A%22h-4%20w-4%22%7D"><path d="M21.801 10A10 10 0 1 1 17 3.335"></path><path d="m9 11 3 3L22 4"></path></svg>
              </div>
              <div className="info">
                <div className="head">Existing {inviteStatus.message}:</div>
                <div className="text">
                  Status: {inviteStatus.invite_details.interview_completed == true ? (
                    <>Completed</>) : (<>Pending</>)
                  }
                </div>
                <div className="text">
                  Sent: {formatUS(inviteStatus?.invite_details?.invite_sent_at)}
                </div>
                <div className="text">
                  Expires: {formatUS(inviteStatus?.invite_details?.token_expires_at)}
                </div>
                <div className="borderText">
                  You can update and resend this invite
                </div>
              </div>
            </div>
          </>
        ) : (<>
          {loadSpinner && (<>
            <div className="existingInterview">
              <div className="icon">

                <Spinner />
              </div>
              <div className="info">
                <div className="head">Checking Existing Requests</div>
              </div>
            </div>
          </>)}

        </>)}

        <div className="containerform">
          <div className="section">
            <label className="label">Interview Type <span className="asterisk">*</span></label>
            <div className="option-group">
              <label className="radio-label">
                <input type="radio" name="interviewType" value="audio"
                  checked={interviewType === "audio"}
                  onChange={(e) => setInterviewType(e.target.value)} />

                <span className="radio-text">Text-Based Interview</span>
              </label>
              <label className="radio-label">
                <input type="radio" name="interviewType" value="video"
                  checked={interviewType === "video"}
                  onChange={(e) => setInterviewType(e.target.value)} />

                <span className="radio-text">Video-Based Interview</span>
              </label>
            </div>
          </div>

          <div className="section">
            <label className="label">Interview Level <span className="asterisk">*</span></label>
            <div className="option-group">
              <label className="radio-label">
                <input type="radio" name="interviewLevel" value="beginner"
                  checked={interviewLevel === "beginner"}
                  onChange={(e) => setInterviewLevel(e.target.value)} />
                <span className="radio-text">Beginner</span>
              </label>
              <label className="radio-label">
                <input type="radio" name="interviewLevel" value="intermediate"
                  checked={interviewLevel === "intermediate"}
                  onChange={(e) => setInterviewLevel(e.target.value)} />
                <span className="radio-text">Intermediate</span>
              </label>
              <label className="radio-label">
                <input type="radio" name="interviewLevel" value="advanced"
                  checked={interviewLevel === "advanced"}
                  onChange={(e) => setInterviewLevel(e.target.value)} />
                <span className="radio-text">Advanced</span>
              </label>
            </div>
          </div>

          <div className="section">
            <label className="label">Interview Format</label>
            <div className="option-group">
              <label className="radio-label">
                <input type="radio" name="interviewFormat" value="scenario"
                  checked={interviewFormat === "scenario"}
                  onChange={(e) => setInterviewFormat(e.target.value)} />
                <span className="radio-text">Scenario-Based</span>
              </label>
              <label className="radio-label">
                <input type="radio" name="interviewFormat" value="non-scenario"
                  checked={interviewFormat === "non-scenario"}
                  onChange={(e) => setInterviewFormat(e.target.value)} />
                <span className="radio-text">Non-Scenario-Based</span>
              </label>
            </div>
          </div>

          <div className="section">
            <label className="label">Focus Areas (Optional)</label>
            <textarea
              className="textarea focus"
              placeholder="Enter focus areas separated by commas (e.g., JavaScript, React)"
              value={focusAreas}
              onChange={(e) => setFocusAreas(e.target.value)}
            />
            {errorMessage && <p className="error-text">{errorMessage}</p>}
          </div>
          <div className="section">
            <label className="label">Job Description (Optional)</label>
            <textarea
              className="textarea description"
              placeholder="Paste Job Description for more Talented Questions"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <p className="guidelines">Providing a job description will help generate more relevant questions for your target role. If not provided, questions will be generated based on your resume and selected skill level.</p>
          </div>

        </div>
      </div>
      {inviteStatus?.invite_exists && inviteStatus.invite_details.interview_completed == false ? (
        <>
          <div className="interviewSubmit" onClick={sendInterviewInnvite}>
            <button className="submitBtn">
              {loadSpinner ? (<>
                <div className="icon">
                  <Spinner />
                </div>
              </>) : (<>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-refresh-cw h-4 w-4 mr-2" data-lov-id="src/components/candidates/SendVideoInterviewSidebar.tsx:294:36" data-lov-name="RefreshCw" data-component-path="src/components/candidates/SendVideoInterviewSidebar.tsx" data-component-line="294" data-component-file="SendVideoInterviewSidebar.tsx" data-component-name="RefreshCw" data-component-content="%7B%22className%22%3A%22h-4%20w-4%20mr-2%22%7D"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path><path d="M21 3v5h-5"></path><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path><path d="M8 16H3v5"></path></svg>
              </>)}
              {inviteStatus?.invite_exists && inviteStatus.invite_details.interview_completed == false ? (<>Resend Interview</>) : (<>Send Interview Invite</>)}
            </button>
          </div>
        </>) : (<>
          <div className="interviewSubmit" onClick={startInterviewInnvite}>
            <button className="submitBtn">
              {loadSpinner ? (<>
                <div className="icon">
                  <Spinner />
                </div>
              </>) : (<>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-refresh-cw h-4 w-4 mr-2" data-lov-id="src/components/candidates/SendVideoInterviewSidebar.tsx:294:36" data-lov-name="RefreshCw" data-component-path="src/components/candidates/SendVideoInterviewSidebar.tsx" data-component-line="294" data-component-file="SendVideoInterviewSidebar.tsx" data-component-name="RefreshCw" data-component-content="%7B%22className%22%3A%22h-4%20w-4%20mr-2%22%7D"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path><path d="M21 3v5h-5"></path><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path><path d="M8 16H3v5"></path></svg>
              </>)}
              {inviteStatus?.invite_exists && inviteStatus.invite_details.interview_completed == false ? (<>Resend Interview</>) : (<>Send Interview Invite</>)}
            </button>
          </div>

        </>)}





    </div>

  );
}
