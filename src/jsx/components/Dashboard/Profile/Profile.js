import React, { Fragment, useState, useEffect, useMemo, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./profile.css"
import "./employerProfile.css?ver0.7";
import ToastSucces from "../../RecruiterComponents/toastSucces"
import { Eye, EyeOff } from 'lucide-react';
import profileImg from "../../../../images/avatar/1.jpg";
import { Dropdown } from "react-bootstrap";
import { Mail, Phone, User, Save, X, SquarePen, Lock, Pencil, XCircle, MailIcon, PhoneCallIcon, Shield } from "lucide-react";
import topCountries from './topCountries';
import { ThemeContext } from "../../../../context/ThemeContext";
import CSavvyPageLoader from "../../RecruiterComponents/cSavvvyPageLoader";
import { useDispatch, useSelector } from "react-redux";
import { setProfileData, setTechSkills, setIsDarkMode } from "../../../../store/actions/actions";
import Icons from "../Interview/icons/proIcon.svg";

const SunIcon = () => (
   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      {/* Sun Core */}
      <circle cx="12" cy="12" r="5" fill="yellow" stroke="orange" strokeWidth="2" />
      {/* Sun Rays */}
      <g stroke="orange" strokeWidth="2">
         <line x1="12" y1="1" x2="12" y2="4" />
         <line x1="12" y1="20" x2="12" y2="23" />
         <line x1="1" y1="12" x2="4" y2="12" />
         <line x1="20" y1="12" x2="23" y2="12" />
         <line x1="4.5" y1="4.5" x2="6.5" y2="6.5" />
         <line x1="17.5" y1="17.5" x2="19.5" y2="19.5" />
         <line x1="4.5" y1="19.5" x2="6.5" y2="17.5" />
         <line x1="17.5" y1="6.5" x2="19.5" y2="4.5" />
      </g>
   </svg>
);


const MoonIcon = () => (
   <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="24">
      <path d="M569 936q-119 0-201.5-82.5T285 652q0-113 72.5-192T526 338q6 0 11 .5t11 .5q-33 38-50 86t-17 101q0 122 87.5 210T757 824q11 0 21-.5t21-1.5q-58 79-140.5 121.5T569 936Z" />
   </svg>
);

// Function to get the calling code based on the selected country
const getCallingCode = (countryName) => {
   const country = topCountries.find(c => c.name === countryName);
   return country ? country.callingCode : ''; // Return the calling code if found, otherwise return an empty string
};

const Profile = () => {
   const dispatch = useDispatch();

   const { profileData, techSkills, isDarkMode, apiToken, apiTokenReady } = useSelector(state => state.profile);
   const { changeBackground } = useContext(ThemeContext);
   const [profileName, setProfileName] = useState([]);
   useEffect(() => {
      // Initial setup of theme when the component loads
      const currentTheme = isDarkMode ? "dark" : "light";
      changeBackground({
         value: currentTheme,
         label: currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1),
      });
   }, [isDarkMode]);

   const toggleTheme = () => {
      dispatch(setIsDarkMode(!isDarkMode)); // Dispatch the Redux action
      console.log("Toggled theme to:", !isDarkMode ? "Dark" : "Light");
   };

   // Access user email and profile data from Redux
   const userEmail = useSelector(state => state.auth.auth.email);

   const [error, setError] = useState(null);
   const [countries, setCountries] = useState([]);
   const [filenames, setFilenames] = useState([]);
   const [loading, setLoading] = useState(true);
   const [openPopup, setOpenPopup] = useState('');
   const [profileEdit, setProfileEdit] = useState(false);
   const [passwordEdit, setPasswordEdit] = useState(false);
   const [type, setType] = useState("");
   const [message, setMessage] = useState("");
   const [showLoader, setShowLoader] = useState("");
   const [oldPassword, setOldPassword] = useState("");
   const [newPassword, setNewPassword] = useState("");
   const fileApi = "https://us-east1-foursssolutions.cloudfunctions.net/send_resume_details_front_end_v2"
   useEffect(() => {


      const fetchProfileData = async () => {
         setShowLoader("Loading Profile");
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
            dispatch(setProfileData(profileInfo));
            setLoading(false);
            setProfileName(profileInfo);
            setShowLoader("");
         } catch (error) {
            setShowLoader("");
            setError(error.message);
            setLoading(false);
         }
      };

      if (userEmail !== '') {
         setShowLoader("Loading Profile");
         setTimeout(() => {

            // fetchFilenames();
            fetchProfileData();
         }, 1000)
      }

      // fetchCountries();

   }, [userEmail]);

   const fetchSkillsTechnologies = async () => {
      if (!filenames || filenames?.length === 0) {
         console.error('No filenames available to fetch skills and technologies.');
         return;
      }

      try {
         const fileName = filenames[0].name;
         const bodyData = {
            email_id: userEmail,
            file_name: fileName,
            app_name: 'frontend'
         };

         const response = await fetch('https://us-east1-foursssolutions.cloudfunctions.net/get_skills_technologies_from_resume_v2', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${apiToken}`,
            },
            body: JSON.stringify(bodyData)
         });

         if (!response.ok) {
            throw new Error('Failed to fetch skills, technologies, and title');
         }

         const data = await response.json();

         // Dispatch tech skills to Redux
         dispatch(setTechSkills(data));
      } catch (error) {
         setError(error.message);
         console.error('Error fetching skills and technologies:', error);
      }
   };

   useEffect(() => {
      if (filenames?.length > 0) {
         // fetchSkillsTechnologies();
      }
   }, [filenames, dispatch]);

   function formatUSPhoneNumber(value) {
      let cleaned = value.trim();
      // Remove "+1" if present at the start
      if (cleaned.startsWith('+1')) {
         cleaned = cleaned.slice(2).trim();
      }
      // Remove all non-numeric characters
      let x = cleaned.replace(/[^\d]/g, '');
      // Only use first 10 digits
      x = x.substring(0, 10);

      if (!x) return '';
      if (x.length < 4) {
         return '(' + x;
      } else if (x.length < 7) {
         return `(${x.slice(0, 3)}) ${x.slice(3)}`;
      } else {
         return `+1 (${x.slice(0, 3)}) ${x.slice(3, 6)}-${x.slice(6)}`;
      }
   }

   const handleInputChange = (e) => {
      const { name, value } = e.target;
      // Update profile data locally and dispatch to Redux
      if (name === 'phone_number') {
         const updatedProfileData = { ...profileData, [name]: value };
         dispatch(setProfileData(updatedProfileData));
      }
      const updatedProfileData = { ...profileData, [name]: value };
      dispatch(setProfileData(updatedProfileData));
      // if (name === 'phone_number') {
      //    const updatedProfileData = { ...profileData, [name]: formatUSPhoneNumber(value) };
      //    dispatch(setProfileData(updatedProfileData));
      // }
   };


   const handleSubmit = async (e) => {
      e.preventDefault();

      // Compare current edited values in Redux state (profileData)
      // with the initially loaded values (profileName)
      const isProfileUnchanged = (
         profileData.first_name === profileName.first_name &&
         profileData.last_name === profileName.last_name &&
         profileData.phone_number === profileName.phone_number
      );

      // Only check unchanged profile data if not editing password
      if (!passwordEdit && isProfileUnchanged) {
         setType("info");
         setMessage("No changes are detected.");
         setShowLoader("");
         return; // Prevent API call if nothing changed
      }

      // For password change, check if the new password is not empty and is different
      if (passwordEdit) {
         if (!oldPassword || !newPassword) {
            setType("error");
            setMessage("Please fill out all password fields.");
            setShowLoader("");
            return;
         }
         if (oldPassword === newPassword) {
            setType("error");
            setMessage("New password must be different from current password.");
            setShowLoader("");
            return;
         }
      } else {
         // For profile edit, ensure fields are not empty
         if (!profileData.first_name || !profileData.last_name) {
            setType("error");
            setMessage("Please fill out all fields.");
            setShowLoader("");
            return;
         }
      }

      setShowLoader(passwordEdit ? "Updating Password" : "Updating Profile");


      let updateObj;
      if (passwordEdit) {
         updateObj = {
            action: "changepassword",
            email: userEmail,
            previous_password: oldPassword,
            new_passaword: newPassword
         };
      } else {
         updateObj = {
            action: "updateprofile",
            email: userEmail,
            profile_details: {
               first_name: profileData.first_name,
               last_name: profileData.last_name,
               phone_number: profileData.phone_number
            }
         };
      }

      try {
         const response = await fetch(
            "https://submit-feedback-update-profile-v10-737421501165.us-east1.run.app",
            {
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${apiToken}`,
               },
               body: JSON.stringify(updateObj),
            }
         );

         if (!response.ok) {
            throw new Error("Failed to update data");
         }

         setType("success");
         setMessage("Your Profile has been updated successfully");
         setShowLoader("");
         setPasswordEdit(false);
      } catch (error) {
         setError(error.message);
         setType("error");
         setMessage("Unable to update profile");
         setShowLoader("");
      }
   };

   function formatUSPhoneNumber(value) {
      let cleaned = value.trim();
      // Remove "+1" if present at the start
      if (cleaned.startsWith('+1')) {
         cleaned = cleaned.slice(2).trim();
      }
      // Remove all non-numeric characters
      let x = cleaned.replace(/[^\d]/g, '');
      // Only use first 10 digits
      x = x.substring(0, 10);

      if (!x) return '';
      if (x.length < 4) {
         return '(' + x;
      } else if (x.length < 7) {
         return `(${x.slice(0, 3)}) ${x.slice(3)}`;
      } else {
         return `+1 (${x.slice(0, 3)}) ${x.slice(3, 6)}-${x.slice(6)}`;
      }
   }

   const [formData, setFormData] = useState({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
   });
   const navigate = useNavigate();
   const handleClose = () => {
      navigate(-1); // Goes back to previous page in history
   };

   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
   };
   const [showCurrent, setShowCurrent] = useState(false);
   const [showNew, setShowNew] = useState(false);
   const [showConfirm, setShowConfirm] = useState(false);



   const handleCancel = () => {
      // Reset or close form logic here
      console.log("Cancelled");
   };

   function formatfieldUSPhoneNumber(value) {
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
   const [isEditing, setIsEditing] = useState(false);
   return (
      <Fragment>
         <div className="modernProfilePage">
            {profileEdit ? (
               <>
                  <form className="profile-form" onSubmit={handleSubmit}>
                     <div className="profile-container">
                        <div className="profile-header">
                           <div>
                              <h2 className="profile-title">Profile Information</h2>
                              <p className="profile-subtitle">
                                 Update your personal information and contact details
                              </p>
                           </div>
                           <span className="close-btn" onClick={handleClose}>✕</span>
                        </div>

                        <div className="profile-body">
                           <div className="profile-top">
                              <div>
                                 <h3 className="profile-name">{profileName.first_name || "----"} {profileName.last_name || "----"}</h3>
                                 <p className="profile-email">{userEmail || "----"}</p>
                              </div>
                           </div>

                           <div className="profile-grid">
                              <div className="form-group">
                                 <label>First Name</label>
                                 <input type="text"
                                    name="first_name"
                                    placeholder="First name"
                                    value={profileData.first_name}
                                    onChange={handleInputChange} />
                              </div>

                              <div className="form-group">
                                 <label>Last Name</label>
                                 <input type="text"
                                    placeholder="Last name"
                                    name="last_name"
                                    value={profileData.last_name}
                                    onChange={handleInputChange} />
                              </div>

                              <div className="form-group">
                                 <label>
                                    <MailIcon size={13} className="icon" /> Email Address
                                 </label>
                                 <input type="text" value={userEmail} className="readOnlyField" readOnly />
                              </div>

                              <div className="form-group">
                                 <label>
                                    <PhoneCallIcon size={13} className="icon" /> Phone Number
                                 </label>

                                 <input
                                    type="tel"
                                    name="phone_number"
                                    value={profileData.phone_number}
                                    placeholder="+1 (555) 123-4567"
                                    // maxLength={17}          // optional limit
                                    onChange={(e) => {
                                       const digits = e.target.value;
                                       handleInputChange({ target: { name: 'phone_number', value: formatUSPhoneNumber(digits) } });
                                    }}
                                    onKeyDown={(e) => {
                                       const allowed = [
                                          'Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'Home', 'End'
                                       ];
                                       if (
                                          allowed.includes(e.key) ||
                                          ((e.ctrlKey || e.metaKey) && ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase()))
                                       ) return;
                                       if (!/^\d$/.test(e.key)) e.preventDefault();
                                    }}
                                    onPaste={(e) => {
                                       e.preventDefault();
                                       const paste = (e.clipboardData || window.clipboardData).getData('text');
                                       const digits = paste.replace(/\D/g, '');
                                       const input = e.currentTarget;
                                       const start = input.selectionStart || 0;
                                       const end = input.selectionEnd || 0;
                                       const next = input.value.slice(0, start) + digits + input.value.slice(end);
                                       handleInputChange({ target: { name: 'phone_number', value: next } });
                                    }}
                                 />
                              </div>


                              <div className="form-group">
                                 <label>Role</label>
                                 <input type="text" value="Admin" className="readOnlyField" readOnly />
                              </div>

                              <div className="form-group">
                                 <label>Member Since</label>
                                 <input type="text" value="January 15,2024" className="readOnlyField" readOnly />
                              </div>
                           </div>

                           <div className="button-group">
                              <button className="save-btn" onClick={handleSubmit}>
                                 <Pencil size={16} /> Save Changes
                              </button>
                              <button
                                 className="cancel-btn"
                                 onClick={() => setProfileEdit(false)}
                              >
                                 <X size={16} /> Cancel
                              </button>
                           </div>
                        </div>
                     </div>
                  </form>

               </>
            ) : (
               <>

                  <div className="profile-container">
                     <div className="profile-header">
                        <div>
                           <h2 className="profile-title">Profile Information</h2>
                           <p className="profile-subtitle">
                              Update your personal information and contact details
                           </p>
                        </div>
                        <button className="close-btn" onClick={handleClose}>✕</button>
                     </div>

                     <div className="profile-body">
                        <div className="profile-top">
                           <div>
                              <h3 className="profile-name">{profileName.first_name || "----"} {profileName.last_name || "----"}</h3>
                              <p className="profile-email">{userEmail || "----"}</p>
                           </div>
                           <button className="edit-btn" onClick={() => { setProfileEdit(true); }}>
                              <Pencil className="edit-icon" size={14} /> Edit
                           </button>
                        </div>

                        <div className="profile-grid">
                           <div className="form-group">
                              <label>First Name</label>
                              <input type="text" value={profileName.first_name} className="readOnlyField" readOnly />
                           </div>

                           <div className="form-group">
                              <label>Last Name</label>
                              <input type="text" value={profileName.last_name} className="readOnlyField" readOnly />
                           </div>

                           <div className="form-group">
                              <label>
                                 <MailIcon size={13} className="icon" /> Email Address
                              </label>
                              <input type="text" value={userEmail} className="readOnlyField" readOnly />
                           </div>

                           <div className="form-group">
                              <label>
                                 <PhoneCallIcon size={13} className="icon" /> Phone Number
                              </label>
                              <input type="text" value={formatfieldUSPhoneNumber(profileData.phone_number)} className="readOnlyField" readOnly />
                           </div>

                           <div className="form-group">
                              <label>Role</label>
                              <input type="text" value="Admin" className="readOnlyField" readOnly />
                           </div>

                           <div className="form-group">
                              <label>Member Since</label>
                              <input type="text" value="January 15,2024" className="readOnlyField" readOnly />
                           </div>
                        </div>
                     </div>
                  </div>
               </>
            )}

            <div className="password-container">
               <div className="password-header">
                  <div className="header-left">
                     <Shield className="shield-icon" size={22} />
                     <div>
                        <h3 className="title">Password & Security</h3>
                        <p className="subtitle">
                           Update your password to keep your account secure
                        </p>
                     </div>
                  </div>

                  {!passwordEdit ? (
                     <button
                        className="action-btn"
                        onClick={() => setPasswordEdit(true)}
                     >
                        <Pencil size={16} />
                        Change Password
                     </button>
                  ) : null}
               </div>

               {/* Body */}
               {!passwordEdit ? (
                  <div className="password-info">
                     <p>Keep your account secure by using a strong password.</p>
                     <span className="last-changed">
                        {/* <strong>Last changed:</strong> Never */}
                     </span>
                  </div>
               ) : (
                  <form className="secuirity-form" onSubmit={handleSubmit} >
                     <div className="password-form">
                        <div className="form-group">
                           <label>Current Password</label>
                           <div className="input-wrapper">
                              <input
                                 type={showCurrent ? 'text' : 'password'}
                                 name="current_password"
                                 placeholder="Current Password"
                                 required
                                 value={oldPassword}
                                 onChange={(e) => setOldPassword(e.target.value)}
                                 autoComplete="current-password"
                                 spellCheck="false"
                              />
                              <button
                                 type="button"
                                 className="toggle-visibility"
                                 aria-label={showCurrent ? 'Hide password' : 'Show password'}
                                 aria-pressed={showCurrent}
                                 onClick={() => setShowCurrent(v => !v)}
                                 tabIndex={0}
                              >
                                 {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                              </button>
                           </div>
                        </div>
                        <div className="form-group">
                           <label>New Password</label>
                           <div className="input-wrapper">
                              <input
                                 type={showNew ? 'text' : 'password'}
                                 name="newpassword"
                                 placeholder="New Password"
                                 required
                                 value={newPassword}
                                 onChange={(e) => setNewPassword(e.target.value)}
                                 autoComplete="new-password"
                                 spellCheck="false"
                              />
                              <button
                                 type="button"
                                 className="toggle-visibility"
                                 aria-label={showNew ? 'Hide password' : 'Show password'}
                                 aria-pressed={showNew}
                                 onClick={() => setShowNew(v => !v)}
                                 tabIndex={0}
                              >
                                 {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                              </button>
                           </div>
                           {newPassword == "" ? (<></>) : (<>

                              {newPassword !== profileData.password && (
                                 <small>Password and confirm password must be same</small>
                              )}
                           </>)}
                        </div>

                        <div className="form-group">
                           <label>Confirm Password</label>
                           <div className="input-wrapper">
                              <input
                                 type={showConfirm ? 'text' : 'password'}
                                 placeholder="Confirm Password"
                                 name="password"
                                 required
                                 onChange={handleInputChange}
                                 autoComplete="new-password"
                                 spellCheck="false"
                              />
                              <button
                                 type="button"
                                 className="toggle-visibility"
                                 aria-label={showConfirm ? 'Hide password' : 'Show password'}
                                 aria-pressed={showConfirm}
                                 onClick={() => setShowConfirm(v => !v)}
                                 tabIndex={0}
                              >
                                 {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                              </button>
                           </div>
                        </div>

                        <div className="button-group">
                           <button className="save-btn" type="submit">
                              <Pencil size={16} /> Save Changes
                           </button>
                           <button
                              className="cancel-btn"
                              onClick={() => setPasswordEdit(false)}
                           >
                              <X size={16} /> Cancel
                           </button>
                        </div>
                     </div>
                  </form>
               )}
            </div>
         </div>


         <ToastSucces message={message} type={type} setType={setType} setMessage={setMessage} />
         <div
            onClick={toggleTheme}
            style={{
               cursor: "pointer",
               padding: "10px",
               backgroundColor: "#ddd",
               display: "none",
               borderRadius: "50%",
               position: "fixed",
               top: "50%",
               right: "0",
            }}
         >
            {isDarkMode ? <MoonIcon /> : <SunIcon />}
         </div>
         {openPopup !== '' && (
            <div className={`pro-bg popup ${isDarkMode === false ? "dark" : "Light"}`}>
               <div className="pro-container small">
                  <div className="pro-header flex-row">
                     <span>Profile Status</span>
                     <div className="close" onClick={() => { setOpenPopup('') }}>+</div>
                  </div>
                  <div className="upgrade-description">
                     {openPopup}
                  </div>
               </div>
            </div>
         )}

         {showLoader !== "" && (<>
            <CSavvyPageLoader loaderText={`${showLoader}`} />
         </>)}
      </Fragment>
   );
};

export default Profile;
