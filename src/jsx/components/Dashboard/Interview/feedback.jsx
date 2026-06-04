import { useState, useEffect } from "react";
import "./feedback.css";
import CsavvyContentLoader from "../CsavvyPageLoad";
import ClipTick from "./ClipTick"; // If used for the chart's XAxis ticks
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
} from "recharts";
import { useNavigate } from "react-router-dom";
import GptIcon from "../SearchJobs/aiIcon.gif"; // not used in popup now

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

  useEffect(() => {
    const fetchFeedback = async () => {
      const payload = { action: "Get_Feedback", doc_id: docId };
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
        } else {
          console.error("Error fetching feedback", await response.text());
        }
      } catch (error) {
        console.error("Network error:", error);
      } finally {
        setTimeout(()=>{
          setIsLoading(false);
        },900);
      }
    };
    fetchFeedback();
  }, [docId, setFeedback]);

  const downloadDocument = async () => {
    // Show the download popup immediately on click
    setShowDownloadPopup(true);
    const payload = {
      action: "Get_Feedback_doc",
      doc_id: docId,
    };
    try {
      const response = await fetch(
        "https://aspire-quest-interview-tool-doc-v2-980069659423.us-east1.run.app",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (response.ok) {
        const data = await response.json();
        setBase64Pdf(data.pdf_data);
      } else {
        console.error("Error fetching feedback", await response.text());
      }
    } catch (error) {
      console.error("Network error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (base64Pdf) {
      DownloadPdf();
      // Hide the popup after 3 seconds
      setTimeout(() => {
        setShowDownloadPopup(false);
      }, 3000);
    }
  }, [base64Pdf]);

  // Convert base64 PDF string to a downloadable file
  const DownloadPdf = () => {
    if (!base64Pdf) {
      return;
    }
    const byteCharacters = atob(base64Pdf);
    const byteNumbers = Array.from(byteCharacters).map((char) =>
      char.charCodeAt(0)
    );
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${fileNamePdf.replace(".docx", "")}_${currentDateTime}.pdf`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  if (isLoading)
    return(<>
            <div className="dashboard-container full-screen">
              <CsavvyContentLoader loaderText={"Loading Interview Results"}/>
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
      {/* Sidebar */}
      {/* <div className="sidebar">
        <button
          className="back-button"
          onClick={() => navigate("/interview-prep")}
        >
          {`<  Back`}
        </button>
        <div className="w-divider"></div>
        <h2>Feedback Dashboard</h2>
      </div> */}

      {/* Main Content */}
      <main className="interview-feedback-wrapper">
        <h1 className="feedback-title">Interview Completed!</h1>
        <div style={{    backgroundColor: "rgb(220 252 231)",borderRadius:"200px", width: "fit-content", margin: "0 auto",padding:"10px" }}>

        <svg style={{width: '40px'}} data-lov-id="src/components/ThankYouScreen.tsx:59:10" data-lov-name="svg" data-component-path="src/components/ThankYouScreen.tsx" data-component-line="59" data-component-file="ThankYouScreen.tsx" data-component-name="svg" data-component-content="%7B%22className%22%3A%22w-12%20h-12%22%7D" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" className="w-12 h-12"><path data-lov-id="src/components/ThankYouScreen.tsx:60:12" data-lov-name="path" data-component-path="src/components/ThankYouScreen.tsx" data-component-line="60" data-component-file="ThankYouScreen.tsx" data-component-name="path" data-component-content="%7B%7D" stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path></svg>
        </div>
        <p className="feedback-subtitle">
          Thank you for completing your interview practice session. Below is an AI-generated analysis of your performance.
        </p>

        <div className="feedback-main-section">
          {/* LEFT PANEL */}
          <div className="interview-analysis">
            <div className="topHead">
              <h2><svg style={{width: "20px", height: "20px"}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-file-text h-5 w-5 text-[#5D23C0]" data-lov-id="src/components/ThankYouScreen.tsx:74:16" data-lov-name="FileText" data-component-path="src/components/ThankYouScreen.tsx" data-component-line="74" data-component-file="ThankYouScreen.tsx" data-component-name="FileText" data-component-content="%7B%22className%22%3A%22h-5%20w-5%20text-%5B%235D23C0%5D%22%7D"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path></svg> Interview Analysis</h2>
              <p>AI-powered assessment of your interview performance</p>
            </div>
            <div className="content">
              <div className="scorehead">
                <p>Overall Performance Score</p>
                <span className="score-label">{feedback.overall_score || 85}%</span>
              </div>
              <div className="score-bar-container">
                <div className="score-bar">
                  <div className="score-fill" style={{ width: `${feedback.overall_score || 85}%` }}></div>
                </div>
              </div>

              <div className="strengths-improvement">
                {feedback.strengths>0&&(<>
                  <div>
                    <h3>Your Strengths</h3>
                    <ul>
                      {(feedback.strengths || []).map((item, i) => <li key={i}>✓ {item}</li>)}
                    </ul>
                  </div>
                </>)}
                <div>
                  <h3>Areas for Improvement</h3>
                  <ul>
                    {(feedback.areas_for_improvement || []).map((item, i) => <li key={i}><span className="red">!</span> {item}</li>)}
                  </ul>
                </div>
              </div>

              <div className="key-insights">
                <h3>Key Insights</h3>
                <ol>
                  {(feedback.analysis_highlights || []).map((item, i) => <li key={i}><span className="number">{i}</span>{item}</li>)}
                </ol>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="performanceCol">
            <div className="performance-metrics">
              <div className="topHead">
                <h2>Performance Metrics</h2>
                {/* <p>AI-powered assessment of your interview performance</p> */}
              </div>
              <div className="content">
                <ul>
                  {Object.entries(feedback.ratings || {}).map(([key, value]) => {
                    const scoreOutOfTen = Math.round((value / 100) * 10);
                    return (
                      <li key={key} style={{ marginBottom: "15px" }}>
                        <div className="scorehead">
                          <p className="metric-name">{key.replace(/_/g, " ")}</p>
                          <span className="score-label">{scoreOutOfTen}/10</span>
                        </div>

                        <div className="metric-bar">
                          <div className="metric-fill" style={{ width: `${scoreOutOfTen * 10}%` }}></div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
            <div className="download-report-section performance-metrics" style={{marginTop:"1rem"}}>
              <div className="topHead">
              <h2>Download Report</h2>
              </div>
              <div className="content">
                <p className="smaltext">Download a detailed PDF report of your interview performance analysis to review later or share with mentors.</p>
                <button className="reportDownload" onClick={downloadDocument}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-download h-4 w-4" data-lov-id="src/components/ThankYouScreen.tsx:177:20" data-lov-name="Download" data-component-path="src/components/ThankYouScreen.tsx" data-component-line="177" data-component-file="ThankYouScreen.tsx" data-component-name="Download" data-component-content="%7B%22className%22%3A%22h-4%20w-4%22%7D"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" x2="12" y1="15" y2="3"></line></svg>
                  Download Analysis Report
                </button>
              </div>
            </div>
          </div>
          
        </div>
        <div style={{display:"flex", flexDirection:"row", justifyContent:"center"}}>

        <button className="reportDownload bottombutton" onClick={()=>navigate("/aspire-quest")}>
          {/* <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-download h-4 w-4" data-lov-id="src/components/ThankYouScreen.tsx:177:20" data-lov-name="Download" data-component-path="src/components/ThankYouScreen.tsx" data-component-line="177" data-component-file="ThankYouScreen.tsx" data-component-name="Download" data-component-content="%7B%22className%22%3A%22h-4%20w-4%22%7D"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" x2="12" y1="15" y2="3"></line></svg> */}
          Start a New Interview
        </button>
        </div>

        

        {showDownloadPopup && <DownloadPopup />}
      </main>


      {/* Render Download Popup */}
      {showDownloadPopup && <DownloadPopup />}
    </div>
  );
}

// DownloadPopup component with a custom download icon
function DownloadPopup() {
  return (
    <div className="download-popup-overlay">
      <div className="download-popup">
        <div className="rotating-border"></div>
        <div className="download-icon-container">
          <img src={GptIcon} alt="icon" className="download-icon" />
        </div>
        <p>Downloading Interview Report...</p>
      </div>
    </div>
  );
}
