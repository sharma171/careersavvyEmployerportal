import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from "react-router-dom";
import { isMobile, isTablet, isBrowser } from 'react-device-detect';
import { setApiToken, setProductCode, setShowPro, setMembershipData, setApiTokenReady, setFileResume, setSubscriptionNextAction, SetFeaturesToBlock, setSidebarPopupType  } from '../../../store/actions/actions';
import Payment from './redirection-gif.gif';
import "../navStyle.css";

import { Link, useNavigate } from "react-router-dom";
/// Scroll
//import PerfectScrollbar from "react-perfect-scrollbar";
import LogoutPage from './Logout';
/// Image
import Icons from "./proIcon.svg";
import ProIcon from "./proIcon.svg";
import profile from "../../../images/profile/profile.svg";
import { Dropdown } from "react-bootstrap";
import JoinRightArr from "./rightArrow.png";
import { register } from "react-scroll/modules/mixins/scroller";
import { PhoneCall } from "lucide-react";

const Header = ({ onNote, toggle, onProfile, onNotification }) => {
   const dispatch = useDispatch();
   const location = useLocation();
   const { apiToken, productCode, activities, isDarkMode, featuresToBlock, subscriptionNextAction, showPro, membershipData, fileResume, apiTokenReady } = useSelector(state => state.profile);
   const userEmail = useSelector(state => state.auth.auth.email);
   const accesstoken = useSelector((state) => state.auth.auth.accesstoken);
   const [subscription, setSubscription] = useState("");
   const [paymentRedirection, setPaymentRedirection] = useState(false);
   const [showProfile, setShowProfile] = useState(false); // add this

   // optional: close on route change too
   useEffect(() => {
      setShowProfile(false);
   }, [location.pathname]); // ensures menu closes after navigation [7]
   const storedUserDetails = localStorage.getItem("userDetails");
   const userDetails = JSON.parse(storedUserDetails);

   useEffect(() => {

      if (userEmail != '') {
         dispatch(setApiToken(accesstoken));
         setTimeout(() => {
            dispatch(setApiTokenReady(true));
         }, 1000);
         fetchProfileData();
      }
   }, [userEmail])




   //  // Start the loop when the component mounts
   //  useEffect(() => {

   //       setTimeout(()=>{
   //          if (userEmail!=''){
   //          makePostRequest();
   //          }
   //       },15000)
   //  }, [userEmail]);

   const navigate = useNavigate();



   function selectProductCode(productCode) {
      dispatch(setProductCode(productCode));
   }

   const togglePro = () => {
      dispatch(setShowPro(!showPro));
   };
   const [profileData, setProfileData] = useState("");
   const [profileLoading, setProfileLoading] = useState(false);
   const fetchProfileData = async () => {
      setProfileLoading(true);
      try {
         const queryObj = {
            "action": "getprofile",
            "email": `${userEmail}`
         }

         const response = await fetch('https://submit-feedback-update-profile-v10-737421501165.us-east1.run.app', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${apiToken}`,
            },
            body: JSON.stringify(queryObj)
         });

         if (!response.ok) {
            throw new Error('Failed to fetch data');
         }

         const data = await response.json();
         const profileInfo = data.profile;
         setProfileLoading(false);
         setProfileData(profileInfo);
      } catch (error) {
         setProfileLoading(false);
      }
   };



   const deviceType = isMobile ? 'mobile' : isTablet ? 'tablet' : 'browser';
   const [ip, setIp] = useState('');

   useEffect(() => {
      fetch('https://api.ipify.org?format=json')
         .then((response) => response.json())
         .then((data) => setIp(data.ip))
         .catch((error) => console.error('Error fetching IP:', error));
   }, []);

   function goToLogin() {
      navigate("/login");
   }
   function goToRegister() {
      navigate("/page-register");
   }


   const getRandomDelay = () => Math.floor(Math.random() * (12 - 2 + 1) + 2) * 60000;

   // Function to make the POST request
   const makePostRequest = async () => {
      try {
         const response = await fetch("https://us-east1-foursssolutions.cloudfunctions.net/get_authentication_tokens_v2", {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json'
            },
            body: JSON.stringify({
               user_email: userEmail,
               ip: `${ip}`,
               device: { type: deviceType },
               token_type: "access_token"
            })
         });

         if (response.ok) {
            // Call the function again after a random delay
            const delay = getRandomDelay();
            console.log(`Next request in ${delay / 60000} minutes`);
            setTimeout(makePostRequest, delay);
            const data = await response.json();
            console.log(data.result.access_token);
            dispatch(setApiToken(data.result.access_token))
         } else {
            const data = await response.json();
            console.log('Response:', data);
         }
      } catch (error) {
         console.error('Error making POST request:', error);
      }
   };
   const userName = userEmail.split('@')[0]
   var path = window.location.pathname.split("/");
   var name = path[path.length - 1].split("-");
   var filterName = name.length >= 3 ? name.filter((n, i) => i > 0) : name;
   var finalName = filterName.includes("app")
      ? filterName.filter((f) => f !== "app")
      : filterName.includes("ui")
         ? filterName.filter((f) => f !== "ui")
         : filterName.includes("uc")
            ? filterName.filter((f) => f !== "uc")
            : filterName.includes("basic")
               ? filterName.filter((f) => f !== "basic")
               : filterName.includes("form")
                  ? filterName.filter((f) => f !== "form")
                  : filterName.includes("table")
                     ? filterName.filter((f) => f !== "table")
                     : filterName.includes("page")
                        ? filterName.filter((f) => f !== "page")
                        : filterName.includes("email")
                           ? filterName.filter((f) => f !== "email")
                           : filterName.includes("ecom")
                              ? filterName.filter((f) => f !== "ecom")
                              : filterName.includes("chart")
                                 ? filterName.filter((f) => f !== "chart")
                                 : filterName.includes("editor")
                                    ? filterName.filter((f) => f !== "editor")
                                    : filterName;
   return (
      <div className="header">
         <div className={`header-content ${location.pathname === "/videoInterview" ? "videoInterviewPage" : "jobPostingBg"}`}>
            <nav className="navbar navbar-expand">
               <div className="collapse navbar-collapse justify-content-between">
                  <div className="header-left">
                     <div
                        className="dashboard_bar"
                        style={{ textTransform: "capitalize" }}
                     >{/*
                        {location.pathname=="/jobposting" || location.pathname === "/candidatelist"?(<></>):(<>{finalName.join(" ")}</>)}*/}

                     </div>
                  </div>



                  <ul className="navbar-nav header-right">
                     <li className="nav-item">

                     </li>


                     {location.pathname === '/jobDetailed' ? (
                        <>
                           <div className="jButtonRow">
                              <button className="join-now-filled" onClick={goToRegister}>
                                 Join Now
                                 <img src={JoinRightArr} className="rArrIcon" alt="rightArr" />
                              </button>
                              <div className="join-btn-divider"></div>
                              <button className="join-now-bordered" onClick={goToLogin}>
                                 <div className="inner-button">
                                    Sign In
                                    <img src={JoinRightArr} className="rArrIcon" alt="rightArr" />
                                 </div>
                              </button>
                           </div>
                        </>
                     ) : (
                        <>
                           {location.pathname === '/resume-upload' ? (
                              <>
                                 <Dropdown as="li" className={`nav-item header-profile `}>
                                    <Dropdown.Toggle className="nav-link i-false" as="a" >
                                       <img src={profile} width="20" alt="" />
                                       <div className="header-info">
                                          <span className="text-black">{userName}</span>
                                          <p className="fs-12 mb-0">Job Applicant</p>
                                       </div>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu className={`dropdown-menu-right`}>
                                       <LogoutPage />
                                    </Dropdown.Menu>
                                 </Dropdown>
                              </>
                           ) : (
                              <>
                                 <Dropdown
                                    as="li"
                                    className="nav-item header-profile"
                                    show={showProfile}
                                    onToggle={(next) => setShowProfile(next)}
                                 // optional: tweak close behavior if needed
                                 // autoClose="inside"  // closes when clicking items inside menu
                                 // rootCloseEvent="mousedown" // slightly earlier close event
                                 >
                                    <Dropdown.Toggle className="nav-link i-false" as="a">
                                       <img src={profile} width="20" alt="" />
                                       <div className="header-info">
                                          <span className="text-black">{profileLoading?(<>
                                          Loading
                                          </>):(<>
                                          {profileData.first_name} {profileData.last_name}
                                          </>)}</span>
                                          <p className="fs-12 mb-0">Employer Account</p>
                                       </div>
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu className="dropdown-menu-right header-navpopup">
                                       <Link
                                          to="/profile"
                                          className="dropdown-item ai-icon"
                                          onClick={() => setShowProfile(false)} // close on click
                                       >
                                          {/* icon + text */}
                                          <svg id="icon-user1" xmlns="http://www.w3.org/2000/svg" className="text-primary" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                             <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                             <circle cx="12" cy="7" r="4"></circle>
                                          </svg>
                                          <span className="ms-2">Profile</span>
                                       </Link>
                                       <Link
                                          className="dropdown-item ai-icon"
                                          onClick={()=>dispatch(setSidebarPopupType("ContactUs"))}
                                       >
                                          {/* icon + text */}
                                          <PhoneCall className="text-primary" size={14.5}/>
                                          {/* <svg id="icon-user1" xmlns="http://www.w3.org/2000/svg" className="text-primary" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                             <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                             <circle cx="12" cy="7" r="4"></circle>
                                          </svg> */}
                                          <span className="ms-2">Contact Us</span>
                                       </Link>

                                       <LogoutPage />
                                    </Dropdown.Menu>
                                 </Dropdown>
                              </>
                           )}
                        </>
                     )}



                  </ul>
               </div>
            </nav>
         </div>

      </div>
   );
};

export default Header;
