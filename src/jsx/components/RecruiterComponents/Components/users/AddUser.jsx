import React, { useState, useEffect, useRef } from "react";
import "../style/referencePopup.css?ver0.2";
import "../users/customRemder.css";
import styles from "../../css/users.module.css";
import { IoIosArrowDropdown, IoMdArrowDropdown, IoMdClose } from "react-icons/io";
import { useSelector } from "react-redux";
import Spinner from "../spinner";
import { LuKey, LuUserRound } from "react-icons/lu";
import { TiEdit } from "react-icons/ti";
import { FiRotateCcw, FiShield, FiShieldOff } from "react-icons/fi";
import CSavvyPageLoader from "../../cSavvvyPageLoader";
import Toast from "../../toastSucces";
import PasswordResetModal from "./CopyPasswordModal";
import { Asterisk } from "lucide-react";

export const UserModal = ({ open, setOpen, data = {}, refresh }) => {
  const [loadSpinner, setLoadSpinner] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  useEffect(() => {
    if (!dropdownOpen) return;

    const onPointerDown = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [dropdownOpen]);
  const [loader, setloader] = useState(false);
  const [formData, setFormData] = useState({ user_role: "recruiter", ...data });
  const [errors, setErrors] = useState({});
  const userData = useSelector((state) => state?.auth?.auth);
  const [showEditForm, setShowEditForm] = useState(false);
  const [apiMessage, setApiMessage] = useState("");
  const [tempPassword, setTempPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isActiveUser, setIsActiveUser] = useState(true);

  let userEmail = userData?.email;

  let isView = !data?.id && !!data?.email;
  let isCreate = !data?.email;
  let isEdit = !!data?.id && !!data?.email;

  useEffect(() => {
    setIsActiveUser(String(data.status).toLowerCase() == "active");
  }, [data.status]);

  useEffect(() => {
    if (!isCreate && open) {
      setFormData(structuredClone(data));
    } else {
      setFormData({
        user_role: "recruiter",
      });
      setErrors({});
    }
    setShowEditForm(false);
  }, [data, open]);

  if (!open && !apiMessage) {
    return <></>;
  }

  const resetUserPassword = async () => {
    const payload = {
      action: "password-reset",
      admin_email: userEmail,
      // admin_email: "amit@4spheresolutions.com",
      user_email: data?.email,
    };

    setloader(true);

    try {
      const res = await fetch("https://manage-recruiter-accounts-v10-737421501165.us-east1.run.app", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      setApiMessage({ message: data.message || "Password reset email sent successfully.", type: "success" });
      setloader(false);

      if (data.status === "success" && data.temp_password) {
        const decoded = atob(data.temp_password);
        setTempPassword(decoded);
        setShowModal(true);
      } else {
        setApiMessage({ message: data.message || "Failed to send password reset email.", type: "error" });
        setTempPassword("");
      }
    } catch (error) {
      setloader(false);
      setApiMessage({ message: error.message || "An error occurred while resetting the password.", type: "error" });
      setTempPassword("");
    }
  };

  const handleUserAccess = async (actionType) => {
    const payload = {
      action: actionType,
      admin_email: userEmail,
      // admin_email: "amit@4spheresolutions.com",
      user_email: data?.email,
    };

    setloader(true);

    try {
      const res = await fetch("https://manage-recruiter-accounts-v10-737421501165.us-east1.run.app", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      const success = result?.status === "success";

      if (success) {
        setIsActiveUser(actionType == "activate");
        refresh(true);
      }

      setApiMessage({
        message: result?.message || (success ? "Operation successful." : "Operation failed."),
        type: success ? "success" : "error",
      });
    } catch (error) {
      setApiMessage({
        message: error?.message || "An error occurred during the operation.",
        type: "error",
      });
    } finally {
      setloader(false);
    }
  };

  const createUser = () => {
    let errors = {};
    if (!formData.first_name) {
      errors.first_name = "First name is required";
    }
    if (!formData.last_name) {
      errors.last_name = "Last name is required";
    }
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Invalid email format";
    }
    if (!formData.user_role) {
      errors.user_role = "User role is required";
    }
    if (!formData.mobile_no) {
      errors.mobile_no = "Phone Number is required";
    }
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    } else {
      setErrors({});
    }

    let payload = {
      action: "create-user",
      admin_email: userEmail,
      // admin_email: "amit@4spheresolutions.com",
      ...formData,
    };

    setLoadSpinner(true);

    fetch("https://manage-recruiter-accounts-v10-737421501165.us-east1.run.app", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        setLoadSpinner(false);
        if (data.status === "success") {
          refresh(true);
          setOpen(false);
          setApiMessage({ message: data.message || "User created successfully.", type: "success" });
          // setOpen(false);
        } else {
          setOpen(false);
          setApiMessage({ message: data.message || "An error occurred while creating the user.", type: "error" });
          console.log("Error creating user:", data.message);
        }
      })
      .catch((error) => {
        setLoadSpinner(false);
        setOpen(false);
        setApiMessage({ message: "An error occurred while creating the user.", type: "error" });
        console.log("Error:", error);
      });
  };

  function comparePayload(payload, original) {
    const modified = {};
    for (const key in payload) {
      if (Object.prototype.hasOwnProperty.call(payload, key) && payload[key] !== original[key]) {
        modified[key] = payload[key];
      }
    }
    return modified;
  }

  const updateUser = () => {
    let newPayload = comparePayload(formData, data);

    if (Object.keys(newPayload).length === 0) {
      setApiMessage({ message: "No changes detected.", type: "info" });
      return;
    }

    let payload = {
      action: "update-user",
      user_id: data?.id,
      admin_email: userEmail,
      // admin_email: "amit@4spheresolutions.com",
      ...newPayload,
    };

    setLoadSpinner(true);

    fetch("https://manage-recruiter-accounts-v10-737421501165.us-east1.run.app", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        setLoadSpinner(false);
        if (data.status === "success") {
          refresh(true);
          setOpen(false);
          setApiMessage({ message: data.message || "User created successfully.", type: "success" });
          // setOpen(false);
        } else {
          setOpen(false);
          setApiMessage({ message: data.message || "An error occurred while creating the user.", type: "error" });
          console.log("Error creating user:", data.message);
        }
      })
      .catch((error) => {
        setLoadSpinner(false);
        setOpen(false);
        setApiMessage({ message: "An error occurred while creating the user.", type: "error" });
        console.log("Error:", error);
      });
  };

  const handleChange = (key, val) => {
    errors[key] = "";
    formData[key] = val;
    setFormData({ ...formData });
  };

  const renderInput = (label, placeholder, key, disabled) => {
    function formatUSPhoneNumber(value) {
      const str = String(value ?? '').trim();        // <- guard
      let cleaned = str;

      if (cleaned.startsWith('+1')) {
        cleaned = cleaned.slice(2).trim();
      }
      let x = cleaned.replace(/[^\d]/g, '').slice(0, 10);

      if (!x) return '';
      if (x.length < 4) return '(' + x;
      if (x.length < 7) return `(${x.slice(0, 3)}) ${x.slice(3)}`;
      return `+1 (${x.slice(0, 3)}) ${x.slice(3, 6)}-${x.slice(6)}`;
    }
    function formatUSNumber(value) {
    const raw = String(value ?? '').trim();
    // keep digits only
    let digits = raw.replace(/\D/g, '');

    // If 11 digits and starts with '1', drop the country code
    if (digits.length === 11 && digits.startsWith('1')) {
      digits = digits.slice(1);
    }

    // Clamp to US 10 digits
    digits = digits.slice(0, 10);

    const len = digits.length;
    if (len === 0) return '';

    if (len <= 3) {
      // just the area code as user types
      return digits;
    } else if (len <= 6) {
      // (AAA) BBB
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    } else {
      // +1 (AAA) BBB-CCCC
      return `+1 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    }
  }

    const isPhone = key === "mobile_no";
    const raw = isPhone ? String(formData[key] ?? '') : (formData[key] ?? '');
    const displayValue = isPhone ? (disabled ? formatUSNumber(raw) : raw) : raw;



    return (
      <div className="mb-4">
        <label htmlFor={key}>{label} <span style={{ color: "#b20000ff", fontWeight: "600" }}>*</span></label>
        {disabled?(<>
        <input
          disabled={disabled}
          onChange={(e) => {
            let value = e.target.value;
            if (key === "mobile_no") {
              value = formatUSPhoneNumber(value);
            }
            handleChange(key, value);
          }}
          value={displayValue}
          className={`${styles.inputBox} form-control`}
          id={key}
          placeholder={placeholder}
          required
        />
        </>):(<>
        <input
          disabled={disabled}
          onChange={(e) => {
            let value = e.target.value;
            if (key === "mobile_no") {
              value = formatUSPhoneNumber(value);
            }
            handleChange(key, value);
          }}
          value={displayValue}
          className={`${styles.inputBox} form-control`}
          id={key}
          placeholder={placeholder}
          required
        />
        </>)}
        
        {errors[key] ? <div className={`fw-300 mt-1 text-danger ${styles["text-sm"]}`}>{errors[key]}</div> : <></>}
      </div>
    );
  };

  const renderDropdown = (label, key, options, disabled) => {
    return (
      <div className="mb-4 position-relative" ref={dropdownRef}>
        <label htmlFor={key} className="form-label">{label} <span style={{ color: "#b20000ff", fontWeight: "600" }}>*</span></label>

        <button
          id={key}
          className="btn btn-outline-secondary dropdown-toggle w-100 text-start customDropDown specialbtn"
          type="button"
          disabled={disabled}
          onClick={() => setDropdownOpen((o) => !o)}
          style={{ maxHeight: "50px" }}
        >
          {formData[key]
            ? options.find(opt => opt.value === formData[key])?.label
            : `Select ${label}`}
        </button>

        <ul
          className={`dropdown-menu specialbtn w-100 ${dropdownOpen ? "show" : ""}`}
          style={{
            maxHeight: "200px",
            overflowY: "auto",
            position: "absolute",
            bottom: "43px",
            zIndex: 1000
          }}
        >
          <li>
            <button
              className="dropdown-item"
              type="button"
              onClick={() => {
                handleChange(key, "");
                setDropdownOpen(false);
              }}
            >
              Select {label}
            </button>
          </li>

          {options.map((option) => (
            <li key={option.value}>
              <button
                className={`dropdown-item ${option.value === formData[key] ? "active" : ""}`}
                type="button"
                onClick={() => {
                  handleChange(key, option.value);
                  setDropdownOpen(false);
                }}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>

        {errors[key] ? (
          <div className={`fw-300 mt-1 text-danger ${styles["text-sm"]}`}>{errors[key]}</div>
        ) : null}
      </div>
    );
  };


  const roleOptions = [
    { value: "admin", label: "Admin" },
    { value: "recruiter", label: "Recruiter" },
  ];

  const renderFormContent = () => {
    if (isCreate || isView)
      return (
        <div className="section">
          {renderInput(`First Name`, "Enter first name", "first_name", isView)}
          {renderInput("Last Name", "Enter last name", "last_name", isView)}
          {renderInput("Email", "Enter email address", "email", isView)}
          {renderInput("Phone Number", "Enter phone number", "mobile_no", isView)}
          {renderDropdown("Role", "user_role", roleOptions, isView)}
        </div>
      );

    const UserDetailsDrawer = () => (
      <div>
        <div className="mb-4">
          <label htmlFor="resetPassword" className="form-label fw-medium">
            Reset Password
            {/* <span className="text-danger">*</span> */}
          </label>
          <div className={`${styles.actionButtonBig}`} onClick={resetUserPassword}>
            <FiRotateCcw className="text-primary" size={16} />
            <div>
              <div className="fw-medium" style={{ color: "black" }}>
                Reset Password
              </div>
              <div className="small text-muted">Click here to generate a temporary password.</div>
              {/* <div className="small text-muted">Send password reset email to {data?.email}</div> */}
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="blockSignIn" className="form-label fw-medium">
            {isActiveUser ? "Block Sign-In" : "Unblock Sign-In"} {/* <span className="text-danger">*</span> */}
          </label>
          <div
            onClick={() => {
              handleUserAccess(isActiveUser ? "deactivate" : "activate");
            }}
            className={`${styles.actionButtonBig} ${isActiveUser ? styles.blockSignInButton : styles.activeSignInButton
              }`}
          >
            {isActiveUser ? (
              <FiShieldOff className="text-danger" size={16} />
            ) : (
              <FiShield className="text-success" size={16} />
            )}
            <div>
              <div className="fw-medium" style={{ color: "black" }}>
                {isActiveUser ? "Block Sign-In" : "Unblock Sign-In"}{" "}
              </div>
              <div className="small text-muted">
                {isActiveUser ? "Prevent user from signing in to the system" : "Allow user to sign in to the system"}
              </div>
            </div>
          </div>
        </div>
      </div>
    );

    const renderActionsSection = () => {
      if (!showEditForm) {
        return <></>;
      }
      return (
        <div className="section bg-white p-3 rounded mt-3">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex gap-2 align-items-center fw-bold" style={{ fontSize: "18px" }}>
              <LuKey style={{ color: "#2563eb" }} />
              Access Control
            </div>
          </div>
          {UserDetailsDrawer()}
        </div>
      );
    };

    return (
      <div>
        <div className="section bg-white p-3 rounded">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex gap-2 align-items-center fw-bold" style={{ fontSize: "18px" }}>
              <LuUserRound style={{ color: "#2563eb" }} />
              Basic Information
            </div>
            {showEditForm ? (
              <></>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setShowEditForm(!showEditForm);
                }}
                className={`${styles.outlineButton} gap-2 d-flex align-items-center`}
              >
                <TiEdit /> Edit
              </button>
            )}
          </div>

          <div className="section">
            <div className="d-flex gap-3 align-items-center">
              {renderInput("First Name", "Enter first name", "first_name", !showEditForm)}
              {renderInput("Last Name", "Enter last name", "last_name", !showEditForm)}
            </div>
            {renderInput("Email (Read-only)", "Enter email address", "email", true)}
            {renderInput("Phone Number", "Enter phone number", "mobile_no", !showEditForm)}
            {renderDropdown("Role", "user_role", roleOptions, !showEditForm)}
          </div>
        </div>

        {renderActionsSection()}
      </div>
    );
  };

  return (
    <div className="sideViewPopupOuter">
      <div className={`sideView smallView`} style={{ maxWidth: "500px" }}>
        <div className="ref-container" style={{ backgroundColor: "#f7fafc" }}>
          <div className="sideViewTop pb-3">
            <div className="ref-header">
              <div className="d-flex align-items-center gap-2">
                {(isView || isEdit) && data?.first_name && data?.last_name && (
                  <div
                    className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                    style={{
                      width: "40px",
                      height: "40px",
                      fontWeight: "bold",
                      fontSize: "16px",
                      background: "linear-gradient(to bottom right, #3b82f6, #9333ea)",
                      color: "white",
                    }}
                  >
                    {data?.first_name[0].toUpperCase()}
                    {data?.last_name[0].toUpperCase()}
                  </div>
                )}
                <h2 className="ref-title fw-bold" style={{ fontSize: "1.25rem" }}>
                  {isView ? "User Profile" : isEdit ? "Edit User Profile" : "Add New User"}
                </h2>
              </div>
              <IoMdClose
                className="ref-close-icon"
                onClick={() => {
                  setOpen(false);
                }}
              />
            </div>
            {isCreate ? (
              <div className="ref-details">
                <p className="ref-role">Create a user account with the required information.</p>
              </div>
            ) : (
              <></>
            )}
          </div>
          <div className="scheduleformContainer">
            <div className="containerform">{renderFormContent()} </div>
          </div>
          {isView ? (
            <></>
          ) : (
            <div className="interviewSubmit" style={{ backgroundColor: "#f7fafc" }}>
              <div className="d-flex gap-2 align-items-center">
                {loadSpinner ? (
                  <div style={{ minWidth: "145px" }}>
                    <Spinner />
                  </div>
                ) : isEdit ? (
                  showEditForm ? (
                    <button type="button" onClick={updateUser} className={`${styles.actionButton}`}>
                      Save Changes
                    </button>
                  ) : (
                    <></>
                  )
                ) : (
                  <button type="button" onClick={createUser} className={`${styles.actionButton}`}>
                    Add & Send Invite
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    if (isEdit && showEditForm) {
                      setShowEditForm(!showEditForm);
                    } else {
                      setOpen(false);
                    }
                  }}
                  className={`${styles.outlineButton}`}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
        <PasswordResetModal
          show={showModal}
          onClose={() => setShowModal(false)}
          password={tempPassword}
          status="success"
          userName={`${data?.first_name} ${data?.last_name}`}
          statusMessage={`Temporary password generated for <b>${data?.email}</b>`}
        />
        {loader ? <CSavvyPageLoader loaderText={"Loading..."} /> : <></>}{" "}
        {apiMessage ? <Toast {...apiMessage} setType={setApiMessage} setMessage={setApiMessage} /> : <></>}
      </div>
    </div>
  );
};
