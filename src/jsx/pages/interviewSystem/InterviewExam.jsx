import React, { Fragment, useState, useRef, useEffect, useContext } from "react";
import "../../components/Dashboard/Interview/interviewExamNstyle.css";
import CSavvyPageLoader from "../../components/Dashboard/CsavvyPageLoad";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import "../css/InterviewCompleted.css?ver0.2";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import CongratsSparkle from './icons/congratsIcon.png';
import CongratsIcon from './icons/mancongrats.png';
import RightSparkle from './icons/rightsparke.png';
import ResultAi from "./icons/resultAi.svg";
import { TrendingUp } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setIsDarkMode, setAnswers, setQuestionAnswer, setDocId, setLinkInterviewQuestions } from "../../../store/actions/actions";
import { CheckCircle, FileText, Clock, Mail, ClipboardCheck } from "lucide-react";
import MonacoEditor from "react-monaco-editor";

import "../../components/Dashboard/Interview/banner.css?ver0.5";

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
  const { linkInterviewQuestions, questionAnswer, isDarkMode, docId, answers, apiToken, apiTokenReady, scenarioBased, interviewLevel, industryInterview } = useSelector((state) => state.profile);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [interviiewType, setInterviewType] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");
  const [startData, setStartData] = useState("");
  const [interviewDetails, setInterviewDetails] = useState([]);
  const [session_id, setSessionId] = useState("");
  const [answerData, SetAnswerData] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [Output, setOutput] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [voutput, SetVoutput] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [examResultsPopup, setShowResultsPopup] = useState(false);
  const [resultQuestion, setResultQuestion] = useState([]);
  const [closing, setClosing] = useState("");
  const [voiceAssistEnabled, setVoiceAssistEnabled] = useState(true); // Flag to enable/disable voice assistant feature

  const [startTime, setStartTime] = useState(null);
  useEffect(() => {
    setStartTime(Date.now());
  }, []);


  const navigate = useNavigate;
  const locate = useNavigate;
  const userEmail = useSelector((state) => state.auth.auth.email);

  useEffect(() => {
    const savedDocId = localStorage.getItem("LinkInterviewId");
    const savedTokenId = localStorage.getItem("Linktoken");
    const savedStartData = localStorage.getItem("LinkInterviewStartData");
    const interviewDetails = localStorage.getItem("LinkInterviewDetails");

    let parsedStartData = null;
    try {
      parsedStartData = savedStartData ? JSON.parse(savedStartData) : null;
    } catch (error) {
      console.error("Error parsing interview details:", error);
    }
    let parsedInterviewDetails = null;
    try {
      parsedInterviewDetails = interviewDetails ? JSON.parse(interviewDetails) : null;
    } catch (error) {
      console.error("Error parsing interview details:", error);
    }
    const savedInterviewType = localStorage.getItem("LinkInterviewType");
    setDocId(savedDocId);
    setSessionId(savedTokenId);
    setCandidateEmail(parsedInterviewDetails.interview_config?.candidate_email);
    setInterviewDetails(parsedInterviewDetails);
    setInterviewType(parsedInterviewDetails.interview_config.interview_type);
    setStartData(parsedStartData);
    SetAnswerData(startData);
    console.log("question", startData.first_question);
    console.log("startData", startData);
  }, [dispatch]);

  useEffect(() => {
    if (startData.first_question !== "") {
      dispatch(setLinkInterviewQuestions(startData.first_question));
    }
  }, [startData])

  // useEffect(() => {

  //   if (docId) localStorage.setItem("docId", docId);
  // }, [docId]);


  const submitTextAnswer = async () => {
    setShowLoader(true);
    const endTime = Date.now();
    const elapsed_time = Math.round((endTime - startTime) / 1000); // in seconds
    try {
      const listQuery =
      {
        "action": "submit_token_text",
        "session_id": docId,
        "answer": currentAnswer,
        "elapsed_time": elapsed_time
      }

      const response = await fetch('https://generate-text-interview-v10-737421501165.us-east1.run.app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(listQuery),
      });
      const data = await response.json();
      console.log('submitted answers', data);
      setShowLoader(false);
      SetAnswerData(data);
      dispatch(setLinkInterviewQuestions(data.next_question));
      dispatch(setDocId(data.session_id));
      setCurrentAnswer("");
      if (data.completion_reason == "time_limit") {
        endTextInterview();
      }

    } catch (error) {
      console.error('Error validating token:', error);
    }
  };
  const endTextInterview = async () => {
    setShowLoader(true);
    submitTextAnswer();
    try {
      const listQuery =

      {
        "action": "complete_token_text",
        "session_id": docId,
        "candidate_email": candidateEmail
      }

      const response = await fetch('https://generate-text-interview-v10-737421501165.us-east1.run.app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(listQuery),
      });
      const data = await response.json();
      setShowLoader(false);
      console.log('End Interview Response', data);
      setClosing(data.closing_message);
      dispatch(setDocId(data.session_id));
      setResultQuestion(data);
      examcomplete();


    } catch (error) {
      console.error('Error validating token:', error);
    }
  };


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

  // const handlePreviousQuestion = () => {
  //   if (currentQuestionIndex > 0) {
  //     setCurrentQuestionIndex(currentQuestionIndex - 1);
  //     resetTranscript();
  //     setOutput(false);
  //     SetVoutput("");
  //   }
  // };

  // const handleNextQuestion = () => {
  //   if (currentQuestionIndex < Object.keys(questionAnswer)?.length - 1) {
  //     setCurrentQuestionIndex(currentQuestionIndex + 1);
  //     resetTranscript();
  //     setOutput(false);
  //     SetVoutput("");
  //   }
  // };

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
      setTimeout(() => {
        SpeechRecognition.stopListening();
        setIsListening(false);

        // Update answers with transcript
        if (transcript) {
          const updatedAnswer = (currentAnswer || "") + " " + transcript;
          setCurrentAnswer(updatedAnswer);
        }


        resetTranscript();
      }, 500)
      setTimeout(() => {
        setVoiceAssist(false);
      }, 900)

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
          setTimeout(() => {
            // Stop listening
            SpeechRecognition.stopListening();
            setIsListening(false);

            // Update answers with transcript
            if (transcript) {
              const updatedAnswer = (currentAnswer || "") + " " + transcript;
              setCurrentAnswer(updatedAnswer);
            }

            resetTranscript();
          }, 500)
          setTimeout(() => {
            setVoiceAssist(false);
          }, 900)

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
      <div className="interviewExamSection" onCopy={handleCopy} style={{ margin: "35px" }}
        onPaste={handlePaste}>
        <div className="examTopSection">
          <div className="questCount">
            Question : {answerData.current_question_number || 1}
          </div>
          <div className="rightSection">
            {answerData.current_question_number >= 14 ? (
              <>
                <button className="endInterview" onClick={() => { endTextInterview() }}>
                  <span>+</span>
                  End Interview
                </button>
              </>
            ) : (
              <>
                <button className="endInterview">
                  {/* <span>+</span> */}
                  Interview in Progress
                </button>
              </>
            )}

          </div>
        </div>
        <div className="QuestionBox">
          <h3 className="question">{linkInterviewQuestions}</h3>
        </div>
        <div className="speechRecogintionBox" style={{ marginBottom: "0.9rem" }} >
          <div className="topHead">
            <h6 className="sectionName"></h6>
            <button className="micButton" onClick={toggleListening}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" x2="12" y1="19" y2="22"></line></svg> {voiceAssist ? "Stop Recognition" : "Start Recognition"}</button>
          </div>
          {/* <div className="recognitionSection">{voiceAssist ? transcript : "Speak to see transcription here..."}</div> */}
        </div>
        <div className="answerBox">
          <div className="col-flex answer">
            <textarea
              className="answer-input"
              value={(currentAnswer || "") + (voiceAssist ? transcript : "")}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder="Type your answer here..."
              disabled={voiceAssist}
            />
            {/* <p className="text-xs text-gray-500 mt-2">⚠ Copy-pasting is disabled.</p> */}

            {notification && (
              <div className="notification bg-red-500 text-white px-4 py-2 rounded-md text-sm mt-2">
                {notification}
              </div>
            )}

          </div>
        </div>

        <div className="triggerButtons">
          <div className="buttonRow">
            {/* <button
              className="navBtn btn"
              onClick={()=>navigate("/")}
            ><span></span>
            </button> */}
          </div>
          {voiceAssist ? (
            <>
              <div className="buttonRow">
                <button
                  className="navBtn btn"
                >
                  <span>
                    Voice Assist Loading...
                  </span>
                  {/* <svg className="RightIcon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg> */}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="buttonRow">
                {answerData.current_question_number >= 15 ? (<>
                  <button
                    className="navBtn btn"
                    onClick={() => { endTextInterview() }}
                  // disabled={currentQuestionIndex === Object.keys(questionAnswer).length - 1 || voiceAssist==true }
                  >
                    <span>
                      Submit Answer
                    </span>
                    <svg className="RightIcon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                  </button>
                </>) : (
                  <>
                    {currentAnswer !== "" && (
                      <>

                        <button
                          className="navBtn btn"
                          onClick={() => submitTextAnswer()}
                        // disabled={currentQuestionIndex === Object.keys(questionAnswer).length - 1 || voiceAssist==true }
                        >
                          <span>
                            Submit Answer
                          </span>
                          <svg className="RightIcon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                        </button>
                      </>
                    )}

                  </>)}
                {/* <button
                className="navBtn btn"
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0 || voiceAssist==true }
              >
                <svg className="LeftIcon" style={{rotate:"180deg"}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"  ><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg><span>Previous Question</span>
              </button> */}


              </div>
            </>
          )}

        </div>
      </div>






      {showPopup && (
        <>
          {/* <div className={`exam-page col-flex ${isDarkMode ? "Dark" : "Light"}`}>
          <div className="full-screen-popup">
            <div className="popup-inner">
            <div className="row-flex" style={{justifyContent:"space-between"}}>
              <Link to="/" className="pop-close" onClick={showResult}>Home</Link>
              <Link to="/login" className="pop-close" onClick={() => setShowPopup(false)}>Go to Login</Link>
              </div>
              <h3>Your Exam Has Been Completed</h3>
              <p>{closing}</p>
            </div>
          </div>
          </div> */}
          <div className="interviewResultOuter">
            <div className="interview-wrapper">
              <div className="interview-header">
                <div>
                  <img src={CongratsSparkle} alt="congrats" className="leftSparkle" />
                  <img src={RightSparkle} alt="congrats" className="rightSparkle" />
                  <h2>Interview Completed!</h2>
                  <p>Congratulations on completing your interview session</p>
                </div>
                <div>
                  <img src={CongratsIcon} alt="congrats" className="iconcongrats" />
                </div>
              </div>
              <div className="status-cards-container">
                <div className="status-card received">
                  <div className="status-icon">
                    <FileText size={32} />
                  </div>
                  <h3>Received</h3>
                  <p>Your interview response has been submitted successfully.</p>
                </div>
                <div className="status-card reviewing">
                  <div className="status-icon">
                    <TrendingUp size={32} />
                  </div>
                  <h3>Reviewing</h3>
                  <p>We're carefully reviewing your response.</p>
                </div>
                <div className="status-card waiting">
                  <div className="status-icon">
                    <Clock size={32} />
                  </div>
                  <h3>Waiting</h3>
                  <p>We’ll update you by email in 3–4 business days.</p>
                </div>
              </div>

              <div className="personal-message">
                <h4><img src={ResultAi} alt="" /> Personal Message</h4>
                <div className="message-box">
                  <p>
                    {closing}
                  </p>
                  <div className="timeline">
                    <span className="badge">🟢 Timeline</span>
                    <span>Expect to hear from us within 3–5 business days via email</span>
                  </div>
                </div>
              </div>

              <div className="steps">
                <div className="step">
                  <div className="clockIcon">
                    <Clock size={20} />
                  </div>
                  <h5>1. Review Process</h5>
                  <p>Our team will review your responses within 3–5 business days</p>
                </div>
                <div className="step">
                  <div className="mailIcon">
                    <Mail size={20} />
                  </div>
                  <h5>2. Follow-up Contact</h5>
                  <p>We'll reach out via email with next steps and feedback</p>
                </div>
                <div className="step">
                  <div className="clipIcon">
                    <ClipboardCheck size={20} />
                  </div>
                  <h5>3. Final Decision</h5>
                  <p>You'll receive our decision within one week</p>
                </div>
              </div>

              <div className="button-group">
                <Link to="https://careersavvy.ai/" className="btn return" >Return Home</Link>
              </div>
            </div>
          </div>
        </>
      )}


      {showLoader && (
        <CSavvyPageLoader loaderText={"Submiting Your Answers"} />
      )}

    </Fragment>
  );
};

export default DashboardDark;