import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import { useSelector } from "react-redux";
import CsavvyContentLoader from "../../components/Dashboard/CsavvyPageLoad";
import "../../../jsx/components/Dashboard/Interview/videoInterview.css";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

import SystemCheckPopup from "../../components/Dashboard/AspireQuest/systemCheckPopup";
import FeedbackComponent from "./feedback";
import RotateIcon from "../../components/Dashboard/Interview/icons/RotateIcon.png";
import CameraGif from "../../components/Dashboard/Interview/icons/camera check.gif";
import MicrophoneGif from "../../components/Dashboard/Interview/icons/mic check icon.gif";
import ProgressBar from "../../components/Dashboard/Interview/ProgressBar";

// Q&A backend
const API_URL = "https://generate-video-interviews-v10-737421501165.us-east1.run.app";

// Upload backend
const API_URL_UPLOAD = "https://video-recording-functionality-v10-737421501165.us-east1.run.app";

const InterviewVideo = () => {
    // Redux data
    const userEmail = useSelector((state) => state?.auth?.auth?.email);
    const { scenarioBased, interviewLevel, industryInterview } = useSelector((state) => state?.profile || {});

    const navigate = useNavigate();

    // Token/config
    const [interviewToken, setInterviewToken] = useState("");
    const [interviewDetails, setInterviewDetails] = useState(null);
    const [candidateEmail, setCandidateEmail] = useState("");
    const [errorPopup, setErrorPopup] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("Linktoken");
        const detailsRaw = localStorage.getItem("LinkInterviewDetails");
        let parsed = null;
        try {
            parsed = detailsRaw ? JSON.parse(detailsRaw) : null;
        } catch (err) {
            console.error("Error parsing interview details:", err);
        }
        setInterviewDetails(parsed);
        setCandidateEmail(parsed?.interview_config?.candidate_email || "");
        setInterviewToken(token || "");
    }, []);

    // UI states
    const [showLoader, setShowLoader] = useState(false);
    const [prepareInterview, setPrepareInterview] = useState(true);
    const [systemCheck, setSystemCheck] = useState(true);
    const [feedbackTab, setFeedbackTab] = useState(false);
    const [showPopup, setShowPopup] = useState(true);
    const [currentStage, setCurrentStage] = useState("Started");

    // Interview states
    const [interviewStarted, setInterviewStarted] = useState(false);
    const [interviewComplete, setInterviewComplete] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [docId, setDocId] = useState("");
    const [feedback, setFeedback] = useState(null);

    // Recording/transcription/timing states
    const [isRecording, setIsRecording] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [transcript, setTranscript] = useState("");
    const [accumulatedTranscript, setAccumulatedTranscript] = useState("");
    const [interviewUnsuccessful, setInterviewUnsuccessful] = useState(false);
    const [textInterviewReady, setTextInterviewReady] = useState(false);

    // Chunks counter
    const [chunkCount, setChunkCount] = useState(0);

    // Progress for loaders
    const [progress, setProgress] = useState(1);

    // CRITICAL REFS FOR BUG FIXES
    const isRecordingActiveRef = useRef(false);
    const lastChunkTimeRef = useRef(0);
    const processingChunksRef = useRef(new Set());
    const ffmpegLockRef = useRef(Promise.resolve());

    // Misc refs
    // Add this line with your other refs around line 80-100
    const isProcessingRef = useRef(false);
    const chunkTimerRef = useRef(null);

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
        isPaused: false,
    });

    // Global chunk recording controls
    const webcamRef = useRef(null);
    const globalRecorderRef = useRef(null);
    const pendingUploadsRef = useRef(Promise.resolve());
    const isStoppingRef = useRef(false);
    const chunkCounterRef = useRef(0);

    // ffmpeg
    const ffmpegRef = useRef(null);

    async function getFFmpeg() {
        if (!ffmpegRef.current) {
            const ffmpeg = new FFmpeg();
            ffmpeg.on('log', ({ message }) => {
                console.log('FFmpeg:', message);
            });
            await ffmpeg.load();
            ffmpegRef.current = ffmpeg;
        }
        return ffmpegRef.current;
    }

    // COMPLETELY FIXED: webmToMp4 with mutex lock
    async function webmToMp4(webmBlob, outName = "out.mp4") {
        await ffmpegLockRef.current;

        let resolveLock;
        ffmpegLockRef.current = new Promise((resolve) => {
            resolveLock = resolve;
        });

        try {
            if (!webmBlob || webmBlob.size === 0) {
                console.error("❌ Invalid or empty input blob");
                throw new Error("Invalid input blob");
            }

            const ffmpeg = await getFFmpeg();

            const uniqueId = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
            const inName = `in_${uniqueId}.webm`;
            const outNameUnique = `out_${uniqueId}.mp4`;

            console.log(`🎬 Starting conversion: ${outName}`);
            const startTime = Date.now();

            await ffmpeg.writeFile(inName, await fetchFile(webmBlob));

            // EXTREME SPEED SETTINGS - Target 1-2 second conversion
            await ffmpeg.exec([
                "-i", inName,
                "-vf", "scale=320:-2",           // EXTREME: 320p resolution (was 480p)
                "-r", "10",                      // EXTREME: 10fps (was 15fps) - 33% fewer frames
                "-c:v", "libx264",
                "-preset", "ultrafast",          // EXTREME: Back to ultrafast for maximum speed
                "-crf", "20",                    // EXTREME: CRF 35 (was 32) - very low quality
                "-maxrate", "250k",              // EXTREME: 250kbps max (was 400k)
                "-bufsize", "500k",              // EXTREME: Smaller buffer
                "-g", "24",                      // EXTREME: Keyframe every 30 frames (3 seconds)
                "-tune", "zerolatency",          // EXTREME: Zero latency tune
                "-x264opts", "bframes=0:ref=1:no-cabac:no-deblock:no-mbtree:subme=0:trellis=0:weightp=0", // EXTREME: Disable all heavy features
                "-c:a", "aac",
                "-b:a", "8k",                   // EXTREME: 24kbps audio (was 32k)
                "-ar", "16000",                  // EXTREME: 16kHz sample rate (was 22050)
                "-ac", "1",                      // Mono audio
                "-movflags", "+faststart",
                outNameUnique,
            ]);
            let data;
            try {
                data = await ffmpeg.readFile(outNameUnique);
            } catch (e) {
                console.error("❌ Failed to read output file");
                throw new Error("Conversion output file not found");
            }

            if (!data || data.length === 0) {
                console.error("❌ Conversion produced empty file");
                throw new Error("Conversion produced empty output");
            }

            const conversionTime = Date.now() - startTime;
            console.log(`✅ Converted ${outName} in ${conversionTime}ms`);

            try {
                await ffmpeg.deleteFile(inName);
                await ffmpeg.deleteFile(outNameUnique);
            } catch (e) {
                console.warn("Cleanup warning:", e);
            }

            return new Blob([data.buffer], { type: "video/mp4" });

        } catch (error) {
            console.error(`❌ Conversion failed for ${outName}:`, error);
            throw error;
        } finally {
            resolveLock();
        }
    }
    const chunkUploadCountRef = useRef(0);

    const uploadVideoChunk = async (videoBlob, { isFinalChunk = false, totalChunks, chunkIndex } = {}) => {
        if (!videoBlob || videoBlob.type !== "video/mp4") {
            throw new Error("videoBlob must be MP4");
        }

        const formData = new FormData();

        formData.append("action", "upload");
        formData.append("job_id", interviewDetails?.interview_config?.job_id || "");
        formData.append("candidate_email", candidateEmail || userEmail || "");

        if (isFinalChunk) {
            formData.append("is_final_chunk", "true");
            formData.append("total_chunks", String(totalChunks ?? chunkCounterRef.current));
        }

        // ✅ BEST: Always append - true for first, false for rest (synchronous)
        const isFirstChunk = chunkUploadCountRef.current === 0;
        formData.append("new_video_recording", isFirstChunk ? "true" : "false");

        const randomSuffix = Math.random().toString(36).substring(2, 10);
        const timestamp = Date.now();
        const filename = isFinalChunk
            ? `final_${timestamp}_${randomSuffix}.mp4`
            : `chunk_${chunkIndex}_${timestamp}_${randomSuffix}.mp4`;

        formData.append("video_file", videoBlob, filename);

        console.log(`📤 Uploading ${filename} (${(videoBlob.size / 1024).toFixed(2)} KB)`);
        console.log(`🔹 new_video_recording: ${isFirstChunk ? "true" : "false"} (count: ${chunkUploadCountRef.current})`);

        try {
            const response = await fetch(API_URL_UPLOAD, {
                method: "POST",
                headers: { Accept: "application/json" },
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`❌ Upload failed for ${filename}:`, errorText);
                throw new Error(`Upload failed for ${filename}: ${response.status}`);
            }

            const result = await response.json();
            console.log(`✅ Uploaded ${filename} successfully`);

            // ✅ Immediate synchronous increment
            chunkUploadCountRef.current += 1;

            return result;
        } catch (error) {
            console.error(`❌ Error uploading ${filename}:`, error);
            throw error;
        }
    };


    // COMPLETELY FIXED: Prevent duplicate processing and corrupted blobs
    const startGlobalRecording = () => {
        try {
            const stream = webcamRef.current?.stream;
            if (!stream) {
                console.error("No webcam stream available");
                return;
            }

            // Stop previous recorder completely
            if (globalRecorderRef.current) {
                try {
                    if (globalRecorderRef.current.state !== "inactive") {
                        globalRecorderRef.current.stop();
                    }
                    globalRecorderRef.current.ondataavailable = null;
                    globalRecorderRef.current.onstop = null;
                    globalRecorderRef.current.onerror = null;
                } catch (e) {
                    console.warn("Error stopping previous recorder:", e);
                }
                globalRecorderRef.current = null;
            }

            // Clear any existing timer
            if (chunkTimerRef.current) {
                clearInterval(chunkTimerRef.current);
                chunkTimerRef.current = null;
            }

            isRecordingActiveRef.current = true;

            const createRecorder = () => {
                const mime = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
                    ? "video/webm;codecs=vp9"
                    : "video/webm";

                const mr = new MediaRecorder(stream, {
                    mimeType: mime,
                    videoBitsPerSecond: 100000,
                    audioBitsPerSecond: 8000,
                });

                mr.ondataavailable = async (e) => {
                    if (!isRecordingActiveRef.current) {
                        console.warn("⚠️ Ignoring chunk - recording stopped");
                        return;
                    }

                    if (!e.data || e.data.size === 0) {
                        console.warn("⚠️ Empty blob, skipping");
                        return;
                    }

                    if (e.data.size < 10000) {
                        console.warn(`⚠️ Blob too small (${e.data.size} bytes), skipping`);
                        return;
                    }

                    const nextIndex = chunkCounterRef.current + 1;
                    chunkCounterRef.current = nextIndex;

                    const now = Date.now();
                    const chunkId = `chunk_${nextIndex}_${now}`;

                    if (processingChunksRef.current.has(chunkId)) {
                        console.warn(`⚠️ Chunk ${nextIndex} already queued`);
                        return;
                    }

                    processingChunksRef.current.add(chunkId);

                    // CRITICAL: Convert blob to ArrayBuffer IMMEDIATELY
                    try {
                        const arrayBuffer = await e.data.arrayBuffer();
                        const webmBlob = new Blob([arrayBuffer], { type: e.data.type });

                        pendingUploadsRef.current = pendingUploadsRef.current.then(async () => {
                            try {
                                console.log(`🎥 Processing chunk ${nextIndex} (${(webmBlob.size / 1024).toFixed(2)} KB)`);

                                if (webmBlob.size === 0) {
                                    console.error(`❌ Chunk ${nextIndex} is empty`);
                                    return;
                                }

                                const uniqueChunkName = `chunk_${nextIndex}_${now}.mp4`;
                                const mp4Blob = await webmToMp4(webmBlob, uniqueChunkName);

                                if (!mp4Blob || mp4Blob.size === 0) {
                                    console.error(`❌ Chunk ${nextIndex} conversion failed`);
                                    return;
                                }

                                await uploadVideoChunk(mp4Blob, { chunkIndex: nextIndex });
                                setChunkCount(nextIndex);
                            } catch (err) {
                                console.error(`❌ Chunk ${nextIndex} failed:`, err);
                            } finally {
                                processingChunksRef.current.delete(chunkId);
                            }
                        });
                    } catch (err) {
                        console.error("❌ Failed to prepare blob:", err);
                        processingChunksRef.current.delete(chunkId);
                    }
                };

                mr.onstop = () => {
                    console.log("📹 MediaRecorder segment stopped");

                    // CRITICAL: Restart recorder after stop if still active
                    if (isRecordingActiveRef.current) {
                        setTimeout(() => {
                            if (isRecordingActiveRef.current) {
                                console.log("🔄 Restarting recorder for next segment");
                                const newRecorder = createRecorder();
                                globalRecorderRef.current = newRecorder;
                                newRecorder.start();
                            }
                        }, 100);
                    }
                };

                mr.onerror = (event) => {
                    console.error("❌ MediaRecorder error:", event);
                    isRecordingActiveRef.current = false;
                };

                return mr;
            };

            // Create and start initial recorder
            const mr = createRecorder();
            globalRecorderRef.current = mr;
            mr.start();

            // CRITICAL FIX: Stop recorder every 15 seconds to trigger ondataavailable
            chunkTimerRef.current = setInterval(() => {
                if (isRecordingActiveRef.current && globalRecorderRef.current) {
                    const currentRecorder = globalRecorderRef.current;
                    if (currentRecorder.state === "recording") {
                        console.log("⏰ Stopping recorder to capture chunk");
                        currentRecorder.stop();
                    }
                }
            }, 15000);

            console.log("✅ Global recording started with 15s stop-restart chunks");
        } catch (err) {
            console.error("❌ Global recorder start failed:", err);
            isRecordingActiveRef.current = false;
        }
    };




    // Helpers
    const isDuplicate = (existingText, newText) => {
        if (!existingText || !newText) return false;
        const normalize = (text) => text.toLowerCase().trim().replace(/\s+/g, " ");
        const normalizedExisting = normalize(existingText);
        const normalizedNew = normalize(newText);
        return normalizedExisting.includes(normalizedNew);
    };

    const similarStrings = (str1, str2) => {
        if (!str1 || !str2) return false;
        const normalize = (text) => text.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
        const a = normalize(str1);
        const b = normalize(str2);
        return a.includes(b) || b.includes(a);
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
    };

    // Cleanup
    const cleanupResources = () => {
        window.speechSynthesis.cancel();

        if (recognitionRef.current) {
            try {
                recognitionRef.current.stop();
            } catch { }
            recognitionRef.current.onresult =
                recognitionRef.current.onend =
                recognitionRef.current.onerror =
                recognitionRef.current.onstart =
                null;
            recognitionRef.current = null;
        }

        if (streamRef.current) {
            try {
                streamRef.current.getTracks().forEach((t) => t.stop());
            } catch { }
            streamRef.current = null;
        }

        if (audioContextRef.current) {
            try {
                audioContextRef.current.close();
            } catch { }
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
        if (chunkTimerRef.current) {
            clearInterval(chunkTimerRef.current);
            chunkTimerRef.current = null;
        }

        try {
            const mr = globalRecorderRef.current;
            if (mr && mr.state !== "inactive") {
                mr.stop();
            }
        } catch { }

        recognitionRestartAttempts.current = 0;
        continuousSilenceRef.current = 0;
    };

    // Reset transcript
    const resetTranscript = () => {
        setTranscript("");
        setAccumulatedTranscript("");
        previousTranscriptsRef.current = [];
        answerStartTimeRef.current = 0;
    };

    // Stop listening
    const stopListeningFn = () => {
        recognitionManuallyStoppedRef.current = true;
        if (recognitionRef.current) {
            try {
                recognitionRef.current.stop();
            } catch { }
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

    // Start listening (answer phase)
    const startListeningFn = (isRestart = false) => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Speech recognition is not supported in this browser.");
            return;
        }

        if (!isRestart) {
            recognitionManuallyStoppedRef.current = false;
            answerStartTimeRef.current = 0;
            previousTranscriptsRef.current = [];
            setAccumulatedTranscript("");

            speechActivityRef.current = {
                startTime: Date.now(),
                totalDuration: 0,
                pauseStartTime: 0,
                isPaused: false,
            };
            continuousSilenceRef.current = 0;
        }

        if (!recognitionRef.current) {
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = "en-US";

            navigator.mediaDevices
                .getUserMedia({
                    audio: {
                        echoCancellation: true,
                        noiseSuppression: true,
                        autoGainControl: true,
                        channelCount: 1,
                        sampleRate: 48000,
                    },
                })
                .then((stream) => {
                    streamRef.current = stream;
                })
                .catch((err) => {
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
                        if (event.results[i][0].transcript.trim().length > 0) {
                            hasNewContent = true;
                        }
                    }
                }

                const newTranscript = (finalTranscript + " " + interimTranscript).trim();
                setTranscript(newTranscript);

                if (finalTranscript.trim().length > 0) {
                    setAccumulatedTranscript((prev) => {
                        if (isDuplicate(prev, finalTranscript)) return prev;
                        const sep = prev.length > 0 ? " " : "";
                        const combined = prev + sep + finalTranscript.trim();
                        previousTranscriptsRef.current.push(finalTranscript.trim());
                        return combined;
                    });
                }

                if (hasNewContent) {
                    const now = Date.now();
                    lastSpeechTimeRef.current = now;

                    if (!isSpeaking && !answerStartTimeRef.current) {
                        answerStartTimeRef.current = now;
                    }

                    if (speechActivityRef.current.isPaused) {
                        speechActivityRef.current.isPaused = false;
                        continuousSilenceRef.current = 0;
                    }

                    if (!isSpeaking) {
                        setIsSpeaking(true);
                    }
                } else if (isSpeaking) {
                    const now = Date.now();
                    const timeSinceLastSpeech = now - lastSpeechTimeRef.current;
                    if (timeSinceLastSpeech > 1500 && !speechActivityRef.current.isPaused) {
                        speechActivityRef.current.isPaused = true;
                        speechActivityRef.current.pauseStartTime = lastSpeechTimeRef.current;
                    }
                }
            };

            recognition.onerror = (event) => {
                console.error("Speech recognition error:", event.error);
                if (event.error === "no-speech" || event.error === "audio-capture") {
                    if (recognitionRestartAttempts.current < 5) {
                        recognitionRestartAttempts.current++;
                        setTimeout(() => {
                            if (!recognitionManuallyStoppedRef.current && !interviewComplete && !feedbackTab) {
                                startListeningFn(true);
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

                if (!recognitionManuallyStoppedRef.current && !interviewComplete && !feedbackTab) {
                    recognitionRestartAttempts.current++;
                    if (recognitionRestartAttempts.current < 10) {
                        setTimeout(() => {
                            startListeningFn(true);
                        }, 500);
                    } else {
                        alert("Speech recognition has encountered too many errors. Please refresh the page and try again.");
                        setIsSpeaking(false);
                    }
                } else {
                    recognitionRestartAttempts.current = 0;
                    setIsSpeaking(false);
                }
            };

            recognitionRef.current = recognition;
        }

        try {
            recognitionRef.current.start();
            setIsListening(true);

            if (voiceActivityTimeoutRef.current) {
                clearInterval(voiceActivityTimeoutRef.current);
            }
            voiceActivityTimeoutRef.current = setInterval(() => {
                if (isListening && !recognitionManuallyStoppedRef.current) {
                    const now = Date.now();
                    const timeSinceLastSpeech = now - lastSpeechTimeRef.current;
                    const hasContent = accumulatedTranscript.trim().length > 10 || transcript.trim().length > 10;

                    if (isSpeaking && timeSinceLastSpeech > 1000) {
                        continuousSilenceRef.current += 1;
                        if (continuousSilenceRef.current >= 4 && hasContent) {
                            clearInterval(voiceActivityTimeoutRef.current);

                            const finalAnswer = accumulatedTranscript
                                ? accumulatedTranscript +
                                (transcript && !isDuplicate(accumulatedTranscript, transcript) ? " " + transcript : "")
                                : transcript;

                            submitAnswers(finalAnswer.trim());
                            resetTranscript();
                            stopListeningFn();
                        }
                    } else {
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
        window.speechSynthesis.cancel();
        if (keepAliveIntervalRef.current) {
            clearInterval(keepAliveIntervalRef.current);
            keepAliveIntervalRef.current = null;
        }

        setTimeout(() => {
            const utterance = new SpeechSynthesisUtterance(text);
            currentUtteranceRef.current = utterance;

            utterance.rate = 0.95;
            utterance.pitch = 0.98;
            utterance.volume = 1.0;

            const voices = window.speechSynthesis.getVoices();
            const english = voices.filter((v) => v.lang.includes("en"));
            if (english.length > 0) {
                const preferredNames = [
                    "Google US English Male",
                    "Daniel",
                    "Alex",
                    "Microsoft David",
                    "Microsoft Mark",
                    "Google UK English Male",
                ];
                const preferred = preferredNames.map((name) => english.find((v) => v.name.includes(name))).find(Boolean);
                const male = !preferred ? english.find((v) => v.name.toLowerCase().includes("male")) : null;
                utterance.voice = preferred || male || english[0];
            }

            utterance.onstart = () => {
                setIsListening(false);
                setIsRecording(false);
                if (recognitionRef.current) {
                    try {
                        recognitionRef.current.stop();
                    } catch { }
                }
                keepAliveIntervalRef.current = setInterval(() => {
                    const synth = window.speechSynthesis;
                    if (synth.speaking) {
                        synth.pause();
                        synth.resume();
                    } else {
                        clearInterval(keepAliveIntervalRef.current);
                    }
                }, 5000);
            };

            utterance.onend = () => {
                if (keepAliveIntervalRef.current) {
                    clearInterval(keepAliveIntervalRef.current);
                    keepAliveIntervalRef.current = null;
                }
                if (!feedbackTab) {
                    setTimeout(() => {
                        resetTranscript();
                        startListeningFn();
                    }, 800);
                }
            };

            utterance.onerror = () => {
                if (keepAliveIntervalRef.current) {
                    clearInterval(keepAliveIntervalRef.current);
                    keepAliveIntervalRef.current = null;
                }
                if (!feedbackTab) {
                    setTimeout(() => {
                        resetTranscript();
                        startListeningFn();
                    }, 800);
                }
            };

            if (window.speechSynthesis.getVoices().length === 0) {
                window.speechSynthesis.onvoiceschanged = () => {
                    const voices = window.speechSynthesis.getVoices();
                    const english = voices.filter((v) => v.lang.includes("en"));
                    if (english.length > 0) {
                        const preferredNames = [
                            "Google US English Male",
                            "Daniel",
                            "Alex",
                            "Microsoft David",
                            "Microsoft Mark",
                            "Google UK English Male",
                        ];
                        const preferred = preferredNames.map((name) => english.find((v) => v.name.includes(name))).find(Boolean);
                        const male = !preferred ? english.find((v) => v.name.toLowerCase().includes("male")) : null;
                        utterance.voice = preferred || male || english[0];
                    }
                    window.speechSynthesis.speak(utterance);
                    window.speechSynthesis.onvoiceschanged = null;
                };
            } else {
                window.speechSynthesis.speak(utterance);
            }
        }, 30);
    };

    // Timer
    const startTimer = () => {
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        setElapsedTime(0);
        timerIntervalRef.current = setInterval(() => {
            setElapsedTime((prev) => prev + 1);
        }, 1000);
    };

    // Start interview
    const startInterview = () => {
        setTextInterviewReady(false);
        setInterviewStarted(true);
        startTimer();

        getFFmpeg().then(() => {
            const checkStreamAndStart = () => {
                if (webcamRef.current?.stream) {
                    startGlobalRecording();
                } else {
                    console.log("Waiting for webcam stream...");
                    setTimeout(checkStreamAndStart, 500);
                }
            };
            checkStreamAndStart();
        }).catch(err => {
            console.error("FFmpeg load failed:", err);
            alert("Failed to initialize video recording. Please refresh and try again.");
        });
    };

    // Start via token
    const fetchInterviews = async () => {
        const payload = { action: "start_token_video", token: interviewToken };
        try {
            setPrepareInterview(true);
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const data = await response.json();
                setQuestions([{ question: data.first_question, answer: "" }]);
                setDocId(data.doc_id);
            } else {
                const data = await response.json();
                alert("Failed to start the interview. Please try again.");
                setInterviewStarted(false);
                setErrorPopup(data.message || "Error in starting interview");
            }
        } catch (error) {
            alert("Network error. Please check your connection and try again.");
            setInterviewStarted(false);
            setErrorPopup(error?.message || "Error in starting Interview");
            setTimeout(() => {
                window.location.href = "https://careersavvy.ai";
            }, 3000);
        } finally {
            setPrepareInterview(false);
            setTextInterviewReady(true);
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
                if (data.status === "error") {
                    setInterviewUnsuccessful(true);
                    setTimeout(() => {
                        setCount(5);
                    }, 500);
                    return;
                }
                setFeedback(data);
                setFeedbackTab(true);
            } else {
                alert("Failed to get feedback. Please try again later.");
            }
        } catch (error) {
            alert("Network error while fetching feedback. Please check your connection.");
        } finally {
            setShowLoader(false);
        }
    };

    // Submit an answer
    const submitAnswers = async (answer) => {
        const completeAnswer = accumulatedTranscript.trim()
            ? accumulatedTranscript +
            (transcript && !isDuplicate(accumulatedTranscript, transcript) ? " " + transcript : "")
            : (answer || transcript);

        if (isSubmitting || !completeAnswer || interviewComplete || prepareInterview) return;

        const currentQuestion = questions.length > 0 ? questions[questions.length - 1].question : "";
        if (similarStrings(currentQuestion, completeAnswer) || completeAnswer.trim().length <= 5) {
            return;
        }

        try {
            setIsSubmitting(true);

            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "submit_token_video",
                    doc_id: docId,
                    answer: completeAnswer,
                    elapsed_time: elapsedTime,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setCurrentStage(data.current_stage);

                setQuestions((prev) => {
                    const updated = [...prev];
                    if (
                        updated.length > 0 &&
                        !similarStrings(updated[updated.length - 1].question, completeAnswer)
                    ) {
                        updated[updated.length - 1].answer = completeAnswer;
                    }
                    if (data.next_question) {
                        updated.push({ question: data.next_question, answer: "" });
                    } else {
                        setInterviewComplete(true);
                        updated.push({ question: "Thank you for completing the interview.", answer: "" });
                    }
                    return updated;
                });

                resetTranscript();
            } else {
                alert("Failed to submit your answer. Please try again.");
            }
        } catch (error) {
            alert("Network error. Please check your connection and try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (prepareInterview === true || isSubmitting === true) {
            setTimeout(() => setProgress(95), 100);
            setTimeout(() => setProgress(0), 4000);
        }
    }, [prepareInterview, isSubmitting]);

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
                    const currentQuestion = questions.length > 0 ? questions[questions.length - 1].question : "";
                    if (!similarStrings(currentQuestion, transcript)) {
                        const completeAnswer = accumulatedTranscript
                            ? accumulatedTranscript +
                            (transcript && !isDuplicate(accumulatedTranscript, transcript) ? " " + transcript : "")
                            : transcript;

                        setQuestions((prev) => {
                            const updated = [...prev];
                            if (updated.length > 0) {
                                updated[updated.length - 1].answer = completeAnswer;
                            }
                            return updated;
                        });

                        submitAnswers(completeAnswer.trim());
                        resetTranscript();
                        stopListeningFn();
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

    useEffect(() => {
        const timer = setTimeout(() => setShowPopup(false), 10000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (interviewToken !== "") {
            const t = setTimeout(() => fetchInterviews(), 1000);
            return () => clearTimeout(t);
        }
    }, [interviewToken]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [questions, transcript, accumulatedTranscript]);

    useEffect(() => {
        if (!interviewStarted || feedbackTab) return;
        if (questions.length > 0 && !interviewComplete) {
            const lastIndex = questions.length - 1;
            if (lastSpokenIndexRef.current === lastIndex) return;

            const lastQuestion = questions[lastIndex].question;
            if (
                lastQuestion === "Thank you for completing the interview." ||
                lastQuestion === "No more questions." ||
                !lastQuestion
            ) {
                setInterviewComplete(true);
                return;
            }

            lastSpokenIndexRef.current = lastIndex;
            setTimeout(() => speakQuestionFn(lastQuestion), 1000);
        }
    }, [questions, interviewComplete, interviewStarted, feedbackTab]);

    useEffect(() => {
        if (!interviewStarted) return;
        const timer = setTimeout(() => endInterview(), 30 * 60 * 1000);
        return () => clearTimeout(timer);
    }, [interviewStarted]);

    useEffect(() => {
        window.addEventListener("beforeunload", cleanupResources);
        return () => {
            cleanupResources();
            window.removeEventListener("beforeunload", cleanupResources);
        };
    }, []);

    const [remindLogInterview, setremindLogInterview] = useState(false);
    const [count, setCount] = useState(null);

    useEffect(() => {
        if (count === 0) {
            window.location.href = "https://careersavvy.ai";
            return;
        }
        if (count !== null) {
            const timer = setTimeout(() => setCount((prev) => prev - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [count, navigate]);

    const finalizeUpload = async () => {
        const formData = new FormData();

        formData.append("action", "upload");
        formData.append("job_id", interviewDetails?.interview_config?.job_id || "");
        formData.append("candidate_email", candidateEmail || userEmail || "");
        formData.append("is_final_chunk", "true");
        formData.append("total_chunks", String(chunkCounterRef.current));

        const randomSuffix = Math.random().toString(36).substring(2, 10);
        const timestamp = Date.now();
        const finalMarkerName = `final_marker_${timestamp}_${randomSuffix}.mp4`;

        const minimalMp4 = new Blob([new Uint8Array(1)], { type: "video/mp4" });
        formData.append("video_file", minimalMp4, finalMarkerName);

        console.log(`📤 Finalizing upload with ${chunkCounterRef.current} total chunks`);

        try {
            const response = await fetch(API_URL_UPLOAD, {
                method: "POST",
                headers: { Accept: "application/json" },
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("❌ Final marker upload failed:", errorText);
                throw new Error(`Finalization failed: ${response.status}`);
            }

            const result = await response.json();
            console.log("✅ Final chunk marker uploaded successfully");
            return result;
        } catch (error) {
            console.error("❌ Error finalizing upload:", error);
            throw error;
        }
    };

    const endInterview = () => {
        setShowLoader(true);
        window.speechSynthesis.cancel();
        (async () => {
            if (isSubmitting || interviewComplete) return;
            try {
                stopListeningFn();
                isRecordingActiveRef.current = false;
                isStoppingRef.current = true;
                const mr = globalRecorderRef.current;
                if (mr && mr.state !== "inactive") {
                    try {
                        if (mr.state === "recording") {
                            mr.requestData();
                            await new Promise(resolve => setTimeout(resolve, 500));
                        }
                        mr.stop();
                        mr.ondataavailable = null;
                        mr.onstop = null;
                        mr.onerror = null;
                    } catch (e) {
                        console.warn("Error stopping recorder:", e);
                    }
                }
                console.log("⏳ Waiting for pending uploads to complete...");
                await pendingUploadsRef.current.catch(() => { });
                console.log("✅ All pending uploads completed");
                console.log(`📤 Sending final marker with ${chunkCounterRef.current} total chunks`);
                await finalizeUpload();
                setIsSubmitting(true);
                const response = await fetch(API_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        action: "end_token_video",
                        doc_id: docId,
                        candidate_email: candidateEmail,
                    }),
                });
                if (response.ok) {
                    const data = await response.json();
                    setInterviewComplete(true);
                    setQuestions((prev) => [...prev, { question: "Thank you for completing the interview.", answer: "" }]);
                    setFeedback(data);
                    setFeedbackTab(true);
                    if (elapsedTime < 120) {
                        setremindLogInterview(true);
                        setTimeout(() => {
                            setCount(5);
                            setTimeout(() => {
                                window.location.href = "https://careersavvy.ai";
                            }, 4000);
                        }, 500);
                        return;
                    }
                } else {
                    alert("Failed to end the interview. Please try again.");
                }
            } catch (error) {
                console.error("Error ending interview:", error);
                alert("Network error. Please check your connection and try again.");
            } finally {
                setIsSubmitting(false);
                setShowPopup(true);
                setTimeout(() => {
                    window.location.href = "https://careersavvy.ai";
                }, 3000);
                if (elapsedTime < 120) {
                    setremindLogInterview(true);
                    setTimeout(() => setCount(5), 500);
                }
                cleanupResources();
            }
        })();
    };

    const renderInstructions = () => (
        <>
            <SystemCheckPopup
                visible={systemCheck}
                startInterview={startInterview}
                textInterviewReady={textInterviewReady}
                setTextInterviewReady={setTextInterviewReady}
                onClose={() => setSystemCheck(false)}
                setShowPopup={setShowPopup}
            />
        </>
    );

    const renderInterviewChat = () => (
        <>
            <div className="top-tag">Current Question</div>
            <div className="messages-box">
                {questions.map((q, index) => (
                    <React.Fragment key={index}>
                        <div className="aimessage">
                            Question : {index + 1}
                            <span>{q.question}</span>
                        </div>
                        {(q.answer || index < questions.length - 1) && (
                            <div className="usermessage">
                                Your Answers : {index + 1}
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
        </>
    );

    return (
        <div className="col-flex videoInterview">
            {!feedbackTab ? (
                <>
                    <div className="interviewTopSection">
                        <div className="buttonRow">
                            <div className="questionCount mob-w-ologin">Current Stage : {currentStage}</div>
                        </div>
                        <div className="buttonRow">
                            <button className="time">{formatTime(elapsedTime)}</button>
                            <button className="endInterview" onClick={endInterview} disabled={isSubmitting}>
                                <span>+</span> End Interview
                            </button>
                            {/* <span style={{ marginLeft: 12, fontSize: 12 }}>Chunks: {chunkCount}</span> */}
                        </div>
                    </div>

                    <div className={`row-flex innerTabs ${interviewStarted ? "started" : ""}`}>
                        <div className="lhs">
                            <Webcam
                                ref={webcamRef}
                                className="webcam-feed"
                                audio={true}
                                muted={true}
                                playsInline
                                audioConstraints={{
                                    echoCancellation: true,
                                    noiseSuppression: true,
                                    autoGainControl: true,
                                    channelCount: 1,
                                    sampleRate: 48000,
                                }}
                            />
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
                <FeedbackComponent docId={docId} setDocId={setDocId} feedback={feedback} setFeedback={setFeedback} />
            )}

            {errorPopup !== "" && (
                <div className="dashboard-container full-screen">
                    <CsavvyContentLoader loaderText={errorPopup} />
                </div>
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
                            <span className="inst-text">
                                Preparing your interview...
                                <br />
                                Ensuring microphone and camera are working properly
                            </span>
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
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <polyline points="12 6 12 12 16 14"></polyline>
                                    </svg>
                                    Interview Duration Notice
                                </h5>
                                <div></div>
                            </div>
                            <span className="inst-text" style={{ fontSize: "15px", fontWeight: "500" }}>
                                Please take the interview for at least 6 minutes to receive proper feedback.
                                <br />
                                Currently, we don't have enough data to generate feedback for you for this interview.
                                <br />
                                <br />
                                Redirecting you to a Aspire Quest Tab in {count}s
                            </span>
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
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <polyline points="12 6 12 12 16 14"></polyline>
                                    </svg>
                                    Interview Duration Notice
                                </h5>
                                <div></div>
                            </div>
                            <span className="inst-text" style={{ fontSize: "15px", fontWeight: "500" }}>
                                Not enough conversation data to generate meaningful feedback. The interview should have multiple
                                question-answer exchanges.
                                <br />
                                <br />
                                Redirecting you to a Aspire Quest Tab in {count}s
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InterviewVideo;
