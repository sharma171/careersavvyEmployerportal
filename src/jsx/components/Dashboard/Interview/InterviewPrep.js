import React, { Fragment, useState, useEffect, useContext, } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from 'react-bootstrap'; // Assuming you're using react-bootstrap
import { Link } from "react-router-dom";
import GptIcon from "../SearchJobs/aiIcon.gif";
import "./banner.css?ver0.5";
import Feedback from "./feedbackInterviewList";

import LoaderIcon from "../../Dashboard/Home/loading-gif.gif";

//** Import Image */
import DateLightIcon from "./icons/dateIcon.svg";
import Icons from "./icons/proIcon.svg";
import AverageScoreLightIcon from "./icons/averageScoreLightIcon.svg";
import "./interviewpopup.css";
import AverageScoreDarkIcon from "./icons/averageScoreDarkIcon.svg";
import InterviewLight from "./icons/interviewLight.svg";
import InterviewNameLight from "./icons/interviewNameLight.svg";
import OverallScoreLight from "./icons/OverallScoreLight.svg";
import CheckIcon from "./icons/CheckIcon.svg";
import CreateInterview from "./icons/createInterview.svg";
import MinimumScoreDark from "./icons/MinimumScoreDark.svg";
import MaximumScoreDark from "./icons/maximumScoreDark.svg";
import IncompleteIcon from "./icons/incompleteIcon.svg";
import TipsDark from "./icons/TipsDark.svg";
import MinimumScoreLight from "./icons/MinimumScoreLight.svg";
import MaximumScoreLight from "./icons/MaximumSoreLight.svg";
import TipsLight from "./icons/TipsLight.svg";
import DateDark from "./icons/DateDark.svg";
import InterviewLevelDark from "./icons/InterviewLevelDark.svg";
import InterviewNameDark from "./icons/InterviewNameDark.svg";
import OverallscoreDark from "./icons/OverallScoreDark.svg";
import createExamLight from "./icons/createExamLight.svg";
import createExamDark from "./icons/createExamDark.svg";
import FirstpageImage from "../SearchJobs/Components/images/listNavIcons/firstPage.svg";
import PrevPageImage from "../SearchJobs/Components/images/listNavIcons/prevPage.svg";
import CurrentPageImage from "../SearchJobs/Components/images/listNavIcons/currentPageIcon.svg";
import NextPageImage from "../SearchJobs/Components/images/listNavIcons/nextPage.svg";
import LastPageImage from "../SearchJobs/Components/images/listNavIcons/lastPage.svg";

import { ThemeContext } from "../../../../context/ThemeContext";
import { setQuestionAnswer, setIsDarkMode, setDocId, setAnswers, setShowPro, setScenarioBased, setInterviewLevel, setIndustryInterview } from "../../../../store/actions/actions";

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


const DashboardDark = () => {
   const dispatch = useDispatch();

   const [interviews, setInterviews] = useState([]);
   const [examVideoResultsPopup, setExamVideoResultsPopup] = useState(false);
   const [show, setShow] = useState(false);  // State to control the modal
   const [showLoader, setShowLoader] = useState(true);
   const [resultQuestion, setResultQuestion] = useState([]);
   const [examResultsPopup, setExamResultsPopup] = useState(false);
   const [resultData, setResultData] = useState([]);
   const [resultIndex, setResultIndex] = useState([]);
   const [tips, setTips] = useState([]);
   const [tipsPopup, setTipsPopup] = useState(false);
   const [incompleteInterviews, setIncompleteInterviews] = useState([]);
   const [upgradeReminder, setUpgradeReminder] = useState(false);
   const [startInterviewType, setStartInterviewType] = useState("text-based");
   function goToVideoInterviewPage() {
      navigate("/videoInterview");
   }
   // Add a new state for video interview data
   const [videoInterviewData, setVideoInterviewData] = useState([]);
   function makePayment() {
      setUpgradeReminder(false);
      dispatch(setShowPro(true));
   }
   function openreminder() {
      setUpgradeReminder(true);
      console.log("upgradeReminder")
   }
   const fetchInterviews = async () => {
      const payload = {
         email: userEmail,
         task: "fetch_all_interviews"
      };

      try {
         const response = await fetch(
            "https://us-east1-foursssolutions.cloudfunctions.net/interview_prep_function_v2",
            {
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
                  'Authorization': `Bearer ${apiToken}`,
               },
               body: JSON.stringify(payload)
            }
         );

         if (response.ok) {
            const data = await response.json();
            setInterviews(data.response || []); // Assuming 'interviews' is the key in the response
            setResultQuestion(data.response || [])
            setShowLoader(false);
            // If the response contains video interviews, store them
            if (data.video_interview) {
               setVideoInterviewData(data.video_interview);
               
            }
         } else {
            console.error("Error fetching interviews");
         }
      } catch (error) {
         console.error("Error:", error);
      }
   };
   const fetchIncompleteInterviews = async () => {
      const payload = {
         email: userEmail,
         task: "fetch_incomplete_interviews"
      };

      try {
         const response = await fetch(
            "https://us-east1-foursssolutions.cloudfunctions.net/interview_prep_function_v2",
            {
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
                  'Authorization': `Bearer ${apiToken}`,
               },
               body: JSON.stringify(payload)
            }
         );

         if (response.ok) {
            const data = await response.json();
            setIncompleteInterviews(data.response || []); // Assuming 'interviews' is the key in the response
            // setResultQuestion(data.response || [])
         } else {
            console.error("Error fetching interviews");
         }
      } catch (error) {
         console.error("Error:", error);
      }
   };
   const fetchTips = async () => {
      const payload = {
         email: userEmail,
         task: "fetch_tips"
      };

      try {
         const response = await fetch(
            "https://us-east1-foursssolutions.cloudfunctions.net/interview_prep_function_v2",
            {
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
                  'Authorization': `Bearer ${apiToken}`,
               },
               body: JSON.stringify(payload)
            }
         );

         if (response.ok) {
            const data = await response.json();
            setTips(data.response[0] || []); // Assuming 'interviews' is the key in the response
         } else {
            console.error("Error fetching interviews");
         }
      } catch (error) {
         console.error("Error:", error);
      }
   };


   const startExam = (interview) => {
      setShowLoader(true);

      console.log("state", interview.id);
      dispatch(setQuestionAnswer(interview.data.questions));
      dispatch(setDocId(interview.id));
      dispatch(setAnswers(interview.data.answers));
      console.log("question Answer:", questionAnswer);
      setTimeout(() => {
         navigate("/interview-exam")
         console.log("Create Exam data:", questionAnswer);
      }, 6000);
      setShow(false); // Close modal after submission
   };
   // Helper function to safely get the interview date
   const getInterviewDate = (interview) => {
      // For video interviews, assume the date is stored in 'date'
      if (interview.type === "video") {
         return interview.date ? new Date(interview.date) : new Date(0);
      }
      // For text-based interviews
      if (interview.isCompleted) {
         return interview.datetime ? new Date(interview.datetime) : new Date(0);
      } else {
         // Check for interview.data and fallback to 'date' if datetime is missing
         if (interview.data) {
            return interview.data.datetime
               ? new Date(interview.data.datetime)
               : interview.data.date
                  ? new Date(interview.data.date)
                  : new Date(0);
         }
      }
      return new Date(0);
   };

   const CreateExam = async () => {
      setShowLoader(true);
      const payLoad = {
         email: userEmail,
         level: interviewLevel,
         scenario_based: scenarioBased,
         task: "create_exam",
      };

      try {
         const response = await fetch(
            "https://us-east1-foursssolutions.cloudfunctions.net/interview_prep_function_v2",
            {
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${apiToken}`,
               },
               body: JSON.stringify(payLoad),
            }
         );

         if (response.ok) {
            const data = await response.json();
            // Dispatch valid actions (ensure these action creators return plain objects)
            dispatch(setQuestionAnswer(data.response));
            dispatch(setDocId(data.doc_id));
            console.log("Question Answer:", data.response);

            // Navigate after a delay
            setTimeout(() => {
               navigate("/interview-exam");
               console.log("Create Exam data:", data.response);
            }, 11000);
         } else {
            console.error("Error creating exam:", await response.text());
            alert("Failed to create exam. Please try again.");
         }
      } catch (error) {
         console.error("Error creating exam:", error);
         alert("Error creating exam: " + error);
         setShowLoader(false);
      } finally {
         setShow(false); // Close modal after submission
      }
   };


   const handleSubmit = (e) => {
      e.preventDefault();
      CreateExam();
      setShow(false); // Close modal after submission
   };
   // Get profile data and tech skills from Redux state
   const { questionAnswer, isDarkMode, featuresToBlock, apiToken, apiTokenReady, scenarioBased, interviewLevel, industryInterview } = useSelector((state) => state.profile);
   const { changeBackground } = useContext(ThemeContext);
   const navigate = useNavigate();
   const userEmail = useSelector((state) => state.auth.auth.email);

   useEffect(() => {
      if (apiToken !== '' && userEmail !== '') {
         setTimeout(() => {
            fetchInterviews();
            fetchTips();
            fetchIncompleteInterviews();
         }, 1000);
         dispatch(setIndustryInterview(""));
         dispatch(setInterviewLevel(""));
         dispatch(setScenarioBased(false));
      }
   }, [apiTokenReady]);

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

   function openResults(interview, index) {
      setExamResultsPopup(true);
      setResultData(interview);
      console.log("resultData",interview);
      setResultIndex(index);
   }

   function jobNavigate() {
      navigate("/search-job");
   }

   /*------------------------------------------------------*/


   const [currentPage, setCurrentPage] = useState(1);
   const recordsPerPage = 5;

   // Combine, sort, and paginate
   const combinedInterviews = [
      ...interviews
         .filter((item) => item.completed === true) // Ensure only completed interviews are included
         .map((item) => ({ ...item, isCompleted: true })), // Add a flag for completed interviews
      ...incompleteInterviews
         .filter((item) => item.data?.completed === false) // Ensure only incomplete interviews are included
         .map((item) => ({ ...item, isCompleted: false })), // Normalize and add a flag for incomplete interviews
      // Video interviews (assumes video interview objects have a `date` field)
      ...videoInterviewData.map((item) => ({
         ...item,
         // Optionally add a flag if needed; video interviews might not have a "completed" flag
         type: "video"
      }))
   ].sort((a, b) => {
      const dateA = new Date(a.data?.datetime || a.datetime || 0); // Safeguard against missing datetime
      const dateB = new Date(b.data?.datetime || b.datetime || 0); // Safeguard against missing datetime
      return dateB - dateA; // Sort descending by date
   });

   const totalRecords = combinedInterviews.length;
   const totalPages = Math.ceil(totalRecords / recordsPerPage);

   const paginatedInterviews = combinedInterviews.slice(
      (currentPage - 1) * recordsPerPage,
      currentPage * recordsPerPage
   );

   // Pagination handlers
   const goToNextPage = () => {
      if (currentPage < totalPages) setCurrentPage(currentPage + 1);
   };

   const goToPreviousPage = () => {
      if (currentPage > 1) setCurrentPage(currentPage - 1);
   };



   const getInterviewLevel = (interview) => {
      if (interview.type === "video") {
         return interview.level || "N/A";
      }
      return interview.isCompleted ? (interview.level || "N/A") : (interview.data?.level || "N/A");
   };

   const getInterviewEmail = (interview) => {
      if (interview.type === "video") {
         return interview.email || "N/A";
      }
      return interview.isCompleted ? (interview.email_id || "N/A") : (interview.data?.email_id || "N/A");
   };

   const getInterviewScore = (interview) => {
      if (interview.type === "video") {
         // For video interviews, use avg_score (as a number) if available.
         return typeof interview.avg_score === "number"
            ? Number(interview.avg_score).toFixed(1)
            : "N/A";
      }
      // For text-based interviews:
      if (interview.isCompleted) {
         if (interview.rating && Array.isArray(interview.rating) && interview.rating.length > 0) {
            const avg =
               interview.rating.reduce((sum, score) => sum + score, 0) /
               interview.rating.length;
            return avg.toFixed(1);
         } else if (typeof interview.avg_score === "number") {
            return Number(interview.avg_score).toFixed(1);
         } else {
            return "N/A";
         }
      } else {
         return "0";
      }
   };

   const [docsId, setDocsId] = useState("");
   const [feedback, setFeedback] = useState([]);
   function interviewdetails(interviewData) {
      console.log("InterviewData", interviewData);
      setExamVideoResultsPopup(true);
      setDocsId(interviewData.id);
   }



   return (
      <Fragment>
         <div className={`row interview-prep ${isDarkMode === false ? "Light" : "Dark"}`}>
            {interviews.length > 1 || videoInterviewData.length > 0 ? (
               <>
                  <div className="dash-info wrap row-flex">
                     <div className="dash-card row-flex">
                        <div className="dash-icon col-flex">
                           {isDarkMode === false ? (
                              <img src={AverageScoreLightIcon} className="dash-img" alt="dash-img" />
                           ) : (
                              <img src={AverageScoreDarkIcon} className="dash-img" alt="dash-img" />
                           )}
                        </div>
                        {(interviews.length > 1 || videoInterviewData.length > 0) && (
                           <div className="dash-score col-flex">
                              <div className="t-head">Your Overall Score</div>
                              <div className="percent-score">
                                 {(interviews[interviews.length - 1]?.overall_avg_rating
                                    ? (interviews[interviews.length - 1].overall_avg_rating * 10).toFixed(2)
                                    : "0")} %
                              </div>
                              <div className="suggestions">
                                 {interviews[interviews.length - 1]?.max_score
                                    ? "+5% increase in score"
                                    : "Score not evaluated yet"}
                              </div>
                           </div>
                        )}
                     </div>
                     <div className="dash-card row-flex">
                        <div className="dash-icon col-flex">
                           {isDarkMode === false ? (
                              <img src={MinimumScoreLight} className="dash-img" alt="dash-img" />
                           ) : (
                              <img src={MinimumScoreDark} className="dash-img" alt="dash-img" />
                           )}
                        </div>
                        {(interviews.length > 0 || videoInterviewData.length > 0) && (
                        <div className="dash-score col-flex">
                           <div className="t-head">Your Highest Score</div>
                           <div className="percent-score">
                              {interviews[interviews.length - 1]?.max_score
                              ? (interviews[interviews.length - 1].max_score * 10).toFixed(2)
                              : "0"} %
                           </div>
                           <div className="suggestions">
                              {interviews[interviews.length - 1]?.max_score
                              ? "+12% increased Today"
                              : "Score not evaluated yet"}
                           </div>
                        </div>
                        )}
                     </div>
                     <div className="dash-card row-flex">
                        <div className="dash-icon col-flex">
                           {isDarkMode === false ? (
                              <img src={MaximumScoreLight} className="dash-img" alt="dash-img" />
                           ) : (
                              <img src={MaximumScoreDark} className="dash-img" alt="dash-img" />
                           )}
                        </div>
                        {(interviews.length > 0 || videoInterviewData.length > 0) && (() => {
                           const lastInterview = interviews[interviews.length - 1];

                           return (
                              <div className="dash-score col-flex">
                                 <div className="t-head">Your Minimum Score</div>
                                 <div className="percent-score">
                                 {lastInterview?.min_score
                                    ? (lastInterview.min_score * 10).toFixed(2)
                                    : "0"}%
                                 </div>
                                 <div className="suggestions">
                                 {lastInterview?.max_score
                                    ? "+9% increased Today"
                                    : "Score not evaluated yet"}
                                 </div>
                              </div>
                           );
                           })()}
                     </div>
                     <div className="dash-card row-flex" onClick={() => setTipsPopup(true)}>
                        <div className="dash-icon col-flex">
                           {isDarkMode === false ? (
                              <img src={TipsLight} className="dash-img" alt="dash-img" />
                           ) : (
                              <img src={TipsDark} className="dash-img" alt="dash-img" />
                           )}
                        </div>
                        <div className="dash-score col-flex">
                           <div className="t-head">Interview Exam Tips</div>
                           <div className="percent-score">4</div>
                           <div className="suggestions">Get Insights of Exams</div>
                        </div>
                     </div>
                  </div>
                  <div className="interview-table col-flex">
                     <div className="table-heading row-flex">
                        <div className="head-row row-flex">
                           {isDarkMode === false ? (
                              <img src={DateLightIcon} className="icon" alt="icon" />
                           ) : (
                              <img src={DateDark} className="icon" alt="icon" />
                           )}
                           <div className="head-text">Date</div>
                        </div>
                        <div className="divider"></div>
                        <div className="head-row row-flex">
                           {isDarkMode === false ? (
                              <img src={InterviewLight} className="icon" alt="icon" />
                           ) : (
                              <img src={InterviewLevelDark} className="icon" alt="icon" />
                           )}
                           <div className="head-text">Level</div>
                        </div>
                        <div className="divider"></div>
                        <div className="head-row row-flex">
                           {isDarkMode === false ? (
                              <img src={InterviewNameLight} className="icon" alt="icon" />
                           ) : (
                              <img src={InterviewNameDark} className="icon" alt="icon" />
                           )}
                           <div className="head-text">E-mail ID</div>
                        </div>
                        <div className="divider"></div>
                        <div className="head-row row-flex">
                           {isDarkMode === false ? (
                              <img src={OverallScoreLight} className="icon" alt="icon" />
                           ) : (
                              <img src={OverallscoreDark} className="icon" alt="icon" />
                           )}
                           <div className="head-text">Score</div>
                        </div>
                        <div className="divider"></div>
                        <div className="head-row row-flex">
                           {isDarkMode === false ? (
                              <img src={OverallScoreLight} className="icon" alt="icon" />
                           ) : (
                              <img src={OverallscoreDark} className="icon" alt="icon" />
                           )}
                           <div className="head-text">Actions</div>
                        </div>
                     </div>





                     {paginatedInterviews
                        .sort((a, b) => {
                           const dateA = getInterviewDate(a);
                           const dateB = getInterviewDate(b);
                           return dateB - dateA; // Sort descending
                        })
                        .map((interview, index) => {
                           const interviewDate = getInterviewDate(interview);
                           { console.log("Interview", interview); }
                           return (
                              <div
                                 className="table-content row-flex"
                                 onClick={() => {
                                    if (interview.isCompleted) {
                                       openResults(interview, index);
                                    } else if (interview.status === "completed" || interview.status === "in_progress") {
                                       interviewdetails(interview);
                                    } else {
                                       startExam(interview);
                                    }
                                 }}
                                 key={index}
                              >
                                 <div className={`content-row ${interview.isCompleted ? "complete" : `${interview.status == "completed" ? "complete" : interview.status == "in_progress" ? "complete" : "incomplete"}`} row-flex`}>
                                    <div className="Content-text">
                                       {interviewDate.getTime() !== 0
                                          ? interviewDate.toISOString().split("T")[0]
                                          : "N/A"}
                                    </div>
                                 </div>
                                 <div className="divider"></div>
                                 <div className={`content-row ${interview.isCompleted ? "complete" : `${interview.status == "completed" ? "completef complete" : interview.status == "in_progress" ? "completef complete" : "incomplete"}`} row-flex`}>
                                    <div className="Content-text">
                                       {getInterviewLevel(interview)}
                                    </div>
                                 </div>
                                 <div className="divider"></div>
                                 <div className={`content-row ${interview.isCompleted ? "complete" : `${interview.status == "completed" ? "completef complete" : interview.status == "in_progress" ? "completef complete" : "incomplete"}`} row-flex`}>
                                    <div className="Content-text">
                                       {getInterviewEmail(interview)}
                                    </div>
                                 </div>
                                 <div className="divider"></div>
                                 <div className={`content-row ${interview.isCompleted ? "complete" : `${interview.status == "completed" ? "completef complete" : interview.status == "in_progress" ? "completef complete" : "incomplete"}`} row-flex`}>
                                    <div className="Content-text">
                                       {getInterviewScore(interview)}
                                    </div>
                                 </div>
                                 <div className="divider"></div>
                                 <div className={`content-row ${interview.isCompleted ? "complete" : `${interview.status == "completed" ? "completef complete" : interview.status == "in_progress" ? "completef complete" : "incomplete"}`} row-flex`}>
                                    <button className={`action-btn ${interview.isCompleted ? "completed" : interview.status == "completed" ? "completed" : interview.status == "in_progress" ? "completed" : "incompleted"} row-flex`}>
                                       <img
                                          src={interview.isCompleted ? CheckIcon : interview.status == "completed" ? CheckIcon : interview.status == "in_progress" ? CheckIcon : IncompleteIcon}
                                          className={interview.isCompleted ? "complete" : interview.status == "completed" ? "Complete" : interview.status == "in_progress" ? "Complete" : "incomplete"}
                                          alt="icon"
                                       />
                                       <span className="action-text">
                                          {interview.isCompleted ? "Completed" : interview.status == "completed" ? "Video Interview" : interview.status == "in_progress" ? "Video Interview" : "Incomplete"}
                                       </span>
                                    </button>
                                 </div>
                              </div>
                           );
                        })}







                     {(featuresToBlock.includes("block_preptests_free") || featuresToBlock.includes("block_preptests_paid") || featuresToBlock.includes("block_preptests")) ? (
                        <>
                           <button className="create-btn row-flex" onClick={openreminder} >
                              Start New Interview
                              <img src={CreateInterview} alt="submit" className="icon" />
                           </button>

                        </>
                     ) : (
                        <>
                           <ul className="jobPagination">
                              <li
                                 className={`page-indicator ${currentPage === 1 ? "disabled" : ""}`}
                                 onClick={() => currentPage > 1 && setCurrentPage(1)}
                              >
                                 <img src={FirstpageImage} alt="first-page" />
                              </li>
                              <li
                                 className={`page-indicator ${currentPage === 1 ? "disabled" : ""}`}
                                 onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                              >
                                 <img src={PrevPageImage} alt="prev-page" />
                              </li>
                              <li className="currentPage">
                                 {/* <img src={CurrentPageImage} alt="current-page" /> */}
                                 {currentPage}
                              </li>
                              <li
                                 className={`page-indicator ${currentPage === totalPages ? "disabled" : ""
                                    }`}
                                 onClick={() =>
                                    currentPage < totalPages && setCurrentPage(currentPage + 1)
                                 }
                              >
                                 <img src={NextPageImage} alt="next-page" />
                              </li>
                              <li
                                 className={`page-indicator ${currentPage === totalPages ? "disabled" : ""
                                    }`}
                                 onClick={() => currentPage < totalPages && setCurrentPage(totalPages)}
                              >
                                 <img src={LastPageImage} alt="last-page" />
                              </li>
                           </ul>
                           <button className="create-btn row-flex" onClick={() => setShow(true)}>
                              Start New Interview
                              <img src={CreateInterview} alt="submit" className="icon" />
                           </button>

                        </>
                     )}


                  </div>
               </>
            ) : (
               <>{(featuresToBlock.includes("block_preptests_paid") || featuresToBlock.includes("block_preptests_free")) ? (
                  <div
                     className="StartNewInterviewCard"
                     onClick={() => setUpgradeReminder(true)} // Open modal on card click
                     style={{ cursor: "pointer" }} // Add pointer cursor to indicate it's clickable
                  >
                     {isDarkMode === false ? (<img src={createExamLight} alt="start-new-interview" />) : (<img src={createExamDark} alt="start-new-interview" />)}

                     <div className="start-text">Create and Start Your Interview Exam</div>

                  </div>
               ) : (
                  <div
                     className="StartNewInterviewCard"
                     onClick={() => setShow(true)} // Open modal on card click
                     style={{ cursor: "pointer" }} // Add pointer cursor to indicate it's clickable
                  >
                     {isDarkMode === false ? (<img src={createExamLight} alt="start-new-interview" />) : (<img src={createExamDark} alt="start-new-interview" />)}

                     <div className="start-text">Create and Start Your Interview Exam</div>

                  </div>
               )}

                  {/* <div 
               className="StartNewInterviewCard" 
               onClick={() => setShow(true)} // Open modal on card click
               style={{ cursor: "pointer" }} // Add pointer cursor to indicate it's clickable
               >
                  {isDarkMode===false?(<img src={createExamLight} alt="start-new-interview" />):(<img src={createExamDark} alt="start-new-interview" />)}
                  
                  <div className="start-text">Create and Start Your Interview Exam</div>
                  
               </div> */}

               </>
            )}
            <Modal show={show} onHide={() => setShow(false)} className={`modal fade ${isDarkMode === false ? "Light" : "Dark"}`}>
               <div className="modal-content">
                  <div className="modal-header">
                     <h5 className="modal-title">Start Your Interview Exam</h5>
                     <button
                        type="button"
                        className="btn-close"
                        onClick={() => setShow(false)}
                     />
                  </div>
                  <div className="modal-body">
                     <div className="Interview-Chooser">
                        <button
                           className={`manualInterview ${startInterviewType === "text-based" ? "active" : ""}`}
                           onClick={() => setStartInterviewType("text-based")}
                        >
                           Text-Based Interview
                        </button>

                        <button
                           className={`manualInterview ${startInterviewType === "video-based" ? "active" : ""}`}
                           onClick={() => setStartInterviewType("video-based")}
                        >
                           Video-Based Interview
                        </button>
                     </div>
                     {startInterviewType == "text-based" ? (
                        <>
                           <form onSubmit={handleSubmit}>
                              {/* Interview Level Dropdown */}
                              <div className="form-group mb-3">
                                 <label htmlFor="interviewLevel">Interview Level</label>
                                 <select
                                    id=""
                                    className="form-control"
                                    value={interviewLevel}
                                    onChange={(e) => dispatch(setInterviewLevel(e.target.value))}
                                    required
                                 >
                                    <option value="">Select Level</option>
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                 </select>
                              </div>
                              <div className="form-group mb-3">
                                 <label htmlFor="interviewLevel">Company / Industry</label>
                                 <input
                                    id=""
                                    className="form-control"
                                    placeholder="Type Here Preferred Company/Industry"

                                    required
                                 >
                                 </input>
                              </div>

                              {/* Scenario-Based Checkbox */}
                              <div className="form-group form-check mb-3">
                                 <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="scenarioBased"
                                    checked={scenarioBased}
                                    onChange={() => dispatch(setScenarioBased(!scenarioBased))}
                                 />
                                 <label className="form-check-label" htmlFor="scenarioBased">
                                    Scenario Based
                                 </label>
                              </div>

                              {/* Submit Button */}
                              <button className="btn btn-primary btn-block" type="submit">
                                 Start Your Interview Exam
                              </button>
                           </form>
                        </>
                     ) : (
                        <>
                           {/* Interview Level Dropdown */}
                           <div className="form-group mb-3">
                              <label htmlFor="interviewLevel">Interview Level</label>
                              <select
                                 id="interviewLevel"
                                 className="form-control"
                                 value={interviewLevel}
                                 onChange={(e) => dispatch(setInterviewLevel(e.target.value))}
                                 required
                              >
                                 <option value="">Select Level</option>
                                 <option value="beginner">Beginner</option>
                                 <option value="intermediate">Intermediate</option>
                                 <option value="advanced">Advanced</option>
                              </select>
                           </div>
                           <div className="form-group mb-3">
                              <label htmlFor="interviewLevel">Preferred Company or Industry</label>
                              <input
                                 id="CompanyIndustry"
                                 className="form-control"
                                 value={industryInterview}
                                 placeholder="Type Here Preferred Company or Industry"
                                 onChange={(e) => dispatch(setIndustryInterview(e.target.value))}
                                 required
                              >
                              </input>
                           </div>

                           {/* Scenario-Based Checkbox */}
                           <div className="form-group form-check mb-3">
                              <input
                                 type="checkbox"
                                 className="form-check-input"
                                 id="scenarioBased"
                                 checked={scenarioBased}
                                 onChange={() => dispatch(setScenarioBased(!scenarioBased))}
                              />
                              <label className="form-check-label" htmlFor="scenarioBased">
                                 Scenario Based
                              </label>
                           </div>

                           <button className="btn btn-primary btn-block" onClick={goToVideoInterviewPage}>
                              Go To Video Interview
                           </button>
                        </>)}

                  </div>
               </div>
            </Modal>
            <Modal show={tipsPopup} onHide={() => setTipsPopup(false)} className={`modal fade ${isDarkMode === false ? "Light" : "Dark"}`}>
               <div className="modal-content">
                  <div className="modal-header">
                     <h5 className="modal-title">Tips for Interview Exam</h5>
                     <button
                        type="button"
                        className="btn-close"
                        onClick={() => setTipsPopup(false)}
                     />
                  </div>
                  <div className="modal-body">
                     {
                        Object.entries(tips).map(([key, value]) => (
                           <label className="form-check-label" key={key}>
                              {key}. {value}
                           </label>
                        ))
                     }
                  </div>
               </div>
            </Modal>
            {examVideoResultsPopup && (
               <>
                  <div className={`resumeOuter ${isDarkMode === false ? "light" : "dark"}`}>
                     <div className="resumeTab">
                        <Link to="/interview-prep" className="pop-close" >
                           <div className="close" onClick={() => setExamVideoResultsPopup(false)}>+</div>
                        </Link>
                        <div className="col-flex">
                           <h4 className="fs-18 border-bottom text-black font-w600 mb-3">Exam Results Overview</h4>
                           <div className="fwline"></div>
                           {/* <div className="row-flex">
                        <Link to="#" className="pop-close" onClick={()=> setShowPopup(false)}>View Exam Overview</Link>
                        <Link to="/interview-prep" className="pop-close" onClick={()=> setShowPopup(false)}>Go to Dashboard</Link>
                     </div> */}
                           <div className="feedbackbox  videoInterview">

                              {examVideoResultsPopup && (<><Feedback docsId={docsId} feedback={feedback} setFeedback={setFeedback} /></>)}
                           </div>


                        </div>
                     </div>
                  </div>
               </>
            )}
            {examResultsPopup && (
               <>
                  <div className={`resumeOuter ${isDarkMode === false ? "light" : "dark"}`}>
                     <div className="resumeTab">
                        <Link to="/interview-prep" className="pop-close" >
                           <div className="close" onClick={() => setExamResultsPopup(false)}>+</div>
                        </Link>
                        <div className="col-flex">
                           <h4 className="fs-18 border-bottom text-black font-w600 mb-3">Exam Results Overview</h4>
                           <div className="fwline"></div>
                           {/* <div className="row-flex">
                        <Link to="#" className="pop-close" onClick={()=> setShowPopup(false)}>View Exam Overview</Link>
                        <Link to="/interview-prep" className="pop-close" onClick={()=> setShowPopup(false)}>Go to Dashboard</Link>
                     </div> */}
                           <div className="col-flex results-summary card">

                              {resultData.questions.map((interview, index) => (
                                 <div key={index} className="col-flex">
                                    <div className="text question fw-bold text-primary">
                                       <span>
                                          {isDarkMode === false ? (
                                             <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <g clip-path="url(#clip0_81_147)">
                                                   <path fill-rule="evenodd" clip-rule="evenodd" d="M9.99992 0.833252C4.93742 0.833252 0.833252 4.93742 0.833252 9.99992C0.833252 15.0624 4.93742 19.1666 9.99992 19.1666C15.0624 19.1666 19.1666 15.0624 19.1666 9.99992C19.1666 4.93742 15.0624 0.833252 9.99992 0.833252ZM9.07658 7.44575C9.26825 7.06825 9.40992 6.88908 9.52742 6.79575C9.61575 6.72575 9.73575 6.66658 9.99992 6.66658C10.5208 6.66658 10.8333 7.05825 10.8333 7.48158C10.8333 7.71325 10.7883 7.82825 10.6649 7.97492C10.4924 8.17992 10.1733 8.42908 9.54158 8.84658L9.16658 9.09325V10.8333C9.16658 11.0543 9.25438 11.2662 9.41066 11.4225C9.56694 11.5788 9.7789 11.6666 9.99992 11.6666C10.2209 11.6666 10.4329 11.5788 10.5892 11.4225C10.7455 11.2662 10.8333 11.0543 10.8333 10.8333V9.98575C11.2849 9.67408 11.6641 9.37575 11.9391 9.04908C12.3366 8.57742 12.4999 8.07408 12.4999 7.48158C12.4999 6.25658 11.5558 4.99992 9.99992 4.99992C9.42992 4.99992 8.92575 5.14658 8.49325 5.48908C8.08992 5.80825 7.81492 6.24742 7.58992 6.69325C7.53763 6.79114 7.50543 6.89849 7.49519 7.00899C7.48496 7.1195 7.4969 7.23093 7.53031 7.33676C7.56372 7.44259 7.61794 7.54068 7.68977 7.62527C7.76161 7.70986 7.84962 7.77925 7.94863 7.82937C8.04765 7.87949 8.15568 7.90932 8.26638 7.91713C8.37708 7.92493 8.48823 7.91054 8.5933 7.87481C8.69836 7.83907 8.79524 7.78271 8.87823 7.70904C8.96122 7.63536 9.02866 7.54585 9.07658 7.44575ZM10.8333 13.7499C10.8333 13.5289 10.7455 13.3169 10.5892 13.1607C10.4329 13.0044 10.2209 12.9166 9.99992 12.9166C9.7789 12.9166 9.56694 13.0044 9.41066 13.1607C9.25438 13.3169 9.16658 13.5289 9.16658 13.7499V14.1666C9.16658 14.3876 9.25438 14.5996 9.41066 14.7558C9.56694 14.9121 9.7789 14.9999 9.99992 14.9999C10.2209 14.9999 10.4329 14.9121 10.5892 14.7558C10.7455 14.5996 10.8333 14.3876 10.8333 14.1666V13.7499Z" fill="#48A9F8" />
                                                </g>
                                                <defs>
                                                   <clipPath id="clip0_81_147">
                                                      <rect width="20" height="20" fill="white" />
                                                   </clipPath>
                                                </defs>
                                             </svg>

                                          ) : (
                                             <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <g clip-path="url(#clip0_81_147)">
                                                   <path fill-rule="evenodd" clip-rule="evenodd" d="M9.99992 0.833252C4.93742 0.833252 0.833252 4.93742 0.833252 9.99992C0.833252 15.0624 4.93742 19.1666 9.99992 19.1666C15.0624 19.1666 19.1666 15.0624 19.1666 9.99992C19.1666 4.93742 15.0624 0.833252 9.99992 0.833252ZM9.07658 7.44575C9.26825 7.06825 9.40992 6.88908 9.52742 6.79575C9.61575 6.72575 9.73575 6.66658 9.99992 6.66658C10.5208 6.66658 10.8333 7.05825 10.8333 7.48158C10.8333 7.71325 10.7883 7.82825 10.6649 7.97492C10.4924 8.17992 10.1733 8.42908 9.54158 8.84658L9.16658 9.09325V10.8333C9.16658 11.0543 9.25438 11.2662 9.41066 11.4225C9.56694 11.5788 9.7789 11.6666 9.99992 11.6666C10.2209 11.6666 10.4329 11.5788 10.5892 11.4225C10.7455 11.2662 10.8333 11.0543 10.8333 10.8333V9.98575C11.2849 9.67408 11.6641 9.37575 11.9391 9.04908C12.3366 8.57742 12.4999 8.07408 12.4999 7.48158C12.4999 6.25658 11.5558 4.99992 9.99992 4.99992C9.42992 4.99992 8.92575 5.14658 8.49325 5.48908C8.08992 5.80825 7.81492 6.24742 7.58992 6.69325C7.53763 6.79114 7.50543 6.89849 7.49519 7.00899C7.48496 7.1195 7.4969 7.23093 7.53031 7.33676C7.56372 7.44259 7.61794 7.54068 7.68977 7.62527C7.76161 7.70986 7.84962 7.77925 7.94863 7.82937C8.04765 7.87949 8.15568 7.90932 8.26638 7.91713C8.37708 7.92493 8.48823 7.91054 8.5933 7.87481C8.69836 7.83907 8.79524 7.78271 8.87823 7.70904C8.96122 7.63536 9.02866 7.54585 9.07658 7.44575ZM10.8333 13.7499C10.8333 13.5289 10.7455 13.3169 10.5892 13.1607C10.4329 13.0044 10.2209 12.9166 9.99992 12.9166C9.7789 12.9166 9.56694 13.0044 9.41066 13.1607C9.25438 13.3169 9.16658 13.5289 9.16658 13.7499V14.1666C9.16658 14.3876 9.25438 14.5996 9.41066 14.7558C9.56694 14.9121 9.7789 14.9999 9.99992 14.9999C10.2209 14.9999 10.4329 14.9121 10.5892 14.7558C10.7455 14.5996 10.8333 14.3876 10.8333 14.1666V13.7499Z" fill="white" fill-opacity="0.71" />
                                                </g>
                                                <defs>
                                                   <clipPath id="clip0_81_147">
                                                      <rect width="20" height="20" fill="white" />
                                                   </clipPath>
                                                </defs>
                                             </svg>
                                          )}

                                          Question {index + 1}: {resultData.questions[index][index + 1] || "N/A"}</span>
                                    </div>
                                    <div className="text answer">

                                       <span>
                                          {isDarkMode === false ? (
                                             <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="11.0961" cy="11.2726" r="10.4835" fill="#E0BA57" />
                                                <path d="M12.75 11.6413L11.6169 10.5081L11 11.125L12.75 12.875L15.375 10.25L14.7581 9.63313L12.75 11.6413ZM7.5 12.875H8.375V13.75H7.5V12.875ZM9.25 8.9375H7.0625V9.8125H8.8125V10.6875H7.5V12H8.375V11.5625H9.25C9.36603 11.5625 9.47731 11.5164 9.55936 11.4344C9.64141 11.3523 9.6875 11.241 9.6875 11.125V9.375C9.6875 9.25897 9.64141 9.14769 9.55936 9.06564C9.47731 8.98359 9.36603 8.9375 9.25 8.9375Z" fill="#E2EFFF" />
                                                <path d="M11.7595 18.125L11 17.6875L12.75 14.625H15.375C15.8593 14.625 16.25 14.2343 16.25 13.75V8.5C16.25 8.01569 15.8593 7.625 15.375 7.625H6.625C6.14069 7.625 5.75 8.01569 5.75 8.5V13.75C5.75 14.2343 6.14069 14.625 6.625 14.625H10.5625V15.5H6.625C6.16087 15.5 5.71575 15.3156 5.38756 14.9874C5.05937 14.6592 4.875 14.2141 4.875 13.75V8.5C4.875 7.53312 5.65812 6.75 6.625 6.75H15.375C16.3419 6.75 17.125 7.53312 17.125 8.5V13.75C17.125 14.2141 16.9406 14.6592 16.6124 14.9874C16.2842 15.3156 15.8391 15.5 15.375 15.5H13.2597L11.7595 18.125Z" fill="#E2EFFF" />
                                             </svg>
                                          ) : (
                                             <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <g clip-path="url(#clip0_81_147)">
                                                   <path fill-rule="evenodd" clip-rule="evenodd" d="M9.99992 0.833252C4.93742 0.833252 0.833252 4.93742 0.833252 9.99992C0.833252 15.0624 4.93742 19.1666 9.99992 19.1666C15.0624 19.1666 19.1666 15.0624 19.1666 9.99992C19.1666 4.93742 15.0624 0.833252 9.99992 0.833252ZM9.07658 7.44575C9.26825 7.06825 9.40992 6.88908 9.52742 6.79575C9.61575 6.72575 9.73575 6.66658 9.99992 6.66658C10.5208 6.66658 10.8333 7.05825 10.8333 7.48158C10.8333 7.71325 10.7883 7.82825 10.6649 7.97492C10.4924 8.17992 10.1733 8.42908 9.54158 8.84658L9.16658 9.09325V10.8333C9.16658 11.0543 9.25438 11.2662 9.41066 11.4225C9.56694 11.5788 9.7789 11.6666 9.99992 11.6666C10.2209 11.6666 10.4329 11.5788 10.5892 11.4225C10.7455 11.2662 10.8333 11.0543 10.8333 10.8333V9.98575C11.2849 9.67408 11.6641 9.37575 11.9391 9.04908C12.3366 8.57742 12.4999 8.07408 12.4999 7.48158C12.4999 6.25658 11.5558 4.99992 9.99992 4.99992C9.42992 4.99992 8.92575 5.14658 8.49325 5.48908C8.08992 5.80825 7.81492 6.24742 7.58992 6.69325C7.53763 6.79114 7.50543 6.89849 7.49519 7.00899C7.48496 7.1195 7.4969 7.23093 7.53031 7.33676C7.56372 7.44259 7.61794 7.54068 7.68977 7.62527C7.76161 7.70986 7.84962 7.77925 7.94863 7.82937C8.04765 7.87949 8.15568 7.90932 8.26638 7.91713C8.37708 7.92493 8.48823 7.91054 8.5933 7.87481C8.69836 7.83907 8.79524 7.78271 8.87823 7.70904C8.96122 7.63536 9.02866 7.54585 9.07658 7.44575ZM10.8333 13.7499C10.8333 13.5289 10.7455 13.3169 10.5892 13.1607C10.4329 13.0044 10.2209 12.9166 9.99992 12.9166C9.7789 12.9166 9.56694 13.0044 9.41066 13.1607C9.25438 13.3169 9.16658 13.5289 9.16658 13.7499V14.1666C9.16658 14.3876 9.25438 14.5996 9.41066 14.7558C9.56694 14.9121 9.7789 14.9999 9.99992 14.9999C10.2209 14.9999 10.4329 14.9121 10.5892 14.7558C10.7455 14.5996 10.8333 14.3876 10.8333 14.1666V13.7499Z" fill="#48A9F8" />
                                                </g>
                                                <defs>
                                                   <clipPath id="clip0_81_147">
                                                      <rect width="20" height="20" fill="white" />
                                                   </clipPath>
                                                </defs>
                                             </svg>

                                          )}
                                          Answer: {resultData.answers[index] || "N/A"}</span>
                                    </div>
                                    <div className="text rating">
                                       <span>
                                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                             <path d="M12 22.5C17.799 22.5 22.5 17.799 22.5 12C22.5 6.20101 17.799 1.5 12 1.5C6.20101 1.5 1.5 6.20101 1.5 12C1.5 17.799 6.20101 22.5 12 22.5Z" fill="#F44336" />
                                             <path d="M12.0002 5.5L13.9502 9.45L18.3002 10.1L15.1502 13.15L15.9002 17.5L12.0002 15.45L8.1002 17.5L8.8502 13.15L5.7002 10.1L10.0502 9.45L12.0002 5.5Z" fill="#FFCA28" />
                                          </svg>

                                          Rating: {resultData.rating[index] || "N/A"}</span>
                                    </div>
                                    <div className="text feedback">
                                       <span>
                                          {isDarkMode === false ? (
                                             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M14.7701 12.4C14.9201 12.47 15.0901 12.5 15.2501 12.5C15.5801 12.5 15.8901 12.37 16.1301 12.14L18.3101 10H19.2501C20.7701 10 22.0001 8.77 22.0001 7.25V4.75C22.0001 3.23 20.7701 2 19.2501 2H14.7501C13.2301 2 12.0001 3.23 12.0001 4.75V7.25C12.0001 8.51 12.8501 9.57 14.0001 9.9V11.25C14.0001 11.75 14.3101 12.2 14.7701 12.4ZM8.0001 13.5C6.0701 13.5 4.5001 11.93 4.5001 10C4.5001 8.07 6.0701 6.5 8.0001 6.5C9.9301 6.5 11.5001 8.07 11.5001 10C11.5001 11.93 9.9301 13.5 8.0001 13.5ZM8.0001 22C5.9401 22 4.3601 21.44 3.3001 20.33C1.9641 18.926 1.9971 17.156 2.0001 16.973V16.96C2.0001 15.89 2.9001 15 4.0001 15H12.0001C13.1001 15 14.0001 15.9 14.0001 17L14.0011 17.006C14.0041 17.133 14.0461 18.916 12.7011 20.33C11.6401 21.44 10.0601 22 8.0001 22Z" fill="#244686" />
                                             </svg>

                                          ) : (
                                             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M14.7701 12.4C14.9201 12.47 15.0901 12.5 15.2501 12.5C15.5801 12.5 15.8901 12.37 16.1301 12.14L18.3101 10H19.2501C20.7701 10 22.0001 8.77 22.0001 7.25V4.75C22.0001 3.23 20.7701 2 19.2501 2H14.7501C13.2301 2 12.0001 3.23 12.0001 4.75V7.25C12.0001 8.51 12.8501 9.57 14.0001 9.9V11.25C14.0001 11.75 14.3101 12.2 14.7701 12.4ZM8.0001 13.5C6.0701 13.5 4.5001 11.93 4.5001 10C4.5001 8.07 6.0701 6.5 8.0001 6.5C9.9301 6.5 11.5001 8.07 11.5001 10C11.5001 11.93 9.9301 13.5 8.0001 13.5ZM8.0001 22C5.9401 22 4.3601 21.44 3.3001 20.33C1.9641 18.926 1.9971 17.156 2.0001 16.973V16.96C2.0001 15.89 2.9001 15 4.0001 15H12.0001C13.1001 15 14.0001 15.9 14.0001 17L14.0011 17.006C14.0041 17.133 14.0461 18.916 12.7011 20.33C11.6401 21.44 10.0601 22 8.0001 22Z" fill="white" />
                                             </svg>

                                          )}
                                          Feedback: {resultData.feedback_comments[index] || "N/A"}</span>
                                    </div>
                                    <hr className="my-3" />
                                 </div>
                              ))}

                           </div>

                        </div>
                     </div>
                  </div>
               </>
            )}
         </div>
         {upgradeReminder && (
            <div className={`pro-bg ${isDarkMode === false ? "dark" : "Light"}`}>
               <div className="pro-container small">
                  <div className="pro-header flex-row">
                     <img src={Icons} className="icon" alt="icons" />
                     <span>Upgrade To Pro</span>
                     <div className="close" onClick={() => setUpgradeReminder(false)}>+</div>
                  </div>
                  <div className="upgrade-description">
                     {featuresToBlock.includes("block_preptests_free") ? "Upgrade to Pro to access these features and reach your career goals faster with the help of CareerSavvy." : "You have used the allowable tests for this month. New tests will reset at the beginning of the next subscription cycle."}

                  </div>
                  {featuresToBlock.includes("block_preptests_free") ? (
                     <div className="upgrade-button" onClick={makePayment}>
                        Upgrade Now
                     </div>
                  ) : (
                     <div className="upgrade-button" onClick={jobNavigate}>
                        Search Jobs
                     </div>
                  )}

               </div>
            </div>
         )}
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
         {showLoader && (<div className="LoaderAnimation">
            <div className="gptAnimate"></div>
            <img className="gptIcon" src={GptIcon} alt="gptIcon" />
         </div>)}
      </Fragment>
   );
};

export default DashboardDark;