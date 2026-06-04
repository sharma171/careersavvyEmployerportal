import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import CsLogo from "./Home/icons & images/careerSavvy.svg";

import styles from "./css/login.module.css";
import { IoEyeOffOutline, IoEyeOutline, IoLockClosedOutline } from "react-icons/io5";
import { VscKey } from "react-icons/vsc";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { TbMail } from "react-icons/tb";
import { FaArrowRight } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";

const decodeToken = (token) => {
  try {
    return jwtDecode(token, { header: true });
  } catch (e) {
    return null;
  }
};

function ResetPasswordModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  if (!isOpen) return null;
  return (
    <>
      <div className={`modal-backdrop fade show ${styles.backdrop}`} />
      <div className="modal d-block" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content position-relative">
            {/* <button
              type="button"
              className={`btn-close position-absolute top-0 end-0 p-3 ${styles.closeButton}`}
              aria-label="Close"
              onClick={onClose}
            /> */}
            <div className="modal-header border-0 flex-column">
              <div className={`mx-auto mb-3 ${styles.iconCircle}`}>🎉</div>

              <h5 className="h3 ">Password Updated!</h5>
              <p>Your new password has been set successfully. You can now sign in with your updated credentials.</p>

              <button
                type="button"
                className={styles.actionBtn}
                style={{ background: "#9333ea" }}
                onClick={() => navigate("/login")}
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function ForgotPassword() {
  const [loaderAnimate, setLoaderAnimate] = useState(false);
  const [formData, setFormData] = useState({});

  const [showLoading, setShowLoading] = useState(false);
  const [message, setMessage] = useState(""); //State to display success or error messages
  const [successModal, setSuccessModal] = useState(false);
  const [token, setToken] = useState("");
  const [showPassword, setShowPassword] = useState({});
  const [email, setEmail] = useState("");

  const [errors, seterrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenFromUrl = queryParams.get("token");
    let email = decodeToken(tokenFromUrl);
    if (!email) {
      navigate("/login");
    }
    setEmail(email);
    setToken(tokenFromUrl);
  }, [location.search]);

  useEffect(() => {
    if (message) {
      setTimeout(() => {
        setMessage("");
      }, 10000);
    }
  }, [message]);

  const handleSubmit = async () => {
    let newErrors = {};
    if (!formData.password) {
      newErrors.password = "Password is required";
      return seterrors(newErrors);
    }

    if (formData.cpassword != formData.password) {
      newErrors.cpassword = "Passwords do not match";

      return seterrors(newErrors);
    }

    setLoaderAnimate(true);
    setShowLoading(true);

    const payload = {
      action: "update-password",
      token: token,
      email: email,
      new_password: formData.cpassword,
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

      setShowLoading(false);

      if (response.ok) {
        setMessage("Your new password has been updated");
        setSuccessModal(true); // Show success modal when successful
      } else {
        setMessage(result.error || "Failed to update your password. Please try again.");
      }
    } catch (error) {
      setShowLoading(false);
      setMessage("Error: Something went wrong. Please try again later.");
    }
  };

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

  const handleChange = (key, val) => {
    errors[key] = "";
    formData[key] = val;
    setFormData({ ...formData });
  };

  const renderLeftSection = () => {
    return (
      <div className={`d-none d-lg-block w-100 ${styles.leftcontainer} ${styles.purpleleft}`}>
        <div className={`position-absolute ${styles.leftcontainerAnimations}`} style={{ zIndex: 1 }}></div>
        <div className={styles.circleLarge} />
        <div className={styles.circleMedium} />
        <div className={styles.circleSmall} />

        <div style={{ zIndex: 2, position: "relative" }} className="d-flex flex-column justify-content-center h-100">
          <div className="pb-2 mb-4">{renderLogo(styles.logowhite)}</div>

          <div className="mt-1">
            <h1 className={`text-white fw-bold ${styles.headingText}`}>Reset Your Password</h1>
          </div>
          <div className={`mt-3 ${styles["text-lg"]} ${styles.mainText}`}>
            You're almost there!
            <br />
            Create a new secure password for your account
            <br />
            and get back to managing your hiring process.
          </div>

          <div className="my-3">
            <ul className={styles.customlist}>
              <li>Enter your email address</li>
              <li>Check your inbox for secure link</li>
              <li>Create your new password</li>
            </ul>
          </div>
        </div>
      </div>
    );
  };

  const renderInput = (label, placeholder, key) => {
    return (
      <div className="mb-4">
        <label htmlFor={key}>{label}</label>
        <div className="d-flex align-items-center">
          <input
            onChange={(e) => {
              handleChange(key, e.target.value);
            }}
            value={formData[key]}
            className={`${styles.inputBox} form-control`}
            id={key}
            type={!showPassword[key] ? "password" : "text"}
            placeholder={placeholder}
          />
          <div
            style={{ cursor: "pointer", marginLeft: "-30px", color: "#a0a7b3" }}
            onClick={() => setShowPassword({ ...showPassword, [key]: !showPassword[key] })}
          >
            {showPassword[key] ? <IoEyeOutline /> : <IoEyeOffOutline />}
          </div>
        </div>

        {errors[key] ? <div className={`fw-300 mt-1 text-danger ${styles["text-sm"]}`}>{errors[key]}</div> : <></>}
      </div>
    );
  };

  const renderRightSection = () => {
    return (
      <div
        className={`${styles.rightcontainer} d-flex flex-column align-items-center w-100 justify-content-center`}
        style={{ zIndex: 9 }}
      >
        <div className={styles.innerRight}>
          <div>
            <div className="d-block d-lg-none d-flex flex-column align-items-center mb-4 pb-1">
              <div className="mb-3">{renderLogo()}</div>
            </div>

            {message && <div className="alert alert-info">{message}</div>}

            <h2
              className={`h1 fw-bold ${styles.alignText} ${styles.headtext}`}
              style={{ color: "#000", letterSpacing: "-.025em" }}
            >
              Reset Your Password
            </h2>
          </div>
          <div style={{ fontSize: "18px", color: "#4b5563" }} className={`mb-4 mt-2 pt-1 ${styles.alignText}`}>
            Enter your new password below
          </div>

          {renderInput("New Password", "Enter your new password", "password")}
          {renderInput("Confirm New Password", "Confirm your new password", "cpassword")}

          <button className={styles.actionBtn} style={{ background: "#9333ea" }} onClick={handleSubmit}>
            Update Password
            <FaArrowRight />
          </button>

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

      <ResetPasswordModal isOpen={successModal} onClose={() => setSuccessModal(false)} />
    </div>
  );
}

export default ForgotPassword;
