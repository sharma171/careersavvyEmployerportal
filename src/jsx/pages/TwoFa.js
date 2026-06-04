import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { connect, useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CsLogo from "./Home/icons & images/careerSavvy.svg";
import { loadingToggleAction, loginAction } from "../../store/actions/AuthActions";

import SuccesIcon from "../../images/succesIcon.svg";
import {
  setProfileData,
  setTechSkills,
  setFileResume,
  setActivities,
  setJobsApplied,
  setJobsList,
  setMembershipData,
  setApiTokenReady,
  setResetEmail,
} from "../../store/actions/actions";

import styles from "./css/login.module.css";
import { FaArrowRight, FaArrowTrendUp, FaStar } from "react-icons/fa6";
import { FiUsers } from "react-icons/fi";

function TwoFaPage(props) {
  const reduxData = useSelector((state) => state.auth);

  let errorMessage = reduxData?.errorMessage;

  const [showLoading, setShowLoading] = useState(false);
  const dispatch = useDispatch();
  const nav = useNavigate();

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [canResend, setCanResend] = useState(true);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef([]);
  const [message, setmessage] = useState("");

  let currentCode = code.join("");

  useEffect(() => {
    if (currentCode.length === 6) {
      handleVerify();
    }
  }, [currentCode]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!props?.data?.email) {
        props.setData(null);
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [props?.data?.email]);

  useEffect(() => {
    if (errorMessage) {
      setmessage(errorMessage);
      setTimeout(() => {
        setmessage("");
      }, 5000);
    }
  }, [errorMessage]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendCooldown]);

  function showLoader() {
    setShowLoading(true);
    dispatch(setProfileData({}));
    dispatch(setTechSkills([]));
    dispatch(setFileResume(""));
    dispatch(setActivities([]));
    dispatch(setJobsApplied([]));
    dispatch(setJobsList([]));
    dispatch(setMembershipData([]));
    dispatch(setApiTokenReady(false));
    setTimeout(() => {
      setShowLoading(false);
    }, 4000);
  }

  const handleInputChange = (value, idx) => {
    if (!/^\d?$/.test(value)) return;

    const newCode = [...code];
    newCode[idx] = value;
    setCode(newCode);
    if (value && idx < 5) inputRefs.current[idx + 1].focus();
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !code[idx] && idx > 0) {
      inputRefs.current[idx - 1].focus();
    }
  };

  const handleVerify = async () => {
    if (code.some((c) => c === "")) return;

    setIsLoading(true);

    try {
      const verificationCode = code.join("");

      const payload = {
        action: "verify-code",
        email: props?.data?.email,
        verification_code: verificationCode,
      };
      showLoader();
      dispatch(loadingToggleAction(true));
      dispatch(loginAction(payload, nav));
    } catch (err) {
      setmessage(err.message || "something went wrong!");
      return { error: err.message };
    } finally {
      setIsLoading(false);
      setCode(["", "", "", "", "", ""]);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setIsResending(true);
    setCanResend(false);
    setResendCooldown(30);

    props?.resend?.();
    await new Promise((r) => setTimeout(r, 1000));

    setCode(["", "", "", "", "", ""]);
    inputRefs.current[0].focus();
    setIsResending(false);
  };

  const renderOtpInput = () => {
    return (
      <div className="mb-4">
        <label htmlFor="otp" className="form-label mb-2">
          Verification Code
        </label>
        <div className="d-flex justify-content-center mb-3">
          <div className="d-flex gap-2 justify-content-center">
            {code.map((digit, idx) => (
              <input
                key={idx}
                onFocus={(e) => e.target.select()}
                onPaste={(e) => {
                  e.preventDefault();
                  const pasteData = e.clipboardData.getData("Text").trim();
                  const chars = pasteData.split("").filter((c) => /^\d$/.test(c));
                  if (chars.length === 0) return;

                  setCode((prev) => {
                    const newCode = [...prev];
                    chars.forEach((char, i) => {
                      const pos = idx + i;
                      if (pos < newCode.length) {
                        newCode[pos] = char;
                      }
                    });
                    return newCode;
                  });

                  const lastPos = Math.min(idx + chars.length - 1, code.length - 1);
                  inputRefs.current[lastPos]?.focus();
                }}
                type="text"
                style={{ width: "48px", border: "1px solid #e6e8eb" }}
                inputMode="numeric"
                value={digit}
                ref={(el) => (inputRefs.current[idx] = el)}
                onChange={(e) => handleInputChange(e.target.value, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                className={`${styles.inputBox} d-flex align-items-center justify-content-center fw-bold text-center rounded`}
              />
            ))}
          </div>
        </div>
        <div className="d-grid mb-2">
          <button
            type="button"
            className={styles.actionBtn}
            style={
              isLoading || code.some((c) => c === "")
                ? { background: "#89a9f5", color: "#f2f5fd", cursor: "not-allowed" }
                : {}
            }
            onClick={handleVerify}
            disabled={isLoading || code.some((c) => c === "")}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Verifying...
              </>
            ) : (
              <>
                Verify Code <FaArrowRight />
              </>
            )}
          </button>
        </div>
        <div className="text-center">
          <button
            type="button"
            className="btn btn-link small p-0"
            onClick={handleResend}
            disabled={!canResend || isResending}
          >
            <div className={`mt-3 ${styles.anotherSimpleSectionTitle}`}>
              Didn't receive the code?{" "}
              <span style={{ color: "#3e74ed" }}>
                {isResending ? "Sending..." : canResend ? "Resend Code" : `Resend in ${resendCooldown}s`}
              </span>
            </div>
          </button>
        </div>
      </div>
    );
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

  const renderLeftSection = () => {
    return (
      <div className={`d-none d-lg-block w-100 ${styles.leftcontainer}`}>
        <div className={`position-absolute ${styles.leftcontainerAnimations}`} style={{ zIndex: 1 }}></div>
        <div className={styles.circleLarge} />
        <div className={styles.circleMedium} />
        <div className={styles.circleSmall} />

        <div style={{ zIndex: 2, position: "relative" }}>
          <div className="pb-2 mb-4">{renderLogo(styles.logowhite)}</div>

          <div className="d-flex gap-4">
            <div className={`${styles.glassBoxBG} p-3 rounded-xl w-100`}>
              <div className={`${styles["text-lg"]} d-flex align-items-center gap-2 mb-2 fw-600`}>
                <FiUsers />
                50K+
              </div>
              <div className={styles["text-sm"]}>Active Users</div>
            </div>
            <div className={`${styles.glassBoxBG} p-3 rounded-xl w-100`}>
              <div className={`${styles["text-lg"]} d-flex align-items-center gap-2 mb-2 fw-600`}>
                <FaArrowTrendUp />
                95%
              </div>
              <div className={styles["text-sm"]}>Success Rate</div>
            </div>
          </div>
          <div className="mt-1">
            <h1 className={`text-white fw-bold ${styles.headingText}`}>
              <span>Secure Access,</span>
              <span className={styles.grayColor}> Almost There!</span>
            </h1>
          </div>
          <div className={`mt-3 ${styles["text-lg"]} ${styles.mainText}`}>
            We're taking extra steps to keep your account secure.
            <br /> Just one more verification step to go.
          </div>

          <div className="my-3">
            <ul className={styles.customlist}>
              <li>Bank-Level Security</li>
              <li>End-to-End Encryption</li>
              <li>Multi-Factor Protection</li>
            </ul>
          </div>
          <div className={`${styles.glassBoxBG} d-flex gap-2 flex-column p-4 rounded-xl`}>
            <div className="d-flex gap-1">
              <FaStar style={{ color: "#facc15" }} />
              <FaStar style={{ color: "#facc15" }} />
              <FaStar style={{ color: "#facc15" }} />
              <FaStar style={{ color: "#facc15" }} />
              <FaStar style={{ color: "#facc15" }} />
            </div>

            <div className={`${styles.rateText} fw-300`}>
              "The security features give me complete peace of mind. I know my data is protected with the best
              technology available."
            </div>
            <div className={`${styles["text-sm"]} fw-500`}>— Michael Rodriguez, Security Director</div>
          </div>
        </div>
      </div>
    );
  };

  const renderRightSection = () => {
    return (
      <div
        className={`${styles.rightcontainer} d-flex flex-column align-items-center ${styles["w-lg-50"]}`}
        style={{ zIndex: 9 }}
      >
        {props.successMessage && (
          <div className="bg-green-300 text-green-900 border-green-900 p-1 my-2">{props.successMessage}</div>
        )}
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
                Secure two-factor authentication
              </div>
            </div>

            {message && <div className="alert alert-info">{message}</div>}

            <h2
              className={`h1 fw-bold ${styles.alignText} ${styles.welcomeText}`}
              style={{ color: "#000", fontSize: "30px", letterSpacing: "-.025em" }}
            >
              Enter 2FA Code 🔐
            </h2>
          </div>
          <div style={{ fontSize: "18px", color: "#4b5563" }} className={`mb-4 mt-2 pt-1 ${styles.alignText}`}>
            We've sent a 6-digit verification code to your registered email. Please enter it below to continue.
          </div>

          {renderOtpInput()}

          <div>
            <div className={`border rounded p-3 mt-4 ${styles.quickAccess}`}>
              <h4 className="h6 d-flex align-items-center gap-2 mb-3">
                <span className={styles.pulseDot} />
                Security Features
              </h4>
              <div className="row row-cols-2 g-3 text-muted small">
                <div className="col d-flex align-items-center gap-2">
                  <span className={styles.dotGreen} />
                  <span>256-bit Encryption</span>
                </div>
                <div className="col d-flex align-items-center gap-2">
                  <span className={styles.dotBlue} />
                  <span>Secure Delivery</span>
                </div>
                <div className="col d-flex align-items-center gap-2">
                  <span className={styles.dotPurple} />
                  <span>Time-limited Code</span>
                </div>
                <div className="col d-flex align-items-center gap-2">
                  <span className={styles.dotOrange} />
                  <span>Single Use Only</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.anotherSimpleContainer}>
            <div className={styles.anotherSimpleSection}>
              <a
                className={styles.anotherSimpleLink}
                href="#"
                onClick={() => {
                  props?.setData?.(null);
                }}
              >
                Back to Sign In
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
    <div className={`d-flex ${styles.mainContainer} position-relative`}>
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
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    errorMessage: state.auth.errorMessage,
    successMessage: state.auth.successMessage,
    showLoading: state.auth.showLoading,
  };
};

export default connect(mapStateToProps)(TwoFaPage);
