import React, { useEffect, useState } from "react";
import CSavvyPageLoader from "../../cSavvvyPageLoader";
import { useSelector } from "react-redux";
import {
  Download,
  Eye,
  NotepadTextIcon,
} from "lucide-react";
import "../style/sendReference.css?ver0.4";
import "../style/profileTop.css?ver0.5";

const SubmissionDetailed = ({
  selectedProfile,
  setMessage,
  setType,
  setShowLoader,
  submissionSelected,
  setSubmissionSelected,
  setBase64Pdf,
  base64Pdf,
  setShowPdfPopup,
}) => {
  const { jobId } = useSelector((state) => state.profile);
  const profile = selectedProfile || {};
  const [additionalDetailed, setAdditionalDetailed] = useState(null);
  const [loading, setLoading] = useState(true);
  const formatDateUS = (dateStr) => {
    if (!dateStr) return "not specified";
    const date = new Date(dateStr);
    if (isNaN(date)) return "invalid date";
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      if (profile.email && submissionSelected?.doc_id) {
        try {
          const listQuery = {
            action: "get_additional_info_form_data",
            doc_id: submissionSelected.doc_id,
            candidate_email: profile.email,
          };
          const response = await fetch(
            "https://get-employment-data-v10-737421501165.us-east1.run.app",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(listQuery),
            }
          );
          const data = await response.json();
          setAdditionalDetailed(data);
        } catch (error) {
          setAdditionalDetailed(null);
          if (setMessage && setType) {
            setType("error");
            setMessage("Failed to load details.");
          }
        }
      } else {
        setAdditionalDetailed(null);
      }
      setLoading(false);
    }
    loadData();
    // Only trigger if email or doc_id changes
  }, [profile.email, submissionSelected?.doc_id, setMessage, setType]);

  if (loading) {
    return <CSavvyPageLoader loaderText="Loading Details..." />;
  }

  if (!additionalDetailed) {
    return (
      <div style={{ padding: 32, textAlign: "center", color: "#888" }}>
        No additional details found.
      </div>
    );
  }

  return (
    <>
      <div className="userProfileTop bordered">
        <div className="profileInfo">
          <div className="head-row">
            <h3 className="bigHead">
              <NotepadTextIcon size={18} style={{ marginTop: "-5px" }} /> Additional Details
            </h3>
          </div>
        </div>
      </div>
      <div className="submissionDetailedView">
        {/* Overview Section */}
        <div className="overview-card">
          <h3 className="overview-title">Request Summary</h3>
          <div className="overview-grid">
            <div className="overview-item">
              <p className="label">Recipient</p>
              <p className="value" style={{ textTransform: "lowercase" }}>
                {additionalDetailed.candidate_email || "--"}
              </p>
            </div>
            <div className="overview-item">
              <p className="label">Due Date</p>
              <p className="value">
                {/* {additionalDetailed.other_questions?.due_date || "--"} */}
                {formatDateUS(additionalDetailed.other_questions?.due_date)}
              </p>
            </div>
            {additionalDetailed.other_questions?.general_instruction !== "" && (<>
              <div className="overview-item">
                <p className="label">Instructions</p>
                <p className="value">
                  {additionalDetailed.other_questions?.general_instruction || "--"}
                </p>
              </div>
            </>)}

            <div className="overview-item">
              <p className="label">Priority</p>
              <p className="value">
                {additionalDetailed.other_questions?.priority == "low" && (<>Normal</>)}
                {additionalDetailed.other_questions?.priority == "medium" && (<>Urgent</>)}
                {additionalDetailed.other_questions?.priority == "high" && (<>Critical</>)}
              </p>
            </div>
          </div>
        </div>
        {/* Additional Information */}
        {Array.isArray(
          additionalDetailed.other_questions?.common_questions
        ) &&
          additionalDetailed.other_questions.common_questions.length > 0 && (
            <div className="overview-card">
              <h3 className="overview-title">Additional Information</h3>
              <div className="overview-grid">
                {additionalDetailed.other_questions.common_questions.map(
                  (q, idx) => (
                    <div className="overview-item" key={idx}>
                      <p className="label">{q.question} {q.required && (<>(Required)</>)}
                      </p>
                      <p className="value">
                        {isNaN(Date.parse(q.answer))
                          ? q.answer || "Not Answered"
                          : new Date(q.answer).toLocaleDateString("en-US", {
                            month: "2-digit",
                            day: "2-digit",
                            year: "numeric",
                          })}
                      </p>

                    </div>
                  )
                )}
              </div>
            </div>
          )}

        {/* Documents Required */}
        {
          (
            (Array.isArray(additionalDetailed?.other_questions?.documents_needed) &&
              additionalDetailed.other_questions.documents_needed.length > 0) ||
            (Array.isArray(additionalDetailed?.uploaded_documents) &&
              additionalDetailed.uploaded_documents.length > 0)
          ) && (
            <div className="overview-card id-card documents rate-card">
              {Array.isArray(additionalDetailed?.uploaded_documents) &&
                additionalDetailed.uploaded_documents.length > 0 ? (
                <>
                  <h3 className="overview-title">
                    Uploaded Documents ({additionalDetailed.uploaded_documents.length})
                  </h3>

                  <div className="id-documents">
                    <div className="document-grid">
                      {additionalDetailed.uploaded_documents.map((doc, idx) => {
                        const safeName = doc?.name || "document";
                        const typeLabel = (doc?.type || "").replace(/_/g, " ");
                        const ext = (safeName.split(".").pop() || "").toLowerCase();

                        const mime =
                          doc?.format === "pdf" || ext === "pdf"
                            ? "application/pdf"
                            : doc?.format === "docx" || ext === "docx"
                              ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                              : doc?.format === "doc" || ext === "doc"
                                ? "application/msword"
                                : "application/octet-stream";

                        const hasHttpUrl =
                          typeof doc?.path === "string" && /^https?:\/\//i.test(doc.path);

                        const canDownload = Boolean(doc?.base64_content) || hasHttpUrl;

                        const handleDownload = () => {
                          if (doc?.base64_content) {
                            const linkSource = `data:${mime};base64,${doc.base64_content}`;
                            const a = document.createElement("a");
                            a.href = linkSource;
                            a.download = safeName;
                            document.body.appendChild(a);
                            a.click();
                            a.remove();
                            return;
                          }
                          if (hasHttpUrl) {
                            const a = document.createElement("a");
                            a.href = doc.path;
                            a.download = safeName;
                            document.body.appendChild(a);
                            a.click();
                            a.remove();
                            return;
                          }
                          // non-http(s): request a signed URL from backend
                        };

                        const handlePreview = () => {
                          if (doc?.base64_content) {
                            setBase64Pdf(doc.base64_content);
                            setShowPdfPopup(true);
                          }
                        };

                        return (
                          <div className="doc-row" key={doc?.id ?? idx} title={safeName}>
                            <div className="docFiles">
                              <div className="doc-Title">{typeLabel}</div>
                              <span className="docsText" title={safeName}>
                                {safeName}
                              </span>
                            </div>

                            <div className="doc-actions">
                              <button
                                className="icon-btn"
                                onClick={handleDownload}
                                disabled={!canDownload}
                                title="Download document"
                              >
                                <Download size={16} />
                              </button>

                              <button
                                className="icon-btn"
                                onClick={handlePreview}
                                disabled={!doc?.base64_content}
                                title="Preview document"
                              >
                                <Eye size={16} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              ) : (
                <div className="id-documents">
                  <div className="document-grid">
                    <div className="doc-row">
                      <div className="docFiles">
                        <div className="doc-Title">Documents</div>
                        <span className="docsText" style={{textTransform:"capitalize"}}>No documents uploaded yet</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        }





        {/* Uploaded Documents */}

      </div>
    </>
  );
};

export default SubmissionDetailed;
