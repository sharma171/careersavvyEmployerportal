import React, { useState, useEffect, useRef } from 'react';
import styles from '../css/JobPostModal.module.css';
import "./jobPostForm.css";
import { useSelector } from "react-redux";
import { useDispatch } from 'react-redux';
import CSavvyPageLoader from "../cSavvvyPageLoader";
import { Dropdown } from "react-bootstrap";
import ToastPopup from "../toastSucces";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import moment from "moment";
import { Modal, Button, Form, Tab, Nav } from 'react-bootstrap';
import AiJobPost from "../Components/aiJobPost";
import { setOrgName, setCreateJobStatus } from "../../../../store/actions/actions";
import Spinner from "../Components/spinner";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import moment from 'moment';
import axios from 'axios';



const JobPostModal = ({ show, onHide, onSuccess, modalOpen, setModalOpen, editJobData = null }) => {
  const userEmail = useSelector(state => state.auth.auth.email);
  const { orgName } = useSelector((state) => state.profile);
  const defaultJob = {
    job_title: '',
    job_description: { overview: '', requirements: '', additional_comments: '' },
    job_employment_type: 'Full-time',
    job_city: '',
    no_of_people: '',
    job_state: '',
    job_country: '',
    experience_range: '',
    job_posted_by: userEmail,
    salary_type: 'Yearly',
    start_date: '',
    job_status: 'Active',
    salary_range: "",
    job_publisher: orgName,
    job_apply_quality_score: 0,
    job_highlights: {},
    job_is_remote: false,
  };
  const formRef = useRef(null);
  const [pincode, setPincode] = useState("");
  const [activeTab, setActiveTab] = useState('basic');
  const [jobData, setJobData] = useState(defaultJob);
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const [copyWriter, setCopyWriter] = useState(false);
  const [preferredTone, setPreferredTone] = useState("");
  const [levelOfDetail, setLevelOfDetail] = useState("");
  const [guideLines, setGuideLines] = useState("");
  const [draftActive, setDraftActive] = useState(false);
  const [showLoader, setShowLoader] = useState("");
  const [type, setType] = useState("");
  const [responsibilities, setResponsibilities] = useState(['']);
  const [requirements, setRequirements] = useState(['']);
  const [benefits, setBenefits] = useState(['']);
  const [stateCountryAnimate, setStateCountryAnimate] = useState(false);

  // Quill toolbar options (similar to your screenshot)
  const quillModules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"], // formatting
      [{ list: "ordered" }, { list: "bullet" }], // lists
      ["clean"], // remove formatting
    ],
  };
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (pincode.length >= 5) {
        getStateCountry();
      }
    }, 100); // Debounce by 500ms

    return () => clearTimeout(delayDebounce);
  }, [pincode]);






  useEffect(() => {
    const orgData = JSON.parse(localStorage.getItem("OrganisationData"));
    dispatch(setOrgName(orgData[0].preferred_org_name));
    setJobData({ ...jobData, job_posted_by: userEmail });
    setJobData({ ...jobData, job_publisher: orgData[0].preferred_org_name, job_posted_by: userEmail });
  }, [orgName, show, activeTab, editJobData]);
  const getStateCountry = async () => {
    setStateCountryAnimate(true);
    try {
      const listQuery = {
        zip_code: pincode,
      };
      const response = await fetch(
        "https://us-central1-foursssolutions.cloudfunctions.net/retrieve_location_details_v2",
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(listQuery),
        }
      );
      const data = await response.json();
      console.log("state", data.data.state)
      // Correctly update all at once
      setJobData((prev) => ({
        ...prev,
        job_city: data.data.city || '',
        job_state: data.data.state || '',
        job_country: data.data.country || '',
      }));

      console.log("Location data received:", data);

    } catch (error) {
      console.error("Error fetching location details:", error);
      setStateCountryAnimate(false);
    }
    finally {
      setStateCountryAnimate(false);
    }
  };

  function saveDraft() {
    const draftData = {
      ...jobData,
      job_status: "Draft"
    };
    setDraftActive(true);
    setJobData(draftData);
    // handleSubmit(false);

  }

  useEffect(() => {
    setTimeout(() => {
      if (jobData.job_status == "Draft") {
        handleSubmit(false);
        setDraftActive(false);
      }
    }, 1000)
  }, [draftActive])


  useEffect(() => {
    if (editJobData) {
      setJobData(editJobData);
      const highlights = editJobData.job_highlights || {};
      setResponsibilities(highlights.responsibilities || []);
      setRequirements(highlights.requirements || []);
      setBenefits(highlights.benefits || []);
    } else {
      setJobData(defaultJob);
      setResponsibilities(['']); // <- change here
      setRequirements(['']);     // <- change here
      setBenefits(['']);         // <- change here
    }
  }, [editJobData]);

  useEffect(() => {
    if (editJobData) {
      // Ensure format is correct and non-empty
      if (editJobData.start_date) {
        // Optionally, format with moment to standardize
        editJobData.start_date = moment(editJobData.start_date).format("MM-DD-YYYY");
      }
      setJobData(editJobData);
    } else {
      setJobData(defaultJob);
    }
  }, [editJobData]);

  useEffect(() => {
    const form = formRef.current;
    const requiredFields = form?.querySelectorAll('[required]') || [];

    requiredFields.forEach(field => {
      field.addEventListener('input', () => {
        if (field.value && field.value.trim() !== '') {
          field.classList.remove('validation-error');
        }
      });
    });

    return () => {
      requiredFields.forEach(field => {
        field.removeEventListener('input', () => { });
      });
    };
  }, [jobData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData({ ...jobData, [name]: value });
  };

  const handleHighlightChange = (type, value, index) => {
    const list = [...(type === 'responsibilities' ? responsibilities : type === 'requirements' ? requirements : benefits)];
    list[index] = value;
    if (type === 'responsibilities') setResponsibilities(list);
    else if (type === 'requirements') setRequirements(list);
    else setBenefits(list);
  };

  const addLine = (type) => {
    if (type === 'responsibilities') setResponsibilities([...responsibilities, '']);
    else if (type === 'requirements') setRequirements([...requirements, '']);
    else setBenefits([...benefits, '']);
  };

  const removeLine = (type, index) => {
    const list = [...(type === 'responsibilities' ? responsibilities : type === 'requirements' ? requirements : benefits)];
    list.splice(index, 1);
    if (type === 'responsibilities') setResponsibilities(list);
    else if (type === 'requirements') setRequirements(list);
    else setBenefits(list);
  };

  const isEmptyRichText = (html) => {
    if (typeof html !== "string") return true;
    // Remove tags and common blank placeholders
    const text = html
      .replace(/<[^>]*>/g, " ")     // strip HTML tags
      .replace(/&nbsp;/g, " ")      // normalize non-breaking spaces
      .replace(/\s+/g, " ")         // collapse whitespace
      .trim();
    return text.length === 0;
  };

  const handleSubmit = async (isUpdate = false) => {
    if (isEmptyRichText(jobData?.job_description?.overview)) {
      console.log("jobOverview", jobData?.job_description?.overview);
      setType("failed");
      setMessage("Please proviede job overview of the job role. Please fill all the fields");
      return;
    }
    if (!formRef.current) return;

    const form = formRef.current;
    const requiredFields = form.querySelectorAll('[required]');
    let hasError = false;

    requiredFields.forEach((field) => {
      if (!field.value || field.value.trim() === '') {
        field.classList.add('validation-error');
        hasError = true;
      } else {
        field.classList.remove('validation-error');
      }
    });

    if (hasError) {
      setMessage("Fill All Mandatory Fields");
      form.reportValidity();
      return;
    }

    // Existing logic...
    if (editJobData) {
      setShowLoader("Updating Job Post");
    } else {
      setShowLoader("Creating New Job Post");
    }

    const payload = {
      task_name: isUpdate ? 'update' : 'create',
      ...(isUpdate && { job_id: editJobData.job_id }),
      email: userEmail,
      data: {
        ...jobData,
        job_highlights: {
          responsibilities,
          requirements,
          benefits,
        },
      },
    };


    const url = 'https://save-employer-job-post-v10-737421501165.us-east1.run.app';

    try {
      const response = await axios.post(url, payload);
      if (response.data.success) {
        onSuccess(response.data.data);
        setType("success");
        setMessage("Job posting saved successfully!");
        setJobData(defaultJob);
        setResponsibilities(['']);
        setRequirements(['']);
        setBenefits(['']);
        dispatch(setCreateJobStatus("job_updated"));
        onHide();
      }
      else {
        setType("error");
        console.log(response.data.error);
        setMessage(response.data.error || "Something went wrong while saving the job.");

      }
    } catch (error) {
      console.error('Error saving job post:', error);

      let errorMessage = "An unexpected error occurred.";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setType("error");
      setMessage(errorMessage);
    }
    finally {
      setShowLoader("");
    }
  };
  const [aiLoading, setAiLoading] = useState(false);
  useEffect(() => {
    if (activeTab == 'description') {
      setCopyWriter(true);
    }
  }, [activeTab])
  const [aiGenerativeData, setAiGenerativeData] = useState(false);
  const [generativeOverview, setGenerativeOverview] = useState("");
  useEffect(() => {
    if (generativeOverview !== "") {
      setJobData({ ...jobData, job_description: { ...jobData.job_description, overview: generativeOverview } });
    }
  }, [generativeOverview]);
  useEffect(() => {
    if (activeTab == 'description') {
      if (editJobData) {
        setTimeout(() => {
          const generatedOverview = `<p>${jobData.job_description?.overview || ""}</p>`;

          setGenerativeOverview(generatedOverview);

        }, 1000)
      }
    }


  }, [editJobData, activeTab]);
  const aiJobPost = async () => {
    setAiLoading(true)
    try {
      const queryObj = {
        guidelines_for_ai: guideLines,
        tone_selection: preferredTone,
        level_of_detail: levelOfDetail,
        prompt_type: "job_overview",
        user_email: userEmail
      };

      const response = await fetch(
        "https://us-east1-foursssolutions.cloudfunctions.net/generate_job_description_v2",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(queryObj),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      console.log("AI Response:", data);

      const title = data?.roleDetails?.title;
      const generatedOverview = `<p>We are seeking a dedicated professional to join our team. ${data?.jobOverview}</p>`;

      setGenerativeOverview(generatedOverview);
      const overview = `${generativeOverview}`;
      const requirements = data?.projectPrerequisites?.requiredSkills?.join(", ");
      console.log(overview)

      const responsibilitiesData = data?.keyResponsibilities || [];

      const qualificationsData = [
        ...(data?.projectPrerequisites?.mandatoryCertifications || []),
        ...(data?.projectPrerequisites?.preferredCertifications || []),
        ...(data?.desiredSkills?.technicalSkills || []),
        data?.desiredSkills?.experienceLevel || "",
        ...(data?.desiredSkills?.toolsAndPlatforms || []),
        ...(data?.desiredSkills?.certifications?.required || []),
        ...(data?.desiredSkills?.certifications?.preferred || []),
        data?.educationAndQualifications?.education || "",
        data?.educationAndQualifications?.alternativeQualifications || ""
      ].filter(Boolean);



      const benefitsData = [
        ...(data?.benefits?.compensation || []),
        ...(data?.benefits?.healthAndWellness || []),
        ...(data?.benefits?.timeOff || []),
        ...(data?.benefits?.professionalDevelopment || []),
        ...(data?.benefits?.workLifeBalance || [])
      ].filter(Boolean);

      // Update jobData with title and description
      console.log("qualificationsData", qualificationsData);
      console.log("benefitsData", benefitsData);
      setJobData(prevState => ({
        ...prevState,
        ...(title && { job_title: title }),
        job_description: {
          ...prevState.job_description,
          ...(overview && { overview }),
          ...(requirements && { requirements })
        }
      }));

      // Update the individual state arrays that your component uses
      if (responsibilitiesData.length > 0) {
        setResponsibilities(responsibilitiesData);
      }

      if (qualificationsData.length > 0) {
        setRequirements(qualificationsData);
      }

      if (benefitsData.length > 0) {
        setBenefits(benefitsData);
      }
      setPreferredTone("");
      setLevelOfDetail("");
      setGuideLines("");

    } catch (error) {
      console.error("Error fetching AI-generated job post:", error);
      setAiLoading(false);
    }
    finally {
      setShowLoader("");
      setCopyWriter(false);
      setAiLoading("");
      // setAiGenerativeData(true);
    }
  };

  // helpers (place above return)
  const asHtmlString = (v) => (typeof v === 'string' ? v : '');

  const resetForm = () => {
    setJobData(defaultJob);
    setResponsibilities(['']);
    setRequirements(['']);
    setBenefits(['']);
  };

  useEffect(() => {
    if (!show || editJobData) return;
    resetForm();
    if (!editJobData) {
      resetForm();
      setPreferredTone("");
      setLevelOfDetail("");
      setGuideLines("");
    }
  }, [show, editJobData]);

  const handleSalaryChange = (e) => {
    const cleaned = e.target.value.replace(/[$/]/g, '');
    setJobData({ ...jobData, salary_range: cleaned });
  };
  const commonProps = {
    required: true,
    className: styles['form-control'],
    name: 'job_description.compensation',
    value: jobData.salary_range || '',
    onChange: handleSalaryChange,
    pattern: "[^$/]*",
    title: "Do not use $ or /",
  };
  // --- helpers ---
  const onlyDigits = (s = "") => s.replace(/\D/g, "");

  // enforce mask while typing/pasting
  const maskToMMDDYYYY = (raw = "") => {
    const d = onlyDigits(raw).slice(0, 8); // keep max 8 digits
    let mm = d.slice(0, 2);
    let dd = d.slice(2, 4);
    let yyyy = d.slice(4, 8);

    if (mm.length === 2) {
      mm = String(Math.max(1, Math.min(12, parseInt(mm, 10) || 0))).padStart(2, "0");
    }
    if (dd.length === 2) {
      dd = String(Math.max(1, Math.min(31, parseInt(dd, 10) || 0))).padStart(2, "0");
    }
    if (yyyy.length === 4) {
      yyyy = String(Math.min(2050, Math.max(1900, parseInt(yyyy, 10) || 0))).padStart(4, "0");
    }

    let out = mm;
    if (dd) out += "-" + dd;
    if (yyyy) out += "-" + yyyy;
    return out;
  };

  // only allow numbers + control keys
  const allowOnlyDateKeys = (e) => {
    if (/^\d$/.test(e.key)) return;
    const ok = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Home", "End"];
    if (ok.includes(e.key)) return;
    e.preventDefault();
  };

  // safely parse -> Date | null
  const parseStartDate = (s) => {
    if (!s) return null;
    const m = moment(s, ["MM-DD-YYYY", "YYYY-MM-DD"], true);
    return m.isValid() ? m.toDate() : null;
  };
  const employmentOptions = [
    { value: "Full-time", label: "Full-time" },
    { value: "Part-time", label: "Part-time" },
    { value: "Contract", label: "Contract" },
    { value: "Internship", label: "Internship" },
  ];
  const statusOptions = [
    { value: "Active", label: "Active" },
    { value: "Review", label: "Review" },
    { value: "Draft", label: "Draft" },
    { value: "Closed", label: "Closed" },
  ];

  const salaryOptions = [
    { value: "Yearly", label: "Yearly" },
    { value: "Hourly", label: "Hourly" },
  ];

  const remoteOptions = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ];


  return (
    <>
      {message !== "" && (
        <>
          <ToastPopup message={message} type={type} setMessage={setMessage} setType={setType} />
        </>
      )}
      {showLoader !== "" && (<>
        <CSavvyPageLoader loaderText={`${showLoader}`} />
      </>)}
      {show && (
        <>
          <Modal fullscreen show={show} onHide={onHide} className={styles.createPost}>
            <Modal.Header className={styles.createPostHeader}>
              <div className="d-flex w-100 align-items-center">
                <Modal.Title className={styles.createPostTitle}>Create New Job Posting</Modal.Title>
                <div className="ms-auto d-flex align-items-center gap-3">
                  <div className="d-flex gap-2">
                    {editJobData ? (<></>) : (
                      <Button className={styles.whiteButton} onClick={() => saveDraft()}>Save as Draft</Button>
                    )}
                    <Button className={styles.submitButton} onClick={() => { handleSubmit(editJobData !== null) }}>
                      {editJobData ? 'Update Job' : 'Publish Job'}
                    </Button>
                  </div>
                  <Button variant="link" onClick={() => { onHide(); setModalOpen(false); dispatch(setCreateJobStatus("job_updated")); setGenerativeOverview("") }} className={styles['btn-close']}>
                    <span aria-hidden="true">&times;</span>
                  </Button>
                </div>
              </div>
            </Modal.Header>
            <Modal.Body className={styles.formOuter}>
              <div className={styles.formContent}>
                <Form ref={formRef} noValidate>
                  <Tab.Container className={styles.fwidthTabs} activeKey={activeTab} onSelect={setActiveTab}>
                    <Nav className={styles.navBar}>
                      <Nav.Item className={styles.navItems} onClick={() => setCopyWriter(false)}>
                        <Nav.Link eventKey="basic" className={`${styles.navigationLink} ${activeTab == 'basic' ? styles.navigationLinkActive : ""}`}>
                          Basic Details
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item className={styles.navItems}>
                        <Nav.Link eventKey="description" className={`${styles.navigationLink} ${activeTab == 'description' ? styles.navigationLinkActive : ""}`}>Job Description</Nav.Link>
                      </Nav.Item>
                    </Nav>
                    <Tab.Content className={styles.TabContent}>
                      <Tab.Pane eventKey="basic">
                        <div className={`row ${styles.contentRow}`} >
                          <div className="col-md-6 mb-4">
                            <Form.Group>
                              <Form.Label className={styles.formLabel}>Job Title *</Form.Label>
                              <Form.Control required className={styles['form-control']} placeholder='eg. Software Engineer' name="job_title" value={jobData.job_title} onChange={handleChange} />
                            </Form.Group>
                          </div>

                          <div className="col-md-6 mb-4">
                            <Form.Group>
                              <Form.Label className={styles.formLabel}>Job Type *</Form.Label>
                              <Dropdown
                                onSelect={(eventKey) => {
                                  if (!eventKey) return;
                                  // Reuse your existing handler signature (name/value)
                                  handleChange({
                                    target: { name: "job_employment_type", value: eventKey },
                                  });
                                }}
                              >
                                <Dropdown.Toggle
                                  id="employment-type"
                                  className={`${styles.formInputs} d-flex align-items-center ${styles.SpecialDropdown}`}
                                >
                                  {jobData.job_employment_type || "Select employment type"}
                                </Dropdown.Toggle>

                                <Dropdown.Menu className={`${styles.DropDownMenu} ${styles.SpecialDropdown}`}>
                                  {employmentOptions.map((opt) => (
                                    <Dropdown.Item
                                      key={opt.value}
                                      eventKey={opt.value}
                                      active={jobData.job_employment_type === opt.value}
                                      className={`${styles.DropDownItems} ${jobData.job_employment_type === opt.value ? styles.DpiActive : ""
                                        }`}
                                    >
                                      {opt.label}
                                    </Dropdown.Item>
                                  ))}
                                </Dropdown.Menu>
                              </Dropdown>
                              <input
                                name="job_employment_type"
                                value={jobData.job_employment_type || ""}
                                onChange={() => { }}
                                required
                                className="visually-hidden"
                              />

                            </Form.Group>
                          </div>

                          <div className="col-md-6 mb-4">
                            <Form.Group>
                              <Form.Label className={styles.formLabel}>Job Status *</Form.Label>
                              <Dropdown
                                onSelect={(eventKey) => {
                                  if (!eventKey) return;
                                  handleChange({
                                    target: { name: "job_status", value: eventKey },
                                  });
                                }}
                              >
                                <Dropdown.Toggle
                                  id="job-status"
                                  className={`${styles.formInputs} d-flex align-items-center ${styles.SpecialDropdown}`}
                                >
                                  {jobData.job_status || "Select job status"}
                                </Dropdown.Toggle>

                                <Dropdown.Menu className={`${styles.DropDownMenu} ${styles.SpecialDropdown}`}>
                                  {statusOptions.map((opt) => (
                                    <Dropdown.Item
                                      key={opt.value}
                                      eventKey={opt.value}
                                      active={jobData.job_status === opt.value}
                                      className={`${styles.DropDownItems} ${jobData.job_status === opt.value ? styles.DpiActive : ""
                                        }`}
                                    >
                                      {opt.label}
                                    </Dropdown.Item>
                                  ))}
                                </Dropdown.Menu>
                              </Dropdown>
                              <input
                                name="job_status"
                                value={jobData.job_status || ""}
                                onChange={() => { }}
                                required
                                className="visually-hidden"
                              />

                            </Form.Group>
                          </div>

                          <div className="col-md-6 mb-4">
                            <Form.Group>
                              <Form.Label className={styles.formLabel}>Posted By *</Form.Label>
                              <Form.Control required className={styles['formInputs']} placeholder='Posted By' name="job_posted_by" value={jobData.job_posted_by} onChange={handleChange} />
                            </Form.Group>
                          </div>
                          <div className="col-md-6 mb-4">
                            <Form.Group>
                              <Form.Label className={styles.formLabel}>ZIP code</Form.Label>
                              <Form.Control className={styles['form-control']} placeholder='Enter Your Area Pincode' value={pincode} onChange={(e) => setPincode(e.target.value)} />
                            </Form.Group>
                          </div>
                          <div className="col-md-6 mb-4">
                            <Form.Group>
                              <Form.Label className={`${styles.formLabel} ${stateCountryAnimate ? styles.AnimateField : ""}`}>City *</Form.Label>
                              <Form.Control required className={styles['formInputs']} placeholder='Enter City' name="job_city" value={jobData.job_city} onChange={handleChange} />
                            </Form.Group>
                          </div>

                          <div className="col-md-6 mb-4">
                            <Form.Group>
                              <Form.Label className={`${styles.formLabel} ${stateCountryAnimate ? styles.AnimateField : ""}`}>State *</Form.Label>
                              <Form.Control required className={styles['form-control']} placeholder='Enter Your State' name="job_state" value={jobData.job_state} onChange={handleChange} />
                            </Form.Group>
                          </div>


                          <div className="col-md-6 mb-4">
                            <Form.Group>
                              <Form.Label className={`${styles.formLabel} ${stateCountryAnimate ? styles.AnimateField : ""}`}>Country *</Form.Label>
                              <Form.Control required className={styles['form-control']} placeholder='Enter Country' name="job_country" value={jobData.job_country} onChange={handleChange} />
                            </Form.Group>
                          </div>
                          <div className="col-md-6 mb-4">
                            <Form.Group>
                              <Form.Label className={styles.formLabel}>Number of People to Hire *</Form.Label>
                              {editJobData ? (<>

                                <Form.Control required className={styles['form-control']} placeholder='Enter no. of people' name="num_of_hire" value={jobData.num_of_hire} onChange={handleChange} />
                              </>) : (<>

                                <Form.Control required className={styles['form-control']} placeholder='Enter no. of people' name="num_of_hire" value={jobData.num_of_hire} onChange={handleChange} />
                              </>)}
                            </Form.Group>
                          </div>
                          <div className="col-md-6 mb-4">


                            <Form.Group className="datePickerjobpost">
                              <Form.Label className={styles.formLabel}>Start Date *</Form.Label>
                              <DatePicker
                                className={`${styles["form-control"]}`}
                                style={{ width: "100%" }}
                                showYearDropdown
                                showMonthDropdown
                                showIcon
                                toggleCalendarOnIconClick
                                scrollableYearDropdown
                                yearDropdownItemNumber={80}
                                calendarIconClassName="calenderIconRight"
                                placeholderText="MM-DD-YYYY"
                                minDate={new Date()}
                                maxDate={new Date("2050-12-31")}
                                inputMode="numeric" // mobile numeric keypad
                                selected={parseStartDate(jobData.start_date)}
                                dateFormat="MM-dd-yyyy" // enforce display format
                                required
                                onChange={(date) => {
                                  if (!date) {
                                    handleChange({ target: { name: "start_date", value: "" } });
                                    return;
                                  }
                                  const capped = new Date(date);
                                  if (capped.getFullYear() > 2050) capped.setFullYear(2050);
                                  const formatted = moment(capped).format("MM-DD-YYYY");
                                  handleChange({ target: { name: "start_date", value: formatted } });
                                }}
                                onChangeRaw={(e) => {
                                  const masked = maskToMMDDYYYY(e.currentTarget.value);
                                  e.currentTarget.value = masked;
                                }}
                                onKeyDown={allowOnlyDateKeys}
                                onPaste={(e) => {
                                  e.preventDefault();
                                  const text = (e.clipboardData || window.clipboardData).getData("text") || "";
                                  e.currentTarget.value = maskToMMDDYYYY(text);
                                }}
                                onBlur={(e) => {
                                  const s = e.currentTarget.value.trim();
                                  if (!s) {
                                    handleChange({ target: { name: "start_date", value: "" } });
                                    return;
                                  }
                                  const m = moment(s, "MM-DD-YYYY", true);
                                  if (m.isValid()) {
                                    if (m.year() > 2050) m.year(2050);
                                    handleChange({
                                      target: { name: "start_date", value: m.format("MM-DD-YYYY") },
                                    });
                                  } else {
                                    // keep user input but don’t commit to state until valid
                                    e.currentTarget.value = maskToMMDDYYYY(s);
                                  }
                                }}
                              />
                            </Form.Group>


                          </div>
                          <div className="col-md-6 mb-4">
                            <Form.Group>
                              <Form.Label className={styles.formLabel}>Salary Type *</Form.Label>
                              <Dropdown
                                onSelect={(eventKey) => {
                                  if (!eventKey) return;
                                  handleChange({
                                    target: { name: "salary_type", value: eventKey },
                                  });
                                }}
                              >
                                <Dropdown.Toggle
                                  id="salary-type"
                                  className={`${styles.formInputs} d-flex align-items-center ${styles.SpecialDropdown}`}
                                >
                                  {jobData.salary_type || "Select salary type"}
                                </Dropdown.Toggle>

                                <Dropdown.Menu className={`${styles.DropDownMenu} ${styles.SpecialDropdown}`}>
                                  {salaryOptions.map((opt) => (
                                    <Dropdown.Item
                                      key={opt.value}
                                      eventKey={opt.value}
                                      active={jobData.salary_type === opt.value}
                                      className={`${styles.DropDownItems} ${jobData.salary_type === opt.value ? styles.DpiActive : ""
                                        }`}
                                    >
                                      {opt.label}
                                    </Dropdown.Item>
                                  ))}
                                </Dropdown.Menu>
                              </Dropdown>
                              <input
                                name="salary_type"
                                value={jobData.salary_type || ""}
                                onChange={() => { }}
                                required
                                className="visually-hidden"
                              />
                            </Form.Group>
                          </div>
                          <div className="col-md-6 mb-4">
                            <Form.Group>
                              <Form.Label className={styles.formLabel}>Salary Range *</Form.Label>

                              {jobData.salary_type === "Yearly" ? (
                                <Form.Control
                                  {...commonProps}
                                  placeholder="Enter salary range (e.g., 120k – 130k)"
                                />
                              ) : (
                                <Form.Control
                                  {...commonProps}
                                  placeholder="Enter salary range (e.g., 100 – 120)"
                                />
                              )}
                            </Form.Group>
                          </div>

                          <div className="col-md-6 mb-4">
                            <Form.Group>
                              <Form.Label className={styles.formLabel}>Remote Job?</Form.Label>
                              <Dropdown
                                onSelect={(eventKey) => {
                                  if (!eventKey) return;
                                  const isRemote = eventKey === "yes";
                                  setJobData((prev) => ({ ...prev, job_is_remote: isRemote }));
                                }}
                              >
                                <Dropdown.Toggle
                                  id="job-is-remote"
                                  className={`${styles.formInputs} d-flex align-items-center  ${styles.SpecialDropdown}`}
                                  style={{ paddingLeft: "15px" }}
                                >
                                  {jobData.job_is_remote === true
                                    ? "Yes"
                                    : jobData.job_is_remote === false
                                      ? "No"
                                      : "Select remote"}
                                </Dropdown.Toggle>

                                <Dropdown.Menu className={`${styles.DropDownMenu} ${styles.SpecialDropdown}`}>
                                  {remoteOptions.map((opt) => {
                                    const current = jobData.job_is_remote === true ? "yes"
                                      : jobData.job_is_remote === false ? "no"
                                        : "";
                                    const isActive = current === opt.value;
                                    return (
                                      <Dropdown.Item
                                        key={opt.value}
                                        eventKey={opt.value}
                                        active={isActive}
                                        className={`${styles.DropDownItems} ${isActive ? styles.DpiActive : ""}`}
                                      >
                                        {opt.label}
                                      </Dropdown.Item>
                                    );
                                  })}
                                </Dropdown.Menu>
                              </Dropdown>
                              <input
                                name="job_is_remote"
                                value={
                                  jobData.job_is_remote === true
                                    ? "yes"
                                    : jobData.job_is_remote === false
                                      ? "no"
                                      : ""
                                }
                                onChange={() => { }}
                                required
                                className="visually-hidden"
                              />
                            </Form.Group>
                          </div>

                          {/* <div className="col-md-6 mb-4">
                          <Form.Group>
                          <Form.Label className={styles.formLabel}>Apply Quality Score</Form.Label>
                          <Form.Control
                              type="number"
                              className={styles.formInputs}
                              name="job_apply_quality_score"
                              value={jobData.job_apply_quality_score}
                              onChange={handleChange}
                          />
                          </Form.Group>
                      </div> */}

                          <div className="col-md-6 mb-4">
                            <Form.Group>
                              <Form.Label className={styles.formLabel}>Experience range *</Form.Label>
                              <Form.Control required className={styles['form-control']} placeholder='Enter experience range (e.g., 4 - 5)' name="experience_range" value={jobData.experience_range} onChange={handleChange} />
                            </Form.Group>
                          </div>
                          <div className="col-md-6 mb-4">
                            <Form.Group>
                              <Form.Label className={styles.formLabel}>Job Publisher *</Form.Label>
                              <Form.Control required className={styles['form-control']} placeholder='Enter name of Job Publisher' name="job_publisher" value={jobData.job_publisher} onChange={handleChange} />
                            </Form.Group>
                          </div>
                        </div>

                      </Tab.Pane>

                      <Tab.Pane eventKey="description">
                        <div className="p-0">
                          <div
                            style={{
                              border: "1px solid #a6f4c5", // light green border
                              backgroundColor: "#f0fff4", // light green background
                              color: "#065f46", // green text
                              borderRadius: "6px",
                              padding: "10px 14px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              marginBottom: "20px",
                            }}
                          >
                            {/* Left Side: Icon + Text */}
                            <div style={{ display: "flex", alignItems: "center" }}>
                              {/* Sparkle Icon */}
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                style={{ marginRight: "8px", color: "#22c55e" }}
                              >
                                <path d="M12 3v2m6.364 2.636-1.414 1.414M21 12h-2M17.364 19.364l-1.414-1.414M12 21v-2M6.636 17.364l1.414-1.414M3 12h2M6.636 6.636l1.414 1.414" />
                                <path d="M12 8a4 4 0 1 1-4 4 4 4 0 0 1 4-4z" />
                              </svg>

                              {/* Text */}
                              <span style={{ fontSize: "14px" }}>
                                This CareerSavvy AI-generated job description is tailored using insights from
                                your company profile and best practices to maximize visibility and
                                engagement.
                              </span>
                            </div>

                            <button
                              type="button"   // ✅ prevents form submission
                              style={{
                                backgroundColor: "#22c55e", // green background
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                padding: "6px 12px",
                                display: "flex",
                                alignItems: "center",
                                cursor: "pointer",
                                fontSize: "14px",
                                fontWeight: "500",
                                transition: "all 0.2s ease-in-out",
                              }}
                              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#16a34a")}
                              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#22c55e")}
                              onClick={() => setCopyWriter(true)}
                            >
                              {/* Wand Icon */}
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                style={{ marginRight: "6px" }}
                              >
                                <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72" />
                                <path d="m14 7 3 3" />
                                <path d="M5 6v4" />
                                <path d="M19 14v4" />
                                <path d="M10 2v2" />
                                <path d="M7 8H3" />
                                <path d="M21 16h-4" />
                                <path d="M11 3H9" />
                              </svg>
                              AI Copywriter
                            </button>
                          </div>

                          <Form.Group>
                            <Form.Label
                              className={`${styles.formLabel} ${styles.copyWriterRow} mb-3`}
                            >
                              Job Overview *{" "}

                            </Form.Label>
                            {aiGenerativeData ? (<>
                              <Form.Control required className={`${styles['formTextArea']} reactQuilcomponent`} as="textarea" rows={3} placeholder='Provide an overview of the job role and key responsibilities' onChange={(e) => setJobData({ ...jobData, job_description: { ...jobData.job_description, overview: e.target.value } })} value={jobData.job_description?.overview || ''} />
                            </>) : (<>
                              {editJobData ? (<>
                                <ReactQuill
                                  theme="snow"
                                  placeholder="Provide an overview of the job role and key responsibilities"
                                  modules={quillModules}
                                  className={`quillEditor`}
                                  value={generativeOverview}
                                  onChange={setGenerativeOverview}
                                  required
                                />

                              </>) : (<>
                                <ReactQuill
                                  theme="snow"
                                  placeholder="Provide an overview of the job role and key responsibilities"
                                  modules={quillModules}
                                  className={`quillEditor`}
                                  value={generativeOverview}
                                  onChange={setGenerativeOverview}
                                  required
                                />
                              </>)}


                            </>)}


                          </Form.Group>


                          {['responsibilities', 'requirements', 'benefits'].map((type) => (
                            <div key={type} className="mt-4">
                              <Form.Label className={`${styles.formLabel} mb-3`}>{type.replace(/_/g, ' ')} {type == "benefits" ? "" : "*"}</Form.Label>
                              {(type === 'responsibilities' ? responsibilities : type === 'requirements' ? requirements : benefits).map((line, index) => (
                                <div className="d-flex mb-2" key={index}>
                                  <Form.Control
                                    required={type !== 'benefits'}
                                    className={styles['formHighlights']}
                                    value={line}
                                    placeholder={`${type == "responsibilities" ? "Add a responsibility" : ""}${type == "requirements" ? "Add a requirement" : ""}${type == "benefits" ? "Add a benefit" : ""}`}
                                    onChange={(e) => handleHighlightChange(type, e.target.value, index)}
                                  />
                                  <Button variant="link" className={styles.fieldDelete} onClick={() => removeLine(type, index)}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x h-4 w-4"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg></Button>
                                </div>
                              ))}
                              <br></br>
                              <Button className={styles.whiteButton} onClick={() => addLine(type)}>+ Add Line</Button>
                            </div>
                          ))}
                          <Form.Group className='mt-5'>
                            <Form.Label
                              className={`${styles.formLabel} ${styles.copyWriterRow} mb-3`}
                            >
                              Additional Comments (Optional) {" "}
                            </Form.Label>

                            {/* Quill Editor */}
                            <ReactQuill
                              theme="snow"
                              placeholder="Any additional information you'd like to provide"
                              modules={quillModules}
                              className={`quillEditor`}
                              value={jobData.job_description?.additional_comments || ""}
                              onChange={(value) =>
                                setJobData({
                                  ...jobData,
                                  job_description: {
                                    ...jobData.job_description,
                                    additional_comments: value,
                                  },
                                })
                              }
                            />
                          </Form.Group>
                          {console.log()}
                        </div>
                      </Tab.Pane>
                    </Tab.Content>
                  </Tab.Container>
                </Form>
              </div>
              {copyWriter && (<>
                <>
                  <div className={`resumeOuter resumeAi light AiCopyWriter`}>
                    <div className="resumeTab AiCopywriter">
                      <div className="popup-Top-Head">
                        {/* <img src={AiIcon} alt="aiicon" className="icon" /> */}
                        <h4 className="head">
                          AI Job Description Generator
                        </h4>
                        <div class="close" onClick={() => setCopyWriter(false)}>+</div>
                      </div>
                      <div className="info mt-2 mb-2">

                        <p className="instructions">Let AI help you create a compelling job description. Provide 1-2 sentences about the role to get started.</p>
                      </div>
                      <div className="CreateForm row">
                        <div className="col-md-12 text-inputs d-flex flex-column">
                          <h6 className="inputTitle mt-2">Guidelines for AI</h6>
                          <textarea name="" id="" className="simpleInputs" value={guideLines}
                            placeholder="Guidelines for AI: eg.( We need a Front-End Developer with 7 years of experience. The candidate should have expertise in UI/UX design and API integration. Benefits include a 3% 401(k) match, a $10,000 yearly bonus, and comprehensive health insurance, including dental and vision coverage.)"
                            onChange={(e) => setGuideLines(e.target.value)}></textarea>
                        </div>
                        <div className="col-md-12 text-inputs d-flex flex-column mt-2">
                          <h6 className="inputTitle">Preferred Tone</h6>
                          <select
                            className="simpleInputs"
                            value={preferredTone}
                            onChange={(e) => setPreferredTone(e.target.value)}
                          >
                            <option key="" value="">Choose Preferred Tone</option>
                            <option key="Professional" value="Professional">Professional</option>
                            <option key="Conversational" value="Conversational">Conversational</option>
                            <option key="Humorous" value="Humorous">Humorous</option>
                          </select>
                        </div>
                        <div className="col-md-12 text-inputs d-flex flex-column mt-2">
                          <h6 className="inputTitle">Level of Detail</h6>
                          <select
                            className="simpleInputs"
                            value={levelOfDetail}
                            onChange={(e) => setLevelOfDetail(e.target.value)}
                          >
                            <option key="" value="">Choose Preferred Tone</option>
                            <option key="Brief" value="Brief">Brief</option>
                            <option key="Standard" value="Standard">Standard</option>
                            <option key="Detailed" value="Detailed">Detailed</option>
                            <option key="Highly Detailed" value="Highly Detailed">Highly Detailed</option>
                          </select>
                          <button className="aiGenerate" onClick={() => { aiJobPost() }}>
                            {aiLoading && (<>
                              <Spinner />
                            </>)}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-wand-sparkles h-3 w-3 mr-2"
                            >
                              <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72"></path>
                              <path d="m14 7 3 3"></path>
                              <path d="M5 6v4"></path>
                              <path d="M19 14v4"></path>
                              <path d="M10 2v2"></path>
                              <path d="M7 8H3"></path>
                              <path d="M21 16h-4"></path>
                              <path d="M11 3H9"></path>
                            </svg>Generate with AI
                          </button>
                        </div>

                      </div>
                    </div>

                  </div>
                </>
              </>)}
            </Modal.Body>
          </Modal>
        </>
      )}


    </>
  );
};

export default JobPostModal;
