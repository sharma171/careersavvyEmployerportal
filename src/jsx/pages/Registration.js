import React, { useState,useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';
import SuccesIcon from "../../images/succesIcon.svg";

import LoaderIcon from "../components/Dashboard/Home/loading-gif.gif";
import "./register.css";
import {
  loadingToggleAction,
  signupAction,
} from '../../store/actions/AuthActions';

function Register(props) {
  const [firstName, setFirstName] = useState(' ');
  const [lastName, setLastName] = useState(' ');
  const [country, setCountry] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showLoader, setShowLoader ] = useState(false);
  
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  // Toggle function for showing/hiding password
    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
  };

  // Extended errors object to include all fields
  let errorsObj = { firstName: '', lastName: '', country: '', username: '', email: '', password: '' };
  const [errors, setErrors] = useState(errorsObj);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  function openLoader() {
    setShowLoader(true);
    setTimeout(()=> {
      setShowLoader(false);
    },10000)
  }
  useEffect(() => {
    if (props.errorMessage === "User registered successfully") {
      setShowLoader(false);
      // Redirect after 5 seconds
      const timer = setTimeout(() => {
        navigate("/login");
      }, 5000);

      // Cleanup the timer in case the component unmounts before 5 seconds
      return () => clearTimeout(timer);
    }
    
  }, [props.errorMessage, navigate]);

  // Validate form inputs
  function validateInputs() {
    let error = false;
    const errorObj = { ...errorsObj };

    // if (firstName === '') {
    //   errorObj.firstName = 'First name is required';
    //   error = true;
    // }
    // if (lastName === '') {
    //   errorObj.lastName = 'Last name is required';
    //   error = true;
    // }
    if (country === '') {
      errorObj.country = 'Country is required';
      error = true;
    }
    // if (username === '') {
    //   errorObj.username = 'Username is required';
    //   error = true;
    // }
    if (email === '') {
      errorObj.email = 'Email is required';
      error = true;
    }
    if (password === '') {
      errorObj.password = 'Password is required';
      error = true;
    }

    setErrors(errorObj);
    return error;
  }


  function onSignUp(e) {
    e.preventDefault();
    const error = validateInputs();

    // If validation fails, stop the submission
    if (error) return;

    // Dispatch the loading action and signup action
    dispatch(loadingToggleAction(true));
    dispatch(
      signupAction(
        firstName,
        lastName,
        country,
        username,
        email,
        password,
        navigate
      )
    );
  }
  

  return (
    <>
      <div className="login-form-bx">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-6 col-md-7 box-skew d-flex">
              <div className="authincation-content">
                <div className="mb-4">
                  <h3 className="mb-1 font-w600">Welcome to job portal</h3>
                  <p>Sign up by entering information below</p>
                </div>
                {props.errorMessage && (
                  <div className={`bg-red-300 text-red-900 border border-red-900 p-1 my-2 ${props.errorMessage==="User registered successfully"?"popup":""}`} style={{zIndex:"1000"}}>
                    {/* {props.errorMessage==="User registered successfully"?(<div className="close-button">+</div>):(<></>)} */}
                    {props.errorMessage==="User registered successfully"?(<img src={SuccesIcon} alt="succesIcon" />):(<></>)}
                    {props.errorMessage==="User registered successfully"?(<span style={{maxWidth:'250px',textAlign:'center'}}>Please check your email for the activation link and follow the instructions to activate your account.</span>):(<></>)}
                    {props.errorMessage==="An error occurred"?(<span style={{maxWidth:'250px',textAlign:'center'}}>Oops! It looks like this email is already registered.</span>):(<></>)}
                  </div>
                )}
                {props.successMessage && (
                  <div className="bg-green-300 text-green-900 border border-green-900 p-1 my-2">
                    <img src={SuccesIcon} alt="succesIcon" />
                    {props.successMessage}
                  </div>
                )}
                <form onSubmit={onSignUp}>
                  {/* <div className="row">
                    <div className="col-md-6 form-group">
                      <label className="mb-2">
                        <strong>First name</strong>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={firstName}
                        name="firstName"
                        placeholder="First name"
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                      {errors.firstName && (
                        <div className="text-danger fs-12">{errors.firstName}</div>
                      )}
                    </div>
                    <div className="col-md-6 form-group">
                      <label className="mb-2">
                        <strong>Last Name</strong>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={lastName}
                        name="lastName"
                        placeholder="Last Name"
                        onChange={(e) => setLastName(e.target.value)}
                      />
                      {errors.lastName && (
                        <div className="text-danger fs-12">{errors.lastName}</div>
                      )}
                    </div>
                  </div> */}
                  <div className="row">
                    <div className="col-md-12 form-group">
                      <label className="mb-2">
                        <strong>Email</strong>
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        value={email}
                        placeholder="Email"
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setUsername(e.target.value);
                        }}
                      />
                      {errors.email && (
                        <div className="text-danger fs-12">{errors.email}</div>
                      )}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12 form-group" style={{position:"relative"}}>
                      <label className="mb-2">
                        <strong>Password</strong>
                      </label>
                      <div style={{position:"relative"}}>
                        <input
                          type={showPassword ? "text" : "password"}
                          className="form-control"
                          value={password}
                          placeholder="Password"
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        {errors.password && (
                          <div className="text-danger fs-12">{errors.password}</div>
                        )}
                        <span
                            onClick={togglePasswordVisibility}
                            style={{
                                position: "absolute",
                                top: "50%",  // Adjust this value based on input padding
                                right: "18px", // Adjust for placement inside input
                                cursor: "pointer",
                                transform: "translate(0, -50%)"
                            }}
                        >
                            {showPassword ?  '👁️' : '👁️‍🗨️'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12 form-group">
                      <label className="mb-2">
                        <strong>Country</strong>
                      </label>
                      <select
                        type="text"
                        className="form-control"
                        value={country}
                        name="country"
                        placeholder="Enter country"
                        onChange={(e) => setCountry(e.target.value)}
                      >
                        <option value="">Select Country</option>
                        <option value="USA">USA</option>
                        <option value="India">India</option>
                      </select>
                      {errors.country && (
                        <div className="text-danger fs-12">{errors.country}</div>
                      )}
                    </div>
                  </div>
                  <div className="text-center mt-4">
                    <button type="submit" className="btn btn-primary btn-block" onClick={openLoader}>
                      Sign Up
                    </button>
                  </div>
                </form>
                <div className="new-account mt-3">
                  <p>
                    Already have an account?{" "}
                    <Link className="text-black" to="/login">
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-5 d-flex box-skew1">
              <div className="inner-content align-self-center">
                <Link to="/dashboard" className="login-logo">
                  {/* Add logos here */}
                </Link>
                <h2 className="m-b10 text-white">Sign Up Now</h2>
                <p className="m-b40 text-white">
                Where Al Meets Ambition
                </p>
                <ul className="social-icons mt-4">
                  <li><Link to={"https://www.facebook.com/share/p/18Gv5rt2Lv/?mibextid=WC7FNe"} target='blank'><i className="fab fa-facebook-f"></i></Link></li>
                                                  {/* <li><Link to={"#"}><i className="fab fa-twitter"></i></Link></li> */}
                                                  <li><Link to={"https://www.linkedin.com/company/career-savvy-ai/"} target='blank'><i className="fab fa-linkedin-in"></i></Link></li>
                                                  <li>
                                                      <Link to={"https://www.instagram.com/p/DDYRi7XxGgv/?igsh=bHlla2s1cGwzdHo0"} target='blank'>
                                                          <i className="fab fa-instagram"></i>
                                                      </Link>
                                                  </li>
                                                  <li>
                                                      <Link to={"https://www.youtube.com/watch?v=Nkl5TiWo6Bs"} target='blank'>
                                                          <i className="fab fa-youtube"
                                                              ></i>
                                                      </Link>
                                                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showLoader && (<div className="checkout-loader">
            <img src={LoaderIcon} alt="loader" />
         </div>)}
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    errorMessage: state.auth.errorMessage,
    successMessage: state.auth.successMessage,
    showLoading: state.auth.showLoading,
  };
};

export default connect(mapStateToProps)(Register);
