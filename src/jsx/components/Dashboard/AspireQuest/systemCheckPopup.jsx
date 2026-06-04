import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Webcam from "react-webcam";
import "./SystemCheckPopup.css";

const SystemCheckPopup = ({ visible, startInterview, setShowPopup, textInterviewReady, setTextInterviewReady }) => {
  const [progress, setProgress] = useState(0);

  const [micTestStarted, setMicTestStarted] = useState(false);
  const [micLevel, setMicLevel] = useState(0);
  const [micStream, setMicStream] = useState(null);
  const [transcript, setTranscript] = useState("");

  const [cameraTestStarted, setCameraTestStarted] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const location = useLocation();

  const navigate = useNavigate();

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const videoRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(()=>{
    if(visible){
      if(location.pathname === "/interview-Video-exam"){
        TriggerAudVideo();
        stopMicTest();
        stopCameraTest();
      }
      if(location.pathname === "/videoInterview"||location.pathname === "/interview-Video-exam"){
        TriggerAudVideo();
        stopMicTest();
        stopCameraTest();
      }
      if(location.pathname === "/aspire-quest"){
      TriggerAudio();
      stopMicTest();
      }
        
      }
  },[visible])
  const TriggerAudVideo = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
  }
  const TriggerAudio = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      // video: true,
    });
  }
  const TriggerVideo = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      // audio: true,
      video: true,
    });
  }

  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 10 : 100));
    }, 139);
    return () => clearInterval(interval);
  }, [visible]);

  const startMicTest = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicStream(stream);

      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      source.connect(analyser);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      dataArrayRef.current = dataArray;

      setMicTestStarted(true);
      requestAnimationFrame(updateMicLevel);

      // Setup speech recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";
        recognition.onresult = (event) => {
          let currentTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
        };
        recognition.onerror = (e) => console.error("Recognition error:", e);
        recognition.start();
        recognitionRef.current = recognition;
      } else {
        console.warn("SpeechRecognition not supported in this browser.");
      }

    } catch (error) {
      alert("Microphone access denied.");
      console.error(error);
    }
  };

  const stopMicTest = () => {
    if (micStream) micStream.getTracks().forEach((track) => track.stop());
    setMicTestStarted(false);
    setMicLevel(0);

    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
  };

  const updateMicLevel = () => {
    if (!analyserRef.current || !dataArrayRef.current) return;
    analyserRef.current.getByteFrequencyData(dataArrayRef.current);
    const volume = dataArrayRef.current.reduce((a, b) => a + b) / dataArrayRef.current.length;
    setMicLevel(volume);
    if (micTestStarted) requestAnimationFrame(updateMicLevel);
  };

  const startCameraTest = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraTestStarted(true);
    } catch (error) {
      alert("Camera access denied.");
      console.error(error);
    }
  };

  const stopCameraTest = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
    }
    setCameraTestStarted(false);
  };

  const handleContinue = () => {
    stopMicTest();
    stopCameraTest();
    if (location.pathname === "/aspire-quest") {
      navigate("/interview-exam");
    } else {
      startInterview();
    }
  };
  const handleCancel = () => {
    stopMicTest();
    stopCameraTest();
    if (location.pathname === "/aspire-quest") {
      navigate("/aspire-quest");
      setShowPopup(false);
    } 
    else if (location.pathname==="/interview-Video-exam"){
      navigate("/")
    }
    else {
      navigate("/aspire-quest");
    }
  };

  if (!visible) return null;

  return (
    <div className="system-check-overlay">
      <div className="system-check-popup">
        <h2 className="system-check-heading">System Check</h2>
        <p className="system-check-text">
          {/* We're checking your {location.pathname === "/videoInterview" && (<>camera and</>)} microphone to ensure everything is ready for your interview. */}
          We’re checking your microphone{location.pathname === "/videoInterview"||location.pathname === "/interview-Video-exam" && (<> and camera</>)} to ensure everything is set up correctly for your interview.
        </p>

        <div className="system-check-progress-container">
          <div
            className="system-check-progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>

        {progress === 100 && (
          <>
            {location.pathname === "/videoInterview"||location.pathname === "/interview-Video-exam"&& (
              <div className="system-check-mic-container">
                <div className="system-check-mic-row">
                  <span>
                    <svg style={{ color: "#00d100", width: "16px" }} xmlns="http://www.w3.org/2000/svg"
                      width="24" height="24" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M23 7l-7 5 7 5V7z"></path>
                      <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                    </svg>{" "}
                    Camera
                  </span>
                  {!cameraTestStarted ? (
                    <button className="system-check-test-button" onClick={startCameraTest}>
                      Test Camera
                    </button>
                  ) : (
                    <button className="system-check-stop-button" onClick={stopCameraTest}>
                      Stop Test
                    </button>
                  )}
                </div>

                {cameraTestStarted && (
                  <div className="system-check-video-wrapper">
                    <Webcam
                      audio={false}
                      screenshotFormat="image/jpeg"
                      className="Camera"
                    />
                  </div>
                )}
              </div>
            )}

            <div className="system-check-mic-container">
              <div className="system-check-mic-row">
                <span>
                  <svg style={{ color: "#00d100", width: "16px" }} xmlns="http://www.w3.org/2000/svg"
                    width="24" height="24" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                    <line x1="12" x2="12" y1="19" y2="22"></line>
                  </svg>{" "}
                  Microphone
                </span>
                {!micTestStarted ? (
                  <button className="system-check-test-button" onClick={startMicTest}>
                    Test Microphone
                  </button>
                ) : (
                  <button className="system-check-stop-button" onClick={stopMicTest}>
                    Stop Test
                  </button>
                )}
              </div>

              {micTestStarted && (
                <div className="system-check-audio-wrapper">
                  <div
                    className="system-check-audio-bar"
                    style={{ width: `${micLevel}px` }}
                  />
                  <p className="system-check-audio-text">
                    {transcript || "Speak into your microphone..."}
                  </p>
                </div>
              )}
            </div>
            <div className="system-check-row-flex">

            {textInterviewReady?(
                <>
                <button className="system-check-continue-button" onClick={handleCancel}>
                  Cancel
                </button>
                <button className="system-check-continue-button" onClick={handleContinue}>
                  Continue
                </button>
                </>
                ):(
                <>
                <button className="system-check-continue-button" >
                  Preparing Interview
                </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SystemCheckPopup;
