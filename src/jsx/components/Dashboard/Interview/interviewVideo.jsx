import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import { useSelector } from "react-redux";
import "./videoInterview.css";
import InstuctionIcon from "./icons/InstructionIcon.png";
import SystemCheckPopup from "../AspireQuest/systemCheckPopup";
import GptIcon from "../SearchJobs/aiIcon.gif";
import FeedbackComponent from "./feedback";
import RotateIcon from "./icons/RotateIcon.png";
import CameraGif from "./icons/camera check.gif";
import MicrophoneGif from "./icons/mic check icon.gif";
import ProgressBar from './ProgressBar';

const API_URL = "https://aspire-quest-interview-tool-v6-980069659423.us-east1.run.app";

const InterviewVideo = () => {
    const userEmail = useSelector((state) => state.auth.auth.email);
    const { scenarioBased, interviewLevel, industryInterview } = useSelector((state) => state.profile);
    const navigate = useNavigate();
    
    // UI States
    const [showLoader, setShowLoader] = useState(false);
    const [prepareInterview, setPrepareInterview] = useState(true);
    const [systemCheck, setSystemCheck] = useState(true);
    const [feedbackTab, setFeedbackTab] = useState(false);
    const [showPopup, setShowPopup] = useState(true);
    
    
    // Interview States
    const [interviewStarted, setInterviewStarted] = useState(false);
    const [interviewComplete, setInterviewComplete] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [docId, setDocId] = useState("");
    const [feedback, setFeedback] = useState(null);
    
    // Recording States
    const [isRecording, setIsRecording] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [transcript, setTranscript] = useState("");
    const [accumulatedTranscript, setAccumulatedTranscript] = useState("");
    const [interviewUnsuccessful, setInterviewUnsuccessful] = useState(false);
    
    // Refs
    const streamRef = useRef(null);
    const timerIntervalRef = useRef(null);
    const recognitionRef = useRef(null);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const timeoutRef = useRef(null);
    const lastTranscriptRef = useRef("");
    const messagesEndRef = useRef(null);
    const lastSpokenIndexRef = useRef(-1);
    const recognitionRestartAttempts = useRef(0);
    const recognitionManuallyStoppedRef = useRef(false); 
    const keepAliveIntervalRef = useRef(null);
    const voiceActivityTimeoutRef = useRef(null);
    const lastSpeechTimeRef = useRef(Date.now());
    const currentUtteranceRef = useRef(null);
    const continuousSilenceRef = useRef(0);
    const previousTranscriptsRef = useRef([]);
    const answerStartTimeRef = useRef(0);
    const speechActivityRef = useRef({
        startTime: 0,
        totalDuration: 0,
        pauseStartTime: 0,
        isPaused: false
    });

     const [progress, setProgress] = useState(1);

  useEffect(() => {
        if(prepareInterview==true||isSubmitting==true){
        setTimeout(()=>{
            setProgress(95);
        },100);
        setTimeout(()=>{
            setProgress(0);
        },4000);

    }
  }, [prepareInterview, isSubmitting]);

    // Better deduplication function
    const isDuplicate = (existingText, newText) => {
        if (!existingText || !newText) return false;
        
        // Normalize texts by removing extra spaces and converting to lowercase
        const normalize = text => text.toLowerCase().trim().replace(/\s+/g, ' ');
        const normalizedExisting = normalize(existingText);
        const normalizedNew = normalize(newText);
        
        // Check if existing text already contains the new text
        return normalizedExisting.includes(normalizedNew);
    };

    // Format seconds into MM:SS
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    // Resource cleanup function
    const cleanupResources = () => {
        window.speechSynthesis.cancel();
        
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            recognitionRef.current.onresult = recognitionRef.current.onend = 
            recognitionRef.current.onerror = recognitionRef.current.onstart = null;
            recognitionRef.current = null;
        }
        
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        
        if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
            analyserRef.current = null;
        }
        
        if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = null;
        }
        
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }

        if (keepAliveIntervalRef.current) {
            clearInterval(keepAliveIntervalRef.current);
            keepAliveIntervalRef.current = null;
        }

        if (voiceActivityTimeoutRef.current) {
            clearTimeout(voiceActivityTimeoutRef.current);
            voiceActivityTimeoutRef.current = null;
        }
        
        recognitionRestartAttempts.current = 0;
        continuousSilenceRef.current = 0;
    };

    // Helper function to check if strings are too similar
    const similarStrings = (str1, str2) => {
        if (!str1 || !str2) return false;
        
        // Convert to lowercase and remove punctuation for comparison
        const normalize = (text) => text.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
        
        const normalizedStr1 = normalize(str1);
        const normalizedStr2 = normalize(str2);
        
        // Check if one is a substring of the other
        if (normalizedStr1.includes(normalizedStr2) || normalizedStr2.includes(normalizedStr1)) {
            return true;
        }
        
        return false;
    };

    // Reset transcript
    const resetTranscript = () => {
        setTranscript("");
        setAccumulatedTranscript("");
        previousTranscriptsRef.current = [];
        answerStartTimeRef.current = 0;
    };

    // Stop Speech Recognition and mark as manually stopped
    const stopListeningFn = () => {
        recognitionManuallyStoppedRef.current = true;
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            recognitionRef.current = null;
        }
        if (keepAliveIntervalRef.current) {
            clearInterval(keepAliveIntervalRef.current);
            keepAliveIntervalRef.current = null;
        }
        if (voiceActivityTimeoutRef.current) {
            clearTimeout(voiceActivityTimeoutRef.current);
            voiceActivityTimeoutRef.current = null;
        }
        setIsListening(false);
        setIsRecording(false);
        window.speechSynthesis.cancel();
    };

    const startListeningFn = (isRestart = false) => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Speech recognition is not supported in this browser.");
            return;
        }
    
        if (!isRestart) {
            // Only reset these if it's a new listening session, not a restart
            recognitionManuallyStoppedRef.current = false;
            answerStartTimeRef.current = 0;
            previousTranscriptsRef.current = [];
            setAccumulatedTranscript("");
            
            // Reset speech tracking
            speechActivityRef.current = {
                startTime: Date.now(),
                totalDuration: 0,
                pauseStartTime: 0,
                isPaused: false
            };
            continuousSilenceRef.current = 0;
        }
    
        if (!recognitionRef.current) {
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = "en-US";
    
            navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                    channelCount: 1,
                    sampleRate: 48000
                }
            }).then(stream => {
                streamRef.current = stream;
            }).catch(err => {
                console.error("Error accessing microphone:", err);
            });
    
            recognition.onstart = () => {
                setIsListening(true);
                setIsRecording(true);
                lastSpeechTimeRef.current = Date.now();
                if (!isRestart) {
                    setIsSpeaking(false);
                }
            };
    
            recognition.onresult = (event) => {
                let finalTranscript = "";
                let interimTranscript = "";
                let hasNewContent = false;
    
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                        hasNewContent = true;
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                        // Even interim results indicate speech activity
                        if (event.results[i][0].transcript.trim().length > 0) {
                            hasNewContent = true;
                        }
                    }
                }
    
                const newTranscript = (finalTranscript + " " + interimTranscript).trim();
                setTranscript(newTranscript);
                
                // When we get final results, add them to our accumulated transcript
                if (finalTranscript.trim().length > 0) {
                    setAccumulatedTranscript(prev => {
                        // Check if the finalTranscript is already included in the accumulated transcript
                        if (isDuplicate(prev, finalTranscript)) {
                            console.log("Detected duplicate transcript, skipping addition");
                            return prev;
                        }
                        
                        // Add a space if needed between previous and new content
                        const separator = prev.length > 0 ? " " : "";
                        const combined = prev + separator + finalTranscript.trim();
                        
                        // Store in our backup array in case of restarts
                        previousTranscriptsRef.current.push(finalTranscript.trim());
                        
                        console.log("Updated accumulated transcript:", combined);
                        return combined;
                    });
                }
    
                // If we have new speech content
                if (hasNewContent) {
                    const now = Date.now();
                    lastSpeechTimeRef.current = now;
                    
                    // First speech in this answer? Record the start time
                    if (!isSpeaking && !answerStartTimeRef.current) {
                        answerStartTimeRef.current = now;
                    }
                    
                    // If we were in a pause state, calculate the pause duration
                    if (speechActivityRef.current.isPaused) {
                        const pauseDuration = now - speechActivityRef.current.pauseStartTime;
                        console.log(`Speech resumed after ${pauseDuration}ms pause`);
                        
                        // Reset continuous silence counter
                        continuousSilenceRef.current = 0;
                        
                        // Mark as no longer paused
                        speechActivityRef.current.isPaused = false;
                    }
                    
                    if (!isSpeaking) {
                        setIsSpeaking(true);
                        console.log("User started speaking at", new Date().toISOString());
                    }
                } 
                // No new content - might be a pause
                else if (isSpeaking) {
                    const now = Date.now();
                    const timeSinceLastSpeech = now - lastSpeechTimeRef.current;
                    
                    // If we've been silent for more than 1.5 seconds, consider it a pause
                    if (timeSinceLastSpeech > 1500 && !speechActivityRef.current.isPaused) {
                        speechActivityRef.current.isPaused = true;
                        speechActivityRef.current.pauseStartTime = lastSpeechTimeRef.current;
                        console.log("Speech paused at", new Date().toISOString());
                    }
                }
            };
    
            recognition.onerror = (event) => {
                console.error("Speech recognition error:", event.error);
                if (event.error === 'no-speech' || event.error === 'audio-capture') {
                    if (recognitionRestartAttempts.current < 5) {
                        recognitionRestartAttempts.current++;
                        setTimeout(() => {
                            if (!recognitionManuallyStoppedRef.current && !interviewComplete && !feedbackTab) {
                                startListeningFn(true); // Pass true to indicate this is a restart
                            }
                        }, 1000);
                    } else {
                        stopListeningFn();
                        alert("Trouble with your microphone. Please check your settings and try again.");
                    }
                } else {
                    stopListeningFn();
                }
            };
    
            recognition.onend = () => {
                setIsListening(false);
                setIsRecording(false);
                
                // If this wasn't a manual stop and interview is still going
                if (!recognitionManuallyStoppedRef.current && !interviewComplete && !feedbackTab) {
                    recognitionRestartAttempts.current++;
                    if (recognitionRestartAttempts.current < 10) {
                        console.log("Recognition ended unexpectedly, restarting...");
                        
                        // Short delay before restart
                        setTimeout(() => {
                            // Make sure we retain our accumulated transcript when restarting
                            // This is critical for preserving longer answers
                            startListeningFn(true); // Pass true to indicate this is a restart
                        }, 500);
                    } else {
                        console.error("Too many restart attempts, stopping recognition");
                        alert("Speech recognition has encountered too many errors. Please refresh the page and try again.");
                        setIsSpeaking(false);
                    }
                } else {
                    recognitionRestartAttempts.current = 0;
                    setIsSpeaking(false);
                    // Don't reset the answer start time here to maintain timing context
                }
            };
    
            recognitionRef.current = recognition;
        }
    
        try {
            recognitionRef.current.start();
            setIsListening(true);
            
            // Start silence checking interval
            if (voiceActivityTimeoutRef.current) {
                clearInterval(voiceActivityTimeoutRef.current);
            }
            
            // Check for long silences (real end of speech) every 1 second
            voiceActivityTimeoutRef.current = setInterval(() => {
                if (isListening && !recognitionManuallyStoppedRef.current) {
                    const now = Date.now();
                    const timeSinceLastSpeech = now - lastSpeechTimeRef.current;
                    
                    // Count continuous silence only if we've been speaking
                    if (isSpeaking && timeSinceLastSpeech > 1000) {
                        continuousSilenceRef.current += 1;
                        console.log(`Continuous silence: ${continuousSilenceRef.current} seconds`);
                        
                        // After 7 seconds of silence after speaking, consider the answer complete
                        // But only if we have meaningful accumulated content
                        const hasContent = accumulatedTranscript.trim().length > 10 || transcript.trim().length > 10;
                        if (continuousSilenceRef.current >= 4 && hasContent) {
                            console.log("Detected end of speech after extended silence");
                            clearInterval(voiceActivityTimeoutRef.current);
                            
                            // Combine any displayed transcript with the accumulated transcript
                            const finalAnswer = accumulatedTranscript ? 
                                accumulatedTranscript + (transcript && !isDuplicate(accumulatedTranscript, transcript) ? " " + transcript : "") : 
                                transcript;
                            
                            // Submit the complete answer
                            submitAnswers(finalAnswer.trim());
                            resetTranscript();
                            stopListeningFn();
                        }
                    } else {
                        // Reset silence counter if we're getting speech
                        continuousSilenceRef.current = 0;
                    }
                }
            }, 1000);
            
        } catch (error) {
            console.error("Failed to start recognition:", error);
            setTimeout(() => {
                recognitionRef.current = null;
                if (!recognitionManuallyStoppedRef.current && !interviewComplete && !feedbackTab) {
                    startListeningFn(isRestart);
                }
            }, 1000);
        }
    };

    const speakQuestionFn = (text) => {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();
        
        // Clear any existing keep-alive interval
        if (keepAliveIntervalRef.current) {
            clearInterval(keepAliveIntervalRef.current);
            keepAliveIntervalRef.current = null;
        }
        
        setTimeout(() => {
            const utterance = new SpeechSynthesisUtterance(text);
            currentUtteranceRef.current = utterance;
            
            // Set speech properties for better clarity
            utterance.rate = 0.95; 
            utterance.pitch = 0.98; 
            utterance.volume = 1.0;  
            
            // Try to select a natural voice if available
            const voices = window.speechSynthesis.getVoices();
            const englishVoices = voices.filter(voice => voice.lang.includes('en'));
            if (englishVoices.length > 0) {
                // Prioritize premium male voices in the given order
                const preferredVoiceNames = [
                    'Google US English Male',
                    'Daniel',  // iOS/macOS
                    'Alex',    // iOS/macOS
                    'Microsoft David',
                    'Microsoft Mark',
                    'Google UK English Male'
                ];
                // Find the first available preferred voice
                const preferredVoice = preferredVoiceNames
                .map(name => englishVoices.find(voice => voice.name.includes(name)))
                .find(voice => voice); // Select the first found voice

                // If no preferred voice found, look for any voice with "male" in the name
                const maleVoice = !preferredVoice ? 
                englishVoices.find(voice => voice.name.toLowerCase().includes('male')) : 
                null;

                // Use preferred voice if found, otherwise try male voice, then fall back to first English voice
                utterance.voice = preferredVoice || maleVoice || englishVoices[0];
            }
            
            utterance.onstart = () => {
                console.log("Started speaking question:", text);
                // Stop any ongoing recognition to avoid self-interference
                setIsListening(false);
                setIsRecording(false);
                if (recognitionRef.current) {
                    try { 
                        recognitionRef.current.stop(); 
                    } catch (e) { 
                        console.error("Error stopping recognition during speech:", e); 
                    }
                }
                
                // Chrome has a bug where long speeches get cut off
                // Set up a keep-alive to prevent this
                keepAliveIntervalRef.current = setInterval(() => {
                    const synth = window.speechSynthesis;
                    if (synth.speaking) {
                        // This forces Chrome to not drop the audio
                        synth.pause();
                        synth.resume();
                    } else {
                        clearInterval(keepAliveIntervalRef.current);
                    }
                }, 5000);
            };
            
            utterance.onend = () => {
                console.log("Finished speaking question:", text);
                
                // Clear the keep-alive interval
                if (keepAliveIntervalRef.current) {
                    clearInterval(keepAliveIntervalRef.current);
                    keepAliveIntervalRef.current = null;
                }
                
                if (!feedbackTab) {
                    // Start listener after a slightly longer delay (800ms) to avoid interference
                    setTimeout(() => {
                        resetTranscript();
                        startListeningFn();
                    }, 800);
                }
            };
            
            utterance.onerror = (event) => {
                console.error("Speech synthesis error:", event);
                
                // Clear the keep-alive interval on error
                if (keepAliveIntervalRef.current) {
                    clearInterval(keepAliveIntervalRef.current);
                    keepAliveIntervalRef.current = null;
                }
                
                // Try to restart listening on error
                if (!feedbackTab) {
                    setTimeout(() => {
                        resetTranscript();
                        startListeningFn();
                    }, 800);
                }
            };
            
            // Add a special preparation for Chrome
            // Because Chrome sometimes doesn't load voices immediately
            if (window.speechSynthesis.getVoices().length === 0) {
                window.speechSynthesis.onvoiceschanged = () => {
                    // Try to select voice again once they're loaded
                    const voices = window.speechSynthesis.getVoices();
                    const englishVoices = voices.filter(voice => voice.lang.includes('en'));
                    if (englishVoices.length > 0) {
                        // Apply the same voice selection logic
                        const preferredVoiceNames = [
                            'Google US English Male',
                            'Daniel',  // iOS/macOS
                            'Alex',    // iOS/macOS
                            'Microsoft David',
                            'Microsoft Mark',
                            'Google UK English Male'
                        ];
                        
                        const preferredVoice = preferredVoiceNames
                            .map(name => englishVoices.find(voice => voice.name.includes(name)))
                            .find(voice => voice);
                            
                        const maleVoice = !preferredVoice ? 
                            englishVoices.find(voice => voice.name.toLowerCase().includes('male')) : 
                            null;
                            
                        utterance.voice = preferredVoice || maleVoice || englishVoices[0];
                    }
                    // Then speak
                    window.speechSynthesis.speak(utterance);
                    window.speechSynthesis.onvoiceschanged = null;
                };
            } else {
                // Speak immediately if voices are already loaded
                window.speechSynthesis.speak(utterance);
            }
        }, 30);
    };

    // Interview control functions
    const startTimer = () => {
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        setElapsedTime(0);
        timerIntervalRef.current = setInterval(() => {
            setElapsedTime(prevTime => prevTime + 1);
        }, 1000);
    };

    const startInterview = () => {
        setInterviewStarted(true);
        startTimer();
    };

    // API functions
    const fetchInterviews = async () => {
        const payload = {
            action: "start",
            candidate_email: userEmail,
            candidate_name: "",
            com_ind_name: industryInterview,
            interview_level: interviewLevel,
            scenario_based: scenarioBased ? "Yes" : "No",
            job_desc : industryInterview
        };

        try {
            setPrepareInterview(true);
            const response = await fetch(API_URL, {
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
            setPrepareInterview(false);
        }
    };

    const getFeedback = async () => {
        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "Get_Feedback",
                    doc_id: docId,
                }),
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                if(data.status=="error"){
                    setInterviewUnsuccessful(true);
                    setTimeout(()=>{
                        setCount(5);
                    }, 500);
                    return;
                }
                setFeedback(data);
                setFeedbackTab(true);
            } else {
                console.error("Error fetching feedback", await response.text());
                alert("Failed to get feedback. Please try again later.");
            }
        } catch (error) {
            console.error("Network error:", error);
            alert("Network error while fetching feedback. Please check your connection.");
        } finally {
            setShowLoader(false);
        }
    };

    const submitAnswers = async (answer) => {
        // Always use accumulatedTranscript as the primary source, falling back to the provided answer
        const completeAnswer = accumulatedTranscript.trim() ? 
            accumulatedTranscript + (transcript && !isDuplicate(accumulatedTranscript, transcript) ? " " + transcript : "") : 
            answer || transcript;
        
        if (isSubmitting || !completeAnswer || interviewComplete || prepareInterview) return;
        
        // Validation checks
        const currentQuestion = questions.length > 0 ? questions[questions.length - 1].question : "";
        if (similarStrings(currentQuestion, completeAnswer) || completeAnswer.trim().length <= 5) {
            console.log("Not submitting answer - too similar to question or too short");
            return;
        }

        try {
            setIsSubmitting(true);
            console.log("Submitting complete answer:", completeAnswer); // Add logging for troubleshooting
            
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "submit",
                    doc_id: docId,
                    answer: completeAnswer,  // Use the complete accumulated answer
                    elapsed_time: elapsedTime
                })
            });

            if (response.ok) {
                const data = await response.json();
                
                setQuestions(prev => {
                    const updated = [...prev];
                    if (updated.length > 0 && !similarStrings(updated[updated.length - 1].question, completeAnswer)) {
                        updated[updated.length - 1].answer = completeAnswer;  // Display the complete answer
                    }
                    
                    if (data.next_question) {
                        updated.push({ question: data.next_question, answer: "" });
                    } else {
                        setInterviewComplete(true);
                        updated.push({ question: "Thank you for completing the interview.", answer: "" });
                    }
                    
                    return updated;
                });
                
                // Reset accumulated transcript after successful submission
                resetTranscript();
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
    useEffect(() => {
    console.log(elapsedTime);

},[elapsedTime]);
const [remindLogInterview, setremindLogInterview] = useState(false);

    const [count, setCount] = useState(null); // Countdown starts as null

        useEffect(() => {
            if (count === 0) {
            navigate("/aspire-quest"); // Navigate when countdown reaches 0
            return;
            }
        
            if (count !== null) {
            const timer = setTimeout(() => {
                setCount((prevCount) => prevCount - 1);
            }, 1000);
        
            return () => clearTimeout(timer);
            }
        }, [count, navigate]);

    const endInterview = () => {
        
        
        setShowLoader(true);
        window.speechSynthesis.cancel();
        cleanupResources();
        
        // End the interview via API
        (async () => {
            if (isSubmitting || interviewComplete) return;
            
            try {
                setIsSubmitting(true);
                const response = await fetch(API_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        candidate_email: userEmail,
                        action: "end",
                        doc_id: docId,
                        base64_video: ""
                    })
                });
        
                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    setInterviewComplete(true);
                    setQuestions(prev => [...prev, { question: "Thank you for completing the interview.", answer: "" }]);
                    setTimeout(getFeedback, 2000);
                    if (elapsedTime < 360){
                        setremindLogInterview(true);
                        setTimeout(()=>{
                            setCount(5);
                        }, 500);
                        return;
                    }
                } else {
                    console.error("Error ending interview", await response.text());
                    alert("Failed to end the interview. Please try again.");
                }
            } catch (error) {
                console.error("Error:", error);
                alert("Network error. Please check your connection and try again.");
            } finally {
                setIsSubmitting(false);
                if (elapsedTime < 360){
                    setremindLogInterview(true);
                    setTimeout(()=>{
                        setCount(5);
                    }, 500);
                    return;
                }
            }
        })();
    };

    useEffect(() => {
        if (!isListening || transcript.trim().length === 0) return;
        lastTranscriptRef.current = transcript;
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        
        if (transcript.trim().length > 10) {
            timeoutRef.current = setTimeout(() => {
                if (lastTranscriptRef.current === transcript) {
                    console.log("Transcript stable for 5 seconds, preparing submission");
                    
                    // Get the current question
                    const currentQuestion = questions.length > 0 ? 
                        questions[questions.length - 1].question : "";
                    
                    // Ensure we're not submitting something that looks like the question
                    if (!similarStrings(currentQuestion, transcript)) {
                        // Get complete answer (accumulated + current) with deduplication
                        const completeAnswer = accumulatedTranscript ? 
                            accumulatedTranscript + (transcript && !isDuplicate(accumulatedTranscript, transcript) ? " " + transcript : "") : 
                            transcript;
                            
                        // First update the UI with the answer
                        setQuestions(prev => {
                            const updated = [...prev];
                            if (updated.length > 0) {
                                updated[updated.length - 1].answer = completeAnswer;
                            }
                            return updated;
                        });
                        
                        // Then submit to API after UI is updated
                        submitAnswers(completeAnswer.trim());
                        
                        // Reset everything
                        resetTranscript();
                        stopListeningFn();
                    } else {
                        console.log("Prevented submitting content similar to the question");
                    }
                }
            }, 5000); 
        }
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
        };
    }, [transcript, isListening, questions, accumulatedTranscript]);

    // UI setup effects
    useEffect(() => {
        // Hide popup after 10 seconds
        const timer = setTimeout(() => setShowPopup(false), 10000);
        return () => clearTimeout(timer);
    }, []);

    // Fetch interviews when email is available
    useEffect(() => {
        if (userEmail) fetchInterviews();
    }, [userEmail]);

    // Scroll to bottom of messages
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [questions, transcript, accumulatedTranscript]);

    // Question speaking effect
    useEffect(() => {
        if (!interviewStarted || feedbackTab) return;
        
        if (questions.length > 0 && !interviewComplete) {
            const lastQuestionIndex = questions.length - 1;
            if (lastSpokenIndexRef.current === lastQuestionIndex) return;
            
            const lastQuestion = questions[lastQuestionIndex].question;
            if (lastQuestion === "Thank you for completing the interview." || 
                lastQuestion === "No more questions." || 
                !lastQuestion) {
                setInterviewComplete(true);
                return;
            }
                    
            lastSpokenIndexRef.current = lastQuestionIndex;
            setTimeout(() => speakQuestionFn(lastQuestion), 1000); // Reduced from 1500ms to 1000ms
        }
    }, [questions, interviewComplete, interviewStarted, feedbackTab]);

    // Auto-end interview after 30 minutes
    useEffect(() => {
        if (interviewStarted) {
            const timer = setTimeout(() => endInterview(), 31 * 60 * 1000);
            return () => clearTimeout(timer);
        }
    }, [interviewStarted]);

    // Global cleanup
    useEffect(() => {
        window.addEventListener('beforeunload', cleanupResources);
        return () => {
            cleanupResources();
            window.removeEventListener('beforeunload', cleanupResources);
        };
    }, []);
    
    // Render UI - Extracted components for readability
    const renderInstructions = () => (
        <>
            <SystemCheckPopup visible={systemCheck} startInterview={startInterview} onClose={() => setSystemCheck(false)} setShowPopup={setShowPopup} />
            {/* <h2 className="mainHead">Welcome to the Video Interview</h2>
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
            </button> */}
        </>
    );

    const renderInterviewChat = () => (
        <>
            <div className="top-tag">Current Question</div>
            <div className="messages-box">
                {questions.map((q, index) => (
                    <React.Fragment key={index}>
                        <div className="aimessage">Question : {index+1}
                            <span>{q.question}</span>
                        </div>
                        {(q.answer || index < questions.length - 1) && (
                            <div className="usermessage">Your Answers : {index+1}
                                <span>{q.answer || (isRecording ? "Listening..." : "")}</span>
                            </div>
                        )}
                    </React.Fragment>
                ))}
                {isRecording && (
                    <div className="usermessage">
                        <div className="topRow">
                            <div className="dot"></div>Live Transcription
                        </div>
                        {/* Show accumulated transcript with current transcript, avoiding duplication */}
                        <span>
                            {accumulatedTranscript ? accumulatedTranscript + " " : ""}
                            {transcript && !isDuplicate(accumulatedTranscript, transcript) ? transcript : ""}
                        </span>
                    </div>
                )}
                
                {isSubmitting && (
                    <div className="aiThinking">
                        Preparing Question
                        <ProgressBar progress={progress} />
                    </div>
                )}
                {prepareInterview && (
                    <div className="aiThinking">
                        Preparing Interview
                        <ProgressBar progress={progress} />
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            {/* <button 
                className="start-button end" 
                onClick={endInterview}
                disabled={isSubmitting}
            >
                End Interview
            </button> */}
        </>
    );

    return (
        <div className="col-flex videoInterview">
            {!feedbackTab ? (
                <>
                    <div className="interviewTopSection">
                        <div className="buttonRow">
                            <div className="questionCount">
                                Question : {questions.length}
                            </div>
                        </div>
                        <div className="buttonRow">
                            <button className="time">{formatTime(elapsedTime)}</button>
                            <button className="endInterview" onClick={endInterview} disabled={isSubmitting}><span>+</span> End Interview</button>
                        </div>
                    </div>
                    <div className={`row-flex innerTabs ${interviewStarted ? "started" : ""}`}>
                        {/* {interviewStarted && (
                            <div className="topInfo row-flex">
                                <div className="recordingIcon">
                                    <div className="recordingDot"></div>
                                    Recording
                                </div>
                                <div className="timer">{formatTime(elapsedTime)}</div>
                            </div>
                        )} */}
                        
                        <div className="lhs">
                            <Webcam className="webcam-feed" />
                        </div>
                        
                        <div className="rhs">
                            {showLoader ? (
                                <div className="FeedbackShower">
                                    <img src={RotateIcon} alt="AiRotateIcon" className="AiRotateIcon" />
                                    <span className="text1">Ending Your Interview</span>
                                    <span className="text2">Preparing Your Feedback</span>
                                </div>
                            ) : !interviewStarted ? (
                                renderInstructions()
                            ) : (
                                renderInterviewChat()
                            )}
                        </div>
                    </div>
                </>
            ) : (
                <FeedbackComponent 
                    docId={docId} 
                    setDocId={setDocId}
                    feedback={feedback} 
                    setFeedback={setFeedback} 
                />
            )}
            {showPopup && (
                <div className="popup-overlay instructionPopup">
                    <div className="testingInstruction">
                        <div className="instructionbox">
                            <div className="iconbg showFirst">
                                <img src={CameraGif} alt="icon" className="cameraGif" />
                            </div>
                            <div className="iconbg showSecond">
                                <img src={MicrophoneGif} alt="icon" className="cameraGif" />
                            </div>
                            <span className="inst-text">Preparing your interview...<br></br>Ensuring microphone and camera are working properly</span>
                        </div>
                    </div>
                </div>
            )}
            {remindLogInterview && (
                <div className="popup-overlay instructionPopup">
                    <div className="testingInstruction">
                        <div className="instructionbox">
                            <div className="topHead">
                                <h5 className="headlogo">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-clock h-5 w-5 text-[#5D23C0]" data-lov-id="src/components/MinDurationWarning.tsx:29:12" data-lov-name="Clock" data-component-path="src/components/MinDurationWarning.tsx" data-component-line="29" data-component-file="MinDurationWarning.tsx" data-component-name="Clock" data-component-content="%7B%22className%22%3A%22h-5%20w-5%20text-%5B%235D23C0%5D%22%7D"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                    Interview Duration Notice
                                </h5>
                                <div></div>
                            </div>
                        
                            <span className="inst-text" style={{fontSize:"15px",fontWeight:"500"}}>Please take the interview for at least 6 minutes to receive proper feedback.<br></br>Currently, we don’t have enough data to generate feedback for you for this interview.<br></br><br></br>Redirecting you to a Aspire Quest Tab in {count}s</span>
                        </div>
                    </div>
                </div>
            )}
            {interviewUnsuccessful && (
                <div className="popup-overlay instructionPopup">
                    <div className="testingInstruction">
                        <div className="instructionbox">
                            <div className="topHead">
                                <h5 className="headlogo">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-clock h-5 w-5 text-[#5D23C0]" data-lov-id="src/components/MinDurationWarning.tsx:29:12" data-lov-name="Clock" data-component-path="src/components/MinDurationWarning.tsx" data-component-line="29" data-component-file="MinDurationWarning.tsx" data-component-name="Clock" data-component-content="%7B%22className%22%3A%22h-5%20w-5%20text-%5B%235D23C0%5D%22%7D"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                    Interview Duration Notice
                                </h5>
                                <div></div>
                            </div>
                            {/* <div className="iconbg">
                                <img src={MicrophoneGif} alt="icon" className="cameraGif" />
                            </div> */}
                            <span className="inst-text" style={{fontSize:"15px",fontWeight:"500"}}>Not enough conversation data to generate meaningful feedback. The interview should have multiple question-answer exchanges.<br></br><br></br>Redirecting you to a Aspire Quest Tab in {count}s</span>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Add a debugging box to help diagnose transcript issues */}
            {isRecording && (
                <div style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    background: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    padding: '10px',
                    borderRadius: '5px',
                    fontSize: '12px',
                    maxWidth: '300px',
                    zIndex: 1000,
                    display: 'none' // Set to 'block' for debugging, 'none' for production
                }}>
                    <div><strong>Transcript:</strong> {transcript.slice(0, 50)}...</div>
                    <div><strong>Accumulated:</strong> {accumulatedTranscript.slice(-50)}...</div>
                    <div><strong>Is Duplicate:</strong> {isDuplicate(accumulatedTranscript, transcript) ? 'Yes' : 'No'}</div>
                </div>
            )}
        </div>
    );
};

export default InterviewVideo;