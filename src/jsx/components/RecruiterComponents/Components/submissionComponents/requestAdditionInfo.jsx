import React, { useEffect, useState } from "react";
import "./requestAdditional.css?ver0.5";
import "../style/profileTop.css?ver0.5";
import { CircleAlert, CircleCheck, Clock, FileText, MessageSquare, Plus, Zap } from "lucide-react";
import { useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import { setSidebarPopupType } from "../../../../../store/actions/actions"; // (kept as you had it)

// Dummy lists for quick selection (customize as you wish)
const COMMON_DOCUMENTS = [
  "Resume/CV", "References (2 professional)", "Certifications", "Pay Stubs (last 3)",
  "I-9 Documents", "Portfolio/Work Samples", "Education Verification", "Background Check Consent"
];
const COMMON_QUESTIONS = [
  "Available start date", "Current salary/rate expectation", "Open to relocation?",
  "Willing to travel? ", "Years of experience with [specific skill]?",
  "Do you have active security clearance?"
];

const PriorityCard = ({ active, label, sublabel, icon, onClick }) => (
  <div
    className={`optionButton${active ? ' active' : ''}`}
    onClick={onClick}
    tabIndex={0}
  >
    <div className="priorityCardIcon">{icon}</div>
    <div className="priorityCardLabel">{label}</div>
    <div className="priorityCardSublabel">{sublabel}</div>
  </div>
);

const PRIORITY_OPTIONS = [
  { label: "Normal", sublabel: "Standard processing", icon: <CircleCheck size={16} /> },
  { label: "Urgent", sublabel: "High priority", icon: <Zap size={16} /> },
  { label: "Critical", sublabel: "Immediate attention", icon: <CircleAlert size={16} /> }
];

const OptionButton = ({ active, label, onClick, icon }) => (
  <button
    type="button"
    className={`optionButton${active ? " active" : ""}`}
    onClick={onClick}
  >
    {icon} {label}
  </button>
);

const RequestAdditionInfo = ({
  selectedProfile,
  setMessage,
  setType,
  setShowLoader,
  setCenterViewType,
  submissionSelected,
  setSubmissionSelected,
}) => {
  const { jobId } = useSelector((state) => state.profile);
  const profile = selectedProfile || {};
  const [activeTabs, setActiveTabs] = useState("basicinfo");

  // Basic Info state
  const [priority, setPriority] = useState("Normal");
  // store dueDate as a Date object (or null). This keeps DatePicker happy.
  const [dueDate, setDueDate] = useState(null);
  const [duePreset, setDuePreset] = useState("");
  const [autoRemind, setAutoRemind] = useState(false);
  const [basicInstructions, setBasicInstructions] = useState("");
  // finalDate is the US formatted string derived from dueDate
  const [finalDate, setFinalDate] = useState("");

  // Documents state
  const [docList, setDocList] = useState([{ label: "Resume/CV", required: true }]);
  const [customDoc, setCustomDoc] = useState("");
  const [docInstructions, setDocInstructions] = useState("");

  // Questions state
  const [questionList, setQuestionList] = useState([{ label: "Available start date", required: true, type: "date" }]);
  const [customQuestion, setCustomQuestion] = useState("");

  // Helper: format Date (or date-string) to MM/DD/YYYY
  const formatUS = (date) => {
    if (!date) return "";
    // if it's already a string like "yyyy-mm-dd" or "MM/DD/YYYY", try to coerce to Date
    const d = (date instanceof Date) ? date : new Date(date);
    if (isNaN(d.getTime())) return ""; // invalid date
    // build MM/DD/YYYY with zero-padding
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  };

  // keep finalDate in sync whenever dueDate changes
  useEffect(() => {
    setFinalDate(formatUS(dueDate));
  }, [dueDate]);

  const mapQuestionType = (t) => {
    switch (t) {
      case "number": return "number";
      case "shorttext": return "shorttext";
      case "text": return "text";
      case "yes/no": return "yes/no";
      case "date": return "date";
      default: return "shorttext";
    }
  };

  const validateBasicInfo = () => {
    let errors = [];
    if (!priority) errors.push("Priority is required.");
    if (!dueDate) errors.push("Due date is required.");
    return errors;
  };

  // Preset buttons: set dueDate as Date object (not string)
  const handleDuePreset = (preset) => {
    setDuePreset(preset);
    let date = new Date();
    if (preset === "24h") date.setHours(date.getHours() + 24);
    else if (preset === "48h") date.setHours(date.getHours() + 48);
    else if (preset === "72h") date.setHours(date.getHours() + 72);
    else if (preset === "1w") date.setDate(date.getDate() + 7);
    // store the Date object
    setDueDate(date);
  };

  const handleContinue = () => {
    if (activeTabs === "basicinfo") {
      const errors = validateBasicInfo();
      if (errors.length) {
        setMessage(errors.join(" "));
        setType && setType("error");
        return;
      }
      setMessage("");
      setActiveTabs("documents");
      return;
    }
    if (activeTabs === "documents") setActiveTabs("questions");
  };

  const handleSkip = () => {
    if (activeTabs === "basicinfo") {
      setMessage("");
      setActiveTabs("documents");
    }
  };

  const handleBack = () => {
    if (activeTabs === "questions") setActiveTabs("documents");
    else if (activeTabs === "documents") setActiveTabs("basicinfo");
  };

  const toggleDoc = (doc) => {
    if (docList.some(d => d.label === doc)) {
      setDocList(docs => docs.filter(d => d.label !== doc));
    } else {
      setDocList([...docList, { label: doc, required: false }]);
    }
  };

  const addCustomDoc = () => {
    if (customDoc && !docList.some(d => d.label === customDoc)) {
      setDocList([...docList, { label: customDoc, required: false }]);
      setCustomDoc("");
    }
  };

  const toggleQuestion = (q) => {
    if (questionList.some(qq => qq.label === q)) {
      setQuestionList(questionList.filter(qq => qq.label !== q));
    } else {
      setQuestionList([
        ...questionList,
        { id: crypto?.randomUUID?.() ?? String(Date.now()), label: q, required: false, type: "shorttext" }
      ]);
    }
  };

  const addCustomQuestion = () => {
    if (customQuestion && !questionList.some(q => q.label === customQuestion)) {
      setQuestionList([
        ...questionList,
        { id: crypto?.randomUUID?.() ?? String(Date.now()), label: customQuestion, required: false, type: "shorttext" }
      ]);
      setCustomQuestion("");
    }
  };

  const removeDoc = (docLabel) => setDocList(docs => docs.filter(d => d.label !== docLabel));
  const removeQuestion = (idx) => setQuestionList(list => list.filter((_, i) => i !== idx));

  const handleSendRequest = () => {
    const hasRequired =
      docList.some(d => !!d.required) || questionList.some(q => !!q.required);

    if (!hasRequired) {
      setType && setType("error");
      setMessage("To proceed, mark at least one document or question as required.");
      return;
    }

    let apiPriority = "low";
    if (priority === "Urgent") apiPriority = "medium";
    else if (priority === "Critical") apiPriority = "high";

    const documents_needed = docList.map(d => ({
      doc_type: d.label,
      required: !!d.required,
    }));

    const common_questions = questionList.map(q => ({
      question: q.label,
      question_type: mapQuestionType(q.type),
      required: !!q.required,
    }));

    const allData = {
      action: "notify_candidate_for_extra_questions",
      job_id: jobId,
      candidate_mail_id: profile.email,
      data: {
        due_date: finalDate,           // MM/DD/YYYY
        priority: apiPriority,
        auto_reminder: autoRemind,
        general_instruction: basicInstructions,
        documents_needed,
        instruction_for_docs: docInstructions,
        common_questions,
      }
    };

    requestAdditionInfoSubmission(profile.email, allData);
  };

  const requestAdditionInfoSubmission = async (email, mappedData) => {
    setShowLoader("Sending Request");
    try {
      const response = await fetch("https://extra-question-answer-api-v10-737421501165.us-east1.run.app", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mappedData),
      });
      const data = await response.json();
      setShowLoader("");
      setType("success");
      setMessage("Request sent successfully.");
      setCenterViewType("");
    } catch (error) {
      console.log(error);
      setShowLoader("");
      setType("failed");
      setMessage("Unable to send request.");
    }
  };

  const TYPE_OPTIONS = [
    { value: "shorttext", label: "Short text" },
    { value: "text", label: "Text (paragraph)" },
    { value: "number", label: "Number" },
    { value: "yes/no", label: "Yes/No" },
    { value: "date", label: "Date" },
  ];

  // Core Template
  return (
    <>
      <div className="requestadditionalinfo">
        <div className="userProfileTop bordered blueColored">
          <div className="profileInfo">
            <h3 className="bigHead">
              Request Additional Information - {`${profile?.first_name || ""} ${profile?.last_name || ""}`}
            </h3>
            <p className="smallHead">
              Request documents or information from the candidate.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="requestadditionalTabs">
          <div className={`requestTabs ${activeTabs === "basicinfo" ? "active" : ""}`}
            onClick={() => setActiveTabs("basicinfo")}>
            <CircleAlert size={16} /> Basic Info
          </div>
          <div className={`requestTabs ${activeTabs === "documents" ? "active" : ""}`}
            onClick={() => setActiveTabs("documents")}>
            <FileText size={16} /> Documents
          </div>
          <div className={`requestTabs ${activeTabs === "questions" ? "active" : ""}`}
            onClick={() => setActiveTabs("questions")}>
            <MessageSquare size={16} /> Questions
          </div>
        </div>

        {/* Panels */}
        {activeTabs === "basicinfo" && (
          <div className="panel basicInfoPanel">
            <div className="iconHeading">
              <CircleAlert width={20} /><h4>Set Priority & Timeline</h4>
            </div>

            <div className="fieldLabelIcon">
              <h3 className="fieldtitle">Priority level</h3>
            </div>

            <div className="priorityGroup">
              {PRIORITY_OPTIONS.map(opt => (
                <PriorityCard
                  key={opt.label}
                  label={opt.label}
                  sublabel={opt.sublabel}
                  icon={opt.icon}
                  active={priority === opt.label}
                  onClick={() => setPriority(opt.label)}
                />
              ))}
            </div>

            <div className="CircularInput">
              <label>
                <input
                  type="checkbox"
                  checked={autoRemind}
                  onChange={e => setAutoRemind(e.target.checked)}
                />{" "}
                Send automatic reminder if no response
              </label>
            </div>

            <div className="dueDateSec">
              <div className="fieldLabelIcon">
                <Clock size={16} />
                <h3 className="fieldtitle">Due Date</h3>
              </div>
              <div className="rowsec">
                <DatePicker
                  showYearDropdown
                  showMonthDropdown
                  showIcon
                  calendarIconClassName="calenderIconRight"
                  toggleCalendarOnIconClick
                  scrollableYearDropdown
                  yearDropdownItemNumber={80}
                  selected={dueDate}                         // Date or null
                  onChange={(date) => {
                    setDueDate(date);
                    setDuePreset(null);
                  }}
                  dateFormat="MM/dd/yyyy"
                  className="form-control ps-2 w-100"
                  style={{ boxShadow: "unset", padding: "6px 12px" }}
                  placeholderText="MM/DD/YYYY"
                  minDate={new Date()}
                />
                <div className="presetsList">
                  {["24h", "48h", "72h", "1w"].map(lbl => (
                    <button
                      key={lbl}
                      type="button"
                      className="buttons"
                      style={{
                        border: (duePreset === lbl) ? "1px solid #2463EB" : "1px solid #E5E7EB",
                        background: (duePreset === lbl) ? "#2463EB" : "white",
                        color: (duePreset === lbl) ? "#fff" : "#020817",
                        borderRadius: 8,
                        padding: "8px 10px",
                        cursor: "pointer"
                      }}
                      onClick={() => handleDuePreset(lbl)}
                    >
                      {lbl.replace(/h/, " hours").replace("1w", "1 week")}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="fieldLabelIcon">
                <h3 className="fieldtitle">General Instruction (Optional)</h3>
              </div>
              <textarea
                className="input"
                rows={3}
                placeholder="Provide any specific instructions for the candidate"
                style={{ width: "100%" }}
                value={basicInstructions}
                onChange={e => setBasicInstructions(e.target.value)}
              />
            </div>

            <div className="footerButtons">
              <div className="leftbtn"></div>
              <div className="rightbtn">
                <button className="button blue" onClick={handleContinue}>Continue</button>
              </div>
            </div>
          </div>
        )}

        {/* Documents Panel (unchanged logic) */}
        {activeTabs === "documents" && (
          <div className="panel documentsPanel">
            <div className="iconHeading">
              <FileText width={20} /><h4>Document Requirements</h4>
            </div>

            <div className="fieldLabelIcon">
              <h3 className="fieldtitle">Common Documents (Click to add)</h3>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
              {COMMON_DOCUMENTS.map(doc => (
                <OptionButton
                  key={doc}
                  label={doc}
                  active={docList.some(d => d.label === doc)}
                  onClick={() => toggleDoc(doc)}
                  icon={null}
                />
              ))}
            </div>

            <div className="fieldLabelIcon">
              <h3 className="fieldtitle">Request Custom Documents</h3>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <input
                className="input"
                value={customDoc}
                onChange={e => setCustomDoc(e.target.value)}
                placeholder="Add a custom document of your choice here"
              />
              <button type="button" className="addButton" onClick={addCustomDoc}><Plus size={18} />Add</button>
            </div>

            {docList.length > 0 && (<>
              <div className="fieldLabelIcon" style={{ marginTop: "18px" }}>
                <h3 className="fieldtitle">List of Requested Documents ({docList.length} items)</h3>
              </div></>)}

            <div>
              <ul style={{ padding: 0, marginBottom: 8 }}>
                {docList.map((doc, idx) => (
                  <li key={doc.label + idx} style={{ listStyle: "none", margin: "4px 0", display: "flex", alignItems: "center" }}>
                    <span>{doc.label}</span>

                    <select
                      value={doc.required ? "Required" : "Optional"}
                      onChange={(e) => {
                        const val = e.target.value === "Required";
                        setDocList(list =>
                          list.map((d, i) =>
                            i === idx ? { ...d, required: val } : d
                          )
                        );
                      }}
                      style={{ marginLeft: "auto", width: "25%", height: "32px", padding: "3px 6px", marginRight: "10px" }}
                    >
                      <option>Required</option>
                      <option>Optional</option>
                    </select>

                    <button
                      onClick={() => removeDoc(doc.label)}
                      style={{
                        color: "#2463EB",
                        marginLeft: 8,
                        cursor: "pointer",
                        border: "none",
                        background: "none"
                      }}
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="fieldLabelIcon" style={{ marginTop: "22px" }}>
              <h3 className="fieldtitle">Instructions for Documents (Optional)</h3>
            </div>
            <textarea
              className="input"
              rows={2}
              style={{ width: "100%" }}
              placeholder="e.g., Please ensure references include contact information"
              value={docInstructions}
              onChange={e => setDocInstructions(e.target.value)}
            />
            <div className="footerButtons">
              <div className="leftbtn">
                <button className="button" style={{ marginRight: 8 }} onClick={handleBack}>Back</button>
              </div>
              <div className="rightbtn">
                <button className="button blue" onClick={handleContinue}>Continue</button>
              </div>
            </div>
          </div>
        )}

        {/* Questions Panel (unchanged logic) */}
        {activeTabs === "questions" && (
          <div className="panel questionsPanel">
            <div className="iconHeading">
              <MessageSquare width={20} /><h4>Additional Questions</h4>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16, marginTop: 20 }}>
              {COMMON_QUESTIONS.map(q => (
                <OptionButton
                  key={q}
                  label={q}
                  active={questionList.some(qq => qq.label === q)}
                  onClick={() => toggleQuestion(q)}
                  icon={null}
                />
              ))}
            </div>

            <div className="fieldLabelIcon">
              <h3 className="fieldtitle">Request custom questions</h3>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <input
                className="input"
                value={customQuestion}
                onChange={e => setCustomQuestion(e.target.value)}
                placeholder="Add a custom question of your choice here"
              />
              <button type="button" className="addButton" onClick={addCustomQuestion}><Plus size={18} />Add</button>
            </div>

            {questionList.length > 0 && (<>
              <div className="fieldLabelIcon" style={{ marginTop: "18px" }}>
                <h3 className="fieldtitle">List of Custom Questions ({questionList.length} items)</h3>
              </div></>)}

            <div>
              <ul style={{ padding: 0 }}>
                {questionList.map((q, idx) => (
                  <li key={q.label + idx} style={{ listStyle: "none", margin: "4px 0", display: "flex", alignItems: "center" }}>
                    <span>{q.label}</span>

                    <select
                      value={q.required ? "Required" : "Optional"}
                      onChange={e => {
                        const val = e.target.value === "Required";
                        setQuestionList(list => list.map((qq, i) => i === idx ? { ...qq, required: val } : qq));
                      }}
                      style={{ marginLeft: "auto", width: "25%", height: "32px", padding: "3px 6px", marginRight: "10px" }}
                    >
                      <option>Required</option>
                      <option>Optional</option>
                    </select>

                    <select
                      value={q.type ?? "shorttext"}
                      onChange={e => {
                        const val = e.target.value;
                        setQuestionList(list =>
                          list.map((qq, i) => (i === idx ? { ...qq, type: val } : qq))
                        );
                      }}
                      style={{ marginLeft: "12px", width: "25%", height: "32px", padding: "3px 6px", marginRight: "10px" }}
                    >
                      {TYPE_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>

                    <button onClick={() => removeQuestion(idx)} style={{
                      color: '#2463EB', marginLeft: 8, cursor: 'pointer', border: 'none', background: 'none'
                    }}>×</button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footerButtons">
              <div className="leftbtn">
                <button className="button" style={{ marginRight: 8 }} onClick={handleBack}>Back</button>
              </div>
              <div className="rightbtn">
                {docList.length > 0 || questionList.length > 0 ? (
                  <button className="button blue" onClick={handleSendRequest}>Send Request</button>
                ) : (
                  <button className="button blue" onClick={() => {
                    setType("failed");
                    setMessage("Select at least one question or document before requesting additional information.");
                  }}>Send Request</button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default RequestAdditionInfo;
