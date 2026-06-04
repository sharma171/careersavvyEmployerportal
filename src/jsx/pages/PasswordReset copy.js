import React, {useState, useEffect } from "react";
import logo from "../../images/site_logo.jpg";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useLocation,useNavigate } from "react-router-dom";
const ForgotPassword = () => {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); //State to display success or error messages
  const location = useLocation(); // Get the query parameters from the URL
  const [token, setToken] = useState('');
  const [successModal, setSuccessModal] = useState(false);
  const navigate = useNavigate();
  function closeSuccessModal() {
    setSuccessModal(false); // Hide success modal
    navigate("/login"); // Navigate to login page
  }
  function goToLogin() {
    navigate("/login"); // Navigate to login page
  }

   // Extract the token from the URL
   useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenFromUrl = queryParams.get('token');
    setToken(tokenFromUrl);
  }, [location.search]);


  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent page refresh

    // Payload to send in the POST request
    const payload = {
      task: "verify_passwordtoken",
      token: token,
      new_password: confirmPassword
  }

    try {
      // Sending POST request
      const response = await fetch("https://us-east1-foursssolutions.cloudfunctions.net/send_activation_link_v2", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      
      // Check if request was successful and update message
      if (response.ok) {
        setMessage("Your new password has been updated");
        setSuccessModal(true); // Show success modal when successful
      } else {
        setMessage(result.error || "Failed to update your password. Please try again.");
      }
    } catch (error) {
      setMessage("Error: Something went wrong. Please try again later.");
    }
  };
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  return (
    <div className=" h-100 p-meddle">
      <div className="container h-100">
        {" "}
        <div className="row justify-content-center h-100 align-items-center">
          <div className="col-md-6">
            <div className="authincation-content"
            style={{borderRadius:"14px"}}>
              <div className="row no-gutters">
                <div className="col-xl-12">
                  <div className="auth-form">
                    <div className="text-center mb-3">
                      <Link to="/dashboard">
                        <img src={logo} alt="" style={{maxHeight:"80px",borderRadius: "100px"}} />
                      </Link>
                    </div>
                    <h4 className="text-center mb-4 font-w600">
                      Update your Password
                    </h4>

                    {/* Display success or error message */}
                    {message && <div className="alert alert-info">{message}</div>}

                    <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label>
                        <strong>Enter Your Password</strong>
                      </label>
                      <div style={{ position: "relative" }}>
                        <input
                          type={showPassword ? "text" : "password"}
                          className="form-control"
                          placeholder="Password"
                          required
                          style={{
                            border: "0.0625rem solid #c8c8c8",
                            paddingRight: "2rem", // Add padding for the icon space
                          }}
                        />
                        <span
                          onClick={() => setShowPassword(!showPassword)}
                          style={{
                            position: "absolute",
                            right: "0.5rem",
                            top: "50%",
                            transform: "translateY(-50%)",
                            cursor: "pointer",
                            color: "#6c757d",
                          }}
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>
                        <strong>Confirm Your Password</strong>
                      </label>
                      <div style={{ position: "relative" }}>
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          className="form-control"
                          placeholder="Confirm Password"
                          value={confirmPassword}
                          style={{
                            border: "0.0625rem solid #c8c8c8",
                            paddingRight: "2rem", // Add padding for the icon space
                          }}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                        <span
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          style={{
                            position: "absolute",
                            right: "0.5rem",
                            top: "50%",
                            transform: "translateY(-50%)",
                            cursor: "pointer",
                            color: "#6c757d",
                          }}
                        >
                          {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                      </div>
                    </div>
                      <div className="text-center">
                        <input
                          type="submit"
                          value="Update Your Password"
                          className="btn btn-primary btn-block"
                        />
                      </div>
                    </form>
                    <div className="new-account mt-2">
                        <p className="mb-0">
                        Go to 
                            <Link className="text-black" to="/login"> login</Link>
                        </p>
                    </div>
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
            style={{ display: "block" }}
          >
            <div className="modal-dialog modal-sm">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Password reset status</h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    onClick={closeSuccessModal}
                  ></button>
                </div>
                <div className="modal-body">{message}. You can Login with new credentials.</div>
                <div className="modal-footer" style={{
                      display: "flex",
                      flexDirection: "row",
                      alignContent: "space-around",
                      justifyContent: "center"
                }}>
                  
                  <button type="button" className="btn btn-primary" onClick={goToLogin} style={{
                    padding:"5px 20px",
                    borderRadius:"16px"
                  }}>
                    Go to Login
                  </button>
                </div>
              </div>
            </div>
          </div>
      
      )}
    </div>
  );
};

export default ForgotPassword;
