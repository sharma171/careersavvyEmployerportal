import React, { Fragment, useState, useRef, useEffect, useContext } from "react";
import "./interviewExamNstyle.css";
import CSavvyPageLoader from "../CsavvyPageLoad";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ThemeContext } from "../../../../context/ThemeContext";
import { setIsDarkMode, setAnswers, setQuestionAnswer, setDocId } from "../../../../store/actions/actions";
import MonacoEditor from "react-monaco-editor";
import PrevIcon from "./icons/PrevIcon.svg";
import QuestionIcon from "./icons/QuestionIcon.svg";
import NextIcon from "./icons/NextIcon.svg";
import AnswerIcon from "./icons/AnswerIcon.svg";
import DraftIcon from "./icons/DraftIcon.svg";
import SubmitIcon from "./icons/submitIcon.svg";
import LoadingIcon from "./icons/loaderGif.gif";
import VoiceAi from "./icons/VoiceAi.svg";
import "./banner.css?ver0.5";

// Sun and Moon icons
const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
    <circle cx="12" cy="12" r="5" fill="yellow" stroke="orange" strokeWidth="2" />
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
  const { questionAnswer, isDarkMode, docId, answers, apiToken, apiTokenReady, scenarioBased, interviewLevel, industryInterview } = useSelector((state) => state.profile);
  const { changeBackground } = useContext(ThemeContext);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [Output, setOutput] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [voutput, SetVoutput] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [examResultsPopup, setShowResultsPopup] = useState(false); 
  const [resultQuestion, setResultQuestion] = useState([]);
  const [voiceAssistEnabled, setVoiceAssistEnabled] = useState(true); // Flag to enable/disable voice assistant feature
  const navigate = useNavigate;
  const userEmail = useSelector((state) => state.auth.auth.email);

  useEffect(() => {
    // Initial setup of theme when the component loads
    const currentTheme = isDarkMode ? "dark" : "light";
    changeBackground({
      value: currentTheme,
      label: currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1),
    });
  }, [isDarkMode]);


  useEffect(() => {
    const savedAnswers = JSON.parse(localStorage.getItem("answers"));
    const savedQuestionAnswer = JSON.parse(localStorage.getItem("questionAnswer"));
    const savedDocId = localStorage.getItem("docId");
  
    // Dispatch saved values if they exist
    if (savedQuestionAnswer) {
      dispatch(setQuestionAnswer(savedQuestionAnswer));
  
      // Initialize answers as an empty array of the same length if no saved answers exist
      if (savedAnswers) {
        dispatch(setAnswers(savedAnswers));
      } else {
        const emptyAnswers = Array(savedQuestionAnswer.length).fill("");
        dispatch(setAnswers(emptyAnswers));
      }
    }
  
    if (savedDocId) dispatch(setDocId(savedDocId));
  }, [dispatch]);
  
  useEffect(() => {
    if (answers) localStorage.setItem("answers", JSON.stringify(answers));
    if (questionAnswer) localStorage.setItem("questionAnswer", JSON.stringify(questionAnswer));
    if (docId) localStorage.setItem("docId", docId);
  }, [answers, questionAnswer, docId]);

  const handleAnswerChange = (event) => {
    const updatedAnswers = [...answers]; // Create a shallow copy of the answers array
    updatedAnswers[currentQuestionIndex] = event.target.value; // Update the current question's answer
    dispatch(setAnswers(updatedAnswers)); // Dispatch updated answers to Redux
  };

  const handleEditorChange = (value) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = value;
    dispatch(setAnswers(newAnswers));
  };
  const clearEditorAnswer = () => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = "";
    dispatch(setAnswers(newAnswers));
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      resetTranscript();
      setOutput(false);
      SetVoutput("");
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < Object.keys(questionAnswer)?.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      resetTranscript();
      setOutput(false);
      SetVoutput("");
    }
  };

  const validate = async () => {
    setShowLoader(true);
    const valPayLoad = {
      code: answers[currentQuestionIndex],
      email: userEmail,
      language: questionAnswer[currentQuestionIndex]?.language
    };
    try {
      const response = await fetch(
        "https://us-east1-foursssolutions.cloudfunctions.net/interview_prep_code_submission_v2",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${apiToken}`,
          },
          body: JSON.stringify(valPayLoad),
        }
      );
      if (response.ok) {
        const data = await response.json();
        SetVoutput(data);
        setOutput(true);
        setShowLoader(false);
      }
    } catch (error) {
      console.error("Error saving draft:", error);
      setShowLoader(false);
    }
  };

   const LeaveInterview = () => {
    SaveToDraft(); // your function
  };

  const SaveToDraft = async () => {
    const payLoad = {
      email: userEmail,
      task: "submit_answers",
      questions: questionAnswer,
      answers,
      completed: false,
      scenario_based: scenarioBased,
      level: interviewLevel,
      doc_id: docId,
    };
    setShowLoader(true);
    try {
      const response = await fetch(
        "https://us-east1-foursssolutions.cloudfunctions.net/interview_prep_function_v2",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${apiToken}`,
          },
          body: JSON.stringify(payLoad),
        }
      );
      if (response.ok) {
        const data = await response.json();
        console.log("Draft saved:", data);
        
        setTimeout(() => {
          setShowLoader(false);
          // alert("Saved to draft");
        }, 1000);
      }
    } catch (error) {
      console.error("Error saving draft:", error);
      setShowLoader(false);
    }
  };

  const SubmitExam = async () => {
    const payLoad = {
      email: userEmail,
      task: "submit_answers",
      questions: questionAnswer,
      answers,
      completed: true,
      scenario_based: scenarioBased,
      level: interviewLevel,
      doc_id: docId,
    };
    setShowLoader(true);
    try {
      const response = await fetch(
        "https://us-east1-foursssolutions.cloudfunctions.net/interview_prep_function_v2",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${apiToken}`,
          },
          body: JSON.stringify(payLoad),
        }
      );
      if (response.ok) {
        const data = await response.json();
        console.log("Exam submitted:", data);
        setShowLoader(false);
        setResultQuestion(data);
        examcomplete();
      }
    } catch (error) {
      console.error("Error submitting exam:", error);
      setShowLoader(false);
    }
  };

  function examcomplete() {
    setShowPopup(true);
  }

  function showResult() {
    setShowPopup(false);
    setShowResultsPopup(true);
  }



  // Speech Recognition setup
  const [isListening, setIsListening] = useState(false);
  const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const [voiceAssist, setVoiceAssist] = useState(false);

  const toggleListening = () => {
    if (isListening) {
      setVoiceAssist(false);
      setTimeout(()=>{
        SpeechRecognition.stopListening();
      setIsListening(false);
      
      // Update answers with transcript
      if (transcript) {
        const updatedAnswers = [...answers];
        updatedAnswers[currentQuestionIndex] = 
          (updatedAnswers[currentQuestionIndex] || "") + transcript;
        dispatch(setAnswers(updatedAnswers));
      }
      
      resetTranscript();
      },1500)
      
    } else {
      setVoiceAssist(true);
      SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
      setIsListening(true);
    }
  };
  // Spacebar recognition for toggling speech recognition
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Prevent toggling when typing inside textarea or editor
      if (event.target.tagName === "TEXTAREA" || 
          event.target.className.includes("monaco-editor")) {
        return;
      }
      
      // Only process if voice assist is enabled
      if (!voiceAssistEnabled) return;

      if (event.code === "Space") {
        event.preventDefault(); // Prevent scrolling when pressing space
        
        if (isListening) {
          setVoiceAssist(false);
          setTimeout(()=>{
              // Stop listening
              SpeechRecognition.stopListening();
              setIsListening(false);
              
              // Update answers with transcript
              if (transcript) {
                const updatedAnswers = [...answers];
                updatedAnswers[currentQuestionIndex] = 
                  (updatedAnswers[currentQuestionIndex] || "") + transcript;
                dispatch(setAnswers(updatedAnswers));
              }
              
              resetTranscript();
          },1500)
          
        } else {
          setVoiceAssist(true);
          // Start listening
          SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
          setIsListening(true);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isListening, transcript, answers, currentQuestionIndex, dispatch, resetTranscript, voiceAssistEnabled]);


  const [notification, setNotification] = useState("");

  useEffect(() => {
    const showNotification = (message) => {
      setNotification(message);
      setTimeout(() => setNotification(""), 2000);
    };

    const handleRestrictedAction = (event, message) => {
      event.preventDefault();
      showNotification(message);
      return false;
    };

    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && ["c", "v", "x"].includes(event.key.toLowerCase())) {
        return handleRestrictedAction(event, "Copying and pasting is not allowed in this assessment.");
      }
    };

    const handleContextMenu = (event) => handleRestrictedAction(event, "Right-click is disabled.");
    const handleDragStart = (event) => handleRestrictedAction(event, "Drag and drop is not allowed.");
    const handleDrop = (event) => handleRestrictedAction(event, "Drag and drop is not allowed.");
    const handleCopy = (event) => handleRestrictedAction(event, "Copying and pasting is not allowed in this assessment.");
    const handleCut = (event) => handleRestrictedAction(event, "Copying and pasting is not allowed in this assessment.");
    const handlePaste = (event) => handleRestrictedAction(event, "Copying and pasting is not allowed in this assessment.");

    const textarea = document.getElementById("answerTextarea");
    if (textarea) {
      textarea.addEventListener("keydown", handleKeyDown);
      textarea.addEventListener("contextmenu", handleContextMenu);
      textarea.addEventListener("dragstart", handleDragStart);
      textarea.addEventListener("drop", handleDrop);
      textarea.addEventListener("copy", handleCopy);
      textarea.addEventListener("cut", handleCut);
      textarea.addEventListener("paste", handlePaste);
    }

    return () => {
      if (textarea) {
        textarea.removeEventListener("keydown", handleKeyDown);
        textarea.removeEventListener("contextmenu", handleContextMenu);
        textarea.removeEventListener("dragstart", handleDragStart);
        textarea.removeEventListener("drop", handleDrop);
        textarea.removeEventListener("copy", handleCopy);
        textarea.removeEventListener("cut", handleCut);
        textarea.removeEventListener("paste", handlePaste);
      }
    };
  }, []);

  const handleCopy = (e) => {
    e.preventDefault();
    alert("Copying is disabled!");
  };

  const handlePaste = (e) => {
    e.preventDefault();
    alert("Pasting is disabled!");
  };

  

  return (
    <Fragment>
      <div className="interviewExamSection"  onCopy={handleCopy}
      onPaste={handlePaste}>
        <div className="examTopSection">
          <div className="questCount">
            Question : {currentQuestionIndex + 1} of {Object.keys(questionAnswer)?.length}
          </div>
          <div className="rightSection">
            {currentQuestionIndex === Object.keys(questionAnswer).length - 1 ?(<>
            
            <button className="endInterview" onClick={SubmitExam}>
              <span>+</span>
              End Interview
            </button>
            </>):(<>
            <Link to={"/aspire-quest"} className="endInterview" onClick={LeaveInterview}>
              <span>+</span>
              Leave Interview
            </Link>
            
            </>)}
          </div>
        </div>
        <div className="QuestionBox">
          <h3 className="question">{questionAnswer && questionAnswer[currentQuestionIndex] && 
              Object.values(questionAnswer[currentQuestionIndex])[0]}</h3>
        </div>
        <div className="answerBox">
          <div className="col-flex answer">
            {questionAnswer[currentQuestionIndex]?.initialize_code === "yes" ? (
              <>
              <div className="code-edit">
                <div className="editorWindow">
                  <div className="topHead">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
                    Code Editor
                  </div>
                  <MonacoEditor
                    width={`${Output === true ? "calc(97% - 1rem)" : "calc(97% - 1rem)"}`}
                    height="160"
                    language={questionAnswer[currentQuestionIndex]?.language}
                    theme={isDarkMode ? "vs-dark" : "light"}
                    value={answers[currentQuestionIndex] || ""}
                    onChange={handleEditorChange}
                  />
                  <div className="bottomSection">
                    <div className="buttonRow">
                      <button className="normalButton" onClick={()=>clearEditorAnswer()}>
                        Reset
                      </button>
                    </div>
                    <div className="buttonRow">
                      <button className="actionButton" onClick={validate}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-play h-4 w-4" data-lov-id="src/components/ObjectiveIDE.tsx:103:14" data-lov-name="Play" data-component-path="src/components/ObjectiveIDE.tsx" data-component-line="103" data-component-file="ObjectiveIDE.tsx" data-component-name="Play" data-component-content="%7B%22className%22%3A%22h-4%20w-4%22%7D"><polygon points="6 3 20 12 6 21 6 3"></polygon></svg>
                        Run Code
                      </button>
                    </div>
                  </div>
                </div>
                <div className="editorWindow">
                  <span className="topHead"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" x2="20" y1="19" y2="19"></line></svg> Output</span>
                  <div className="output-inner-ios">
                    {Output ?(<>
                    <pre>{`${voutput.response}`}</pre>
                    </>):(<>
                    <pre>Code output will appear here...</pre>
                    </>)}
                  </div>
                  <div className="bottomSection">
                    <div className="buttonRow">
                      <button className="normalButton" onClick={()=>setOutput(false)}>
                        Clear Output
                      </button>
                    </div>
                  </div>
                </div>
                
              </div>
              </>
            ) : (
              <textarea
                className="answer-input"
                value={(answers[currentQuestionIndex] || "") + (voiceAssist ? transcript : "")}
                onChange={handleAnswerChange}
                placeholder="Type your answer here..."
                disabled={voiceAssist}
              />
            )}
            {/* <p className="text-xs text-gray-500 mt-2">⚠ Copy-pasting is disabled.</p> */}

            {notification && (
              <div className="notification bg-red-500 text-white px-4 py-2 rounded-md text-sm mt-2">
                {notification}
              </div>
            )}
            
          </div>
        </div>
        {questionAnswer[currentQuestionIndex]?.initialize_code === "yes" ? (<>
        </>):(<>
        <div className="speechRecogintionBox">
          <div className="topHead">
            <h6 className="sectionName">Speech Recognition</h6>
            <button className="micButton" onClick={toggleListening}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" x2="12" y1="19" y2="22"></line></svg> {voiceAssist ? "Stop Recognition" : "Start Recognition"}</button>
          </div>
          <div className="recognitionSection">{voiceAssist ? transcript : "Speak to see transcription here..."}</div>
        </div>
        </>)}
        <div className="triggerButtons">
          <div className="buttonRow">
            
            <button
              className="navBtn btn"
              onClick={SaveToDraft}
            ><span>Save Draft</span>
            </button>
          </div>
          <div className="buttonRow">
            
            <button
              className="navBtn btn"
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0 || voiceAssist==true }
            >
              <svg className="LeftIcon" style={{rotate:"180deg"}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"  ><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg><span>Previous Question</span>
            </button>
            <button
              className="navBtn btn"
              onClick={handleNextQuestion}
              disabled={currentQuestionIndex === Object.keys(questionAnswer).length - 1 || voiceAssist==true }
            >
              <span>
              Next Question
              </span>
              <svg className="RightIcon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
            </button>
            
          </div>
        </div>
      </div>
      <div className={`exam-page col-flex ${isDarkMode ? "Dark" : "Light"}`}>
        
        

        

        
        {showPopup && (
          <>
          <div className="full-screen-popup">
            <div className="popup-inner">
            <div className="row-flex" style={{justifyContent:"space-between"}}>
              <Link to="#" className="pop-close" onClick={showResult}>View Result Overview</Link>
              <Link to="/aspire-quest" className="pop-close" onClick={() => setShowPopup(false)}>Go to Dashboard</Link>
              </div>
              <h3>Your Exam Has Been Completed</h3>
              <p>Thank you for completing your exam. You can now return to the dashboard.</p>
            </div>
          </div>
          </>
         )}
        {examResultsPopup && (
          <>
          <div className="interview-prep">
            <div className={`resumeOuter ${isDarkMode === false ? "light" : "dark"}`}>
              <div className="resumeTab whiteResume">
              <div className="close">+</div>
              <Link to="/aspire-quest" className="pop-close" onClick={() => setShowResultsPopup(false)}>
                <div className="close">+</div>
              </Link>
                <div className="col-flex">
                  <h4 className="fs-18 text-black font-w600 mb-3">Exam Results Overview</h4>
                  <div className="fwline"></div>
                  <div className="col-flex results-summary card">
                  
                  {resultQuestion.questions && resultQuestion.questions.map((item, index) => (
                    <div key={index} className="col-flex">
                      <div className="text question fw-bold text-primary">
                        <span className="QuestionName">
                            <span className="questionIcon">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-help h-5 w-5 text-blue-600" data-lov-id="src/components/ExamQuestion.tsx:34:10" data-lov-name="CircleHelp" data-component-path="src/components/ExamQuestion.tsx" data-component-line="34" data-component-file="ExamQuestion.tsx" data-component-name="CircleHelp" data-component-content="%7B%22className%22%3A%22h-5%20w-5%20text-blue-600%22%7D"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><path d="M12 17h.01"></path></svg>
                            </span>

                            Question {index+1} : {item[index + 1] || "No Question"}</span>
                      </div>
                      <div className="text answer">
          
                        <span className="AnswerName">
                            <span className="answerIcon">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text h-4 w-4 text-gray-600" data-lov-id="src/components/ExamQuestion.tsx:46:12" data-lov-name="FileText" data-component-path="src/components/ExamQuestion.tsx" data-component-line="46" data-component-file="ExamQuestion.tsx" data-component-name="FileText" data-component-content="%7B%22className%22%3A%22h-4%20w-4%20text-gray-600%22%7D"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path></svg>
                            </span>
                            Answer: {resultQuestion.answers && resultQuestion.answers[index] || "No Answer"}</span>
                      </div>
                      <div className="text rating">
                        <span className="RatingName">
                            <span className="ratingIcon">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star h-4 w-4 text-gray-600" data-lov-id="src/components/ExamQuestion.tsx:57:12" data-lov-name="Star" data-component-path="src/components/ExamQuestion.tsx" data-component-line="57" data-component-file="ExamQuestion.tsx" data-component-name="Star" data-component-content="%7B%22className%22%3A%22h-4%20w-4%20text-gray-600%22%7D"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg>
                            </span>

                            Rating : 
                            {/* {resultData.rating[index] || "N/A"} */}
                            {[...Array(10)].map((_, i) => {
                              let color = "#d1d5db";
                              const rating = resultQuestion.rating[index];
                              if (rating >= i + 1) {
                                  if (rating <= 2) color = "#ef4444";
                                  else if (rating <= 7) color = "#facc15";
                                  else color = "#22c55e";
                              }
                              return (
                                  <svg
                                  key={i}
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="18"
                                  height="18"
                                  viewBox="0 0 24 24"
                                  fill={color}
                                  stroke={color}
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  style={{ marginRight: "2px", verticalAlign: "middle" }}
                                  >
                                  <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
                                  </svg>
                              );
                            })}
                            </span>
                      </div>
                      {/* <div className="text rating">
                        <span>Rating: {resultQuestion.rating && resultQuestion.rating[index] || "N/A"}</span>
                      </div> */}
                      <div className="text feedback">
                        <span className="feedBackName">
                            <span className="feedbackIcon">
                              <svg data-lov-id="src/components/ExamQuestion.tsx:81:12" data-lov-name="svg" data-component-path="src/components/ExamQuestion.tsx" data-component-line="81" data-component-file="ExamQuestion.tsx" data-component-name="svg" data-component-content="%7B%7D" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 text-blue-600"><path data-lov-id="src/components/ExamQuestion.tsx:96:14" data-lov-name="path" data-component-path="src/components/ExamQuestion.tsx" data-component-line="96" data-component-file="ExamQuestion.tsx" data-component-name="path" data-component-content="%7B%7D" d="M17 6.1H3"></path><path data-lov-id="src/components/ExamQuestion.tsx:97:14" data-lov-name="path" data-component-path="src/components/ExamQuestion.tsx" data-component-line="97" data-component-file="ExamQuestion.tsx" data-component-name="path" data-component-content="%7B%7D" d="M21 12.1H3"></path><path data-lov-id="src/components/ExamQuestion.tsx:98:14" data-lov-name="path" data-component-path="src/components/ExamQuestion.tsx" data-component-line="98" data-component-file="ExamQuestion.tsx" data-component-name="path" data-component-content="%7B%7D" d="M15.1 18H3"></path></svg>
                            </span>
                            
                            Feedback :{` `}
                            {resultQuestion.feedback_comments && resultQuestion.feedback_comments[index] || "No Feedback"}&nbsp;
                            
                            </span>
                      </div>
                      {/* <div className="text feedback">
                        <span>Feedback: {resultQuestion.feedback_comments && resultQuestion.feedback_comments[index] || "N/A"}</span>
                      </div> */}
                      <hr className="my-3" />
                    </div>
                  ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          </>
         )}
      </div>
      
      {showLoader && (
        <CSavvyPageLoader loaderText={"Submiting Your Answers"}/>
      )}
         
    </Fragment>
  );
};

export default DashboardDark;