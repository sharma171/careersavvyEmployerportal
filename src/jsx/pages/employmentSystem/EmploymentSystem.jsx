import React, { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import styles from '../../components/RecruiterComponents/css/JobPostModal.module.css';
import { useLocation, useNavigate } from "react-router-dom";
import '../css/employmentSystem.css?ver0.99';
import { Building2, MapPin, Clock, User, Upload, CircleCheckBig } from "lucide-react";
import { Calendar as CalendarIcon } from "lucide-react";
import DatePicker from "react-datepicker";
import CSavvyPageLoader from "../../components/RecruiterComponents/cSavvvyPageLoader";
import ToastSuccess from "../../components/RecruiterComponents/toastSucces";
import "react-datepicker/dist/react-datepicker.css";
import CsLogo from "../Home/icons & images/careerSavvy.svg";

const EmploymentSystem = () => {
  const dropdownRef = useRef(null);
  const frontFileInputRef = useRef(null);
  const backFileInputRef = useRef(null);
  const workAuthDropdownRef = useRef(null);
  const [previousOutcomeOpen, setPreviousOutcomeOpen] = useState(false);
  const previousOutcomeRef = useRef(null);
  // top-level in EmploymentSystem component
  const c2cStateDropdownRef = useRef(null);
  const [c2cStateOpen, setC2cStateOpen] = useState(false);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [workAuthDropdownOpen, setWorkAuthDropdownOpen] = useState(false);
  const [c2cStateSearch, setC2cStateSearch] = useState("");

  // Reuse the usStates object already defined in the file

  const location = useLocation();
  const navigate = useNavigate();
  const sections = [
    "Section 1",
    "Section 2",
    "Section 3",
    "Section 4",
    "Section 5",
    "Section 6",
    "Section 7",
  ];

  const workAuthTypes = {
    "US Citizen": "US Citizen",
    "Green Card Holder": "Green Card Holder",
    "H1B Visa": "H1B Visa",
    "H4 EAD": "H4 EAD",
    "L2 EAD": "L2 EAD",
    "OPT": "OPT",
    "CPT": "CPT",
    "TN Visa": "TN Visa",
    "E3 Visa": "E3 Visa",
    "Other Work Authorization": "Other Work Authorization",
  }
  // Place near your existing `usStates` constant
  const abbrToStateName = {
    AL: "Alabama",
    AK: "Alaska",
    AZ: "Arizona",
    AR: "Arkansas",
    CA: "California",
    CO: "Colorado",
    CT: "Connecticut",
    DE: "Delaware",
    FL: "Florida",
    GA: "Georgia",
    HI: "Hawaii",
    ID: "Idaho",
    IL: "Illinois",
    IN: "Indiana",
    IA: "Iowa",
    KS: "Kansas",
    KY: "Kentucky",
    LA: "Louisiana",
    ME: "Maine",
    MD: "Maryland",
    MA: "Massachusetts",
    MI: "Michigan",
    MN: "Minnesota",
    MS: "Mississippi",
    MO: "Missouri",
    MT: "Montana",
    NE: "Nebraska",
    NV: "Nevada",
    NH: "New Hampshire",
    NJ: "New Jersey",
    NM: "New Mexico",
    NY: "New York",
    NC: "North Carolina",
    ND: "North Dakota",
    OH: "Ohio",
    OK: "Oklahoma",
    OR: "Oregon",
    PA: "Pennsylvania",
    RI: "Rhode Island",
    SC: "South Carolina",
    SD: "South Dakota",
    TN: "Tennessee",
    TX: "Texas",
    UT: "Utah",
    VT: "Vermont",
    VA: "Virginia",
    WA: "Washington",
    WV: "West Virginia",
    WI: "Wisconsin",
    WY: "Wyoming",
    DC: "District of Columbia",
  };

  const usStates = {
    Alabama: "Alabama",
    Alaska: "Alaska",
    Arizona: "Arizona",
    Arkansas: "Arkansas",
    California: "California",
    Colorado: "Colorado",
    Connecticut: "Connecticut",
    Delaware: "Delaware",
    Florida: "Florida",
    Georgia: "Georgia",
    Hawaii: "Hawaii",
    Idaho: "Idaho",
    Illinois: "Illinois",
    Indiana: "Indiana",
    Iowa: "Iowa",
    Kansas: "Kansas",
    Kentucky: "Kentucky",
    Louisiana: "Louisiana",
    Maine: "Maine",
    Maryland: "Maryland",
    Massachusetts: "Massachusetts",
    Michigan: "Michigan",
    Minnesota: "Minnesota",
    Mississippi: "Mississippi",
    Missouri: "Missouri",
    Montana: "Montana",
    Nebraska: "Nebraska",
    Nevada: "Nevada",
    "New Hampshire": "New Hampshire",
    "New Jersey": "New Jersey",
    "New Mexico": "New Mexico",
    "New York": "New York",
    "North Carolina": "North Carolina",
    "North Dakota": "North Dakota",
    Ohio: "Ohio",
    Oklahoma: "Oklahoma",
    Oregon: "Oregon",
    Pennsylvania: "Pennsylvania",
    "Rhode Island": "Rhode Island",
    "South Carolina": "South Carolina",
    "South Dakota": "South Dakota",
    Tennessee: "Tennessee",
    Texas: "Texas",
    Utah: "Utah",
    Vermont: "Vermont",
    Virginia: "Virginia",
    Washington: "Washington",
    "West Virginia": "West Virginia",
    Wisconsin: "Wisconsin",
    Wyoming: "Wyoming",
    "District of Columbia": "District of Columbia",
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (c2cStateOpen && c2cStateDropdownRef.current && !c2cStateDropdownRef.current.contains(event.target)) {
        setC2cStateOpen(false);
      }
      // existing closers remain
      else if (dropdownOpen && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      } else if (workAuthDropdownOpen && workAuthDropdownRef.current && !workAuthDropdownRef.current.contains(event.target)) {
        setWorkAuthDropdownOpen(false);
      }
      else if (previousOutcomeOpen && previousOutcomeRef.current && !previousOutcomeRef.current.contains(event.target)) {
        setPreviousOutcomeOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside, true);
    return () => document.removeEventListener("mousedown", handleClickOutside, true);
  }, [c2cStateOpen, dropdownOpen, workAuthDropdownOpen, previousOutcomeOpen]);

  // Store related states
  const [stateCountryAnimate, setStateCountryAnimate] = useState(false);
  const [token, setToken] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");
  const [expiryDate, setExpiryDate] = useState(null);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);
  const [jobId, setJobId] = useState("");
  const [docId, setDocId] = useState("");
  const [candidateDetails, setCandidateDetails] = useState({});
  const [employmentSubmissionStage, setEmploymentSubmissionStage] = useState("1");
  const [frontFileName, setFrontFileName] = useState("");
  const [backFileName, setBackFileName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const filteredStates = Object.keys(usStates).filter(state =>
    state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [pincode, setPincode] = useState("");
  const [employmentStatus, setEmploymentStatus] = useState({
    employment_situation: "",
    current_employer_name: "",
    employment_type_with_current_employer: "",
    contact_person_name: "",
    contact_person_title: "",
    contact_email: "",
    contact_phone: "",
    employment_change_authorization: "",
    notice_period: "",
    restriction_details: ""
  });

  const [identificationDetails, setIdentificationDetails] = useState({
    document_type: "",
    id_number: "",
    issuing_state: "",
    "work_auth_doc": {
      work_authorization_status: "",
      work_authorization_expiry: ""
    }
  });

  const [employmentDetails, setEmploymentDetails] = useState({
    employment_submission_stage: "1",
    first_name: "",
    last_name: "",
    dob: null,
    email: "",
    phone: "",
    notice_period: "",
    restriction_details: "",
  });

  const [preferredEmployment, setPreferredEmployment] = useState({
    preferred_employment_type: [],
    available_start_date: null,
    // W2
    w2_expected_hourly_rate: "",
    w2_min_rate: "",
    // C2C main
    c2c_company_name: "",
    c2c_expected_hourly_rate: "",
    c2c_min_rate: "",
    // C2C info
    c2c_legal_name: "",
    c2c_primary_contact: "",
    c2c_company_email: "",
    c2c_company_phone: "",
    c2c_zip: "",
    c2c_city: "",
    c2c_state: "",
    // 1099 Contractor
    contractor_expected_hourly_rate: "",
    contractor_min_rate: ""
  });
  const [priorSubmission, setPriorSubmission] = useState({
    submission_status: "", // "No", "Yes", "notSure"
    previous_agency: "",
    approximate_submission_date: "",
    previous_outcome: "",
    additional_comments: ""
  });

  const [consentInfo, setConsentInfo] = useState({
    certify_accuracy: false,
    authorize_background: false,
    understand_no_job_offer: false,
    accept_terms: false,
    digital_signature: ""
  });

  const incrementSubmissionState = () => {
    setEmploymentSubmissionStage(prev => `${Number(prev) + 1}`);
  };
  const decrementSubmissionState = () => {
    setEmploymentSubmissionStage(prev => `${Number(prev) - 1}`);
  };

  // File validation constants and functions
  const allowedTypes = [
    "image/jpeg", // covers .jpg and .jpeg
    "image/png",
    "application/pdf"
  ];

  const maxFileSizeBytes = 5 * 1024 * 1024; // 5 MB

  const extensionAllowed = (name) => {
    if (!name) return false;
    const ext = name.split(".").pop().toLowerCase();
    return ["jpg", "jpeg", "png", "pdf"].includes(ext);
  };

  const validateFile = (fileOrFileList) => {
    // normalize: allow passing File or FileList
    let file = fileOrFileList;
    if (!file) return { valid: false, message: "No file selected." };

    if (typeof FileList !== "undefined" && file instanceof FileList) {
      file = file[0];
    }

    if (!file || !(file instanceof File)) {
      return { valid: false, message: "Invalid file." };
    }

    // If file.type is empty (some browsers/devices), fallback to extension check
    const mimeType = file.type || "";
    if (mimeType) {
      if (!allowedTypes.includes(mimeType)) {
        return {
          valid: false,
          message: "Only PDF, JPG or PNG files are allowed and size must be ≤ 5 MB."
        };
      }
    } else {
      // fallback: check extension
      if (!extensionAllowed(file.name)) {
        return {
          valid: false,
          message: "Only PDF, JPG or PNG files are allowed and size must be ≤ 5 MB."
        };
      }
    }

    if (file.size > maxFileSizeBytes) {
      return {
        valid: false,
        message: "Only PDF, JPG or PNG files are allowed and size must be ≤ 5 MB."
      };
    }

    return { valid: true, message: "" };
  };

  const validateUploadedFilesBeforeNext = () => {
    if (employmentSubmissionStage === "2") {
      const frontFileInput = document.getElementById("frontFile");
      const backFileInput = document.getElementById("backFile");

      // Validate front file
      if (frontFileInput && frontFileInput.files && frontFileInput.files[0]) {
        const validation = validateFile(frontFileInput.files[0]);
        if (!validation.valid) {
          setType("error");
          setMessage(validation.message);
          return false;
        }
      }
      if (
        identificationDetails.document_type !== "US Passport" &&
        backFileInput &&
        backFileInput.files &&
        backFileInput.files[0]
      ) {
        const validation = validateFile(backFileInput.files[0]);
        if (!validation.valid) {
          setType("error");
          setMessage(validation.message);
          return false;
        }
      }
    }

    if (employmentSubmissionStage === "3") {
      const workAuthDocInput = document.getElementById("workAuthDoc");
      const i94DocInput = document.getElementById("I94Doc");

      // Validate work authorization document (if not US Citizen)
      if (
        identificationDetails.work_auth_doc.work_authorization_status !== "" &&
        identificationDetails.work_auth_doc.work_authorization_status !== "US Citizen" &&
        workAuthDocInput &&
        workAuthDocInput.files &&
        workAuthDocInput.files[0]
      ) {
        const validation = validateFile(workAuthDocInput.files[0]);
        if (!validation.valid) {
          setType("error");
          setMessage(validation.message);
          return false;
        }
      }

      // Validate I-94 document (for specific visa types)
      if (
        (identificationDetails.work_auth_doc.work_authorization_status === "E3 Visa" ||
          identificationDetails.work_auth_doc.work_authorization_status === "TN Visa" ||
          identificationDetails.work_auth_doc.work_authorization_status === "H1B Visa") &&
        i94DocInput &&
        i94DocInput.files &&
        i94DocInput.files[0]
      ) {
        const validation = validateFile(i94DocInput.files[0]);
        if (!validation.valid) {
          setType("error");
          setMessage(validation.message);
          return false;
        }
      }
    }

    return true; // All files valid
  };



  // Extract query params
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenFromUrl = queryParams.get("token");
    const emailFromUrl = queryParams.get("email");
    const jobIdUrl = queryParams.get("job_id");
    const docIdUrl = queryParams.get("doc_id");

    if (jobIdUrl) {
      setJobId(jobIdUrl.replace(/ /g, "+"));
    }
    if (tokenFromUrl) setToken(tokenFromUrl);
    if (emailFromUrl) {
      setCandidateEmail(emailFromUrl);
      setEmploymentDetails((prev) => ({ ...prev, email: emailFromUrl }));
    }
    if (docIdUrl) setDocId(docIdUrl);
  }, [location.search]);

  // Verify token once we have token + email
  useEffect(() => {
    if (!token || !candidateEmail) return;
    verifyCandidateToken();
    // eslint-disable-next-line
  }, [token, candidateEmail]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
      else if (

        workAuthDropdownOpen &&
        workAuthDropdownRef.current &&
        !workAuthDropdownRef.current.contains(event.target)
      ) {
        setWorkAuthDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen, workAuthDropdownOpen]);

  const verifyCandidateToken = async () => {
    setLoading("Verifying Token")
    try {
      const listQuery = {
        action: "verify_token_doc_upload",
        doc_id: docId,
        token: token,
      };
      const response = await fetch(
        "https://notify-candidate-employmnt-sub-and-store-data-v10-737421501165.us-east1.run.app",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(listQuery),
        }
      );
      const data = await response.json();
      setLoading(false)

      if (!response.ok) {
        console.error("Token verification failed", data);
        return;
      }

      const nameParts = data.Candidate_name ? data.Candidate_name.split(" ") : ["", ""];
      setEmploymentDetails((prev) => ({
        ...prev,
        first_name: nameParts[0] || "",
        last_name: nameParts[1] || "",
        phone: data.phone,
      }));
      setCandidateDetails(data);
      setLoading(false)
      // setEmploymentSubmissionStage(data.employment_submission_stage);
      console.log("emp", data.employment_submission_stage);

    } catch (error) {
      console.error("Token verification error:", error);
      setLoading(false)
    }
  };

  // Submit form
  const sendEmploymentSubmission = async (e) => {

    setLoading("Sending Submissions")


    try {
      let payload = {};

      if (employmentSubmissionStage === "1") {
        payload = {
          action: "form_one_Submission",
          employment_submission_stage: "1",
          first_name: employmentDetails.first_name,
          last_name: employmentDetails.last_name,
          dob: employmentDetails.dob
            ? new Date(employmentDetails.dob).toLocaleDateString("en-US") // MM/DD/YYYY
            : "",
          email: candidateEmail, // From URL
          phone: employmentDetails.phone,
          doc_id: docId,
        };
      }
      if (employmentSubmissionStage === "3") {
        payload = {
          action: "form_one_Submission",
          employment_submission_stage: "3",
          work_authorization_status: identificationDetails.work_auth_doc.work_authorization_status,
          work_authorization_Expiry_date: expiryDate || "02-02-2028",
          email: candidateEmail, // From URL
          doc_id: docId,
        };
      }
      if (employmentSubmissionStage === "4") {
        payload = {
          action: "form_one_Submission",
          employment_submission_stage: "4",
          employment_situation: employmentStatus.employment_situation || "",
          current_employer_name: employmentStatus.current_employer_name || "",
          employment_type_with_current_employer: employmentStatus.employment_type_with_current_employer || "",
          contact_person_name: employmentStatus.contact_person_name || "",
          restriction_details: employmentStatus.restriction_details || "",
          notice_period: employmentStatus.notice_period || "",
          contact_person_title: employmentStatus.contact_person_title || "",
          contact_email: employmentStatus.contact_email || "",
          contact_phone: employmentStatus.contact_phone || "",
          employment_change_authorization: employmentStatus.employment_change_authorization || "",
          notice_period: employmentStatus.notice_period || "",
          restriction_details: employmentStatus.restriction_details || "",
          email: candidateEmail,
          doc_id: docId,
        };
      }
      if (employmentSubmissionStage === "5") {
        payload = {
          action: "form_one_Submission",
          employment_submission_stage: "5",
          preferred_employment_type: preferredEmployment.preferred_employment_type || "",
          available_start_date: preferredEmployment.available_start_date
            ? new Date(preferredEmployment.available_start_date).toLocaleDateString("en-US")
            : "",

          c2c_company_name: preferredEmployment.c2c_company_name,
          c2c_expected_hourly_rate: preferredEmployment.c2c_expected_hourly_rate,
          c2c_min_rate: preferredEmployment.c2c_min_rate,
          c2c_legal_name: preferredEmployment.c2c_legal_name,
          w2_expected_hourly_rate: preferredEmployment.w2_expected_hourly_rate || "",
          w2_min_rate: preferredEmployment.w2_min_rate || "",
          c2c_primary_contact: preferredEmployment.c2c_primary_contact,
          c2c_company_email: preferredEmployment.c2c_company_email,
          c2c_company_phone: preferredEmployment.c2c_company_phone,
          c2c_city: preferredEmployment.c2c_city,
          c2c_state: preferredEmployment.c2c_state,
          c2c_zip: pincode,
          contractor_expected_hourly_rate: preferredEmployment.contractor_expected_hourly_rate,
          contractor_min_rate: preferredEmployment.contractor_min_rate,
          email: candidateEmail,
          doc_id: docId,
        };
      }
      if (employmentSubmissionStage === "6") {
        payload = {
          action: "form_one_Submission",
          employment_submission_stage: "6",
          "Have you been submitted for this position before?": priorSubmission.submission_status,
          "Previous Agency/Recruiter Name": priorSubmission.previous_agency,
          "Approximate Submission Date": priorSubmission.approximate_submission_date,
          "Previous Submission Outcome": priorSubmission.previous_outcome,
          "Additional_comments": priorSubmission.additional_comments,
          email: candidateEmail,
          doc_id: docId,
        };
      }
      if (employmentSubmissionStage === "7") {
        payload = {
          action: "form_one_Submission",
          employment_submission_stage: "7",
          "consent & Acknoledgements": [
            consentInfo.certify_accuracy ? "I certify that all information provided in this submission is accurate and complete to the best of my knowledge." : "",
            consentInfo.authorize_background ? "I authorize CareerSavvy and its clients to conduct background verification and reference checks as required." : "",
            consentInfo.understand_no_job_offer ? "I understand that submission does not guarantee job placement or constitute a job offer." : "",
            consentInfo.accept_terms ? "I agree to CareerSavvy's terms of service and privacy policy regarding data handling and submission processes." : ""
          ].filter(Boolean),
          digital_signature: consentInfo.digital_signature,
          email: candidateEmail,
          "token_expire": true,
          doc_id: docId
        };
      }

      const response = await fetch(
        "https://notify-candidate-employmnt-sub-and-store-data-v10-737421501165.us-east1.run.app",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await response.json();
      if (employmentSubmissionStage !== "7") {
        setEmploymentSubmissionStage(data.employment_submission_stage);
      }
      console.log("Form submitted successfully");
      setWorkAuthDocFile("");

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  function finalSubmit() {
    setType("success");
    setMessage("Form submitted successfully");
    setTimeout(() => {
      window.location.href = "https://careersavvy.ai";
    }, 500);
  }

  const sendUploadFiles = async (e) => {
    // // Validate files one more time before upload
    // if (!validateUploadedFilesBeforeNext()) {
    //   return;
    // }

    // if (frontFileName == "" || backFileName == "" && identificationDetails.document_type !== "US Passport") {
    //   setType("error");
    //   setMessage("Please Fill all the fields and upload image");
    //   return;
    // }

    try {
      const formData = new FormData();

      if (employmentSubmissionStage === "2") {
        // Stage 2: Identification Documents
        formData.append(
          "meta_data",
          JSON.stringify({
            action: "form_two_Submission",
            employment_submission_stage: "2",
            document_type: identificationDetails.document_type || "Driver's License",
            candidate_mail: candidateEmail,
            id_number: identificationDetails.id_number,
            issuing_state: identificationDetails.issuing_state,
            doc_id: docId,
          })
        );

        // Append front/back files
        const frontFile = document.getElementById("frontFile").files[0];
        const backFile = document.getElementById("backFile")?.files[0];
        if (frontFile) formData.append("front", frontFile);
        if (backFile) formData.append("back", backFile);
      }

      if (employmentSubmissionStage === "3") {
        // Stage 3: Work Authorization Documents
        formData.append(
          "meta_data",
          JSON.stringify({
            action: "form_two_Submission",
            employment_submission_stage: "3",
            document_type: identificationDetails.work_auth_doc.work_authorization_status,
            work_authorization_status: identificationDetails.work_auth_doc.work_authorization_status,
            candidate_mail: candidateEmail,
            work_authorization_Expiry_date: expiryDate,
            doc_id: docId,
          })
        );

        // Append work authorization document
        const workAuthDoc = document.getElementById("workAuthDoc").files[0];
        if (workAuthDoc) formData.append("work_authorization_Document", workAuthDoc);
        // Append work authorization document
        const i94authDoc = document.getElementById("I94Doc").files[0];
        if (i94authDoc) formData.append("i_94_document", i94authDoc);
      }

      // Send data
      const response = await fetch(
        "https://notify-candidate-employmnt-sub-and-store-data-v10-737421501165.us-east1.run.app",
        {
          method: "POST",
          body: formData, // Browser will set correct Content-Type
        }
      );

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      console.log("Upload successful:", data);
      setEmploymentSubmissionStage(data.employment_submission_stage);
      setFrontFileName("");
      setBackFileName("");
      setWorkAuthDocFile("");
      setI94DocFile("");
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };
  const sendSingleWorkAuthFiles = async (e) => {
    try {
      const formData = new FormData();
      if (employmentSubmissionStage === "3") {
        // Stage 3: Work Authorization Documents
        formData.append(
          "meta_data",
          JSON.stringify({
            action: "form_two_Submission",
            employment_submission_stage: "3",
            document_type: identificationDetails.work_auth_doc.work_authorization_status,
            work_authorization_status: identificationDetails.work_auth_doc.work_authorization_status,
            candidate_mail: candidateEmail,
            work_authorization_Expiry_date: expiryDate,
            doc_id: docId,
          })
        );

        const workAuthDoc = document.getElementById("workAuthDoc").files[0];
        if (workAuthDoc) formData.append("work_authorization_Document", workAuthDoc);
      }

      // Send data
      const response = await fetch(
        "https://notify-candidate-employmnt-sub-and-store-data-v10-737421501165.us-east1.run.app",
        {
          method: "POST",
          body: formData, // Browser will set correct Content-Type
        }
      );


      const data = await response.json();
      // setEmploymentSubmissionStage(data.employment_submission_stage);
      setFrontFileName("");
      setBackFileName("");
      setWorkAuthDocFile("");
      setI94DocFile("");
    } catch (error) {
      console.error("Error uploading files:", error);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmploymentDetails({
      ...employmentDetails,
      [name]: value,
    });
  };


  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setEmploymentDetails((prev) => ({ ...prev, [name]: value }));
  // };

  const handlestage2 = (e) => {
    const { name, value } = e.target;
    if (name === "document_type") {
      setIdentificationDetails(prev => ({
        ...prev,
        document_type: value,
        id_number: "",
        issuing_state: "",
      }));
      // Clear selected files in DOM inputs
      if (frontFileInputRef.current) frontFileInputRef.current.value = "";
      if (backFileInputRef.current) backFileInputRef.current.value = "";

      // Clear filenames in state
      setFrontFileName("");
      setBackFileName("");

      // Optional: clear any prior messages
      setMessage("");
      setType("");
    } else {
      setIdentificationDetails(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };


  const allowedEmailTLDs = /^[^\s@]+@[^\s@]+\.(com|in|ai|us)$/i;

  const handlestage4 = (e) => {
    const { name, value } = e.target;
    if (name === "contact_email") {
      const normalized = value.trim().toLowerCase();
      const ok = allowedEmailTLDs.test(normalized);
      e.target.setCustomValidity(ok ? "" : "Email must end with .com, .in, .ai, or .us");
      setEmploymentStatus((prev) => ({ ...prev, [name]: normalized }));
      return;
    }
    setEmploymentStatus((prev) => ({ ...prev, [name]: value }));
  };
  const handleStageInput5 = (e) => {
    const { name, value } = e.target;
    setPreferredEmployment((prev) => ({ ...prev, [name]: value }));
  };
  const handlestage5 = (e) => {
    const { value, checked } = e.target;
    setPreferredEmployment(prev => {
      return {
        ...prev,
        preferred_employment_type: checked ? [value] : []
      };
    });
  };


  const handleStage6 = (e) => {
    const { name, value } = e.target;
    setPriorSubmission(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const handleStage7 = (e) => {
    const { name, type, checked, value } = e.target;
    setConsentInfo(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const [startDateError, setStartDateError] = useState("");
  const handleStartDateChange = (date) => {
    setPreferredEmployment(prev => ({
      ...prev,
      available_start_date: date
    }));
  };


  const handlestage3 = (e) => {
    const { name, value } = e.target;
    setIdentificationDetails((prev) => ({
      ...prev, work_auth_doc: {
        [name]: value
      }
    }));
  };
  const handleFrontFileChange = (e) => {
    const file = e.target.files[0];
    const validation = validateFile(file);

    if (!validation.valid) {
      setType("error");
      setMessage(validation.message);
      setFrontFileName("");
      e.target.value = ""; // Reset file input
      return;
    }

    setFrontFileName(file ? file.name : "");
    // Clear any previous error messages
    if (message) {
      setMessage("");
      setType("");
    }
  };


  const handleBackFileChange = (e) => {
    const file = e.target.files[0];
    const validation = validateFile(file);

    // if (!validation.valid) {
    //   setType("error");
    //   setMessage(validation.message);
    //   setBackFileName("");
    //   e.target.value = ""; // Reset file input
    //   return;
    // }

    setBackFileName(file ? file.name : "");
    // Clear any previous error messages
    if (message) {
      setMessage("");
      setType("");
    }
  };
  const [workAuthDocFile, setWorkAuthDocFile] = useState("");
  const [i94DocFile, setI94DocFile] = useState("");

  const handleWorkAuthorization = (e) => {
    const file = e.target.files[0];
    const validation = validateFile(file);

    if (!validation.valid) {
      setType("error");
      setMessage(validation.message);
      setWorkAuthDocFile("");
      e.target.value = ""; // Reset file input
      return;
    }

    setWorkAuthDocFile(file ? file.name : "");
    // Clear any previous error messages
    if (message) {
      setMessage("");
      setType("");
    }
  };

  const handleI94Document = (e) => {
    const file = e.target.files[0];
    const validation = validateFile(file);

    if (!validation.valid) {
      setType("error");
      setMessage(validation.message);
      setI94DocFile("");
      e.target.value = ""; // Reset file input
      return;
    }

    setI94DocFile(file ? file.name : "");
    // Clear any previous error messages
    if (message) {
      setMessage("");
      setType("");
    }
  };


  const [zipLoading, setZipLoading] = useState(false);
  const [autoFillFlash, setAutoFillFlash] = useState(false);
  // debounced ZIP watcher (fixes numeric check and adds loading toggle)
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const digits = String(pincode || '').replace(/\D/g, '');
      if (digits.length >= 5) {
        setZipLoading(true);
        setStateCountryAnimate(true);
        getStateCountry().finally(() => setZipLoading(false));
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [pincode]);

  // modify getStateCountry success branch to trigger flash
  const getStateCountry = async () => {
    try {
      const listQuery = { zip_code: pincode };
      const response = await fetch(
        "https://us-central1-foursssolutions.cloudfunctions.net/retrieve_location_details_v2",
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(listQuery),
        }
      );
      const data = await response.json();
      // Inside getStateCountry success branch
      if (data.status === "success") {
        const rawState = (data?.data?.state || "").trim();
        const normalized =
          abbrToStateName[rawState.toUpperCase()] || rawState; // map code→name if needed

        setPreferredEmployment((prev) => ({
          ...prev,
          c2ccity: data?.data?.city || prev.c2ccity,
          c2cstate: normalized || prev.c2cstate,
        }));

        setAutoFillFlash(true);
        setStateCountryAnimate(false);
        setTimeout(() => setAutoFillFlash(false), 1000);
      }

    } catch (error) {
      console.error("Error fetching location details:", error);
      setStateCountryAnimate(false);
    }
  };




  // Range: 1950 to current year
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1949 }, (_, i) => 1950 + i);
  const months = [
    { value: 0, label: 'January' }, { value: 1, label: 'February' }, { value: 2, label: 'March' },
    { value: 3, label: 'April' }, { value: 4, label: 'May' }, { value: 5, label: 'June' },
    { value: 6, label: 'July' }, { value: 7, label: 'August' }, { value: 8, label: 'September' },
    { value: 9, label: 'October' }, { value: 10, label: 'November' }, { value: 11, label: 'December' }
  ];

  function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  }
  // In your component state (if you want to keep as a Date, you'll need conversion logic later)
  const [dob, setDob] = useState({
    year: '',
    month: '',
    day: ''
  });
  // Ensure pickDateOnly returns the full Date object
  const pickDateOnly = (value) => {
    if (!value) return null;
    if (typeof value === "string") return new Date(value);
    return value;
  };

  // Allow digits, hyphen, navigation/editing keys
  const allowDigitsDashKeyDown = (e) => {
    const allowedKeys = new Set([
      'Backspace', 'Tab', 'Enter', 'Escape', 'ArrowLeft', 'ArrowRight',
      'ArrowUp', 'ArrowDown', 'Delete', 'Home', 'End', '-'
    ]);
    const isDigit = /^\d$/.test(e.key);
    if (isDigit || allowedKeys.has(e.key)) return;
    e.preventDefault();
  };

  // Block insertion of non [0-9-] on supported browsers (mobile/IME friendly)
  const blockInvalidBeforeInput = (e) => {
    if (e.data && !/^[0-9-]+$/.test(e.data)) e.preventDefault();
  };

  // Block paste with invalid characters
  const handlePasteDigitsDash = (e) => {
    const text = (e.clipboardData || window.clipboardData).getData('text');
    if (!/^[0-9-]*$/.test(text)) e.preventDefault();
  };

  // Optional: guard raw input changes (fallback)
  const blockInvalidRawChange = (e) => {
    if (!/^[0-9-]*$/.test(e.target.value)) e.preventDefault();
  };

  const filteredC2CStates = Object.keys(usStates).filter((state) =>
    state.toLowerCase().includes(c2cStateSearch.toLowerCase())
  );




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
      <div className="employmentSubmissionPage">
        <div className="submission-form-wrapper">
          {/* Logo */}
          <div className="logo-title">
            <div className="logo-icon">
              <img src={CsLogo} alt="Career Savvy Logo" className="careerSavvyIcon" />
            </div>
            <span className="brand">
              <span className="brand-blue">CareerSavvy.ai</span>
            </span>
          </div>

          {/* Heading */}
          <h2 className="form-heading">Employment Submission Form</h2>
          <p className="form-subtitle">
            Hi <span className="highlight">{candidateDetails.Candidate_name || "Candidate"}</span>,
            please complete your submission for:
          </p>

          {/* Job Card */}
          <div className="job-card">
            <h3 className="job-title">{candidateDetails.Job_title || "Job Title"}</h3>
            <div className="job-info">
              <span className="job-company"><Building2 size={16} /> {candidateDetails.Company_name || "Company Name"}</span>
              <span className="job-location"><MapPin size={16} />{candidateDetails.location || "Location"}</span>
              <span className="job-duration"><Clock size={16} /> {candidateDetails.experience || "Experience"}</span>
            </div>
          </div>

          {/* Step Progress */}
          <div className="steps-wrapper">
            {[1, 2, 3, 4, 5, 6, 7].map((step) => (
              <React.Fragment key={step}>
                <div className={`step-circle ${step === Number(employmentSubmissionStage) ? "active" : ""} ${step < employmentSubmissionStage ? "green" : ""}`}>{step < employmentSubmissionStage ? (<><CircleCheckBig size={16} /></>) : (<>{step}</>)}</div>
                {step - 1 < 7 && <div className={`step-line ${step < employmentSubmissionStage ? "green" : ""} ${step === Number(employmentSubmissionStage) ? "active" : ""}`}></div>}
              </React.Fragment>
            ))}
          </div>
          <p className="step-label">Step {employmentSubmissionStage} of 7 :
            {employmentSubmissionStage === "1" && " Personal Information"}
            {employmentSubmissionStage === "2" && " Identification Documents"}
            {employmentSubmissionStage === "3" && " Work Authorization"}
            {employmentSubmissionStage === "4" && " Current Employment Status"}
            {employmentSubmissionStage === "5" && " Rate & Employment Terms"}
            {employmentSubmissionStage === "6" && " Additional Information"}
            {employmentSubmissionStage === "7" && " Consent & Digital Signature"}
            {employmentSubmissionStage === "8" && " Consent & Digital Signature"}
          </p>

          {employmentSubmissionStage === "1" && (
            <>
              <div className="form-container">
                <div className="form-header">
                  <span className="header-icon"><User size={20} /></span>
                  <h2>Section 1: Personal Information</h2>
                </div>

                <form className="form-content" onSubmit={(e) => { e.preventDefault(); sendEmploymentSubmission(); incrementSubmissionState() }}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>
                        First Name
                        {/* <span className="required">*</span> */}
                      </label>
                      <input
                        type="text"
                        name="first_name"
                        value={employmentDetails.first_name}
                        onChange={handleChange}
                        placeholder="Enter your first name"
                        readOnly
                        className="read-only-input"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>
                        Last Name
                        {/* <span className="required">*</span> */}
                      </label>
                      <input
                        type="text"
                        name="last_name"
                        value={employmentDetails.last_name}
                        onChange={handleChange}
                        placeholder="Enter your last name"
                        readOnly
                        className="read-only-input"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>
                        Date of Birth <span className="required">*</span>
                      </label>
                      <div className="relative w-full DateChooseField">
                        <DatePicker
                          showYearDropdown
                          showMonthDropdown
                          showIcon
                          calendarIconClassName="calenderIconRight"
                          toggleCalendarOnIconClick
                          scrollableYearDropdown
                          yearDropdownItemNumber={80}
                          selected={employmentDetails.dob}
                          onChange={(date) =>
                            setEmploymentDetails({ ...employmentDetails, dob: date })
                          }
                          dateFormat="MM-dd-yyyy"
                          className="form-control ps-2 w-100"
                          style={{ boxShadow: "unset" }}
                          placeholderText="MM-DD-YYYY"
                          filterDate={(date) => date <= new Date()}
                          minDate={new Date("1950-01-01")}
                          maxDate={new Date()}
                          required

                          // Input restrictions
                          onKeyDown={allowDigitsDashKeyDown}
                          onBeforeInput={blockInvalidBeforeInput}
                          onPaste={handlePasteDigitsDash}
                          onChangeRaw={blockInvalidRawChange}
                          inputMode="numeric"
                          pattern="[0-9\\-]*"
                          autoComplete="off"
                        // readOnly // uncomment to forbid typing entirely
                        />

                      </div>
                    </div>

                  </div>


                  <div className="form-row">
                    <div className="form-group">
                      <label>
                        Email Address
                        {/* <span className="required">*</span> */}
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={employmentDetails.email}
                        readOnly
                        className="read-only-input"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>
                        Phone Number
                        {/* <span className="required">*</span> */}
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={employmentDetails.phone}
                        className="read-only-input"
                        maxLength={17}
                        readOnly
                        onChange={(e) => {
                          const formattedPhone = formatUSPhoneNumber(e.target.value);
                          setEmploymentDetails({
                            ...employmentDetails,
                            phone: formattedPhone
                          });
                        }}
                        placeholder="+1 (555) 123-4567"
                        required
                      />

                    </div>
                  </div>

                  <div className="form-footer">
                    <button className="btn prev" disabled>
                      Previous
                    </button>
                    <button className="btn next" type="submit">Next</button>
                  </div>
                </form>
              </div>
            </>
          )}
          {employmentSubmissionStage === "2" && (
            <>
              <div className="form-container">
                <div className="form-header">
                  <span className="header-icon"><User size={20} /></span>
                  <h2>Section 2: Identification Documents</h2>
                </div>

                <form className="form-content" onSubmit={(e) => {
                  e.preventDefault();
                  if (identificationDetails.document_type == "") {
                    setType("failed");
                    setMessage("Please select document type.");
                    return;
                  }
                  incrementSubmissionState();
                  sendUploadFiles();
                }}>
                  <label>
                    Identification Document Type <span className="required">*</span>
                  </label>
                  <div className="doc-type-row">
                    <label className={`card-radio${identificationDetails.document_type === "Driver's License" ? " selected" : ""}`}>
                      <input
                        type="radio"
                        name="document_type"
                        value="Driver's License"
                        checked={identificationDetails.document_type === "Driver's License"}
                        onChange={handlestage2}
                      />
                      Driver's License
                    </label>
                    <label className={`card-radio${identificationDetails.document_type === "State ID" ? " selected" : ""}`}>
                      <input
                        type="radio"
                        name="document_type"
                        value="State ID"
                        checked={identificationDetails.document_type === "State ID"}
                        onChange={handlestage2}
                      />
                      State ID
                    </label>
                    <label className={`card-radio${identificationDetails.document_type === "US Passport" ? " selected" : ""}`}>
                      <input
                        type="radio"
                        name="document_type"
                        value="US Passport"
                        checked={identificationDetails.document_type === "US Passport"}
                        onChange={handlestage2}
                      />
                      US Passport
                    </label>
                  </div>
                  {identificationDetails.document_type !== "" && (<>
                    <div className="form-row">
                      <div className="form-group">
                        <label>
                          ID Number <span className="required">*</span>
                        </label>
                        <input
                          type="tel"
                          name="id_number"
                          value={identificationDetails.id_number}
                          onChange={handlestage2}
                          placeholder="1836274554"
                          required
                        />
                      </div>
                      {identificationDetails.document_type == "US Passport" ? (<>

                      </>) : (<>

                        <div className="form-group">
                          <label>
                            Issuing State <span className="required">*</span>
                          </label>
                          <div className="dropdown position-relative" ref={dropdownRef}>
                            <button
                              className="btn btn-outline-secondary dropdown-toggle w-100 text-start customDropDown"
                              type="button"
                              onClick={() => setDropdownOpen(!dropdownOpen)}
                              style={{ maxHeight: "50px" }}
                            >
                              {identificationDetails.issuing_state || "Select State"}
                            </button>

                            {/* Dropdown menu */}
                            <ul
                              className={`dropdown-menu w-100 ${dropdownOpen ? "show" : ""}`}
                              style={{
                                maxHeight: "250px",
                                overflowY: "auto",
                                position: "absolute",
                                zIndex: 1000,
                                padding: "8px"
                              }}
                            >
                              {/* Search input */}
                              <li>
                                <input
                                  type="text"
                                  className="form-control mb-2"
                                  placeholder="Search state..."
                                  value={searchTerm}
                                  onChange={(e) => setSearchTerm(e.target.value)}
                                  style={{ maxHeight: "38px", paddingLeft: "15px", paddingRight: "15px", fontSize: "14px", color: "#020817", background: "#fff", fontWeight: "500", borderRadius: "8px" }}
                                  onClick={(e) => e.stopPropagation()} // prevent closing dropdown on click inside input
                                />
                              </li>

                              {/* Clear selection button */}
                              <li>
                                <button
                                  className="dropdown-item"
                                  type="button"
                                  onClick={() => {
                                    setIdentificationDetails((prev) => ({ ...prev, issuing_state: "" }));
                                    setDropdownOpen(false);
                                    setSearchTerm("");
                                  }}
                                >
                                  Select State
                                </button>
                              </li>

                              {/* Filtered states list */}
                              {filteredStates.length ? (
                                filteredStates.map((item, i) => (
                                  <li key={i}>
                                    <button
                                      className={`dropdown-item ${item === identificationDetails.issuing_state ? "active" : ""}`}
                                      type="button"
                                      onClick={() => {
                                        setIdentificationDetails((prev) => ({ ...prev, issuing_state: item }));
                                        setDropdownOpen(false);
                                        setSearchTerm("");
                                      }}
                                    >
                                      {item}
                                    </button>
                                  </li>
                                ))
                              ) : (
                                <li className="dropdown-item disabled">No states found</li>
                              )}
                            </ul>
                          </div>
                        </div>
                      </>)}
                    </div>
                  </>)}

                  <div className="form-row">
                    {identificationDetails.document_type !== "" && (<>
                      <div className="form-group">
                        <label>
                          {identificationDetails.document_type !== "US Passport" ? (
                            <>Document Front Image</>
                          ) : (
                            <>Document Image</>
                          )}
                          <span className="required">*</span>
                        </label>
                        <div className="file-upload-box">
                          <label htmlFor="frontFile" className="file-upload-label">
                            <div className="upload-icon"><Upload /></div>
                            <div className="file-upload-text">
                              Click to upload front image
                              <div className="file-upload-subtext">PDF, JPG, PNG (max 5MB)</div>
                              {frontFileName && (
                                <div className="file-upload-filename">{frontFileName}</div>
                              )}
                            </div>
                            <input
                              type="file"
                              id="frontFile"
                              accept=".png,.jpg,.jpeg,.pdf"
                              required
                              className="file-input"
                              onChange={handleFrontFileChange}
                              ref={frontFileInputRef}
                            />
                          </label>
                        </div>
                      </div>
                    </>)}

                    {identificationDetails.document_type !== "US Passport" && identificationDetails.document_type !== "" && (
                      <div className="form-group">
                        <label>
                          Document Back Image <span className="required">*</span>
                        </label>
                        <div className="file-upload-box">
                          <label htmlFor="backFile" className="file-upload-label">
                            <div className="upload-icon"><Upload /></div>
                            <div className="file-upload-text">
                              Click to upload back image
                              <div className="file-upload-subtext">PDF, JPG, PNG (max 5MB)</div>
                              {backFileName && (
                                <div className="file-upload-filename">{backFileName}</div>
                              )}
                            </div>
                            <input
                              type="file"
                              id="backFile"
                              accept=".png,.jpg,.jpeg,.pdf"
                              required
                              className="file-input"
                              onChange={handleBackFileChange}
                              ref={backFileInputRef}
                            />
                          </label>
                        </div>
                      </div>
                    )}
                  </div>


                  <div className="form-footer">
                    <button className="btn prev" onClick={() => decrementSubmissionState()}>
                      Previous
                    </button>
                    <button
                      className="btn next"
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();

                        // Validate files before proceeding
                        if (!validateUploadedFilesBeforeNext()) {
                          return; // Stop execution if validation fails
                        }

                        // Additional validation for required files
                        if (frontFileName === "" ||
                          (identificationDetails.document_type !== "US Passport" && backFileName === "")) {
                          setType("error");
                          setMessage("Please Fill all the fields and upload image");
                          return;
                        }
                        if (identificationDetails.document_type == "") {
                          setType("failed");
                          setMessage("Please choose document Type and fill all fields.");
                          return;
                        }
                        if (identificationDetails.id_number == "") {
                          setType("failed");
                          setMessage("Please enter id number and fill all fields.");
                          return;
                        }
                        if (identificationDetails.issuing_state == "" && identificationDetails.document_type !== "US Passport") {
                          setType("failed");
                          setMessage("Please select issuing state and fill all fields.");
                          return;
                        }


                        // Proceed with upload and next stage
                        sendUploadFiles();
                        incrementSubmissionState();
                      }}
                    >
                      Next
                    </button>

                  </div>
                </form>
              </div>
            </>
          )}
          {employmentSubmissionStage === "3" && (
            <>
              <div className="form-container">
                <div className="form-header">
                  <span className="header-icon"><User size={20} /></span>
                  <h2>Section 3: Work Authorization</h2>
                </div>
                <form className="form-content"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (identificationDetails.work_auth_doc.work_authorization_status !== "US Citizen") {
                      if (identificationDetails.work_auth_doc.work_authorization_status !== "E3 Visa" || identificationDetails.work_auth_doc.work_authorization_status !== "TN Visa" || identificationDetails.work_auth_doc.work_authorization_status !== "H1B Visa") {

                        sendSingleWorkAuthFiles();
                      }
                    }
                    // Validate files before proceeding
                    if (!validateUploadedFilesBeforeNext()) {
                      setType("error");
                      setMessage("File can be only, pdf, jpg, png and not more that 5 mb of size.");
                      return; // Stop execution if validation fails
                    }
                    if (identificationDetails.work_auth_doc.work_authorization_status !== "" && identificationDetails.work_auth_doc.work_authorization_status !== "US Citizen" && expiryDate == null) {
                      if (identificationDetails.work_auth_doc.work_authorization_status !== "US Citizen" && expiryDate == null) {
                        setType("error");
                        setMessage("Select Expiry Date.");
                        setTimeout(() => {
                          setEmploymentSubmissionStage("3");
                        }, 1000);
                        return;

                      }
                    }
                    else if (identificationDetails.work_auth_doc.work_authorization_status == "") {
                      return;
                    }
                    console.log("expiry", expiryDate);


                    sendEmploymentSubmission();
                    sendUploadFiles();
                  }}
                >

                  <div className="form-row" style={{ minHeight: workAuthDropdownOpen ? "280px" : "unset" }}>

                    <div className="form-group">
                      <label>
                        Work Authorization Status <span className="required">*</span>
                      </label>
                      <div className="dropdown" ref={workAuthDropdownRef}>
                        <button
                          className="btn btn-outline-secondary dropdown-toggle w-100 text-start customDropDown"
                          type="button"
                          onClick={() => setWorkAuthDropdownOpen(!workAuthDropdownOpen)}
                          style={{ maxHeight: '50px' }}
                        >
                          {identificationDetails.work_auth_doc.work_authorization_status || "Select Work Authorization"}
                        </button>

                        <ul
                          className={`dropdown-menu w-100 ${workAuthDropdownOpen ? 'show' : ''}`}
                          style={{
                            maxHeight: '200px',
                            overflowY: 'auto',
                            position: 'absolute',
                            zIndex: 1000
                          }}
                        >
                          <li>
                            <button
                              className="dropdown-item"
                              type="button"
                              onClick={() => {
                                setIdentificationDetails(prev => ({
                                  ...prev,
                                  work_auth_doc: {
                                    ...prev.work_auth_doc,
                                    work_authorization_status: ""
                                  }
                                }));
                                setWorkAuthDropdownOpen(false);
                              }}
                            >
                              Select Work Authorization
                            </button>
                          </li>
                          {Object.keys(workAuthTypes).map((item, i) => (
                            <li key={i}>
                              <button
                                className="dropdown-item"
                                type="button"
                                onClick={() => {
                                  setIdentificationDetails(prev => ({
                                    ...prev,
                                    work_auth_doc: {
                                      ...prev.work_auth_doc,
                                      work_authorization_status: item
                                    }
                                  }));
                                  setWorkAuthDropdownOpen(false);
                                }}
                              >
                                {item}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>

                    </div>
                  </div>
                  {identificationDetails.work_auth_doc.work_authorization_status == "" || identificationDetails.work_auth_doc.work_authorization_status == "US Citizen" ? (<>

                  </>) : (<>

                    <div className="form-row">
                      <div className="form-group">
                        <label>
                          Work Authorization Document
                          <span className="required">*</span>
                        </label>
                        <div className="file-upload-box">
                          <label htmlFor="workAuthDoc" className="file-upload-label">
                            <div className="upload-icon"><Upload /></div>
                            <div className="file-upload-text">
                              Upload Visa
                              <div className="file-upload-subtext">PDF, JPG, PNG (max 5MB)</div>
                              {workAuthDocFile && (
                                <div className="file-upload-filename">{workAuthDocFile}</div>
                              )}
                            </div>
                            <input
                              type="file"
                              id="workAuthDoc"
                              accept=".png,.jpg,.jpeg,.pdf"
                              required
                              className="file-input"
                              onChange={handleWorkAuthorization}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </>)}
                  {identificationDetails.work_auth_doc.work_authorization_status == "E3 Visa" || identificationDetails.work_auth_doc.work_authorization_status == "TN Visa" || identificationDetails.work_auth_doc.work_authorization_status == "H1B Visa" ? (<>
                    <div className="form-row">
                      <div className="form-group">
                        <label>
                          I-94 Document <span className="required"></span>
                        </label>
                        <div className="file-upload-box">
                          <label htmlFor="I94Doc" className="file-upload-label">
                            <div className="upload-icon"><Upload /></div>
                            <div className="file-upload-text">
                              Upload Visa I-94 (if available)
                              <div className="file-upload-subtext">PDF, JPG, PNG (max 5MB)</div>
                              {i94DocFile && (
                                <div className="file-upload-filename">{i94DocFile}</div>
                              )}
                            </div>
                            <input
                              type="file"
                              id="I94Doc"
                              accept=".png,.jpg,.jpeg,.pdf"
                              className="file-input"
                              onChange={handleI94Document}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </>) : (<></>)}

                  {identificationDetails.work_auth_doc.work_authorization_status == "" || identificationDetails.work_auth_doc.work_authorization_status == "US Citizen" ? (<>

                  </>) : (<>
                    <div className="form-row">
                      <div className="form-group">
                        <label>
                          Document Expiration Date
                          <span className="required">*</span>
                        </label>
                        <div className="relative w-full DateChooseField">
                          <DatePicker
                            showYearDropdown
                            showMonthDropdown
                            showIcon
                            calendarIconClassName="calenderIconRight"
                            toggleCalendarOnIconClick
                            scrollableYearDropdown
                            yearItemNumber={80}           // use 'yearItemNumber' in recent versions
                            selected={expiryDate}
                            onChange={(date) => setExpiryDate(date)}
                            dateFormat="MM-dd-yyyy"
                            className="form-control ps-2 w-100"
                            style={{ boxShadow: "unset" }}
                            placeholderText="MM-DD-YYYY"
                            minDate={new Date()}
                            maxDate={new Date("2050-12-31")}
                            required
                          />



                        </div>
                      </div>
                    </div>
                  </>)}



                  <div className="form-footer">
                    <button className="btn prev" onClick={() => setEmploymentSubmissionStage("2")}>
                      Previous
                    </button>
                    <button className="btn next" type="submit" onClick={() => {
                      if (identificationDetails.work_auth_doc.work_authorization_status == "US Citizen") {
                      }
                      else if (identificationDetails.work_auth_doc.work_authorization_status !== "" && identificationDetails.work_auth_doc.work_authorization_status !== "US Citizen" && expiryDate == null) {
                        if (identificationDetails.work_auth_doc.work_authorization_status !== "US Citizen" && expiryDate == null) {
                          setType("error");
                          setMessage("Select Expiry Date.");
                          setTimeout(() => {
                            setEmploymentSubmissionStage("3");
                          }, 1000);
                          return;

                        }
                      }
                      else if (identificationDetails.work_auth_doc.work_authorization_status == "") {
                        setType("error");
                        setMessage("Please fill all field and Upload Documents.");
                        setTimeout(() => {
                          setEmploymentSubmissionStage("3");
                        }, 1000);
                      }
                      else if (workAuthDocFile == "") {
                        setType("error");
                        setMessage("Please fill all field and Upload Documents.");
                      }
                      else if (identificationDetails.work_auth_doc.work_authorization_status == "E3 Visa" || identificationDetails.work_auth_doc.work_authorization_status == "TN Visa" || identificationDetails.work_auth_doc.work_authorization_status == "H1B Visa") {
                        // if (i94DocFile == "") {
                        //   setType("error");
                        //   setMessage("Please fill all field and Upload Documents.");
                        //   return;
                        // }
                      }
                      else if (identificationDetails.work_auth_doc.work_authorization_status == "") {
                        return;
                      }


                    }} >Next</button>
                  </div>
                </form>
              </div>
            </>
          )}
          {employmentSubmissionStage === "4" && (
            <>
              <div className="form-container">
                <div className="form-header">
                  <span className="header-icon"><User size={20} /></span>
                  <h2>Section 4: Current Employment Status</h2>
                </div>

                <form className="form-content" onSubmit={(e) => {
                  e.preventDefault();
                  if (employmentStatus.employment_situation == "currently unemployed") {
                    sendEmploymentSubmission();
                  }
                  else if (employmentStatus.employment_situation == "currently employed" || employmentStatus.employment_situation == "current contract") {
                    if (employmentStatus.current_employer_name == "") {
                      setType("failed");
                      setMessage("Fill all the required fields.");
                      return;
                    }
                    else if (employmentStatus.employment_type_with_current_employer == "") {
                      setType("failed");
                      setMessage("Fill all the required fields.");
                      return;
                    }
                    else if (employmentStatus.employment_change_authorization == "") {
                      setType("failed");
                      setMessage("Fill all the required fields.");
                      return;
                    }
                    sendEmploymentSubmission();

                  }
                  else if (employmentStatus.employment_type_with_current_employer == "") {
                    setType("failed");
                    setMessage("Fill all the required fields.");
                    return;
                  }

                }}>
                  {/* Employment Situation */}
                  <label>
                    Current Employment Situation <span className="required">*</span>
                  </label>
                  <div className="doc-type-row">
                    {["currently unemployed", "currently employed", "current contract"].map((type) => (
                      <label
                        key={type}
                        className={`card-radio${employmentStatus.employment_situation === type ? " selected" : ""}`}
                      >
                        <input
                          type="radio"
                          name="employment_situation"
                          value={type}
                          checked={employmentStatus.employment_situation === type}
                          onChange={handlestage4}
                        />
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </label>
                    ))}
                  </div>
                  {employmentStatus.employment_situation == "currently unemployed" || employmentStatus.employment_situation == "" ? (<>

                  </>) : (<>



                    {/* Employer Name */}
                    <div className="form-row">
                      <div className="form-group">
                        <label>
                          Current Employer Name <span className="required">*</span>
                        </label>
                        <input
                          type="text"
                          name="current_employer_name"
                          value={employmentStatus.current_employer_name}
                          onChange={handlestage4}
                          placeholder="Enter current employer name"
                          required
                        />
                      </div>
                    </div>

                    {/* Employment Type */}
                    <label>
                      Employment Type with Current Employer <span className="required">*</span>
                    </label>
                    <div className="doc-type-row">
                      {["W2 employee", "C2C contract", "1099 contractor"].map((type) => (
                        <label
                          key={type}
                          className={`card-radio${employmentStatus.employment_type_with_current_employer === type ? " selected" : ""}`}
                        >
                          <input
                            type="radio"
                            name="employment_type_with_current_employer"
                            value={type}
                            checked={employmentStatus.employment_type_with_current_employer === type}
                            onChange={handlestage4}
                          />
                          {type}
                        </label>
                      ))}
                    </div>

                    {/* Contact Details */}
                    <div className="form-row">
                      <div className="form-group">
                        <label>Contact Person Name<span className="required"> *</span></label>
                        <input
                          type="text"
                          name="contact_person_name"
                          value={employmentStatus.contact_person_name}
                          onChange={handlestage4}
                          required
                          placeholder="Manager or HR contact name"
                        />
                      </div>
                      <div className="form-group">
                        <label>Contact Person Title<span className="required"> *</span></label>
                        <input
                          type="text"
                          name="contact_person_title"
                          value={employmentStatus.contact_person_title}
                          onChange={handlestage4}
                          required
                          placeholder="Manager, HR Director, etc."
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Contact Email<span className="required"> *</span></label>
                        <input
                          type="email"
                          name="contact_email"
                          value={employmentStatus.contact_email}
                          onChange={handlestage4}
                          required
                          placeholder="contact@company.com"
                          pattern="^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.(com|in|ai|us)$"
                          title="Use an email ending with .com, .in, .ai, or .us"
                          autoCapitalize="off"
                          autoCorrect="off"
                        />
                      </div>
                      <div className="form-group">
                        <label>Contact Phone<span className="required"> *</span></label>
                        <input
                          type="tel"
                          name="contact_phone"
                          value={employmentStatus.contact_phone}
                          maxLength={17}
                          required
                          onChange={(e) => {
                            const formattedPhone = formatUSPhoneNumber(e.target.value);
                            setEmploymentStatus(prev => ({
                              ...prev,
                              contact_phone: formattedPhone
                            }));
                          }}
                          placeholder="+1 (555) 123-4567"
                        />

                      </div>
                    </div>
                    <label style={{ marginBottom: "10px" }}>
                      Employment Change Authorization <span className="required">*</span>
                    </label>
                    <div className="doc-type-row doc-type-col">
                      {[
                        "can start immediately",
                        "need to give notice period",
                        "have restrictions (non-compete, etc.)"
                      ].map((type) => (
                        <label
                          key={type}
                          className={`card-radio${employmentStatus.employment_change_authorization === type ? " selected" : ""}`}
                        >
                          <input
                            type="radio"
                            name="employment_change_authorization"
                            value={type}
                            checked={employmentStatus.employment_change_authorization === type}
                            onChange={handlestage4}
                          />
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </label>
                      ))}
                    </div>
                    {employmentStatus.employment_change_authorization === "need to give notice period" && (<>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Notice Period (in weeks)<span className="required">*</span></label>
                          <select
                            name="notice_period"
                            value={employmentStatus.notice_period}
                            onChange={handlestage4}
                            required
                          >
                            <option value="">Select notice period</option>
                            <option key="1" value="1 week">1 week</option>
                            <option key="1" value="2 weeks">2 weeks</option>
                            <option key="1" value="3 weeks">3 weeks</option>
                            <option key="1" value="4 weeks">4 weeks</option>
                            <option key="1" value="6 weeks">6 weeks</option>
                            <option key="1" value="8 weeks">8 weeks</option>
                          </select>
                        </div>
                      </div>
                    </>)}

                    {employmentStatus.employment_change_authorization === "have restrictions (non-compete, etc.)" && (<>



                      <div className="form-row">
                        <div className="form-group">
                          <label>Restriction Details <span className="required">*</span></label>
                          <textarea
                            type="text"
                            name="restriction_details"
                            value={employmentStatus.restriction_details}
                            required
                            onChange={handlestage4}
                            placeholder="Please explain the restrictions (non-compete, client restrictions, etc.)"
                          />
                        </div>
                      </div>
                    </>)}

                  </>)}

                  {/* Footer */}
                  <div className="form-footer">
                    <button
                      className="btn prev"
                      onClick={() => setEmploymentSubmissionStage("3")}
                    >
                      Previous
                    </button>
                    <button className="btn next" type="submit">
                      Next
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
          {employmentSubmissionStage === "5" && (
            <>
              <div className="form-container">
                <div className="form-header">
                  <span className="header-icon"><User size={20} /></span>
                  <h2>Section 5: Rate & Employment Terms</h2>
                </div>
                <form className="form-content" onSubmit={e => {
                  e.preventDefault();
                  if (!preferredEmployment.available_start_date) {
                    setStartDateError("Please select your available start date.");
                    return;
                  } else {
                    setStartDateError("");
                    sendEmploymentSubmission();
                  }
                }}>

                  <label>
                    Preferred Employment Type(s) <span className="required">*</span>
                  </label>
                  <div className="doc-type-row wrapped">
                    {["W2 (I can work on your payroll)", "C2C (Corp-to-Corp through my company)", "1099 (Independent Contractor)", "Open to Multiple Options"].map((type) => (
                      <label
                        key={type}
                        className={`card-radio${preferredEmployment.preferred_employment_type.includes(type) ? " selected" : ""}`}
                      >
                        <input
                          type="checkbox"
                          name="preferred_employment_type"
                          value={type}
                          checked={preferredEmployment.preferred_employment_type.includes(type)}
                          onChange={handlestage5}
                          required={preferredEmployment.preferred_employment_type.length === 0}
                        />
                        {type}
                      </label>
                    ))}
                  </div>





                  {/* --- W2 --- */}
                  {(preferredEmployment.preferred_employment_type.includes("W2 (I can work on your payroll)") ||
                    preferredEmployment.preferred_employment_type.includes("Open to Multiple Options")) && (
                      <>
                        <div className="w2-col">
                          <label className="head" style={{ marginBottom: "12px" }}>W2 Employment Terms</label>
                          <div className="form-row">
                            <div className="form-group">
                              <label>Expected Hourly Rate ($) <span className="required"> *</span></label>
                              <input
                                type="number"
                                name="w2_expected_hourly_rate"
                                value={preferredEmployment.w2_expected_hourly_rate}
                                onChange={handleStageInput5}
                                min="0"
                                placeholder="e.g. 60"
                                required
                              />
                            </div>
                            <div className="form-group">
                              <label>Minimum Acceptable Rate ($) <span className="required"> *</span></label>
                              <input
                                type="number"
                                name="w2_min_rate"
                                value={preferredEmployment.w2_min_rate}
                                onChange={handleStageInput5}
                                min="0"
                                placeholder="e.g. 50"
                                required
                              />
                            </div>
                          </div>
                        </div>

                      </>
                    )}

                  {/* --- C2C --- */}
                  {(preferredEmployment.preferred_employment_type.includes("C2C (Corp-to-Corp through my company)") ||
                    preferredEmployment.preferred_employment_type.includes("Open to Multiple Options")) && (
                      <>
                        <div className="c2c-col">
                          <label className="head" style={{ marginBottom: "18px" }}>C2C Terms & Company Details</label>
                          <div className="form-row">
                            <div className="form-group">
                              <label>Your Company/Business Name <span className="required"> *</span></label>
                              <input
                                type="text"
                                name="c2c_company_name"
                                value={preferredEmployment.c2c_company_name}
                                onChange={handleStageInput5}
                                placeholder="Business name"
                                required
                              />
                            </div>
                            <div className="form-group">
                              <label>Expected Hourly Rate ($) <span className="required"> *</span></label>
                              <input
                                type="number"
                                name="c2c_expected_hourly_rate"
                                value={preferredEmployment.c2c_expected_hourly_rate}
                                onChange={handleStageInput5}
                                min="0"
                                placeholder="e.g. 70"
                                required
                              />
                            </div>
                            <div className="form-group">
                              <label>Minimum Acceptable Rate ($) <span className="required"> *</span></label>
                              <input
                                type="number"
                                name="c2c_min_rate"
                                value={preferredEmployment.c2c_min_rate}
                                onChange={handleStageInput5}
                                min="0"
                                placeholder="e.g. 60"
                                required
                              />
                            </div>
                          </div>

                          {/* C2C Company Info */}
                          <label style={{ marginBottom: "18px" }}>C2C Company Information <span className="required"> *</span></label>
                          <div className="form-row">
                            <div className="form-group">
                              <label>Company Legal Name <span className="required"> *</span></label>
                              <input
                                type="text"
                                name="c2c_legal_name"
                                value={preferredEmployment.c2c_legal_name}
                                onChange={handleStageInput5}
                                placeholder="Legal Name"
                                required
                              />
                            </div>
                            <div className="form-group">
                              <label>Primary Contact Name <span className="required"> *</span></label>
                              <input
                                type="text"
                                name="c2c_primary_contact"
                                value={preferredEmployment.c2c_primary_contact}
                                onChange={handleStageInput5}
                                placeholder="Contact Name"
                                required
                              />
                            </div>
                          </div>
                          <div className="form-row">
                            <div className="form-group">
                              <label>Company Email <span className="required"> *</span></label>
                              <input
                                type="email"
                                name="c2c_company_email"
                                value={preferredEmployment.c2c_company_email}
                                onChange={handleStageInput5}
                                placeholder="Email"
                                pattern="^[^\s@]+@[^\s@]+\.(com|org|in|ai|us)$"
                                title="Email must end with .com, .org, .in, .ai, or .us"
                                required
                              />
                            </div>

                            <div className="form-group">
                              <label>Company Phone <span className="required"> *</span></label>
                              <input
                                type="tel"
                                name="c2c_company_phone"
                                value={preferredEmployment.c2c_company_phone}
                                maxLength={17}
                                required
                                onChange={(e) => {
                                  const formattedPhone = formatUSPhoneNumber(e.target.value);
                                  setPreferredEmployment(prev => ({
                                    ...prev,
                                    c2c_company_phone: formattedPhone
                                  }));
                                }}
                                placeholder="+1 (555) 123-4567"
                              />
                            </div>
                          </div>
                          <div className="form-row">
                            <div className={`form-group `}>
                              <label>ZIP Code <span className="required"> *</span></label>
                              <input
                                type="text"
                                name="c2c_zip"
                                value={pincode}
                                onChange={(e) => { setPincode(e.target.value) }}
                                placeholder="ZIP"
                                required
                                aria-busy={zipLoading}
                              />
                            </div>

                            <div className={`form-group ${stateCountryAnimate ? styles.JobAnimate : ""}`}>
                              <label>City <span className="required"> *</span></label>
                              <input
                                type="text"
                                name="c2c_city"
                                value={preferredEmployment.c2c_city}
                                onChange={handleStageInput5}
                                placeholder="City"
                                required
                              />
                            </div>

                            <div className={`form-group ${stateCountryAnimate ? styles.JobAnimate : ""}`}>
                              <label>State <span className="required"> *</span></label>
                              <div
                                className={`dropdown position-relative ${stateCountryAnimate ? styles.JobAnimate : ""}`}
                                ref={c2cStateDropdownRef}
                              >
                                <button
                                  type="button"
                                  className="btn btn-outline-secondary dropdown-toggle w-100 text-start customDropDown"
                                  onClick={() => setC2cStateOpen((v) => !v)}
                                  style={{ maxHeight: "50px" }}
                                >
                                  {preferredEmployment.c2cstate || "Select State"}
                                </button>

                                <ul
                                  className={`dropdown-menu w-100 ${c2cStateOpen ? "show" : ""}`}
                                  style={{ maxHeight: 250, overflowY: "auto", position: "absolute", zIndex: 1000, padding: 8 }}
                                >
                                  {/* Search */}
                                  <li>
                                    <input
                                      type="text"
                                      className="form-control mb-2"
                                      placeholder="Search state..."
                                      value={c2cStateSearch}
                                      onChange={(e) => setC2cStateSearch(e.target.value)}
                                      style={{
                                        maxHeight: 38,
                                        paddingLeft: 15,
                                        paddingRight: 15,
                                        fontSize: 14,
                                        color: "#020817",
                                        background: "#fff",
                                        fontWeight: 500,
                                        borderRadius: 8,
                                      }}
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                  </li>

                                  {/* Clear */}
                                  <li>
                                    <button
                                      type="button"
                                      className="dropdown-item"
                                      onClick={() => {
                                        setPreferredEmployment((prev) => ({ ...prev, c2cstate: "" }));
                                        setC2cStateSearch("");
                                        setC2cStateOpen(false);
                                      }}
                                    >
                                      Select State
                                    </button>
                                  </li>

                                  {/* Options */}
                                  {filteredC2CStates.length ? (
                                    filteredC2CStates.map((item, i) => (
                                      <li key={i}>
                                        <button
                                          type="button"
                                          className={`dropdown-item ${preferredEmployment.c2cstate === item ? "active" : ""}`}
                                          onClick={() => {
                                            setPreferredEmployment((prev) => ({ ...prev, c2cstate: item }));
                                            setC2cStateOpen(false);
                                            setC2cStateSearch("");
                                          }}
                                        >
                                          {item}
                                        </button>
                                      </li>
                                    ))
                                  ) : (
                                    <li className="dropdown-item disabled">No states found</li>
                                  )}
                                </ul>
                              </div>
                              <input
                                name="c2cstate"
                                value={preferredEmployment.c2cstate || ""}
                                onChange={() => { }}
                                required
                                className="visually-hidden"
                              />

                            </div>
                          </div>

                        </div>
                      </>
                    )}

                  {/* --- 1099 Contractor --- */}
                  {(preferredEmployment.preferred_employment_type.includes("1099 (Independent Contractor)") ||
                    preferredEmployment.preferred_employment_type.includes("Open to Multiple Options")) && (
                      <>
                        <div className="contracterterms-col">
                          <label className="head" style={{ marginBottom: "18px" }}>1099 Contractor Terms</label>
                          <div className="form-row">
                            <div className="form-group">
                              <label>Expected Hourly Rate ($) <span className="required"> *</span></label>
                              <input
                                type="number"
                                name="contractor_expected_hourly_rate"
                                value={preferredEmployment.contractor_expected_hourly_rate}
                                onChange={handleStageInput5}
                                min="0"
                                placeholder="e.g. 55"
                                required
                              />
                            </div>
                            <div className="form-group">
                              <label>Minimum Acceptable Rate ($) <span className="required"> *</span></label>
                              <input
                                type="number"
                                name="contractor_min_rate"
                                value={preferredEmployment.contractor_min_rate}
                                onChange={handleStageInput5}
                                min="0"
                                placeholder="e.g. 50"
                                required
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                  {/* Available Start Date */}
                  <div className="form-row">
                    <div className="form-group">
                      <label>
                        Available Start Date <span className="required">*</span>
                      </label>
                      <div className="relative w-full DateChooseField">
                        <DatePicker
                          showYearDropdown
                          showMonthDropdown
                          showIcon
                          toggleCalendarOnIconClick
                          scrollableYearDropdown
                          selected={preferredEmployment.available_start_date}
                          onChange={handleStartDateChange}
                          dateFormat="MM-dd-yyyy"  // ✅ ensures DatePicker itself uses mm-dd-yyyy
                          minDate={new Date()}
                          maxDate={new Date("2050-12-31")} // no future dates
                          customInput={
                            <button
                              type="button"
                              className="DateChooseFieldBtn inline-flex items-center gap-2 whitespace-nowrap rounded-md text-sm ring-offset-background 
                                        transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring 
                                        focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 
                                        [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 
                                        border border-input bg-background hover:bg-accent hover:text-accent-foreground 
                                        h-10 px-4 py-2 w-full justify-start text-left font-normal text-muted-foreground"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {preferredEmployment.available_start_date
                                ? `${String(preferredEmployment.available_start_date.getMonth() + 1).padStart(2, "0")}-${String(preferredEmployment.available_start_date.getDate()).padStart(2, "0")}-${preferredEmployment.available_start_date.getFullYear()}`
                                : "Select start date"}
                            </button>
                          }
                          required
                        />

                      </div>
                    </div>
                  </div>

                  {/* Error message for Available Start Date */}
                  {startDateError && (
                    <div style={{ color: "red", fontSize: 13, marginTop: 6 }}>
                      {startDateError}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="form-footer">
                    <button
                      className="btn prev"
                      onClick={() => setEmploymentSubmissionStage("4")}
                      type="button"
                    >
                      Previous
                    </button>
                    <button className="btn next" type="submit">Next</button>
                  </div>
                </form>
              </div>
            </>
          )}
          {employmentSubmissionStage === "6" && (
            <div className="form-container">
              <div className="form-header">
                <span className="header-icon"><User size={20} /></span>
                <h2>Section 6: Additional Information</h2>
              </div>
              <form className="form-content" onSubmit={(e) => {
                e.preventDefault();
                if (priorSubmission.submission_status == "Yes" && priorSubmission.previous_outcome == "") {
                  setType("failed");
                  setMessage("Please fill previous outcome field.");
                  return;
                }
                sendEmploymentSubmission()
              }}>
                <label>
                  Have you been submitted for this position before? <span className="required">*</span>
                </label>
                <div className="doc-type-row doc-type-col">
                  {[
                    { value: "No", label: "No, this is my first submission" },
                    { value: "Yes", label: "Yes, I have been submitted before" },
                    { value: "notSure", label: "Not sure / Don't remember" }
                  ].map(opt => (
                    <label key={opt.value} className={`card-radio${priorSubmission.submission_status === opt.value ? " selected" : ""}`}>
                      <input
                        type="radio"
                        name="submission_status"
                        value={opt.value}
                        checked={priorSubmission.submission_status === opt.value}
                        onChange={handleStage6}
                        required
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>

                {/* Additional fields only shown if user says Yes */}
                {priorSubmission.submission_status === "Yes" && (
                  <>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Previous Agency/Recruiter Name <span className="required">*</span></label>
                        <input
                          type="text"
                          name="previous_agency"
                          value={priorSubmission.previous_agency}
                          onChange={handleStage6}
                          placeholder="Name of agency or recruiter"
                          required
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Approximate Submission Date <span className="required">*</span></label>
                        <input
                          type="text"
                          name="approximate_submission_date"
                          value={priorSubmission.approximate_submission_date}
                          onChange={handleStage6}
                          required
                          placeholder="e.g. March 2024, 6 months ago"
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Previous Submission Outcome <span className="required">*</span></label>

                        <div className="dropdown" ref={previousOutcomeRef}>
                          <button
                            className="btn btn-outline-secondary dropdown-toggle w-100 text-start customDropDown"
                            type="button"
                            onClick={() => setPreviousOutcomeOpen(v => !v)} // toggle local state [2]
                            style={{ maxHeight: '50px' }}
                          >
                            {priorSubmission.previous_outcome || "Select outcome"}
                          </button>

                          <ul
                            className={`dropdown-menu w-100 ${previousOutcomeOpen ? 'show' : ''}`}
                            style={{
                              maxHeight: '200px',
                              overflowY: 'auto',
                              position: 'absolute',
                              zIndex: 1000
                            }}
                          >
                            <li>
                              <button
                                className="dropdown-item"
                                type="button"
                                onClick={() => {
                                  setPriorSubmission(prev => ({ ...prev, previous_outcome: "" }));
                                  setPreviousOutcomeOpen(false); // close on select [2]
                                }}
                              >
                                Select outcome
                              </button>
                            </li>

                            <li>
                              <button
                                className="dropdown-item"
                                type="button"
                                onClick={() => {
                                  setPriorSubmission(prev => ({ ...prev, previous_outcome: "pending" }));
                                  setPreviousOutcomeOpen(false); // close on select [2]
                                }}
                              >
                                Pending
                              </button>
                            </li>

                            <li>
                              <button
                                className="dropdown-item"
                                type="button"
                                onClick={() => {
                                  setPriorSubmission(prev => ({ ...prev, previous_outcome: "rejected" }));
                                  setPreviousOutcomeOpen(false); // close on select [2]
                                }}
                              >
                                Rejected
                              </button>
                            </li>

                            <li>
                              <button
                                className="dropdown-item"
                                type="button"
                                onClick={() => {
                                  setPriorSubmission(prev => ({ ...prev, previous_outcome: "no response" }));
                                  setPreviousOutcomeOpen(false); // close on select [2]
                                }}
                              >
                                No response
                              </button>
                            </li>

                            <li>
                              <button
                                className="dropdown-item"
                                type="button"
                                onClick={() => {
                                  setPriorSubmission(prev => ({ ...prev, previous_outcome: "withdrew application" }));
                                  setPreviousOutcomeOpen(false); // close on select [2]
                                }}
                              >
                                Withdrew application
                              </button>
                            </li>

                            <li>
                              <button
                                className="dropdown-item"
                                type="button"
                                onClick={() => {
                                  setPriorSubmission(prev => ({ ...prev, previous_outcome: "hired by different role" }));
                                  setPreviousOutcomeOpen(false); // close on select [2]
                                }}
                              >
                                Hired by different role
                              </button>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                  </>
                )}

                <div className="form-row">
                  <div className="form-group">
                    <label>Additional Comments or Information </label>
                    <textarea
                      name="additional_comments"
                      value={priorSubmission.additional_comments}
                      onChange={handleStage6}
                      placeholder="Any additional information you'd like to share about your background, preferences, or this opportunity..."
                    />
                  </div>
                </div>
                <div className="form-footer">
                  <button className="btn prev" type="button" onClick={() => setEmploymentSubmissionStage("5")}>
                    Previous
                  </button>
                  <button className="btn next" type="submit">Next</button>
                </div>
              </form>
            </div>
          )}
          {employmentSubmissionStage === "7" && (
            <div className="form-container">
              <div className="form-header">
                <span className="header-icon"><User size={20} /></span>
                <h2>Section 7: Consent & Digital Signature</h2>
              </div>
              <form className="form-content" onSubmit={(e) => { e.preventDefault(); sendEmploymentSubmission(); finalSubmit() }}>
                <div className="consent-acknowledgments" style={{ marginBottom: 20 }}>
                  <label className="topLabel" style={{ marginBottom: "10px" }}>Consent & Acknowledgements</label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="certify_accuracy"
                      checked={consentInfo.certify_accuracy}
                      onChange={handleStage7}
                      required
                    />
                    I certify that all information provided in this submission is accurate and complete to the best of my knowledge. <span className="required">*</span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="authorize_background"
                      checked={consentInfo.authorize_background}
                      onChange={handleStage7}
                      required
                    />
                    I authorize CareerSavvy and its clients to conduct background verification and reference checks as required. <span className="required">*</span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="understand_no_job_offer"
                      checked={consentInfo.understand_no_job_offer}
                      onChange={handleStage7}
                      required
                    />
                    I understand that submission does not guarantee job placement or constitute a job offer. <span className="required">*</span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="accept_terms"
                      checked={consentInfo.accept_terms}
                      onChange={handleStage7}
                      required
                    />
                    I agree to CareerSavvy's terms of service and privacy policy regarding data handling and submission processes. <span className="required">*</span>
                  </label>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>
                      Digital Signature <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="digital_signature"
                      placeholder="Type your full legal name..."
                      value={consentInfo.digital_signature}
                      onChange={handleStage7}
                      required
                    />
                    <div className="consent-hint" style={{ fontSize: 13, color: "#6b727c", textAlign: "left" }}>
                      By typing your name above, you are providing your digital signature and agreeing to all terms and conditions.
                    </div>
                  </div>
                </div>
                <div className="form-footer">
                  <button
                    className="btn prev"
                    type="button"
                    onClick={() => setEmploymentSubmissionStage("6")}
                  >
                    Previous
                  </button>
                  <button className="btn next" type="submit">Submit</button>
                </div>
              </form>
            </div>
          )}


        </div>
      </div>
    </>
  );
};

export default EmploymentSystem;