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
  const { apiToken, resetEmail } = useSelector(state => state.profile);

  const [showLoader, setShowLoader] = useState(false);
  const [countdown, setCountdown] = useState(5); // State for the countdown
  const [showPopup, setShowPopup] = useState(false); // State for popup visibility
  const [popupMessage, setPopupMessage] = useState(''); // State for the popup message
  const [email, setEmail] = useState("");

  // Extract the token from the URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenFromUrl = queryParams.get('token');
    setToken(tokenFromUrl);
  }, [location.search]);

  // Update the popup message whenever countdown changes
  useEffect(() => {
    if (showPopup && countdown > 0) {
      setPopupMessage(`A new email with the activation link has been sent to your email. Please check your email and activate your account by clicking on the link.`);
    }
  }, [countdown, showPopup]);

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

           "task": "resend_activation_link", 
          
           "user_mail":email 
          
          }  ),
      });

      const data = await response.json();
      setTimeout(() => {
        if (response.ok) {
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
        } else {
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
        <div className="text-center inner" style={{
              padding: "30px",
              display: "flex",
              flexDirection: "column",
              gap: "0px",
              background: "#ffffff",
              minWidth:"300px",
              maxWidth:"350px",
              width:"33%",
              borderRadius: "18px",
              border: "1px solid #cdd3ea"}}>
          <h2 className="mb-4">Reactivation Link</h2>
          <p className="text">
            The activation link has expired. Please use the button below to request a new verification link.
          </p>
          <input type="email" value={resetEmail} onChange={(e) => setEmail(e.target.value)}  className="reactivate-mail" placeholder="Enter your Email Address" style={{
            padding: "10px 15px",
            background:"rgb(205, 211, 234)",
            color: "#40189d",
            border: "none",
            borderRadius: "46px",
            marginBottom: "30px"
          }}></input>
          <button
            className="btn-primary"
            style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer',
              padding: "10px 15px",
              border: "none",
              borderRadius: "46px",
              marginBottom: "30px"
             }}
            onClick={handleActivate}
          >
            Reactivate Profile
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
