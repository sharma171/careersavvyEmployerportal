import React, { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import VideoInterview from "./videoInterview.css";
import InstuctionIcon from "./icons/InstructionIcon.png";
import Feedback from "react-bootstrap/esm/Feedback";
import FeedbackComponent from "./feedback";


const InterviewVideo = () => {
    const [interviewStarted, setInterviewStarted] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [docId, setDocId] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [interviewComplete, setInterviewComplete] = useState(false);
    const [texttranscript, setTextTranscript] = useState("");
    const [elapsedTime, setElapsedTime] = useState(0); // State to track elapsed time in seconds
    const timerIntervalRef = useRef(null); // Ref to store the timer interval
    const [feedbackTab, setFeedbackTab] = useState(false);
    const recognitionRef = useRef(null);
    
    const navigate = useNavigate();
    const userEmail = useSelector((state) => state.auth.auth.email);
    const dispatch = useDispatch();

    useEffect(() => {
        // Clean up speech recognition and timer on component unmount
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.abort();
            }
            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
            }
            window.speechSynthesis.cancel();
        };
    }, []);

    useEffect(() => {
        if (questions.length > 0 && !interviewComplete) {
            const lastQuestion = questions[questions.length - 1].question;
            
            // Check if this is the end of the interview
            if (lastQuestion === "Thank you for completing the interview." || 
                lastQuestion === "No more questions." || 
                !lastQuestion) {
                setInterviewComplete(true);
                return;
            }
            
            speakQuestion(lastQuestion);
        }
    }, [questions, interviewComplete]);
    // Format seconds into MM:SS
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    // Start the timer when interview begins
    const startTimer = () => {
        // Clear any existing interval first
        if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
        }
        
        // Reset elapsed time
        setElapsedTime(0);
        
        // Start the interval
        timerIntervalRef.current = setInterval(() => {
            setElapsedTime(prevTime => prevTime + 1);
        }, 1000);
    };

    const startInterview = () => {
        setInterviewStarted(true);
        startTimer(); // Start the timer when interview begins
        fetchInterviews();
    };

    // Add this useEffect to monitor elapsed time and end interview at 30 minutes
    useEffect(() => {
        // Check if interview has started but not completed
        if (interviewStarted && !interviewComplete) {
            // If elapsed time reaches 30 minutes (1800 seconds)
            if (elapsedTime >= 1800) {
                // Call function to end interview
                requestEndInterview();
                
                // Show a message to the user
                alert("Your interview time of 30 minutes has elapsed. The interview will now end.");
            }
        }
    }, [elapsedTime, interviewStarted, interviewComplete]);

    const fetchInterviews = async () => {
        const payload = {
            action: "start",
            candidate_email: userEmail,
            candidate_name: ""
        };

        try {
            setIsSubmitting(true);
            const response = await fetch("https://aspire-quest-interview-tool-v2-980069659423.us-east1.run.app", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const data = await response.json();
                setQuestions([{ question: data.first_question, answer: "" }]);
                setDocId(data.doc_id);
            } else {
                console.error("Error fetching interviews", await response.text());
                alert("Failed to start the interview. Please try again.");
                setInterviewStarted(false);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Network error. Please check your connection and try again.");
            setInterviewStarted(false);
        } finally {
            setIsSubmitting(false);
        }
    };
    const [feedback, setFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
    const GetFeedback = async () => {
        const payload = {
            action: "Get_Feedback",
            doc_id: docId,
          };
          try {
            const response = await fetch(
              "https://aspire-quest-interview-tool-v2-980069659423.us-east1.run.app",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
              }
            );
            if (response.ok) {
              const data = await response.json();
              setFeedback(data);
              setFeedbackTab(true);
            } else {
              console.error("Error fetching feedback", await response.text());
            }
          } catch (error) {
            console.error("Network error:", error);
          } finally {
            // setIsLoading(false);
          }
        };

    const submitAnswers = async (answer) => {
        // Don't submit if already submitting, empty answer, or interview is complete
        if (isSubmitting || !answer || interviewComplete) {
            return;
        }

        const payload = {
            action: "submit",
            doc_id: docId,
            answer: answer,
            elapsed_time:  elapsedTime 
        };

        try {
            setIsSubmitting(true);
            const response = await fetch("https://aspire-quest-interview-tool-v2-980069659423.us-east1.run.app", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const data = await response.json();
                
                // Update the current question with the recorded answer
                setQuestions(prev => {
                    const updated = [...prev];
                    // Make sure we're only updating the last question
                    if (updated.length > 0) {
                        updated[updated.length - 1].answer = answer;
                    }
                    
                    // Add the next question if there is one
                    if (data.next_question) {
                        updated.push({ question: data.next_question, answer: "" });
                    } else {
                        setInterviewComplete(true);
                        updated.push({ question: "Thank you for completing the interview.", answer: "" });
                    }
                    
                    return updated;
                });
            } else {
                console.error("Error submitting answer", await response.text());
                alert("Failed to submit your answer. Please try again.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Network error. Please check your connection and try again.");
        } finally {
            setIsSubmitting(false);
        }
    };
    const requestEndInterview = async () => {
        // Remove the answer parameter and check
        if (isSubmitting || interviewComplete) {
            return;
        }
    
        const payload = {
            "action": "end", 
            "doc_id": docId
        };
    
        try {
            setIsSubmitting(true);
            const response = await fetch("https://aspire-quest-interview-tool-v2-980069659423.us-east1.run.app", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
    
            if (response.ok) {
                // Simply set interview as complete without trying to update answers
                setInterviewComplete(true);
                setQuestions(prev => [
                    ...prev,
                    { question: "Thank you for completing the interview.", answer: "" }
                ]);
                setTimeout(()=>{
                    GetFeedback();
                },2000)
            } else {
                console.error("Error ending interview", await response.text());
                alert("Failed to end the interview. Please try again.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Network error. Please check your connection and try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const speakQuestion = (text) => {
        // Cancel any ongoing speech first
        window.speechSynthesis.cancel();
        
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(text);
        
        utterance.onstart = () => {
            // Stop any ongoing recording when a new question is being spoken
            if (recognitionRef.current && isRecording) {
                recognitionRef.current.abort();
                setIsRecording(false);
            }
        };
        
        utterance.onend = () => {
            startRecognition();
        };
        
        synth.speak(utterance);
    };

    const startRecognition = () => {
        if (isRecording) return; // Prevent duplicate recognition instances
    
        console.log("Recognition Started");
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
        if (!SpeechRecognition) {
            alert("Speech recognition is not supported in your browser.");
            return;
        }
    
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = false; // Ensure it stops properly after each response
        recognitionInstance.interimResults = false; // Only get the final result
        recognitionInstance.lang = "en-US";
    
        let silenceTimer = null;
        let finalTranscript = "";
        const SILENCE_THRESHOLD = 5000; // 3 seconds
    
        recognitionInstance.onstart = () => {
            setIsRecording(true);
            setIsSubmitting(false);
            console.log("Speech recognition started...");
        };
    
        recognitionInstance.onresult = (event) => {
            if (silenceTimer) clearTimeout(silenceTimer); // Reset silence detection
    
            finalTranscript = event.results[0][0].transcript; // Only get the final result
    
            console.log("Recognized speech:", finalTranscript);
    
            // Update UI with the recognized text
            setQuestions(prev => {
                const updated = [...prev];
                if (updated.length > 0) {
                    updated[updated.length - 1].answer = finalTranscript;
                }
                return updated;
            });
    
            // Silence detection logic
            silenceTimer = setTimeout(() => {
                console.log("Silence detected, stopping recognition...");
                recognitionInstance.stop();
            }, SILENCE_THRESHOLD);
        };
    
        recognitionInstance.onspeechend = () => {
            if (silenceTimer) clearTimeout(silenceTimer); // Clear silence timer
            console.log("Speech ended, waiting for recognition to finalize...");
        };
    
        recognitionInstance.onend = () => {
            console.log("Recognition ended");
            setIsRecording(false);
    
            if (!isSubmitting && finalTranscript.trim()) {
                setIsSubmitting(true);
                submitAnswers(finalTranscript.trim()); // Submit final transcript
            } else if (!finalTranscript.trim() && !isSubmitting) {
                setIsSubmitting(true);
                submitAnswers("No response detected.");
            }
    
            recognitionRef.current = null;
        };
    
        recognitionInstance.onerror = (event) => {
            console.error("Speech recognition error", event.error);
            setIsRecording(false);
    
            if (event.error !== "aborted") {
                // alert(`Speech recognition error: ${event.error}`);
            }
    
            recognitionRef.current = null;
        };
    
        recognitionRef.current = recognitionInstance;
        recognitionInstance.start();
    };
    
    
    useEffect(()=>{
        console.log(texttranscript)
    },[texttranscript])

    const endInterview = () => {
        requestEndInterview(); // Call without parameters
        
        // Clean up
        if (recognitionRef.current) {
            recognitionRef.current.abort();
        }
        if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
        }
        window.speechSynthesis.cancel();
        
        // The setInterviewComplete is now handled in requestEndInterview
        // so we can remove it from here
    };

    

    return (
        <div className="col-flex videoInterview">
            {!feedbackTab ? (<>
                <div className={`row-flex innerTabs ${interviewStarted ? "started":""}`}>
                    {interviewStarted ? (<>
                        <div className="topInfo row-flex">
                            <div className="recordingIcon">
                                <div className="recordingDot"></div>
                                Recording
                            </div>
                            <div className="timer">
                                {interviewStarted && formatTime(elapsedTime)}
                            </div>
                        </div>
                    </>):(<></>)}
                    
                    <div className="lhs">
                        <Webcam className="webcam-feed" />
                        {/* {isRecording && <div className="recording-indicator">Recording...</div>} */}
                    </div>
                    <div className="rhs">
                        {!interviewStarted ? (
                            <>
                                <h2 className="mainHead">Welcome to the Video Interview</h2>
                                <p className="text">Click "Start Now" to begin your interview. Make sure your camera and microphone are working properly.</p>
                                <div className="instructionIcon">
                                    <img src={InstuctionIcon} alt="icon" className="icon" />
                                    <h4 className="pointHead">Instructions</h4>
                                </div>
                                <ul className="instructionList">
                                    <li className="item"><div className="list"><span className="number">1</span>Ensure you're in a quiet Environment</div></li>
                                    <li className="item"><div className="list"><span className="number">2</span>Test your Camera and Microphone</div></li>
                                    <li className="item"><div className="list"><span className="number">3</span>Make sure your Camera and Microphone working properly</div></li>
                                    <li className="item"><div className="list"><span className="number">4</span>This Interview Lasts up to 30 minutes</div></li>
                                    <li className="item"><div className="list"><span className="number">5</span>Speak Clearly and Take your Time with Responses</div></li>
                                </ul>
                                <button 
                                    className="start-button" 
                                    onClick={startInterview}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Starting..." : "Start Interview Now"}
                                </button>
                            </>
                        ) : (
                            <>
                                <div className="top-tag">Live Transcript</div>
                                <div className="messages-box">
                                    {questions.map((q, index) => (
                                        <React.Fragment key={index}>
                                            <div className="aimessage">Career Savvy
                                                <span>{q.question}</span>
                                            </div>
                                            {(q.answer || index < questions.length - 1) && (
                                                <div className="usermessage">You
                                                    <span>{q.answer || (isRecording ? "Listening..." : "")}</span>
                                                </div>
                                            )}
                                        </React.Fragment>
                                    ))}
                                    {isRecording && (
                                        <div className="recording-status">Listening to your response...</div>
                                    )}
                                    {isSubmitting && (
                                        <div className="submitting-status">Submitting your answer...</div>
                                    )}
                                </div>
                                <button 
                                    className="start-button" 
                                    onClick={endInterview}
                                    disabled={isSubmitting}
                                >
                                    End Interview
                                </button>
                                {/* <button 
                                    className="start-button" 
                                    onClick={GetFeedback}
                                    disabled={isSubmitting}
                                >
                                    Get Feedback
                                </button> */}
                            </>
                        )}
                    </div>
                </div>
            </>):(<>
                <FeedbackComponent docId={docId} feedback={feedback} setFeedback={setFeedback} />
            </>)}
        </div>
    );
};

export default InterviewVideo;