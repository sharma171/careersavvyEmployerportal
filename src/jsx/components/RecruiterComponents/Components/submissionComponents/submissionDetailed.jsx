import React, { useEffect, useState } from "react";
import CSavvyPageLoader from "../../cSavvvyPageLoader";
import { useSelector } from "react-redux";
import {
  Check,
  Download,
  Eye,
  NotepadTextIcon,
  PenLine,
  RefreshCcw,
} from "lucide-react";
import "../style/sendReference.css?ver0.5";
import "../style/profileTop.css?ver0.5";

const SubmissionDetailed = ({
  selectedProfile,
  setMessage,
  setType,
  setShowLoader,
  submissionSelected,
  setSubmissionSelected,
  setBase64Pdf, base64Pdf, setShowPdfPopup
}) => {
  const { jobId } = useSelector((state) => state.profile);
  const profile = selectedProfile || {};
  const [submissionDetailed, setSubmissionDetailed] = useState(null);

  const formatDateUS = (dateStr) => {
    if (!dateStr) return "not specified";
    const date = new Date(dateStr);
    if (isNaN(date)) return "invalid date";
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };
  const employmentSubmissionRequest = async (email) => {
    setShowLoader("Sending Request");
    try {
      const listQuery = {
        "action": "notify_candidate_for_document_upload",
        "candidate_mail_id": email,
        "job_id": jobId
      }
      const response = await fetch("https://notify-candidate-employmnt-sub-and-store-data-v10-737421501165.us-east1.run.app", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(listQuery),
      })
      const data = await response.json();
      // setShowLoader("");
      setType("success");
      setMessage(data.message);
    } catch (error) {
      console.log(error);
      // setShowLoader("");
    }
  }

  // Static timeline sample data for submission progress visualization
  const timelineData = [
    {
      color: "#3B82F6",
      title: "Submission Form Sent",
      description: "Initial submission form sent to candidate",
      date: formatDateUS(submissionDetailed?.submission_sent),
    },
    {
      color: "#22C55E",
      title: "Partial Submission Received",
      description: "Candidate submitted partial information",
      date: formatDateUS(submissionDetailed?.submission_partial),
    },
    {
      color: "#A855F7",
      title: "Submission Form Completed",
      description: "Requested missing employment verification documents",
      date: formatDateUS(submissionDetailed?.submission_completed),
    },
  ];


  useEffect(() => {
    getDetailedSubmissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getDetailedSubmissions = async () => {
    if (!submissionSelected || !submissionSelected.doc_id || !profile.email || !jobId) return;
    try {
      const listQuery = {
        action: "get_detailed_submission",
        doc_id: submissionSelected.doc_id,
        candidate_email: profile.email,
        job_id: jobId,
      };
      setShowLoader("Loading");
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
      setSubmissionDetailed(data);
    } catch (error) {
      console.error("Failed to load submission details:", error);
      setMessage("Failed to load submission details");
      setType("error");
    } finally {
      setTimeout(() => {

        setShowLoader("");
      }, 0)
    }
  };

  if (!submissionDetailed) {
    return <>
      <CSavvyPageLoader loaderText={`Loading`} />
    </>;
  }



  // Fallback for profile name if missing from submission data
  const fullName =
    (submissionDetailed?.full_name ||
      `${profile?.first_name || ""} ${profile?.last_name || ""}`).trim() || "-";

  return (
    <>
      <div className="userProfileTop bordered">
        <div className="profileInfo">
          <div className="head-row">
            <h3 className="bigHead">
              <NotepadTextIcon size={18} /> Submission Information - {fullName && (<>{fullName}</>)}
            </h3>
            <span className={`status-badge ${submissionSelected.submission_status.replace("_", " ") == "completed" ? "completed" : "pending"}`}>
              {submissionSelected.submission_status
                ? submissionSelected.submission_status.replace(/_/g, " ")
                : "-"}
            </span>
          </div>
        </div>
      </div>

      <div className="submissionDetailedView">
        {/* <div className="top-buttonsection">
          <button className="action-btn">
            <PenLine size={16} className="icon" />
            Request Additional Info
          </button>
          <button className="action-btn" onClick={()=>{employmentSubmissionRequest(profile.email)}}>
            <RefreshCcw size={16} className="icon" />
            Resend Form
          </button>
        </div> */}

        {/* Overview Section */}
        <div className="overview-card">
          <h3 className="overview-title">Overview</h3>
          <div className="overview-grid">
            <div className="overview-item">
              <p className="label">Candidate</p>
              <p className="value">{fullName}</p>
            </div>
            <div className="overview-item">
              <p className="label">Submitted</p>
              <p className="value">{formatDateUS(submissionDetailed?.submission_sent) || "not specified"}</p>
            </div>
            <div className="overview-item">
              <p className="label">Email</p>
              <p className="value" style={{ textTransform: "lowercase" }}>{submissionDetailed.candidate_email || "not specified"}</p>
            </div>
            <div className="overview-item">
              <p className="label">Phone</p>
              <p className="value">{submissionDetailed.phone || "not specified"}</p>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="overview-card">
          <h3 className="overview-title">Personal Information</h3>
          <div className="overview-grid">
            <div className="overview-item">
              <p className="label">Full Name</p>
              <p className="value">{fullName}</p>
            </div>
            <div className="overview-item">
              <p className="label">Date of Birth</p>
              <p className="value">
                {formatDateUS(submissionDetailed.dob) || "not specified"}


              </p>
            </div>
          </div>
        </div>
        {/* Personal Information */}
        <div className="overview-card">
          <h3 className="overview-title">Employer Details</h3>
          <div className="overview-grid">
            <div className="overview-item">
              <p className="label">Company</p>
              <p className="value">{submissionDetailed.employer_details.company || "not specified"}</p>
            </div>
            <div className="overview-item">
              <p className="label">Address</p>
              <p className="value">{submissionDetailed.employer_details.address || "not specified"}</p>
            </div>
          </div>
        </div>

        {/* Identification Documents */}
        <div className="id-card documents">
          <h3 className="id-title">Identification Documents</h3>
          <div className="id-grid">
            <div className="id-item">
              <p className="label">ID Type</p>
              <p className="value link-text">{submissionDetailed.identification_docs?.id_type || "not specified"}</p>
            </div>
            <div className="id-item">
              <p className="label">ID Number</p>
              <p className="value link-text">{submissionDetailed.identification_docs?.id_number || "not specified"}</p>
            </div>
          </div>

          {submissionDetailed.identification_docs?.issuing_state !== "" && (<>
            <div className="id-grid">
              <div className="id-item">
                <p className="label">Issuing State</p>
                <p className="value link-text">
                  {submissionDetailed.identification_docs?.issuing_state || "not specified"}
                </p>

              </div>
            </div>
          </>)}

          <div className="id-documents">
            <p className="label">Documents</p>
            <div className="document-grid">
              {submissionDetailed.identification_docs?.documents_list?.length > 0 ? (
                submissionDetailed.identification_docs.documents_list.map((doc, idx) => (
                  <div key={idx} className="doc-row" title={doc.name}>
                    <span className="doc-name">{doc.name}</span>
                    <div className="doc-actions">
                      <button
                        className="icon-btn"
                        onClick={() => {
                          // Example: open the document base64 content in new tab or modal
                          if (doc.base64_content) {
                            const linkSource = `data:application/pdf;base64,${doc.base64_content}`;
                            const downloadLink = document.createElement("a");
                            downloadLink.href = linkSource;
                            downloadLink.download = doc.name;
                            downloadLink.click();
                          }
                        }}
                        title="Download Document"
                      >
                        <Download size={16} />
                      </button>
                      <button
                        className="icon-btn"
                        onClick={() => {
                          setBase64Pdf(doc.base64_content);
                          setTimeout(() => {
                            setShowPdfPopup(true);
                          }, 100);
                          // if (doc.base64_content) {
                          //   const linkSource = `data:application/pdf;base64,${doc.base64_content}`;
                          //   const downloadLink = document.createElement("a");
                          //   downloadLink.href = linkSource;
                          //   downloadLink.download = doc.name;
                          //   downloadLink.click();
                          // }
                        }}
                        title="View Document"
                      >
                        <Eye size={16} />
                      </button>
                      {/* Eye icon button could be used for preview if implemented */}
                      {/* <button className="icon-btn" title="Preview Document">
                        👁
                      </button> */}
                    </div>
                  </div>
                ))
              ) : (
                <p className="value">No documents uploaded</p>
              )}
            </div>
          </div>
        </div>


        {/* Work Authorization */}
        <div className="overview-card id-card documents">
          <h3 className="overview-title">Work Authorization</h3>
          <div className="overview-grid">
            <div className="overview-item">
              <p className="label">Status</p>
              <p className="value">{submissionDetailed.work_authorization?.work_authorization_status || "not specified"}</p>
            </div>
            <div className="overview-item">
              <p className="label">Expiry Date</p>
              <p className="value">{formatDateUS(submissionDetailed.work_authorization?.work_authorization_expiry_date)}</p>
            </div>
          </div>
          <div className="id-documents">
            <p className="label">Documents</p>
            <div className="document-grid">
              {submissionDetailed.work_authorization?.document_list?.length > 0 ? (
                submissionDetailed.work_authorization?.document_list?.map((doc, idx) => (
                  <div key={idx} className="doc-row" title={doc.name}>
                    <span className="doc-name">{doc.name}</span>
                    <div className="doc-actions">
                      <button
                        className="icon-btn"
                        onClick={() => {
                          // Example: open the document base64 content in new tab or modal
                          if (doc.base64_content) {
                            const linkSource = `data:application/pdf;base64,${doc.base64_content}`;
                            const downloadLink = document.createElement("a");
                            downloadLink.href = linkSource;
                            downloadLink.download = doc.name;
                            downloadLink.click();
                          }
                        }}
                        title="Download Document"
                      >
                        <Download size={16} />
                      </button>
                      <button
                        className="icon-btn"
                        onClick={() => {
                          setBase64Pdf(doc.base64_content);
                          setTimeout(() => {
                            setShowPdfPopup(true);
                          }, 100);
                          // if (doc.base64_content) {
                          //   const linkSource = `data:application/pdf;base64,${doc.base64_content}`;
                          //   const downloadLink = document.createElement("a");
                          //   downloadLink.href = linkSource;
                          //   downloadLink.download = doc.name;
                          //   downloadLink.click();
                          // }
                        }}
                        title="View Document"
                      >
                        <Eye size={16} />
                      </button>
                      {/* Eye icon button could be used for preview if implemented */}
                      {/* <button className="icon-btn" title="Preview Document">
                        👁
                      </button> */}
                    </div>
                  </div>
                ))
              ) : (
                <p className="value">No documents uploaded</p>
              )}
            </div>
          </div>
        </div>


        {/* Employment Status */}
        <div className="overview-card">
          <h3 className="overview-title">Employment Status</h3>
          <div className="overview-grid">
            <div className="overview-item">
              <p className="label">Current Status</p>
              <p className="value">{submissionDetailed.employment_status?.employment_situation || "not specified"}</p>
            </div>
            {submissionDetailed.employment_status?.employment_situation == "currently employed" || submissionDetailed.employment_status?.employment_situation == "current contract" ? (<>
              <div className="overview-item">
                <p className="label">Current employer name</p>
                <p className="value">{submissionDetailed.employment_status?.current_employer_name || "not specified"}</p>
              </div>
              <div className="overview-item">
                <p className="label">employment type with current employer</p>
                <p className="value">{submissionDetailed.employment_status?.employment_type_with_current_employer || "not specified"}</p>
              </div>
              <div className="overview-item">
                <p className="label">Contact person name</p>
                <p className="value">{submissionDetailed.employment_status?.contact_person_name || "not specified"}</p>
              </div>
              <div className="overview-item">
                <p className="label">Contact person title</p>
                <p className="value">{submissionDetailed.employment_status?.contact_person_title || "not specified"}</p>
              </div>
              <div className="overview-item">
                <p className="label">Contact email</p>
                <p className="value" style={{ textTransform: "lowercase" }}>{submissionDetailed.employment_status?.contact_email || "not specified"}</p>
              </div>
              <div className="overview-item">
                <p className="label">Contact phone</p>
                <p className="value">{submissionDetailed.employment_status?.contact_phone || "not specified"}</p>
              </div>
              <div className="overview-item">
                <p className="label">Changes Authorization</p>
                <p className="value">{submissionDetailed.employment_status?.employment_change_authorization || "not specified"}</p>
              </div>
              {submissionDetailed.employment_status?.employment_change_authorization == "need to give notice period" && (<>

                {submissionDetailed.employment_status?.notice_period !== "" && (<>
                  <div className="overview-item">
                    <p className="label">Notice Period</p>
                    <p className="value">{submissionDetailed.employment_status?.notice_period || "not specified"}</p>
                  </div>
                </>)}
              </>)}
              {submissionDetailed.employment_status?.employment_change_authorization == "have restrictions (non-compete, etc.)" && (<>
                {submissionDetailed.employment_status?.restriction_details !== "" && (<>
                  <div className="overview-item">
                    <p className="label">restriction details</p>
                    <p className="value">{submissionDetailed.employment_status?.restriction_details || "not specified"}</p>
                  </div>
                </>)}
              </>)}

            </>) : (<></>)}

          </div>
        </div>

        {/* Rate & Employment Terms */}
        <div className="rate-card overview-card">
          <h3 className="section-title">Rate & Employment Terms</h3>

          <div className="employment-types">
            <p className="badgeHead">Preferred Employment Types</p>
            <div className="type-badges">
              {submissionDetailed?.rate_employment_terms?.preferred_employment_type ? (<>
                {(submissionDetailed?.rate_employment_terms?.preferred_employment_type || "")
                  .map((type) => (
                    <span key={type.trim()} className="badge">
                      {type.trim()}
                    </span>
                  ))}
              </>) : (<>
                not specified
              </>)}

            </div>
          </div>
          {submissionDetailed?.rate_employment_terms?.preferred_employment_type.includes("W2 (I can work on your payroll)") && (<>
            {submissionDetailed?.rate_employment_terms?.w2_expected_hourly_rate !== "" || submissionDetailed.rate_employment_terms.w2_min_rate !== "" ? (<>
              <div className="rates">
                <p className="sub-title">W2 Rates</p>
                <div className="row">
                  <div>
                    <span className="label">Expected rate</span>
                    <p className="values">
                      {submissionDetailed?.rate_employment_terms?.w2_expected_hourly_rate
                        ? `$ ${String(submissionDetailed.rate_employment_terms.w2_expected_hourly_rate).trim().replace(/^\$/, '').replace(/\s*\/\s*hr$/i, '')}/hr`
                        : "not specified"}
                    </p>
                  </div>
                  <div>
                    <span className="label">Minimum Rate </span>
                    <p className="values">
                      {submissionDetailed?.rate_employment_terms?.w2_min_rate
                        ? `$ ${String(submissionDetailed.rate_employment_terms.w2_min_rate).trim().replace(/^\$/, '').replace(/\s*\/\s*hr$/i, '')}/hr`
                        : "not specified"}
                    </p>
                  </div>
                </div>
              </div>
            </>) : (<></>)}
          </>)}
          {submissionDetailed?.rate_employment_terms?.preferred_employment_type.includes("Open to Multiple Options") && (<>
            {submissionDetailed?.rate_employment_terms?.w2_expected_hourly_rate !== "" || submissionDetailed.rate_employment_terms.w2_min_rate !== "" ? (<>
              <div className="rates">
                <p className="sub-title">W2 Rates</p>
                <div className="row">
                  <div>
                    <span className="label">Expected rate</span>
                    <p className="values">
                      {submissionDetailed?.rate_employment_terms?.w2_expected_hourly_rate
                        ? `$ ${String(submissionDetailed.rate_employment_terms.w2_expected_hourly_rate).trim().replace(/^\$/, '').replace(/\s*\/\s*hr$/i, '')}/hr`
                        : "not specified"}
                    </p>
                  </div>
                  <div>
                    <span className="label">Minimum Rate </span>
                    <p className="values">
                      {submissionDetailed?.rate_employment_terms?.w2_min_rate
                        ? `$ ${String(submissionDetailed.rate_employment_terms.w2_min_rate).trim().replace(/^\$/, '').replace(/\s*\/\s*hr$/i, '')}/hr`
                        : "not specified"}
                    </p>
                  </div>
                </div>
              </div>
            </>) : (<></>)}
          </>)}

          {submissionDetailed?.rate_employment_terms?.preferred_employment_type.includes("C2C (Corp-to-Corp through my company)") && (<>
            {submissionDetailed?.rate_employment_terms?.c2c_expected_hourly_rate !== "" || submissionDetailed?.rate_employment_terms?.c2c_min_rate !== "" ? (<>
              <div className="c2c-details">
                <p className="sub-title">C2C Details</p>
                <div className="row">
                  <div>
                    <span className="label">Business Name</span>
                    <p className="values">{submissionDetailed?.rate_employment_terms?.c2c_company_name || "not specified"}</p>
                  </div>
                </div>
                <div className="row">
                  <div>
                    <span className="label">Expected Rate</span>
                    <p className="values">
                      {submissionDetailed?.rate_employment_terms?.c2c_expected_hourly_rate
                        ? `$${submissionDetailed?.rate_employment_terms.c2c_expected_hourly_rate}/hr`
                        : "not specified"}
                    </p>
                  </div>
                  <div>
                    <span className="label">Minimum Rate</span>
                    <p className="values">
                      {submissionDetailed.rate_employment_terms?.c2c_min_rate
                        ? `$ ${String(submissionDetailed.rate_employment_terms.c2c_min_rate).trim().replace(/^\$/, '').replace(/\s*\/\s*hr$/i, '')}/hr`
                        : "not specified"}
                    </p>
                  </div>

                </div>
              </div>
              <div className="overview-grid">
                <div className="overview-item">
                  <p className="label">Company phone</p>
                  <p className="value"> {submissionDetailed.rate_employment_terms?.c2c_company_phone
                    ? `${submissionDetailed.rate_employment_terms.c2c_company_phone}`
                    : "not specified"}</p>
                </div>
                <div className="overview-item">
                  <p className="label">Company Legal name</p>
                  <p className="value"> {submissionDetailed.rate_employment_terms?.c2c_legal_name
                    ? `${submissionDetailed.rate_employment_terms.c2c_legal_name}`
                    : "not specified"}</p>
                </div>
                <div className="overview-item">
                  <p className="label">Company Email</p>
                  <p className="value" style={{ textTransform: "lowercase" }}> {submissionDetailed.rate_employment_terms?.c2c_company_email
                    ? `${submissionDetailed.rate_employment_terms.c2c_company_email}`
                    : "not specified"}</p>
                </div>

                <div className="overview-item">
                  <p className="label">Primary Contact Person</p>
                  <p className="value"> {submissionDetailed.rate_employment_terms?.c2c_primary_contact
                    ? `${submissionDetailed.rate_employment_terms.c2c_primary_contact}`
                    : "not specified"}</p>
                </div>
                <div className="overview-item">
                  <p className="label">Zip code</p>
                  <p className="value"> {submissionDetailed.rate_employment_terms?.c2c_zip
                    ? `${submissionDetailed.rate_employment_terms.c2c_zip}`
                    : "not specified"}</p>
                </div>
                <div className="overview-item">
                  <p className="label">City</p>
                  <p className="value"> {submissionDetailed.rate_employment_terms?.c2c_city
                    ? `${submissionDetailed.rate_employment_terms.c2c_city}`
                    : "not specified"}</p>
                </div>
                <div className="overview-item">
                  <p className="label">State</p>
                  <p className="value"> {submissionDetailed.rate_employment_terms?.c2c_state
                    ? `${submissionDetailed.rate_employment_terms.c2c_state}`
                    : "not specified"}</p>
                </div>


              </div>
            </>) : (<></>)}
          </>)}
          {submissionDetailed?.rate_employment_terms?.preferred_employment_type.includes("Open to Multiple Options") && (<>
            {submissionDetailed?.rate_employment_terms?.c2c_expected_hourly_rate !== "" || submissionDetailed?.rate_employment_terms?.c2c_min_rate !== "" ? (<>
              <div className="c2c-details">
                <p className="sub-title">C2C Details</p>
                <div className="row">
                  <div>
                    <span className="label">Business Name</span>
                    <p className="values">{submissionDetailed?.rate_employment_terms?.c2c_company_name || "not specified"}</p>
                  </div>
                </div>
                <div className="row">
                  <div>
                    <span className="label">Expected Rate</span>
                    <p className="values">
                      {submissionDetailed?.rate_employment_terms?.c2c_expected_hourly_rate
                        ? `$ ${String(submissionDetailed?.rate_employment_terms.c2c_expected_hourly_rate).trim().replace(/^\$/, '').replace(/\s*\/\s*hr$/i, '')}/hr`
                        : "not specified"}
                    </p>
                  </div>
                  <div>
                    <span className="label">Minimum Rate</span>
                    <p className="values">
                      {submissionDetailed.rate_employment_terms?.c2c_min_rate
                        ? `$ ${String(submissionDetailed.rate_employment_terms.c2c_min_rate).trim().replace(/^\$/, '').replace(/\s*\/\s*hr$/i, '')}/hr`
                        : "not specified"}
                    </p>
                  </div>

                </div>
              </div>
              <div className="overview-grid">
                <div className="overview-item">
                  <p className="label">Company phone</p>
                  <p className="value"> {submissionDetailed.rate_employment_terms?.c2c_company_phone
                    ? `${submissionDetailed.rate_employment_terms.c2c_company_phone}`
                    : "not specified"}</p>
                </div>
                <div className="overview-item">
                  <p className="label">Company Email</p>
                  <p className="value" style={{ textTransform: "lowercase" }}> {submissionDetailed.rate_employment_terms?.c2c_company_email
                    ? `${submissionDetailed.rate_employment_terms.c2c_company_email}`
                    : "not specified"}</p>
                </div>

                <div className="overview-item">
                  <p className="label">Primary Contact Person</p>
                  <p className="value"> {submissionDetailed.rate_employment_terms?.c2c_primary_contact
                    ? `${submissionDetailed.rate_employment_terms.c2c_primary_contact}`
                    : "not specified"}</p>
                </div>
                <div className="overview-item">
                  <p className="label">Company Legal name</p>
                  <p className="value"> {submissionDetailed.rate_employment_terms?.c2c_legal_name
                    ? `${submissionDetailed.rate_employment_terms.c2c_legal_name}`
                    : "not specified"}</p>
                </div>
                <div className="overview-item">
                  <p className="label">Zip code</p>
                  <p className="value"> {submissionDetailed.rate_employment_terms?.c2c_zip
                    ? `${submissionDetailed.rate_employment_terms.c2c_zip}`
                    : "not specified"}</p>
                </div>
                <div className="overview-item">
                  <p className="label">City</p>
                  <p className="value"> {submissionDetailed.rate_employment_terms?.c2c_city
                    ? `${submissionDetailed.rate_employment_terms.c2c_city}`
                    : "not specified"}</p>
                </div>
                <div className="overview-item">
                  <p className="label">State</p>
                  <p className="value"> {submissionDetailed.rate_employment_terms?.c2c_state
                    ? `${submissionDetailed.rate_employment_terms.c2c_state}`
                    : "not specified"}</p>
                </div>


              </div>
            </>) : (<></>)}
          </>)}

          {submissionDetailed?.rate_employment_terms?.preferred_employment_type.includes("1099 (Independent Contractor)") && (<>
            {submissionDetailed?.rate_employment_terms?.contractor_expected_hourly_rate !== "" || submissionDetailed?.rate_employment_terms?.contractor_min_rate !== "" ? (<>
              <p className="sub-title">1099 Rates</p>
              <div className="overview-grid">
                <div className="overview-item">
                  <p className="label">Expected hourly rate</p>
                  <p className="value"> {submissionDetailed.rate_employment_terms?.contractor_expected_hourly_rate
                    ? `$ ${String(submissionDetailed.rate_employment_terms.contractor_expected_hourly_rate).trim().replace(/^\$/, '').replace(/\s*\/\s*hr$/i, '')}/hr`
                    : "not specified"}</p>
                </div>
                <div className="overview-item">
                  <p className="label">Minimum Rate</p>
                  <p className="value"> {submissionDetailed.rate_employment_terms?.contractor_min_rate
                    ? `$ ${String(submissionDetailed.rate_employment_terms.contractor_min_rate).trim().replace(/^\$/, '').replace(/\s*\/\s*hr$/i, '')}/hr`
                    : "not specified"}</p>
                </div>


              </div>
            </>) : (<></>)}
          </>)}
          {submissionDetailed?.rate_employment_terms?.preferred_employment_type.includes("Open to Multiple Options") && (<>
            {submissionDetailed?.rate_employment_terms?.contractor_expected_hourly_rate !== "" || submissionDetailed?.rate_employment_terms?.contractor_min_rate !== "" ? (<>
              <p className="sub-title">1099 Rates</p>
              <div className="overview-grid">
                <div className="overview-item">
                  <p className="label">Expected hourly rate</p>
                  <p className="value">$ {submissionDetailed.rate_employment_terms?.contractor_expected_hourly_rate
                    ? `${String(submissionDetailed.rate_employment_terms.contractor_expected_hourly_rate).trim().replace(/^\$/, '').replace(/\s*\/\s*hr$/i, '')}/hr`
                    : "not specified"}</p>
                </div>
                <div className="overview-item">
                  <p className="label">Minimum Rate</p>
                  <p className="value">$ {submissionDetailed.rate_employment_terms?.contractor_min_rate
                    ? `${String(submissionDetailed.rate_employment_terms.contractor_min_rate).trim().replace(/^\$/, '').replace(/\s*\/\s*hr$/i, '')}/hr`
                    : "not specified"}</p>
                </div>


              </div>
            </>) : (<></>)}
          </>)}



          <div className="start-date">
            <p className="sub-title">Available Start Date</p>
            <p className="dateValue">{submissionDetailed.rate_employment_terms?.available_start_date || "not specified"}</p>
          </div>
        </div>

        {/* Personal Information */}
        <div className="overview-card">
          <h3 className="overview-title">Additional Information</h3>
          <div className="overview-grid">
            <div className="overview-item">
              <p className="label">Have you been submitted for this position before?</p>
              <p className="value">
                {submissionDetailed?.additional_information?.["Have you been submitted for this position before?"] == "No" && (<>No, this is my first submission</>)}
                {submissionDetailed?.additional_information?.["Have you been submitted for this position before?"] == "Yes" && (<>Yes, I have been submitted before</>)}
                {submissionDetailed?.additional_information?.["Have you been submitted for this position before?"] == "notSure" && (<>Not sure / Don't remember</>)}
              </p>
            </div>
            {submissionDetailed?.additional_information?.["Have you been submitted for this position before?"] == "Yes" && (<>
              <div className="overview-item">
                <p className="label">Previous Agency / Recruiter Name</p>
                <p className="value">
                  {submissionDetailed?.additional_information?.["Previous Agency/Recruiter Name"] ?? "not specified"}
                </p>
              </div>
              {submissionDetailed?.additional_information?.["Approximate Submission Date"] !== "" && (<>

                <div className="overview-item">
                  <p className="label">Approximate Submission Date</p>
                  <p className="value">
                    {submissionDetailed?.additional_information?.["Approximate Submission Date"] ?? "not specified"}
                  </p>
                </div>
              </>)}
              {submissionDetailed?.additional_information?.["Previous Submission Outcome"] !== "" && (<>

                <div className="overview-item">
                  <p className="label">Previous Submission Outcome</p>
                  <p className="value">
                    {submissionDetailed?.additional_information?.["Previous Submission Outcome"] ?? "not specified"}
                  </p>
                </div>
              </>)}
            </>)}

            {submissionDetailed?.additional_information?.["Additional_comments"] !== "" && (<>
              <div className="overview-item">
                <p className="label">Additional comments</p>
                <p className="value">

                  {submissionDetailed?.additional_information?.["Additional_comments"] ?? "not specified"}
                </p>
              </div>
            </>)}
          </div>
        </div>



        {/* Digital Signature */}
        <div className="overview-card consent">
          <h3 className="overview-title">Consent & Acknowledgements</h3>
          <div className="consentTick">
            <Check size={16} />
            I certify that all information provided in this submission is accurate and complete to the best of my knowledge.
          </div>
          <div className="consentTick">
            <Check size={16} />
            I authorize CareerSavvy and its clients to conduct background verification and reference checks as required.
          </div>
          <div className="consentTick">
            <Check size={16} />
            I understand that submission does not guarantee job placement or constitute a job offer.
          </div>
          <div className="consentTick">
            <Check size={16} />
            I agree to CareerSavvy's terms of service and privacy policy regarding data handling and submission processes.
          </div>

        </div>
        {/* Digital Signature */}
        <div className="overview-card">
          <h3 className="overview-title">Digital Signature</h3>
          <div className="overview-grid">
            <div className="overview-item">
              <p className="label">Signed By</p>
              <p className="value">{submissionDetailed.digital_signature?.signed_by || "not specified"}</p>
            </div>
            <div className="overview-item">
              <p className="label">Signed At</p>
              <p className="value">{formatDateUS(submissionDetailed.digital_signature?.signed_at)}</p>
            </div>
          </div>
        </div>
        {/* <div className="references-card">
            <h3>References</h3>
            {submissionDetailed.references && submissionDetailed.references.length > 0 ? (
                submissionDetailed.references.map((ref, i) => (
                <div key={i} className="reference-section">
                    <div><b>Referee Name:</b> {ref.referee_name || "-"}</div>
                    <div><b>Referee Email:</b> {ref.referee_email || "-"}</div>
                    <div><b>Referee Phone:</b> {ref.referee_phone_number || "-"}</div>
                    <div><b>Referee Title:</b> {ref.referee_title || "-"}</div>
                    <div><b>Relationship:</b> {ref.relationship_to_candidate || "-"}</div>
                    <div>
                    <b>Status:</b>{" "}
                    <span
                        className={`status-badge ${
                        ref.status?.toLowerCase() === "completed"
                            ? "status-completed"
                            : ref.status?.toLowerCase() === "pending"
                            ? "status-pending"
                            : ref.status?.toLowerCase() === "rejected"
                            ? "status-rejected"
                            : "status-inprogress"
                        }`}
                    >
                        {ref.status || "-"}
                    </span>
                    </div>
                    <div>
                    <b>Feedback:</b>
                    {ref.referee_feedback ? (
                        <ul>
                        {Object.entries(ref.referee_feedback).map(([q, ans], j) => (
                            <li key={j}>
                            <b>{q.replace(/_/g, " ")}:</b>{" "}
                            {Array.isArray(ans) ? ans.join(", ") : ans}
                            </li>
                        ))}
                        </ul>
                    ) : (
                        "-"
                    )}
                    </div>
                </div>
                ))
            ) : (
                <div>-</div>
            )}
            </div> */}


        {/* Submission Timeline */}
        <div className="submission-card">
          <h3 className="submission-title">Submission Timeline</h3>
          <div className="timeline">
            {timelineData.map((item, index) => (
              <div key={index} className="timeline-item">
                <div
                  className="timeline-dot"
                  style={{ backgroundColor: item.color }}
                ></div>
                <div className="timeline-content">
                  <h4 className="timeline-heading">{item.title}</h4>
                  <p className="timeline-desc">{item.description}</p>
                </div>
                <div className="timeline-date">{item.date}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default SubmissionDetailed;
