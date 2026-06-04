/// Menu
import React, { useContext, useEffect, useReducer, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { PhoneCall } from "lucide-react";
import "./sidebar.css";
import { Collapse } from "react-bootstrap";
/// Link
import Icons from "./proIcon.svg";
import { Link } from "react-router-dom";
// import { MenuList } from "./Menu";
import { useScrollPosition } from "@n8tb1t/use-scroll-position";
import { ThemeContext } from "../../../context/ThemeContext";
import { navtoggle } from "../../../store/actions/AuthActions";
import { setShowPro, setSidebarPopupType } from "../../../store/actions/actions";
import { HiOutlineUserAdd } from "react-icons/hi";

const reducer = (previousState, updatedState) => ({
  ...previousState,
  ...updatedState,
});

const initialState = {
  active: "",
  activeSubmenu: "",
};

const SideBar = () => {
  /// Open menu
  let d = new Date();
  const { iconHover, sidebarposition, headerposition, sidebarLayout, ChangeIconSidebar } = useContext(ThemeContext);

  const [state, setState] = useReducer(reducer, initialState);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate;

  const userEmail = useSelector((state) => state.auth.auth);
  const { profileData, fileResume, featuresToBlock, isDarkMode ,sidebarPopupType } = useSelector((state) => state.profile);
  const [upgradePro, setUpgradePro] = useState(false);
  const sideMenu = useSelector((state) => state.sideMenu);

  useEffect(()=>{
    console.log("sideMenu",sideMenu);
    
  },[sideMenu])
  useEffect(()=>{
    setTimeout(()=>{
      if (sideMenu == false) {

        sideBarOpen();
      }

    },6000);
  },[sideMenu])
  

  useEffect(() => {
    if (window.innerWidth <= 768) {
      const timer = setTimeout(() => {
        // handleToggle(); // Calls the toggle function after 10 seconds
      }, 5000);

      // Cleanup the timer when component unmounts or userEmail changes
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        // handleToggle(); // Calls the toggle function after 10 seconds
      }, 10000);

      // Cleanup the timer when component unmounts or userEmail changes
      return () => clearTimeout(timer);
    }
  }, [userEmail, sideMenu]); // Dependency array includes sideMenu to ensure it has the latest value

  const sideBarOpen = () => {
    if (sideMenu == false) {
      dispatch(navtoggle());
    }
    else{

      // dispatch(navtoggle());
    }
  };
  const sideBarClose = () => {
    if (sideMenu == true) {
      dispatch(navtoggle());
    }
  };

  let handleheartBlast = document.querySelector(".heart");
  function heartBlast() {
    return handleheartBlast.classList.toggle("heart-blast");
  }

  const [hideOnScroll, setHideOnScroll] = useState(true);
  useScrollPosition(
    ({ prevPos, currPos }) => {
      const isShow = currPos.y > prevPos.y;
      if (isShow !== hideOnScroll) setHideOnScroll(isShow);
    },
    [hideOnScroll]
  );

  const handleMenuActive = (status) => {
    setState({ active: status });
    if (state.active === status) {
      setState({ active: "" });
    }
  };
  const handleSubmenuActive = (status) => {
    setState({ activeSubmenu: status });
    if (state.activeSubmenu === status) {
      setState({ activeSubmenu: "" });
    }
  };

  function makePayment() {
    setUpgradePro(false);
    dispatch(setShowPro(true));
  }

  // Function to handle click and set active menu

  // Menu dropdown list End

  /// Path
  let path = window.location.pathname;
  path = path.split("/");
  path = path[path.length - 1];

  return (
    <>
      <div
        className={`deznav ${sideMenu === true ? "side-close" : "side-open"}`}
        // onMouseOver={sideBarOpen}
        // onMouseLeave={sideBarClose}
      >
        <div className="deznav-scroll ">
          {location.pathname !== "/resume-upload" ? (
            <ul className="metismenu" id="menu" onClick={sideBarClose}>
              
              <li className={`menu-title ${location.pathname === "/jobposting" ? "mm-active" : ""}`}>
                <Link to="/jobposting">
                  <i className="fi fi-br-briefcase">

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      style={
                        (sideMenu && location.pathname === "/jobposting") || location.pathname !== "/jobposting"
                          ? { filter: "brightness(25)" }
                          : {}
                      }
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-briefcase-business"
                    >
                      <path d="M12 12h.01"></path>
                      <path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"></path>
                      <path d="M22 13a18.15 18.15 0 0 1-20 0"></path>
                      <rect width="20" height="14" x="2" y="6" rx="2"></rect>
                    </svg>
                  </i>
                  <span className="nav-text">Job Postings</span>
                </Link>
              </li>

              <li className={`menu-title ${location.pathname === "/users" ? "mm-active" : ""}`}>
                <Link to="/users">
                  <HiOutlineUserAdd
                    style={
                      (sideMenu && location.pathname === "/users") || location.pathname !== "/users"
                        ? { filter: "brightness(25)", width: "24px", height: "24px", marginRight: "0.75rem" }
                        : {}
                    }
                  />
                  <span className="nav-text">Users</span>
                </Link>
              </li>
             
            </ul>
          ) : (
            <>
              <ul className="metismenu" id="menu">
                <li className={`menu-title ${location.pathname === "/resume-upload" ? "mm-active" : ""} `}>
                  <Link className="has-arrow ai-icon" to="/resume-upload">
                    <i className="flaticon-381-networking"></i>
                    <span className="nav-text">Resume Upload</span>
                  </Link>
                </li>
              </ul>
            </>
          )}
          
            <div className={`contactUsBtn ${sideMenu === true ? "side-close" : "side-open"}`} onClick={()=>dispatch(setSidebarPopupType("ContactUs"))}>
              <PhoneCall size={18}/>
              <span className="text">
                Contact Us
              </span>
            </div>
        </div>
      </div>
      {upgradePro && (
        <div className={`pro-bg ${isDarkMode === false ? "dark" : "Light"}`}>
          <div className="pro-container small">
            <div className="pro-header flex-row">
              <img src={Icons} className="icon" alt="icons" />
              <span>Upgrade To Pro</span>
              <div className="close" onClick={() => setUpgradePro(false)}>
                +
              </div>
            </div>
            <div className="upgrade-description">
              Upgrade to Pro to access these features and reach your career goals faster with the help of Career Savvy!
            </div>
            <div className="upgrade-button" onClick={makePayment}>
              Upgrade Now
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SideBar;
