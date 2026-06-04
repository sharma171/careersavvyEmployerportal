import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { format } from 'date-fns';
import "./additionalDetails.css?ver0.7";
import { Clock, FileText, MessageCircleMoreIcon, Upload, User, BadgeAlert } from "lucide-react";
import { Calendar as CalendarIcon } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CSavvyPageLoader from "../../components/RecruiterComponents/cSavvvyPageLoader";
import ToastSuccess from "../../components/RecruiterComponents/toastSucces";

const NOTIFY_UPLOAD_URL = "https://notify-candidate-employmnt-sub-and-store-data-v10-737421501165.us-east1.run.app";
const EXTRA_QA_URL = "https://extra-question-answer-api-v10-737421501165.us-east1.run.app";

const AdditionalDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [jobId, setJobId] = useState("");
  const [docId, setDocId] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");

  const [loading, setLoading] = useState(true);
  const [sessionData, setSessionData] = useState(null);


  const [docUploads, setDocUploads] = useState({});
  // Track answers keyed by question text (safe as label key here)
  const [answers, setAnswers] = useState({});
  // UI feedback
  const [submitBusy, setSubmitBusy] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [type, setType] = useState("");
  const [message, setMessage] = useState("");
  const [showLoader, setShowLoader] = useState("Loading");

  // Read URL params
  useEffect(() => {
    const urlQuery = new URLSearchParams(location.search);
    const fetchdocId = urlQuery.get("doc_id");
    const fetchjobId = urlQuery.get("job_id");
    const fetchcandidateEmail = urlQuery.get("email");

    if (fetchjobId) setJobId(fetchjobId.replace(/ /g, "+"));
    if (fetchdocId) setDocId(fetchdocId.replace(/ /g, "+"));
    if (fetchcandidateEmail) setCandidateEmail(fetchcandidateEmail);
  }, [location.search]);

  // Normalize mapping: "Resume/CV" -> "resume", others by heuristic
  const mapDocTypeToParam = (docType) => {
    const t = (docType || "").toLowerCase();
    if (t.includes("resume")) return "resume";
    if (t.includes("cv")) return "resume";
    if (t.includes("cover")) return "cover_letter";
    if (t.includes("portfolio")) return "portfolio";
    if (t.includes("cert")) return "certifications";
    if (t.includes("id")) return "id";
    if (t.includes("photo") || t.includes("image")) return "photo";
    if (t.includes("reference")) return "references";
    return t.replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
  };

  // Fetch and verify session, then set data to render
  useEffect(() => {
    const canFetch = candidateEmail !== "" && docId !== "" && jobId !== "";
    if (!canFetch) return;

    const verifySessionGettingData = async () => {
      try {
        setLoading(true);
        setShowLoader("Loading")
        setSubmitError("");
        const listQuery = {
          action: "validate_extra_question_token",
          doc_id: docId,
          candidate_mail_id: candidateEmail,
          job_id: jobId,
        };
        const response = await fetch(EXTRA_QA_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(listQuery),
        });
        const data = await response.json();

        if (!response.ok) {
          console.error("Token verification failed", data);
          setSubmitError(data?.message || "Unable to validate request. Please check the link.");
          setType("failed");
          setMessage(data?.message || "Unable to validate request. Please check the link.")
          setLoading(false);
          setShowLoader("");
          return;
        }

        // data expected shape based on prompt
        // Use a defensive fallback if server responds differently
        setSessionData(data);

        // Prime uploads map for documents
        const docs = data?.other_questions?.documents_needed || [];
        const initUploads = {};
        for (const d of docs) {
          const key = d?.doc_type || "document";
          initUploads[key] = { file: null, status: "idle" };
        }
        setDocUploads(initUploads);

        // Prime answers map
        const qs = data?.other_questions?.common_questions || [];
        const initAnswers = {};
        for (const q of qs) {
          initAnswers[q.question] = "";
        }
        setAnswers(initAnswers);

        setLoading(false);
        setShowLoader("");
      } catch (error) {
        console.error("Token verification error:", error);
        setSubmitError("Network error while validating request.");
        setType("failed");
        setMessage("Network error while validating request.");
        setLoading(false);
        setShowLoader("");
      }
    };

    verifySessionGettingData();
  }, [candidateEmail, docId, jobId]);

  // Derived helpers
  const priority = sessionData?.other_questions?.priority || "";
  const dueDateIso = sessionData?.other_questions?.due_date || "";
  const dueDateDisplay = useMemo(() => {
    if (!dueDateIso) return "";
    const d = new Date(dueDateIso);
    if (Number.isNaN(d.getTime())) return dueDateIso;
    return d.toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, [dueDateIso]);

  const instructions = sessionData?.other_questions?.general_instruction || "";
  const instructionForDocs = sessionData?.other_questions?.instruction_for_docs || "";
  const autoReminder = !!sessionData?.other_questions?.auto_reminder;

  const documents = sessionData?.other_questions?.documents_needed || [];
  const questions = sessionData?.other_questions?.common_questions || [];

  const docsCount = documents.length;
  const qsCount = questions.length;

  const priorityBadge = useMemo(() => {
    const p = (priority || "").toLowerCase().trim();
    if (p === "high") return "Critical";
    if (p === "medium") return "Urgent";
    if (p === "low") return "Normal";
    return p || "—";
  }, [priority]);

  // File validation (10MB, types)
  const MAX_SIZE = 10 * 1024 * 1024;
  const ACCEPTED_EXT = [".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png"];
  const hasAcceptedExt = (name) => {
    const lower = (name || "").toLowerCase();
    return ACCEPTED_EXT.some((ext) => lower.endsWith(ext));
  };

  const updateUploadState = (docType, patch) => {
    setDocUploads((prev) => ({
      ...prev,
      [docType]: { ...(prev[docType] || { file: null, status: "idle" }), ...patch },
    }));
  };

  const uploadDocument = async (docType, file) => {
    try {
      updateUploadState(docType, { status: "uploading", error: "" });

      const formData = new FormData();
      const meta = {
        action: "form_two_Submission",
        employment_submission_stage: "",
        document_type: mapDocTypeToParam(docType),
        candidate_mail: candidateEmail,
        form_type:"additional_form",
        doc_id: docId
      };
      formData.append("meta_data", JSON.stringify(meta));
      formData.append("single", file);

      const res = await fetch(NOTIFY_UPLOAD_URL, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        updateUploadState(docType, { status: "error", error: text || "Upload failed" });
        return false;
      }

      updateUploadState(docType, { status: "uploaded", error: "" });
      return true;
    } catch (e) {
      updateUploadState(docType, { status: "error", error: "Network error" });
      return false;
    }
  };

  const onPickFile = async (docType, file) => {
    if (!file) return;
    if (file.size > MAX_SIZE) {
      updateUploadState(docType, { status: "error", error: "File exceeds 10MB limit." });
      return;
    }
    if (!hasAcceptedExt(file.name)) {
      updateUploadState(docType, { status: "error", error: "Unsupported file type." });
      return;
    }
    updateUploadState(docType, { file });
    // Instantly upload
    await uploadDocument(docType, file);
  };

  const handleAnswerChange = (questionText, value) => {
    setAnswers((prev) => ({ ...prev, [questionText]: value }));
  };

  // Validate required docs uploaded and required questions answered
  const validateBeforeSubmit = () => {
    const missingDocs = [];
    for (const d of documents) {
      if (d?.required) {
        const u = docUploads[d.doc_type];
        if (!u || u.status !== "uploaded") {
          missingDocs.push(d.doc_type);
        }
      }
    }

    const missingAnswers = [];
    for (const q of questions) {
      if (q?.required) {
        const val = answers[q.question];
        const isEmpty = val === undefined || val === null || String(val).trim() === "";
        if (isEmpty) missingAnswers.push(q.question);
      }
    }

    return { missingDocs, missingAnswers };
  };

  const ensureAllUploadsComplete = async () => {
    // For any selected but not uploaded file, sequentially upload now
    for (const d of documents) {
      const st = docUploads[d.doc_type];
      if (st?.file && st.status !== "uploaded") {
        const ok = await uploadDocument(d.doc_type, st.file);
        if (!ok) return false;
      }
    }
    return true;
  };

  // safe parser similar to above
  const toUSDateFns = (value) => {
    if (!value) return null;
    let d;
    if (value instanceof Date) d = value;
    else if (typeof value === 'string') {
      const m = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
      d = m ? new Date(+m[1], +m[2] - 1, +m[3]) : new Date(value);
    } else if (typeof value === 'number') d = new Date(value);
    if (!d || Number.isNaN(d.getTime())) return null;
    return format(d, 'MM-dd-yyyy'); // MM-DD-YYYY
  };


  const handleSubmit = async () => {
    setSubmitError("");
    setSubmitSuccess("");
    setSubmitBusy(true);

    // Ensure any picked-but-pending files are uploaded now
    const uploadsOk = await ensureAllUploadsComplete();
    if (!uploadsOk) {
      setSubmitError("Please resolve document upload errors and try again.");
      setType("failed");
      setMessage("Please resolve document upload errors and try again.");
      setSubmitBusy(false);
      return;
    }

    const { missingDocs, missingAnswers } = validateBeforeSubmit();
    if (missingDocs.length || missingAnswers.length) {
      const msgParts = [];
      if (missingDocs.length) msgParts.push(`Missing required documents: ${missingDocs.join(", ")}`);
      if (missingAnswers.length) msgParts.push(`Missing required answers: ${missingAnswers.join(", ")}`);
      setSubmitError(msgParts.join(" | "));
      setType("failed");
      setMessage(msgParts.join(" | "));
      setSubmitBusy(false);
      return;
    }

    const payload = {
      action: "submit_extra_question_answer",
      job_id: jobId,
      doc_id: docId,
      "token_expire": true,
      candidate_mail_id: candidateEmail,
      data: {
        due_date: sessionData?.other_questions?.due_date || "",
        priority: sessionData?.other_questions?.priority || "",
        auto_reminder: !!sessionData?.other_questions?.auto_reminder,
        general_instruction: sessionData?.other_questions?.general_instruction || "",
        documents_needed: sessionData?.other_questions?.documents_needed || [],
        instruction_for_docs: sessionData?.other_questions?.instruction_for_docs || "",
        common_questions: (sessionData?.other_questions?.common_questions || []).map((q) => ({
          question: q.question,
          question_type: q.question_type,
          required: !!q.required,
          answer: answers[q.question] ?? "",
        })),
      },
    };

    try {
      const res = await fetch(EXTRA_QA_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setSubmitError(data?.message || "Submission failed. Please try again.");
        setType("failed");
        setMessage(data?.message || "Submission failed. Please try again.");
        setSubmitBusy(false);
        return;
      }

      setSubmitSuccess("Submitted successfully.");
      setType("success");
      setMessage("Your response Submitted successfully.");
      setSubmitBusy(false);
      setTimeout(() => {
        window.location.href = "https://careersavvy.ai";
      }, 500);
      // navigate(...) if a redirect is expected
    } catch (e) {
      setSubmitError("Network error while submitting.");
      setType("failed");
      setMessage("Network error while submitting.");
      setSubmitBusy(false);
    }
  };

  const renderQuestionField = (q) => {
    const value = answers[q.question] ?? "";
    const requiredAsterisk = q.required ? <span className="asterisk">*</span> : null;
    // Parse stored string to Date or null
    const selectedDate = value ? new Date(value) : null;

    // Handler for date change from DatePicker
    const handleDateChange = (date) => {
      // Convert Date to yyyy-MM-dd string or empty string if null
      const dateStr = date ? date.toISOString().substring(0, 10) : "";
      handleAnswerChange(q.question, dateStr);
    };

    switch ((q.question_type || "").toLowerCase()) {
      case "text":
        return (
          <div className="question" key={q.question}>
            <label>{q.question} {requiredAsterisk}</label>
            <textarea
              placeholder="Enter your answer here..."
              value={value}
              onChange={(e) => handleAnswerChange(q.question, e.target.value)}
            />
          </div>
        );
      case "number":
        return (
          <div className="question" key={q.question}>
            <label>{q.question} {requiredAsterisk}</label>
            <input
              type="number"
              placeholder="Enter a number..."
              value={value}
              onChange={(e) => handleAnswerChange(q.question, e.target.value)}
            />
          </div>
        );
      case "shorttext":
        return (
          <div className="question" key={q.question}>
            <label>{q.question} {requiredAsterisk}</label>
            <input
              type="text"
              placeholder="Enter your answer here..."
              value={value}
              onChange={(e) => handleAnswerChange(q.question, e.target.value)}
            />
          </div>
        );
      case "yes/no":
      case "yesno":
        return (
          <div className="question" key={q.question}>
            <label>{q.question} {requiredAsterisk}</label>
            <div className="radio-group">
              <label className="radio-inline">
                <input
                  type="radio"
                  name={q.question}
                  checked={String(value).toLowerCase() === "yes"}
                  onChange={() => handleAnswerChange(q.question, "yes")}
                />
                Yes
              </label>
              <label className="radio-inline" style={{ marginLeft: 16 }}>
                <input
                  type="radio"
                  name={q.question}
                  checked={String(value).toLowerCase() === "no"}
                  onChange={() => handleAnswerChange(q.question, "no")}
                />
                No
              </label>
            </div>
          </div>
        );
      case "date": {
        const selectedDate = value ? new Date(value) : null;

        const handleDateChange = (date) => {
          const dateStr = date ? date.toISOString().substring(0, 10) : "";
          handleAnswerChange(q.question, dateStr);
        };

        return (
          <div className="question" key={q.question}>
            <label>
              {q.question} {requiredAsterisk}
            </label>
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              showIcon
              calendarIconClassName="calenderIconRight"
              toggleCalendarOnIconClick
              dateFormat="MM-dd-yyyy"
              minDate={new Date()}
              maxDate={new Date("2050-12-31")}
              placeholderText="Enter date (eg. MM-DD-YYYY)"
              required={q.required}
              className="date-picker-input" // Optional: add your CSS class for styling input
            />
          </div>
        );
      }


      default:
        // Fallback to single-line text for unknown types
        return (
          <div className="question" key={q.question}>
            <label>{q.question} {requiredAsterisk}</label>
            <input
              type="text"
              placeholder="Enter your answer here..."
              value={value}
              onChange={(e) => handleAnswerChange(q.question, e.target.value)}
            />
          </div>
        );
    }
  };

  return (
    <>
      <div className="extraQuestionDocsContainer">
        <div className="page-header">
          <div className="headerRow">
            <div className="headCol">
              <h2>Additional Details Request</h2>
              <p>
                Kindly provide the requested information and documents to proceed with your application.
              </p>
            </div>
            <div className="headCol">
              <div className={`priority ${priorityBadge=="Critical"&&"red"} ${priorityBadge=="Urgent"&&"orange"} ${priorityBadge=="Normal"&&"green"}`}>
                <Clock size={12} />
                {priorityBadge}
              </div>
            </div>
          </div>
        </div>

        <div className="extraQuestionCard">
          {/* Request Summary */}
          <div className="card">
            <div className="card-header">
              <span className="icon"><User size={22} /></span>
              <h3>Request Summary</h3>
            </div>
            <div className="card-body">
              <div className="row-box">
                <div className="f-width">
                  <span className="labelHead">Recipient</span>
                  <p className="Info">{candidateEmail || "—"}</p>
                </div>
                <div className="f-width">
                  <span className="labelHead">Due Date</span>
                  <p className="Info">{toUSDateFns(dueDateDisplay) ?? '—'}</p>
                </div>
              </div>

              {instructions?.trim() ? (
                <>
                  <div className="instructions">
                    <span className="labelHead"><BadgeAlert size={16} className="instIcon" />Instructions</span>
                    <p className="Info">{instructions}</p>
                  </div>
                </>
              ) : null}
            </div>
          </div>

          {/* Required Documents */}
          {documents.length>0?(<>
          <div className="card">
            <div className="card-header">
              <FileText size={20} />
              <h3>Required Documents</h3>
              <span className="count">{docsCount} document{docsCount === 1 ? "" : "s"}</span>
            </div>
            <div className="card-body">
              {documents.length === 0 ? (
                <p>No documents requested.</p>
              ) : (
                documents.map((d) => {
                  const state = docUploads[d.doc_type] || { file: null, status: "idle", error: "" };
                  const isReq = !!d.required;
                  return (
                    <div className="upload-box" key={d.doc_type}>
                      <span className="form-label">
                        {d.doc_type} {isReq && <span className="asterisk">*</span>}
                      </span>
                      <label className="upload-area" style={{ cursor: "pointer" }}>
                        <Upload size={26} />
                        {state.status === "uploading" && <p>Uploading...</p>}
                        {state.status === "uploaded" && <p >Uploaded</p>}
                        {state.status === "error" && (
                          <p>{state.error || "Upload failed"}</p>
                        )}
                        <p>
                          {state.file ? state.file.name : "Click to upload or drag and drop"}
                        </p>
                        <span>PDF, DOC, DOCX, JPG, PNG (max 10MB)</span>

                        <input
                          type="file"
                          accept={ACCEPTED_EXT.join(",")}
                          style={{ display: "none" }}
                          onChange={(e) => onPickFile(d.doc_type, e.target.files?.[0] || null)}
                        />
                      </label>
                      {/* <div className="upload-status">
                        
                      </div> */}
                    </div>
                  );
                })
              )}

              {instructionForDocs?.trim() ? (
                <div className="instructions" style={{ marginTop: 12 }}>
                  <span className="labelHead"><BadgeAlert size={16} className="instIcon" />Instructions for documents</span>
                  <p>{instructionForDocs}</p>
                </div>
              ) : null}
            </div>
          </div>
          </>):(<></>)}
          
          {questions.length>0?(<>
          <div className="card">
            <div className="card-header">
              <FileText size={20} />
              <h3>Additional Information</h3>
              <span className="count">{qsCount} question{qsCount === 1 ? "" : "s"}</span>
            </div>
            <div className="card-body">
              {questions.length === 0 ? (
                <p>No additional questions.</p>
              ) : (
                questions.map((q) => renderQuestionField(q))
              )}
            </div>
          </div>
          </>):(<></>)}
          {/* Additional Information */}
          

          {/* Submit */}
          <div className="submit-section">
            <p>
              By submitting, you confirm that all information provided is accurate and complete.
            </p>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <button className="submit-btn" disabled={loading || submitBusy} onClick={handleSubmit}>
                {submitBusy ? "Submitting..." : "Submit Request"}
              </button>
              {/* {loading && <span>Loading...</span>} */}
              {/* {submitError && <span style={{ color: "red" }}>{submitError}</span>}
              {submitSuccess && <span style={{ color: "green" }}>{submitSuccess}</span>} */}
            </div>
          </div>
        </div>
      </div>
      {showLoader !== "" && (
        <>

          <CSavvyPageLoader loaderText={showLoader} />
        </>
      )}
      {message !== "" && (
        <>
          <ToastSuccess message={message} type={type} setMessage={setMessage} setType={setType} />
        </>
      )}
    </>
  );
};

export default AdditionalDetails;
