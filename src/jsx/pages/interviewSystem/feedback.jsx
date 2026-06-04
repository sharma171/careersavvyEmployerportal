import { useState, useEffect } from "react";
import "../../components/Dashboard/Interview/feedback.css";
import CsavvyContentLoader from "../../components/Dashboard/CsavvyPageLoad";
import ClipTick from "../../components/Dashboard/Interview/ClipTick"; // If used for the chart's XAxis ticks
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
} from "recharts";
import { useNavigate } from "react-router-dom";
import GptIcon from "../../components/Dashboard/SearchJobs/aiIcon.gif"; // not used in popup now

export default function FeedbackComponent({ docId, feedback, setFeedback }) {
  const [isLoading, setIsLoading] = useState(true);
  const [base64Pdf, setBase64Pdf] = useState("");
  const [base64Docx, setBase64Docx] = useState("");
  const [fileNamePdf, setFileNamePdf] = useState("");
  const [showDownloadPopup, setShowDownloadPopup] = useState(false);
  const navigate = useNavigate();

  // Current date-time for filename generation
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const currentDateTime = `${month}-${day}-${year}_${hours}-${minutes}-${seconds}`;
  useEffect(()=>{
    setTimeout(()=>{
      setIsLoading(true);
      window.location.href = "https://careersavvy.ai";
    },2000)
  },[feedback])
  // useEffect(() => {
  //   const fetchFeedback = async () => {
  //     const payload = { action: "Get_Feedback", doc_id: docId };
  //     try {
  //       const response = await fetch(
  //         "https://aspire-quest-interview-tool-v2-980069659423.us-east1.run.app",
  //         {
  //           method: "POST",
  //           headers: { "Content-Type": "application/json" },
  //           body: JSON.stringify(payload),
  //         }
  //       );
  //       if (response.ok) {
  //         const data = await response.json();
  //         setFeedback(data);
  //       } else {
  //         console.error("Error fetching feedback", await response.text());
  //       }
  //     } catch (error) {
  //       console.error("Network error:", error);
  //     } finally {
  //       setTimeout(()=>{
  //         setIsLoading(false);
  //       },900);
  //     }
  //   };
  //   fetchFeedback();
  // }, [docId, setFeedback]);

  // const downloadDocument = async () => {
  //   // Show the download popup immediately on click
  //   setShowDownloadPopup(true);
  //   const payload = {
  //     action: "Get_Feedback_doc",
  //     doc_id: docId,
  //   };
  //   try {
  //     const response = await fetch(
  //       "https://aspire-quest-interview-tool-doc-v2-980069659423.us-east1.run.app",
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify(payload),
  //       }
  //     );
  //     if (response.ok) {
  //       const data = await response.json();
  //       setBase64Pdf(data.pdf_data);
  //     } else {
  //       console.error("Error fetching feedback", await response.text());
  //     }
  //   } catch (error) {
  //     console.error("Network error:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   if (base64Pdf) {
  //     DownloadPdf();
  //     // Hide the popup after 3 seconds
  //     setTimeout(() => {
  //       setShowDownloadPopup(false);
  //     }, 3000);
  //   }
  // }, [base64Pdf]);

  // Convert base64 PDF string to a downloadable file
  // const DownloadPdf = () => {
  //   if (!base64Pdf) {
  //     return;
  //   }
  //   const byteCharacters = atob(base64Pdf);
  //   const byteNumbers = Array.from(byteCharacters).map((char) =>
  //     char.charCodeAt(0)
  //   );
  //   const byteArray = new Uint8Array(byteNumbers);
  //   const blob = new Blob([byteArray], { type: "application/pdf" });
  //   const link = document.createElement("a");
  //   link.href = URL.createObjectURL(blob);
  //   link.download = `${fileNamePdf.replace(".docx", "")}_${currentDateTime}.pdf`;
  //   link.click();
  //   URL.revokeObjectURL(link.href);
  // };

  if (isLoading)
    return(<>
            <div className="dashboard-container full-screen">
              <CsavvyContentLoader loaderText={"Your Interview Completed Succesfully"}/>
            </div>
          </>) 
  if (!feedback || Object.keys(feedback).length === 0)
    return <p className="no-feedback">No feedback available.</p>;

  // Prepare ratingData for the chart
  const ratingData = Object.entries(feedback.ratings || {}).map(
    ([key, value]) => ({
      category: key.replace(/_/g, " ").toUpperCase(),
      score: value,
    })
  );

  return (
    <div className="dashboard-container full-screen">
      
      <main className="interview-feedback-wrapper">
        <h1 className="feedback-title">Interview Completed!</h1>

        <div style={{
          backgroundColor: "rgb(220 252 231)",
          borderRadius: "200px",
          width: "fit-content",
          margin: "0 auto",
          padding: "10px"
        }}>
          <svg style={{ width: '40px' }} xmlns="http://www.w3.org/2000/svg" fill="none"
            viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"
            className="w-12 h-12">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>

        <p className="feedback-subtitle">
          Thank you for completing your interview session. Below is an AI-generated analysis of your performance.
        </p>

        <div className="feedback-main-section">
          {/* LEFT PANEL */}
          <div className="interview-analysis" style={{height:"max-content"}}>
            <div className="topHead">
              <h2>
                <svg style={{ width: "20px", height: "20px" }} xmlns="http://www.w3.org/2000/svg"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round"
                  className="lucide lucide-file-text h-5 w-5 text-[#5D23C0]">
                  <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                  <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                  <path d="M10 9H8" />
                  <path d="M16 13H8" />
                  <path d="M16 17H8" />
                </svg>
                Interview Summary
              </h2>
              <p>Summary of your interview experience</p>
            </div>
            <div className="content">
              <div className="closing-message">
                <p>{feedback.closing_message}</p>
              </div>

              {/* <div className="key-insights">
                <h3>Emotion Analysis</h3>
                <ul>
                  <li><strong>Dominant Emotion:</strong> {feedback.video_analysis?.dominant_emotion} ({feedback.video_analysis?.dominant_confidence}%)</li>
                  <li><strong>Other Emotions:</strong></li>
                  <ul>
                    {Object.entries(feedback.video_analysis?.emotions || {}).map(([emotion, score]) => (
                      <li key={emotion}>{emotion}: {score.toFixed(2)}%</li>
                    ))}
                  </ul>
                </ul>
              </div> */}
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="performanceCol">
            <div className="performance-metrics">
              <div className="topHead">
                <h2>Performance Metrics</h2>
              </div>
              <div className="content">
                <ul>
                  <li style={{ marginBottom: "15px" }}>
                    <div className="scorehead">
                      <p className="metric-name">Dominant Emotion Confidence</p>
                      <span className="score-label">{feedback.video_analysis?.dominant_confidence?.toFixed(1)}%</span>
                    </div>
                    <div className="metric-bar">
                      <div className="metric-fill" style={{
                        width: `${feedback.video_analysis?.dominant_confidence || 0}%`
                      }}></div>
                    </div>
                  </li>
                  {Object.entries(feedback.video_analysis?.emotions || {}).map(([emotion, value]) => (
                    <li key={emotion} style={{ marginBottom: "15px" }}>
                      <div className="scorehead">
                        <p className="metric-name">{emotion}</p>
                        <span className="score-label">{value.toFixed(2)}%</span>
                      </div>
                      <div className="metric-bar">
                        <div className="metric-fill" style={{ width: `${value}%` }}></div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
          <button className="reportDownload bottombutton" onClick={() => {setTimeout(() => {
              window.location.href = "https://careersavvy.ai";
            }, 500)}}>
            Go Back To Home Page
          </button>
        </div>

      </main>


    </div>
  );
}
