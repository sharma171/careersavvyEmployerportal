import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { connect, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import InstructionIcon from "./instruction.png";
import CsLogo from "./Home/icons & images/careerSavvy.svg";
import { loadingToggleAction, loginAction } from "../../store/actions/AuthActions";
import { setOrgName } from "../../store/actions/actions";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import TwoFaPage from "./TwoFa";

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

function Login(props) {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showLoading, setShowLoading] = useState(false);
  const [message, setmessage] = useState("");
  const [linkSent, setLinkSent] = useState(true);
  const location = useLocation;
  const dispatch = useDispatch();
  const nav = useNavigate();
  const [errors, seterrors] = useState({});
  const navigate = useNavigate();
  const [is2fa, setis2fa] = useState(false);

  const [showPassword, setShowPassword] = useState(true);

  useEffect(() => {
    if (message) {
      setTimeout(() => {
        setmessage("");
      }, 10000);
    }
  }, [message]);

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

  function handleSubmit() {
    let newErrors = {};
    if (!formData.username) {
      newErrors.username = "Email is required";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    if (!formData.username || !formData.password) {
      setis2fa(false);
      return seterrors(newErrors);
    }
    showLoader();

    const payload = {
      action: "sign-in",
      username: formData.username,
      password: formData.password,
    };

    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    };

    // const rememberToken = "device-token-here";
    // if (rememberToken) {
    //   options.headers["X-Remember-Browser-Token"] = rememberToken;
    // }

    return fetch("https://user-authentication-api-v10-737421501165.us-east1.run.app", options)
      .then((res) => {
        if (!res.ok) {
          return res.json().then((err) => {
            throw new Error(err.message || "Login failed");
          });
        }
        return res.json();
      })
      .then((res) => {
        console.log("login Data",res.org_data);
        dispatch(setOrgName(res.org_data));
        localStorage.setItem("OrganisationData", JSON.stringify(res.org_data));
        if(res.requires_verification==false){
          dispatch(loginAction(payload, nav));
        }
        else{
          setis2fa(res);
        }
      })
      .catch((err) => {
        setmessage(err.message || "Failed to login!");
      });
  }

  const handleChange = (key, val) => {
    errors[key] = "";
    formData[key] = val;
    setFormData({ ...formData });
  };

  const renderLogo = (className) => {
    return (
      <div className={`d-flex align-items-center gap-2 ${className}`}>
        <div>
          <img src={CsLogo} alt="CareerSavvy" style={{ height: "40px" }} className="icon" />
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
              <span>Welcome Back to Your</span>
              <br />
              <span className={styles.grayColor}>Hiring Journey</span>
            </h1>
          </div>
          <div className={`mt-3 ${styles["text-lg"]} ${styles.mainText}`}>
            Continue managing your recruitment process <br />
            with AI-powered tools that help you find the <br />
            perfect candidates faster.
          </div>

          <div className="my-3">
            <ul className={styles.customlist}>
              <li>AI-Powered Matching Engine</li>
              <li>Advanced Analytics Dashboard</li>
              <li>Seamless Interview Management</li>
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
              "CareerSavvy.ai transformed our hiring process. We reduced time-to-hire by 60% and improved candidate
              quality significantly."
            </div>
            <div className={`${styles["text-sm"]} fw-500`}>— Sarah Chen, HR Director</div>
          </div>
        </div>
      </div>
    );
  };

  const renderInput = (label, placeholder, key, isPassword) => {
     const handleKeyDown = (e) => {
        if (isPassword && e.key === 'Enter') {
          handleSubmit();
        }
      };
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
            type={isPassword && showPassword ? "password" : "text"}
            placeholder={placeholder}
            onKeyDown={handleKeyDown}
          />
          {isPassword ? (
            <div
              style={{ cursor: "pointer", marginLeft: "-30px", color: "#a0a7b3" }}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <IoEyeOutline /> : <IoEyeOffOutline />}
            </div>
          ) : (
            <></>
          )}
        </div>
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
                Trusted by 50,000+ professionals worldwide
              </div>
            </div>
            {message && <div className="alert alert-info">{message}</div>}

            <h2
              className={`h1 fw-bold ${styles.alignText} ${styles.welcomeText}`}
              style={{ color: "#000", fontSize: "30px", letterSpacing: "-.025em" }}
            >
              Welcome Back! 👋
            </h2>
          </div>
          <div style={{ fontSize: "18px", color: "#4b5563" }} className={`mb-4 mt-2 pt-1 ${styles.alignText}`}>
            Sign in to your account to continue your journey
          </div>

          {renderInput("Email Address", "Enter your email", "username")}
          {renderInput("Password", "Enter your password", "password", true)}

          <button className={styles.actionBtn} onClick={handleSubmit}>
            Sign In <FaArrowRight />
          </button>

          <div>
            <div className={`border rounded p-3 mt-4 ${styles.quickAccess}`}>
              <h4 className="h6 d-flex align-items-center gap-2 mb-3">
                <span className={styles.pulseDot} />
                Quick Access
              </h4>
              <div className="row row-cols-2 g-3 text-muted small">
                <div className="col d-flex align-items-center gap-2">
                  <span className={styles.dotGreen} />
                  <span>Secure Login</span>
                </div>
                <div className="col d-flex align-items-center gap-2">
                  <span className={styles.dotBlue} />
                  <span>Auto Save</span>
                </div>
                <div className="col d-flex align-items-center gap-2">
                  <span className={styles.dotPurple} />
                  <span>24/7 Support</span>
                </div>
                <div className="col d-flex align-items-center gap-2">
                  <span className={styles.dotOrange} />
                  <span>Real-time Sync</span>
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
                  dispatch(setResetEmail(formData.username));
                  navigate("/page-forgot-password");
                }}
              >
                Forgot your password?
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

  if (is2fa) {
    return <TwoFaPage data={is2fa} setData={setis2fa} resend={handleSubmit} />;
  }

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

export default connect(mapStateToProps)(Login);
