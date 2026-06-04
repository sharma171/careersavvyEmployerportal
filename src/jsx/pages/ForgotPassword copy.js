import React, { useEffect, useState } from "react";
import logo from "../../images/site_logo.jpg";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import AiCompressIcon from "./Home/icons & images/aigif compressed.gif";
const ForgotPassword = () => {
  const [userEmail, setUserEmail] = useState("");
  const [message, setMessage] = useState(""); //State to display success or error messages
  const [successModal, setSuccessModal] = useState(false);
  const { resetEmail } = useSelector((state) => state.profile);
  const [loaderAnimate, setLoaderAnimate] = useState(false);
  const navigate = useNavigate();
  function closeSuccessModal() {
    setSuccessModal(false); // Hide success modal
  }
  function goToLogin() {
    navigate("/login"); // Navigate to login page
  }
  useEffect(() => {
    setUserEmail(resetEmail);
  }, []);

  const handleSubmit = async (e) => {
    setLoaderAnimate(true);

    e.preventDefault(); // Prevent page refresh

    // Payload to send in the POST request
    const payload = {
      task: "send_passwordresetlink",
      user_mail: userEmail,
    };

    try {
      // Sending POST request
      const response = await fetch("https://us-east1-foursssolutions.cloudfunctions.net/send_activation_link_v2", {
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
        setMessage(result.error || "Failed to send reset link. Please try again.");
        setLoaderAnimate(false);
      }
    } catch (error) {
      setMessage("Error: Something went wrong. Please try again later.");
      setLoaderAnimate(false);
    }
  };

  return (
    <div className="h-100 p-meddle">
      <div className="container h-100">
        {" "}
        <div className="row justify-content-center h-100 align-items-center">
          <div className="col-md-6">
            <div className="authincation-content">
              <div className="row no-gutters">
                <div className="col-xl-12">
                  <div className="auth-form">
                    <div className="text-center mb-3">
                      <Link to="/dashboard">
                        <img src={logo} alt="" style={{ maxHeight: "80px", borderRadius: "100px" }} />
                      </Link>
                    </div>
                    <h4 className="text-center mb-4 font-w600 " style={{ color: "rgb(0 90 165)" }}>
                      Forgot Password ?
                    </h4>

                    {/* Display success or error message */}
                    {message && <div className="alert alert-info">{message}</div>}

                    <form onSubmit={handleSubmit}>
                      <div
                        className="form-group"
                        style={{
                          marginBottom: "1rem",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <label
                          className="text-center"
                          style={{
                            margin: "0px auto 17px",
                            color: "rgb(0 90 165)",
                            fontSize: "16px",
                            fontWeight: "500",
                          }}
                        >
                          Enter Your Email Id to reset your password
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          value={userEmail}
                          placeholder="Enter your Email Address"
                          onChange={(e) => setUserEmail(e.target.value)}
                          style={{ border: "0.0625rem solid #cecece", borderRadius: "22px", fontSize: "16px" }}
                          required
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="submit"
                          value="Get Reset Link"
                          className="btn btn-primary btn-block"
                          style={{
                            borderRadius: "22px",
                            padding: "8px",
                            fontWeight: "500",
                            fontSize: "17px",
                            background: "linear-gradient(45deg, #008b5c, #419cf8)",
                            border: "none",
                            marginTop: "22px",
                          }}
                        />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {successModal && (
        <div
          className="modal fade bd-example-modal-sm show"
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          style={{
            display: "block",
            backgroundColor: "rgba(0, 0, 0, 0.6)", // Darker overlay for more contrast
            transition: "opacity 0.5s ease-in-out", // Smooth fade-in effect
          }}
        >
          <div
            className="modal-dialog modal-sm"
            style={{
              maxWidth: "400px",
              animation: "fadeInUp 0.5s ease", // Smooth slide-in animation
            }}
          >
            <div
              className="modal-content"
              style={{
                borderRadius: "12px", // Softer rounded corners
                boxShadow: "0 10px 20px rgba(0, 0, 0, 0.15)", // Deep shadow for a floating effect
                overflow: "hidden",
              }}
            >
              {/* Modal Header */}
              <div
                className="modal-header"
                style={{
                  background: "#fafafa", // Gradient background for a modern look
                  color: "#fff",
                  padding: "15px",
                  borderTopLeftRadius: "12px",
                  borderTopRightRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <h5 className="modal-title" style={{ fontWeight: "bold", margin: 0 }}>
                  Password Reset Status
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  onClick={closeSuccessModal}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#fff",
                    fontSize: "20px",
                    cursor: "pointer",
                  }}
                >
                  &times;
                </button>
              </div>

              {/* Modal Body */}
              <div
                className="modal-body"
                style={{
                  padding: "25px",
                  textAlign: "center",
                  fontSize: "16px",
                  color: "#333",
                  backgroundColor: "#f8f9fa",
                }}
              >
                Password reset link has been sent to your email: <strong>{userEmail}</strong>
              </div>

              {/* Modal Footer */}
              <div
                className="modal-footer"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "15px 20px",
                  backgroundColor: "#f1f1f1",
                }}
              >
                <button
                  type="button"
                  className="btn btn-danger light"
                  data-bs-dismiss="modal"
                  onClick={closeSuccessModal}
                  style={{
                    borderRadius: "32px",
                    padding: "5px 20px",
                    fontWeight: "600",
                    backgroundColor: "#e74c3c",
                    color: "#fff",
                    border: "none",
                    transition: "background-color 0.3s ease", // Smooth hover effect
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = "#c0392b")} // Hover color change
                  onMouseLeave={(e) => (e.target.style.backgroundColor = "#e74c3c")}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={goToLogin}
                  style={{
                    borderRadius: "32px",
                    padding: "5px 20px",
                    fontWeight: "600",
                    backgroundColor: "rgb(0 69 209)",
                    color: "#fff",
                    border: "none",
                    transition: "background-color 0.3s ease", // Smooth hover effect
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = "#2980b9")} // Hover color change
                  onMouseLeave={(e) => (e.target.style.backgroundColor = "#3498db")}
                >
                  Go to Login
                </button>
              </div>
            </div>
          </div>

          {/* Smooth slide-in animation */}
          <style>
            {`
               @keyframes fadeInUp {
                 0% {
                   transform: translateY(50px);
                   opacity: 0;
                 }
                 100% {
                   transform: translateY(0);
                   opacity: 1;
                 }
               }
             `}
          </style>
        </div>
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
};

export default ForgotPassword;
