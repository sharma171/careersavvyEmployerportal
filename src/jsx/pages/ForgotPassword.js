import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AiCompressIcon from "./Home/icons & images/aigif compressed.gif";
import { useDispatch } from "react-redux";

import CsLogo from "./Home/icons & images/careerSavvy.svg";

import styles from "./css/login.module.css";
import { IoLockClosedOutline } from "react-icons/io5";
import { VscKey } from "react-icons/vsc";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { TbMail } from "react-icons/tb";
import { FiLayout, FiMail, FiCheckCircle, FiClock, FiArrowLeft } from "react-icons/fi";

let securityIcon = (
  <svg
    color="#e9d5ff"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="lucide lucide-shield h-6 w-6 text-purple-200"
    data-lov-id="src/pages/ForgotPasswordPage.tsx:198:18"
    data-lov-name="Shield"
    data-component-path="src/pages/ForgotPasswordPage.tsx"
    data-component-line="198"
    data-component-file="ForgotPasswordPage.tsx"
    data-component-name="Shield"
    data-component-content="%7B%22className%22%3A%22h-6%20w-6%20text-purple-200%20mb-2%22%7D"
  >
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
  </svg>
);

const renderLogo = (className) => {
  return (
    <div className={`d-flex align-items-center gap-2 ${className}`}>
      <div>
        <img src={CsLogo} alt="career Savvy" style={{ height: "40px" }} className="icon" />
      </div>
      <div className={`${styles.logoText} ${className} m-0 p-0`}>CareerSavvy.ai</div>
    </div>
  );
};

function EmailSent({ email, setIsEmailSent, setEmail, setError }) {
  return (
    <div className={styles.esWrapper}>
      <div className={styles.esBgContainer}>
        <div className={styles.esCircleA} />
        <div className={styles.esCircleB} />
        <div className={styles.esCircleC} />
        <div className={styles.esCircleD} />
        <div className={styles.esRadialOverlay} />
      </div>
      <div className={styles.esContent}>
        <div className={styles.esCardBox}>
          <div className="d-flex justify-content-center w-100 mb-3">{renderLogo()}</div>
          <div>
            <div className="d-flex justify-content-center mb-4">
              <div className={styles.esIconWrap}>
                <div className={styles.esIconBg}>
                  <FiMail size={48} className="text-success" />
                </div>
                <div className={styles.esCheckWrap}>
                  <FiCheckCircle size={16} className="text-white" />
                </div>
              </div>
            </div>
            <h1 className="h3 fw-bold mb-3" style={{ color: "black" }}>
              Check your email 📧
            </h1>
            <p className="text-muted mb-1">We've sent a password reset link to</p>
            <div className="fw-bold p-3 rounded mb-3" style={{ color: "#111827", background: "#f9fafb" }}>
              {email}
            </div>
            <div className={styles.esExpireBox}>
              <FiClock size={20} className="text-muted" />
              <span>Link expires in 24 hours</span>
            </div>
          </div>
          <div className={styles.esInfoContainer}>
            <h4 className={styles.esInfoHeader}>Didn't receive the email?</h4>
            <ul className={styles.esList}>
              <li className={styles.esListItem}>
                <div className={styles.esListDot} />
                Check your spam/junk folder
              </li>
              <li className={styles.esListItem}>
                <div className={styles.esListDot} />
                Verify the email address is correct
              </li>
              <li className={styles.esListItem}>
                <div className={styles.esListDot} />
                Wait a few minutes for delivery
              </li>
            </ul>
          </div>
          <div className="d-grid gap-2">
            <button
              type="button"
              className="btn btn-outline-primary btn-lg"
              onClick={() => {
                setIsEmailSent(false);
                setEmail("");
                setError("");
              }}
            >
              Try another email
            </button>
            <Link to="/login" className="btn btn-link btn-lg">
              <FiArrowLeft size={16} className="me-2" />
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function ForgotPassword() {
  const { resetEmail } = useSelector((state) => state.profile);
  const [loaderAnimate, setLoaderAnimate] = useState(false);

  const [userEmail, setUserEmail] = useState("");
  const [showLoading, setShowLoading] = useState(false);
  const [linkSent, setLinkSent] = useState(true);
  const [message, setMessage] = useState(""); //State to display success or error messages
  const [successModal, setSuccessModal] = useState(false);

  const [errors, seterrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    setUserEmail(resetEmail);
  }, [resetEmail]);

  useEffect(() => {
    if (message) {
      setTimeout(() => {
        setMessage("");
      }, 5000);
    }
  }, [message]);

  const handleSubmit = async () => {
    let newErrors = {};
    if (!userEmail) {
      newErrors.username = "Email is required";
      return seterrors(newErrors);
    }
    setLoaderAnimate(true);

    const payload = {
      action: "send-password-reset",
      email: userEmail,
    };

    try {
      // Sending POST request
      const response = await fetch("https://user-authentication-api-v10-737421501165.us-east1.run.app", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      // Check if request was successful and update message
      if (response.ok) {
        setMessage("A password reset link has been sent to your email.");
        setSuccessModal(true); // Show success modal
        setLoaderAnimate(false);
      } else {
        setMessage(result.message+". Failed to send reset link." || "Failed to send reset link. Please try again.");
        setLoaderAnimate(false);
      }
    } catch (error) {
      setMessage("Error: Something went wrong. Please try again later.");
      setLoaderAnimate(false);
    }
  };

  const renderLeftSection = () => {
    return (
      <div className={`d-none d-lg-block w-100 ${styles.leftcontainer} ${styles.purpleleft}`}>
        <div className={`position-absolute ${styles.leftcontainerAnimations}`} style={{ zIndex: 1 }}></div>
        <div className={styles.circleLarge} />
        <div className={styles.circleMedium} />
        <div className={styles.circleSmall} />

        <div style={{ zIndex: 2, position: "relative" }}>
          <div className="pb-2 mb-4">{renderLogo(styles.logowhite)}</div>

          <div className="d-flex gap-4">
            <div className={`${styles.glassBoxBG} p-3 rounded-xl w-100`}>
              <div className={`${styles["text-lg"]} d-flex gap-2 flex-column fw-600`}>{securityIcon} 256-bit</div>
              <div className={styles["text-sm"]}>SSL Encryption</div>
            </div>
            <div className={`${styles.glassBoxBG} p-3 rounded-xl w-100`}>
              <div className={`${styles["text-lg"]} d-flex gap-2 flex-column fw-600`}>
                <IoLockClosedOutline style={{ height: 24, width: 24 }} />
                Secure
              </div>
              <div className={styles["text-sm"]}>Recovery</div>
            </div>
          </div>
          <div className="mt-1">
            <h1 className={`text-white fw-bold ${styles.headingText}`}>
              <span>Don't worry, </span>
              <span className={styles.grayColor}>it happens!</span>
            </h1>
          </div>
          <div className={`mt-3 ${styles["text-lg"]} ${styles.mainText}`}>
            We'll help you reset your password quickly and securely.
            <br /> Your account security is our top priority.
          </div>

          <div className="my-3">
            <ul className={styles.customlist}>
              <li>Enter your email address</li>
              <li>Check your inbox for secure link</li>
              <li>Create your new password</li>
            </ul>
          </div>
          <div className={`${styles.glassBoxBG} d-flex gap-3 flex-column p-4 rounded-xl`}>
            <div className={`d-flex gap-2 align-items-center fw-600`} style={{ color: "#e9d5ff" }}>
              <VscKey style={{ fontSize: "20px" }} /> Security First
            </div>
            <div>
              <div className="w-100 d-flex flex-column gap-3">
                <div className="d-flex align-items-center w-100">
                  <div className="w-100">• Instant recovery </div>
                  <div className="w-100">• Secure delivery</div>
                </div>
                <div className="d-flex align-items-center w-100">
                  <div className="w-100">• 24-hour expiry</div>
                  <div className="w-100">• One-time use</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderInput = (label, placeholder, key) => {
    return (
      <div className="mb-4">
        <label htmlFor={key}>{label}</label>
        <input
          onChange={(e) => {
            seterrors({});
            setUserEmail(e.target.value);
          }}
          value={userEmail}
          className={`${styles.inputBox} form-control`}
          id={key}
          placeholder={placeholder}
        />

        {errors[key] ? <div className={`fw-300 mt-1 text-danger ${styles["text-sm"]}`}>{errors[key]}</div> : <></>}
      </div>
    );
  };

  const renderRightSection = () => {
    return (
      <div
        className={`${styles.rightcontainer} d-flex flex-column align-items-center ${styles["w-lg-50"]}`}
        style={{ zIndex: 9 }}
      >
        <div className={styles.innerRight}>
          <div>
            <div className="d-block d-lg-none d-flex flex-column align-items-center mb-4 pb-1">
              <div className="mb-3">{renderLogo()}</div>
              <div
                className={`${styles["text-sm"]} p-3 rounded-xl text-center w-100`}
                style={{
                  color: "#4b5563",
                  backgroundImage: "linear-gradient(to right, hsl(221 83% 53% / .1) , rgb(147 51 234 / .1)",
                }}
              >
                Secure password recovery in 3 simple steps
              </div>
            </div>

            {message && <div className="alert alert-info">{message}</div>}

            <h2
              className={`h1 fw-bold ${styles.alignText} ${styles.headtext}`}
              style={{ color: "#000", letterSpacing: "-.025em" }}
            >
              Forgot your password? 🔐
            </h2>
          </div>
          <div style={{ fontSize: "18px", color: "#4b5563" }} className={`mb-4 mt-2 pt-1 ${styles.alignText}`}>
            No worries! Enter your email address and we'll send you a secure link to reset your password.
          </div>

          {renderInput("Email Address", "Enter your email", "username")}

          <button className={styles.actionBtn} onClick={handleSubmit}>
            <TbMail style={{ fontWeight: "bold", fontSize: "20px" }} />
            Send Reset Link
          </button>

          <div className={`${styles.blueBox} d-flex gap-2`}>
            <div>{securityIcon}</div>
            <div>
              <div className={styles.headingsec}> Security Note</div>
              <div className="mt-2">
                The reset link will expire in 24 hours for your security. Only the most recent link will be valid.
              </div>
            </div>
          </div>
          <div>
            <div className={`border rounded p-3 mt-4 ${styles.quickAccess}`}>
              <h4 className="h6 d-flex align-items-center gap-2 mb-3">
                <span className={styles.pulseDot} />
                Need help?
              </h4>
              <div className="row row-cols-2 g-3 text-muted small">
                <div className="col d-flex align-items-center gap-2">
                  <span className={styles.dotGreen} />
                  <span>Live chat support</span>
                </div>
                <div className="col d-flex align-items-center gap-2">
                  <span className={styles.dotBlue} />
                  <span>Email support</span>
                </div>
                <div className="col d-flex align-items-center gap-2">
                  <span className={styles.dotPurple} />
                  <span>Knowledge base</span>
                </div>
                <div className="col d-flex align-items-center gap-2">
                  <span className={styles.dotOrange} />
                  <span>Video tutorials</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.anotherSimpleContainer}>
            <div className={styles.anotherSimpleSection}>
              <a className={styles.anotherSimpleLink} href="#" onClick={() => navigate("/login")}>
                <MdOutlineKeyboardBackspace /> Back to Sign In
              </a>
            </div>

            <div className={styles.anotherSimpleSection}>
              <div className={styles.anotherSimpleSectionTitle}>Connect with us</div>
              <div className={styles.anotherSimpleSocialContainer}>
                <button
                  onClick={() =>
                    window.open(
                      "https://www.facebook.com/share/p/18Gv5rt2Lv/?mibextid=WC7FNe",
                      "_blank",
                      "noopener,noreferrer"
                    )
                  }
                  style={{ color: "#3870ec" }}
                  className={`${styles.anotherSimpleSocialButton} ${styles.anotherSimpleFacebook}`}
                  type="button"
                  aria-label="Follow us on Facebook"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={styles.anotherSimpleIcon}
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </button>

                <button
                  className={`${styles.anotherSimpleSocialButton} ${styles.anotherSimpleInstagram}`}
                  type="button"
                  style={{ color: "#dd3a83" }}
                  aria-label="Follow us on Instagram"
                  onClick={() =>
                    window.open(
                      "https://www.instagram.com/p/DDYRi7XxGgv/?igsh=bHlla2s1cGwzdHo0",
                      "_blank",
                      "noopener,noreferrer"
                    )
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={styles.anotherSimpleIcon}
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </button>

                <button
                  style={{ color: "#2857da" }}
                  className={`${styles.anotherSimpleSocialButton} ${styles.anotherSimpleLinkedin}`}
                  type="button"
                  aria-label="Follow us on LinkedIn"
                  onClick={() =>
                    window.open("https://www.linkedin.com/company/career-savvy-ai/", "_blank", "noopener,noreferrer")
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={styles.anotherSimpleIcon}
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect width="4" height="12" x="2" y="9" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </button>

                <button
                  style={{ color: "#dc2626" }}
                  className={`${styles.anotherSimpleSocialButton} ${styles.anotherSimpleYoutube}`}
                  type="button"
                  aria-label="Follow us on YouTube"
                  onClick={() =>
                    window.open("https://www.youtube.com/watch?v=Nkl5TiWo6Bs", "_blank", "noopener,noreferrer")
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={styles.anotherSimpleIcon}
                  >
                    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                    <path d="m10 15 5-3-5-3z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (successModal) {
    return (
      <EmailSent
        email={userEmail}
        setEmail={setUserEmail}
        setIsEmailSent={setSuccessModal}
        setError={() => seterrors({})}
      />
    );
  }

  return (
    <div className={`d-flex ${styles.mainContainer} ${styles.mainPurple} position-relative`}>
      <div
        className="position-absolute top-0 start-0 w-100 h-100 overflow-hidden pointer-events-none"
        style={{ zIndex: 1 }}
      >
        <div className={`position-absolute ${styles.shape1} ${styles.animatePulse}`} />
        <div className={`position-absolute ${styles.shape2} ${styles.animateBounce}`} />
        <div className={`position-absolute ${styles.shape3} ${styles.animatePulse}`} />
      </div>

      {renderLeftSection()}
      {renderRightSection()}
      {showLoading ? (
        <div className="preloader container">
          <div id="preloader">
            <div className="sk-three-bounce">
              <div className="sk-child sk-bounce1"></div>
              <div className="sk-child sk-bounce2"></div>
              <div className="sk-child sk-bounce3"></div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}

      {loaderAnimate && (
        <>
          <div className="LoaderAnimation">
            <div className="gptAnimate"></div>
            <img className="gptIcon" src={AiCompressIcon} alt="gptIcon" />
          </div>
        </>
      )}
    </div>
  );
}

export default ForgotPassword;
