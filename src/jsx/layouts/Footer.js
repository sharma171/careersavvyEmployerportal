import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import SidePopup from "../components/RecruiterComponents/Components/sidePopup";
import ToastSucces from "../components/RecruiterComponents/toastSucces";
import { setSidebarPopupType } from "../../store/actions/actions";
import "./navStyle.css";
const ContactUsComp = ({showContactus, setShowContactUs}) => {
  const userEmail = useSelector((state) => state.auth.auth);
  const { sidebarPopupTypes } = useSelector((state) => state.profile);
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [complaint, setComplaint] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState(""); // State to display the success message
  

  const toggleContactUs = () => setShowContactUs(!showContactus);

  // Handle form submission
  const handleSubmit = async () => {
    const payload = {
      userEmail,
      request_type: "Complaint",
      feedback_text: complaint,
      app_name: "Career-Savvy",
    };

    try {
      const response = await fetch(
        "https://us-east1-foursssolutions.cloudfunctions.net/all_user_query_forms_v2",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        // Show success message
        setFeedbackMessage("Your complaint has been submitted");
      } else {
        // Handle errors if needed
        setFeedbackMessage("There was an issue submitting your complaint. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setFeedbackMessage("An error occurred. Please try again later.");
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fade fade bd-example-modal-lg modal show"
      tabIndex={-1}
      style={{ display: "block", paddingRight: 11 }}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <div className="modal-title h4">Contact us</div>
            <button
              type="button"
              className="btn close lineheight1 btn"
              onClick={toggleContactUs}
            >
              <span>×</span>
            </button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-lg-6 mb-2">
                <div className="form-group mb-3">
                  <label className="text-label">
                    Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Your Name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-lg-6 mb-2">
                <div className="form-group mb-3">
                  <label className="text-label">
                    Last Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    className="form-control"
                    placeholder="Montana"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-lg-6 mb-2">
                <div className="form-group mb-3">
                  <label className="text-label">
                    Email Address <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    value={`${userEmail.email}`}
                    readOnly
                  />
                </div>
              </div>
              <div className="col-lg-6 mb-2">
                <div className="form-group mb-3">
                  <label className="text-label">
                    Phone Number <span className="required">*</span>
                  </label>
                  <input
                    type="number"
                    name="phoneNumber"
                    className="form-control"
                    placeholder="(+1)408-657-9007"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-lg-12 mb-3">
                <div className="form-group mb-3">
                  <label className="text-label">Complaint</label>
                  <textarea
                    className="form-control"
                    placeholder="Enter your complaint"
                    value={complaint}
                    onChange={(e) => setComplaint(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-danger light"
              onClick={toggleContactUs}
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
          {feedbackMessage && (
            <div className="alert alert-success mt-3" role="alert">
              {feedbackMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


const Footer = () => {
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const dispatch = useDispatch();
  const [showContactus, setShowContactUs] = useState(false);
  const [type, setType] = useState("");
  const { sidebarPopupType } = useSelector((state) => state.profile);
  const [message, setMessage] = useState("");
  const [showLoader, setShowLoader] = useState("");
  const [popupType,setPopupType] = useState("");
  const d = new Date();
  function closeAboutSection() {
    setShowTerms(false);
    setShowPrivacyPolicy(false);
  }

  const toggleTerms = () => {
    setShowTerms(!showTerms);
    if (showPrivacyPolicy) setShowPrivacyPolicy(false); // Close Privacy Policy if Terms is clicked
    // setTimeout(()=>{setShowTerms(false);}, 8000);
  };

  const togglePrivacyPolicy = () => {
    setShowPrivacyPolicy(!showPrivacyPolicy);
    if (showTerms) setShowTerms(false); // Close Terms if Privacy Policy is clicked
    // setTimeout(()=>{setShowPrivacyPolicy(false)}, 8000);
  };
  useEffect(()=>{
    if(popupType==""){
      dispatch(setSidebarPopupType(""));
    }
  },[popupType])
  useEffect(()=>{
    if(sidebarPopupType=="ContactUs"){
      setPopupType("ContactUs");
    }
    else{
      setPopupType("");
    }
  },[sidebarPopupType])
  const toggleContactUs = () => {
    // setShowContactUs(!showContactus);
    setPopupType("ContactUs");
  };

  return (
    <div className={`footer LayoutFooter text-light pt-2 sticky ${showTerms||showPrivacyPolicy?"active":""}`}>
      {showTerms||showPrivacyPolicy?(<>
      <button className="CloseBtn" onClick={closeAboutSection}>+</button>
      </>):(<></>)}
      <div className="container">
          {showTerms||showPrivacyPolicy?(<>
        
        </>):(<>
        <div className="row">
          {/* <div className="col text-center">
            <div className="footer-Links d-flex justify-content-center">
              <Link to="#" className={`${showTerms===true?"active":""}`} onClick={toggleTerms}>
                <p className="text-light mb-0 me-2">Terms & Conditions</p>
              </Link>
              <div className="separator mx-2">|</div>
              <Link to="#" className={`${showPrivacyPolicy===true?"active":""}`} onClick={togglePrivacyPolicy}>
                <p className="text-light mb-0">Privacy Policy</p>
              </Link>
              <div className="separator mx-2">|</div>
              <Link to="#" onClick={toggleContactUs}>
                <p className="text-light mb-0">Contact Us</p>
              </Link>
            </div>
          </div> */}
        </div>

        <div className="row mt-1">
          <div className="col text-center">
            <p>
              Copyright © Designed &amp; Developed by{" "}
              {/* <a  rel="noreferrer" className="text-light fw-bold"> */}
              TB Soft Solutions LLC
              {/* </a>{" "} */}
              {d.getFullYear()}
            </p>
          </div>
        </div>
        </>)}

        {showTerms && (
          <div className="row mt-4 footer height-adjust">
            <div className="col-12">
              <div className="card customCard text-dark">
                <div className="card-body">
                  <h4>Terms and Conditions for Our Portal</h4>
                  <p>
                    Welcome to Our Portal! These Terms and Conditions outline the rules and
                    regulations for your use of our website and services. By accessing or using our site,
                    you agree to comply with these terms.
                  </p>
                  <h5>1. Acceptance of Terms</h5>
                  <p>
                    By using our website, you confirm that you accept these Terms and Conditions and
                    agree to abide by them. If you do not agree with any part of these terms, you must
                    not use our site.
                  </p>
                  <h5>2. Use of Our Services</h5>
                  <p>
                    You agree to use our services for lawful purposes only and in a way that does not
                    infringe on the rights of others or restrict their use and enjoyment of our services.
                  </p>
                  <h5>3. Account Responsibilities</h5>
                  <p>
                    If you create an account on our site, you are responsible for maintaining the
                    confidentiality of your account details and for all activities that occur under your
                    account. You agree to notify us immediately of any unauthorized use of your
                    account.
                  </p>
                  <h5>4. Intellectual Property</h5>
                  <p>
                    All content on our website, including text, graphics, logos, and software, is the
                    property of Our Portal or our licensors and is protected by copyright and other
                    intellectual property laws. You may not reproduce, distribute, or create derivative
                    works without our written consent.
                  </p>
                  <h5>5. Limitation of Liability</h5>
                  <p>
                    To the fullest extent permitted by law, Our Portal shall not be liable for any
                    indirect, incidental, or consequential damages arising from your use of our site or
                    services.
                  </p>
                  <h5>6. Changes to Terms</h5>
                  <p>
                    We reserve the right to modify these Terms and Conditions at any time. Any
                    changes will be effective immediately upon posting the revised terms on our
                    website.
                  </p>
                  <h5>7. Contact Information</h5>
                  <p>
                    If you have any questions about these Terms and Conditions, please contact us at
                    contact@careersavvy.ai.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {showPrivacyPolicy && (
          <div className="row mt-4 footer height-adjust">
              <div className="card customCard text-dark">
                <div className="card-body">
                  <h4>Privacy Policy for Our Portal</h4>
                  <p>
                    At Our Portal, we are committed to protecting your privacy. This Privacy Policy
                    outlines how we collect, use, and protect your information when you use our
                    website and services.
                  </p>
                  <h5>1. Information We Collect</h5>
                  <p>
                    • Personal Information: When you register, apply for jobs, or contact us, we may
                    collect personal information such as your name, email address, phone number, and
                    resume.
                    • Usage Data: We collect information about how you interact with our site,
                    including your IP address, browser type, jobs applied, and pages visited.
                  </p>
                  <h5>2. How We Use Your Information</h5>
                  <p>
                    • Job Applications: To facilitate job applications and build connections.
                    • Job Matching: To connect you with job opportunities that align with your skills
                    and preferences.
                    • Application Processing: To facilitate your job applications and communicate
                    with vendors on your behalf.
                    • Communication: To send you updates, career roadmaps, and respond to inquiries.
                    • Improvement of Services: To analyze usage patterns and improve our services and
                    user experience.
                  </p>
                  <h5>3. Sharing Your Information</h5>
                  <p>
                    • With Vendors: We may share your information with potential vendors who are
                    hiring for job openings you apply for.
                    • Service Providers: We may use third-party services to help operate our website
                    and services, who may have access to your data under strict confidentiality agreements.
                  </p>
                  <h5>4. Data Security</h5>
                  <p>
                    We implement a variety of security measures to protect your personal information
                    from unauthorized access, disclosure, alteration, or destruction. However, please be
                    aware that no method of transmission over the internet is 100% secure.
                  </p>
                  <h5>5. Third-Party Links</h5>
                  <p>
                    Our site may contain links to third-party websites. We are not responsible for their
                    content or privacy practices.
                  </p>
                  <h5>6. ChatGPT</h5>
                  <p>
                    We may utilize AI technologies, including ChatGPT, to provide support and answer
                    inquiries. Please note that while we strive for accuracy, we are not responsible for
                    any inaccuracies or misunderstandings that may arise from the use of these AI tools.
                  </p>
                  <h5>7. Your Rights</h5>
                  <p>
                    You have the right to:
                    • Access your personal information.
                    • Request correction of inaccurate information.
                    • Request deletion of your personal information.
                    • Choose not to receive marketing communications.
                  </p>
                  <h5>8. Cookies</h5>
                  <p>
                    Our website uses cookies to enhance your experience. You can choose to accept or
                    decline cookies through your browser settings.
                  </p>
                  <h5>9. Changes to This Privacy Policy</h5>
                  <p>
                    We may update this Privacy Policy from time to time. We will notify you of any
                    changes by posting the new policy on our website with a new effective date.
                  </p>
                  <h5>10. Contact Us</h5>
                  <p>
                    If you have any questions about this Privacy Policy, please contact us at
                    contact@careersavvy.ai.
                  </p>
                </div>
              </div>
          </div>
        )}
        {popupType!=="" && (<>
          {/* <ContactUsComp showContactus={showContactus} setShowContactUs={setShowContactUs}/> */}
          <SidePopup popupType={popupType} setPopupType={setPopupType} setShowLoader={setShowLoader} setMessage={setMessage} setType={setType} />
        </>)}
          <ToastSucces type={type} setType={setType} message={message} setMessage={setMessage}/>
         
      </div>
    </div>
  );
};

export default Footer;
