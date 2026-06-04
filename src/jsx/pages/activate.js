import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import LoaderIcon from "../components/Dashboard/Home/loading-gif.gif";

import "../components/Dashboard/Home/styles/dash.css";
import "../components/Dashboard/Home/styles/activate.css";

const DashboardDark = () => {
  const location = useLocation();
  const [token, setToken] = useState('');
  const navigate = useNavigate();
    const { apiToken } = useSelector(state => state.profile);

  const [showLoader, setShowLoader] = useState(false);
  const [countdown, setCountdown] = useState(5); // State for the countdown
  const [showPopup, setShowPopup] = useState(false); // State for popup visibility
  const [popupMessage, setPopupMessage] = useState(''); // State for the popup message

  // Extract the token from the URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenFromUrl = queryParams.get('token');
    setToken(tokenFromUrl);
  }, [location.search]);

  // // Update the popup message whenever countdown changes
  // useEffect(() => {
  //   if (showPopup && countdown > 0) {
  //     setPopupMessage(`Your account is now activated! You can login with your credentials. Redirecting to login in ${countdown} seconds...`);
  //   }
  // }, [countdown, showPopup]);

  // Function to send POST request to verify the token
  const handleActivate = async () => {
    setShowLoader(true);
    try {
      const response = await fetch('https://us-east1-foursssolutions.cloudfunctions.net/send_activation_link_v2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
               'Authorization': `Bearer ${apiToken}`,
        },
        body: JSON.stringify({
          token: token,
          task: 'verify_token',
        }),
      });

      const data = await response.json();
      console.log(response);
      setTimeout(() => {
        if (response.ok && data.status !== "token not valid or expired") {
          setPopupMessage(`Your account is now activated! You can login with your credentials. Redirecting to login in ${countdown} seconds...`);
          setShowPopup(true); // Show the popup
          // Start countdown timer
          const countdownInterval = setInterval(() => {
            setCountdown((prev) => {
              if (prev === 1) {
                clearInterval(countdownInterval); // Clear interval when countdown is done
                setShowPopup(false); // Hide the popup
                setShowLoader(false);
                navigate('/login'); // Redirect to login page
              }
              return prev - 1;
            });
          }, 1000); // Update countdown every second
        }
        else if(data.status === "token not valid or expired"){
          setPopupMessage(`Your activation link is expired! You can resend activation link. Redirecting to resend activation page in ${countdown} seconds...`);
          setShowPopup(true); // Show the popup
          const countdownInterval = setInterval(() => {
            setCountdown((prev) => {
              if (prev === 1) {
                setShowPopup(true); // Show the popup
                clearInterval(countdownInterval); // Clear interval when countdown is done
                setShowLoader(false);
                setShowPopup(false); // Hide the popup
                navigate('/reactivate-link'); // Redirect to login page
              }
              return prev - 1;
            });
          }, 1000); // Update countdown every second
          setShowLoader(false);
        }
        else {
          setShowLoader(false);
          setPopupMessage(`Verification failed: ${data.status}`);
          setShowPopup(true);
        }
      }, 4000);
    } catch (error) {
      console.error('Error verifying token:', error);
      setShowLoader(false);
      setPopupMessage("An error occurred while verifying your account.");
      setShowPopup(true);
    }
  };

  return (
    <>
      <div className="activate-container container-center">
        <div className="text-center inner">
          <h2 className="mb-4">Verify Your Profile</h2>
          <p className="mb-4">
            To activate your profile, please click the button below. This will verify your account and allow you to access the platform.
          </p>
          <button
            className="btn-primary"
            style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
            onClick={handleActivate}
          >
            Activate Profile
          </button>
        </div>
      </div>
      <div className="login-btn">
        <Link to="/login">Go To Login</Link>
      </div>

      {/* Modal Popup */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-message">
            <p>{popupMessage}</p>
          </div>
        </div>
      )}
      {showLoader && (
        <div className="checkout-loader">
          <img src={LoaderIcon} alt="loader" />
        </div>
      )}
    </>
  );
};

export default DashboardDark;
