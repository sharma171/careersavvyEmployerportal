import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { connect, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./register.css";
import InstructionIcon from "./instruction.png";
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
// import logo from '../../images/logo.png';
// import logotext from '../../images/logo-text.png';

function Login(props) {
  const [username, setUsername] = useState(""); // Renamed to username
  let errorsObj = { username: "", password: "" }; // Updated for username instead of email
  const [errors, setErrors] = useState(errorsObj);
  const [password, setPassword] = useState("");
  const [showLoading, setShowLoading] = useState(false);
  const [linkSent, setLinkSent] = useState(true);
  const location = useLocation;
  const dispatch = useDispatch();
  const nav = useNavigate();

  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
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

  function onLogin(e) {
    e.preventDefault();
    let error = false;
    const errorObj = { ...errorsObj };
    dispatch(setResetEmail(username));

    // Validate username
    if (username === "") {
      errorObj.username = "Username is Required";
      error = true;
    }

    // Validate password
    if (password === "") {
      errorObj.password = "Password is Required";
      error = true;
    }

    setErrors(errorObj);
    if (error) {
      setLinkSent(true);
      return;
    }

    dispatch(loadingToggleAction(true));
    dispatch(loginAction(username, password, nav)); // Pass username instead of email
  }

  // Toggle function for showing/hiding password
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const { apiToken, resetEmail } = useSelector((state) => state.profile);

  // Function to send POST request to verify the token
  const handleActivate = async () => {
    setShowLoading(true);
    try {
      const response = await fetch("https://us-east1-foursssolutions.cloudfunctions.net/send_activation_link_v2", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiToken}`,
        },
        body: JSON.stringify({
          task: "resend_activation_link",

          user_mail: username,
        }),
      });

      const data = await response.json();
      setTimeout(() => {
        if (response.ok) {
          setLinkSent(false);
          setShowLoading(false);
        } else {
        }
      }, 4000);
    } catch (error) {
      console.error("Error verifying token:", error);
    }
  };

  function pageReload() {
    location.reload();
  }

  return (
    <div className="login-form-bx">
      <div className="container-fluid">
        <div className="careerSavvyLogo d-flex" onClick={() => nav("/")}>
          <img src={CsLogo} alt="career Savvy" className="icon" />
          Career Savvy
        </div>
        <div className="row csavvy">
          <div className="col-lg-6 col-md-7 box-skew d-flex">
            <div className="authincation-content">
              <div className="mb-4">
                <h3 className="mb-1 font-w600" style={{ color: "#330170 !important", marginBottom: "10px !important" }}>
                  Welcome to Career Savvy
                </h3>
                <p className="">Sign in by entering information below</p>
              </div>

              {props.errorMessage === "Your account is not active. Please check your email for activation." ? (
                <div
                  className={`bg-red-300 text-red-900 border border-red-900 p-1 my-2 errorMessage popup ${
                    props.errorMessage === "User registered successfully" ? "popup" : ""
                  }`}
                  style={{ zIndex: "1000" }}
                >
                  {/* {props.errorMessage==="User registered successfully"?(<div className="close-button">+</div>):(<></>)} */}

                  {linkSent ? (
                    <>
                      {props.errorMessage === "Your account is not active. Please check your email for activation." ? (
                        <img src={InstructionIcon} alt="succesIcon" />
                      ) : (
                        <></>
                      )}
                      {props.errorMessage === "Your account is not active. Please check your email for activation." ? (
                        <span style={{ maxWidth: "250px", textAlign: "center" }}>{props.errorMessage}</span>
                      ) : (
                        <></>
                      )}
                      <Link className="button" onClick={handleActivate}>
                        Resend Link {">"}
                      </Link>
                    </>
                  ) : (
                    <>
                      <img src={SuccesIcon} alt="succesIcon" />
                      <span
                        className={`${linkSent === true ? "" : "green"}`}
                        style={{ maxWidth: "250px", textAlign: "center" }}
                      >
                        Mail has been sent to your email-id. Please check your email for activation.
                      </span>
                      <Link
                        to="/"
                        className={`button ${linkSent === true ? "" : "green"}`}
                        style={{ background: "green !important" }}
                      >
                        Go to Home {">"}
                      </Link>
                    </>
                  )}
                </div>
              ) : (
                <div className="bg-red-300 text-red-900 border-red-900 p-1 my-2">{props.errorMessage}</div>
              )}
              {props.successMessage && (
                <div className="bg-green-300 text-green-900 border-green-900 p-1 my-2">{props.successMessage}</div>
              )}
              <form onSubmit={onLogin}>
                <div className="form-group">
                  <label className="mb-2">
                    <strong>Username</strong> {/* Changed to Username */}
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter your email address"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  {errors.username && <div className="text-danger fs-12">{errors.username}</div>}
                </div>
                <div className="form-group" style={{ position: "relative" }}>
                  <label className="mb-2">
                    <strong>Password</strong>
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    {/* Eye Icon to toggle visibility */}
                    <span
                      onClick={togglePasswordVisibility}
                      style={{
                        position: "absolute",
                        top: "50%", // Adjust this value based on input padding
                        right: "10px", // Adjust for placement inside input
                        cursor: "pointer",
                        transform: "translate(0, -50%)",
                      }}
                    >
                      {showPassword ? "👁️" : "👁️‍🗨️"}
                    </span>
                  </div>
                  {errors.password && <div className="text-danger fs-12">{errors.password}</div>}
                </div>

                <div className="text-center">
                  <button type="submit" className="btn btn-primary btn-block" onClick={showLoader}>
                    Sign In
                  </button>
                </div>
              </form>
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

              <div className="new-account mt-2">
                <p className="mb-0">
                  Don't have an account?{" "}
                  <Link className="text-black" to="/page-register">
                    Sign up
                  </Link>
                </p>
              </div>
              <div className="new-account mt-2">
                <p className="mb-0">
                  <Link
                    className="text-black"
                    to="/page-forgot-password"
                    onClick={() => dispatch(setResetEmail(username))}
                  >
                    Forget Password
                  </Link>
                </p>
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-md-5 d-flex box-skew1">
            <div className="inner-content align-self-center">
              <Link to="/dashboard" className="login-logo">
                {/* <img src={logo} alt="" className="logo-icon me-2"/>
                                <img src={logotext} alt="" className="logo-text ms-1"/> */}
              </Link>
              <h2 className="m-b10 text-white">Welcome to CareerSavvy</h2>
              <p className="m-b40 text-white">Where Al Meets Ambition</p>
              <ul className="social-icons mt-4">
                <li>
                  <Link to={"https://www.facebook.com/share/p/18Gv5rt2Lv/?mibextid=WC7FNe"} target="blank">
                    <i className="fab fa-facebook-f"></i>
                  </Link>
                </li>
                {/* <li><Link to={"#"}><i className="fab fa-twitter"></i></Link></li> */}
                <li>
                  <Link to={"https://www.linkedin.com/company/career-savvy-ai/"} target="blank">
                    <i className="fab fa-linkedin-in" target="blank"></i>
                  </Link>
                </li>
                <li>
                  <Link to={"https://www.instagram.com/p/DDYRi7XxGgv/?igsh=bHlla2s1cGwzdHo0"} target="blank">
                    <i className="fab fa-instagram"></i>
                  </Link>
                </li>
                <li>
                  <Link to={"https://www.youtube.com/watch?v=Nkl5TiWo6Bs"} target="blank">
                    <i className="fab fa-youtube"></i>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
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
