import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "./style/interviewHistory.css";
import "./style/sendReference.css";
import "./style/profileTop.css?ver0.5";
import "./style/ReferenceReport.css";
import {
  Code2,                // Technical Skills
  MessageCircle,        // Communication Skills
  Award,                // Main Strengths
  TrendingDown, 
  Notebook,        // Areas for Improvement
  BadgeCheck,           // Quality of Work
  Timer,                // Reliability and Punctuality
  StickyNote, 
  ThumbsUp,
  ThumbsDown,
  Loader,
  MinusCircle,           // Additional Comments
  Download,
  Briefcase,
  Bubbles,
  Users,
  Building,
  ListCheck
} from "lucide-react";
import { Mail, Phone, CircleCheckBig, UserRoundCheck, Star, CheckCircle, AlertTriangle, ClipboardList, User, Clock4, XCircle } from "lucide-react";
import { FaQuestion, FaRegCommentDots } from "react-icons/fa6";




const InterviewHistory = ({ selectedProfile, refereeData, setRefereeData, setCenterViewType, setProfileClicked, setMessage, setType }) => {
  const { jobId } = useSelector(
    (state) => state.profile
  );
  const profile = selectedProfile || {};
  const [refereeDetailed, setRefereeDetailed] = useState([]);
  const feedback = {
  referee: {
    name: refereeDetailed?.data?.referee_name,
    title: refereeDetailed?.data?.referee_title,
    email: refereeDetailed?.data?.referee_email,
    phone: refereeDetailed?.data?.referee_phone_number,
    relationship: refereeDetailed?.data?.relationship_to_candidate,
    completed: usDateOnly(refereeDetailed?.data?.timestamp_gmt)
  },
  rating: 9,
  rehire: true,
  skills: "Excellent problem-solving skills and deep understanding of modern frontend frameworks. Consistently delivered high-quality code with minimal bugs.",
  communication: "Outstanding communication skills, both written and verbal. Excellent at explaining complex technical concepts to non-technical stakeholders.",
  strengths: "Strong technical leadership, mentoring junior developers, and driving architectural decisions. Great team player who always meets deadlines.",
  improvement: "Could benefit from more experience with backend technologies to become more full-stack oriented.",
  quality: "Consistently high quality work. Attention to detail is exceptional and code reviews are always thorough.",
  reliability: "Extremely reliable and punctual. Never missed a deadline and always available when needed.",
  comments: "Alex was one of our top performers. I would definitely hire them again and recommend them for senior technical roles.",
  internal: "Strong technical background, excellent team player"
};
// Utility function:
function usDateOnly(iso) {
  if (!iso) return "";
  const date = new Date(iso);
  // Get month & date padded to 2 digits
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
}

const [fileName, setfileName] = useState(false);
const [downloadLoading, setDownloadLoading] = useState(false);
const [base64Pdf, setBase64Pdf] = useState(""); 
      const now = new Date();
      const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
      const day = String(now.getDate()).padStart(2, '0');
      const year = now.getFullYear();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const currentDateTime = `${month}-${day}-${year}_${hours}-${minutes}-${seconds}`;

  useEffect(()=>{
      getDetailedData();
    },[jobId]);
    const getDetailedData = async () => {
        try{
        const listQuery = { 
          "stage": 2, 
          "job_id": jobId, 
          "candidate_email": profile.email, 
          "referee_email": refereeData.referee_email
        }
        const response = await fetch("https://operations-for-reference-api-v10-737421501165.us-east1.run.app", {
            method:'POST',
            headers:{
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(listQuery),
        })
        const data = await response.json();
        
        console.log("refereeeData", data);
        setRefereeDetailed(data);
        
        } catch (error) {
        console.log(error)
        }
    }
    const getPdfReport = async () => {
      setDownloadLoading(true)
        try{
        const listQuery = {
          "action": "generate_report_referee",
          "candidate_email": profile.email,
          "job_id": jobId,
          "report_for": "individual",
          "referee_email": refereeData.referee_email
        }
        const response = await fetch("https://referee-report-generation-v10-737421501165.us-east1.run.app", {
            method:'POST',
            headers:{
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(listQuery),
        })
        const data = await response.json();
        setBase64Pdf(data.pdf_base64);
        setfileName(data.filename);
        
        } catch (error) {
        console.log(error)
        setDownloadLoading(false);
        }
    }
    useEffect(()=>{
    
        if(base64Pdf!==""){
          DownloadPdf();
        }
      },[base64Pdf])
    
      
      const DownloadPdf = () => {
    
            
            if (!base64Pdf) {
            // alert("No PDF data available!");
            setType("interview");
            setMessage([{ topName: "Report Unavailable", para: "No report Summary available to generate report" }]);
            
          setDownloadLoading(false);
            }
            else{
        
            // Convert Base64 to Blob
            const byteCharacters = atob(base64Pdf);
            const byteNumbers = Array.from(byteCharacters).map((char) => char.charCodeAt(0));
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: "application/pdf" });
        
            // Create a link and trigger download
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `${"reference_report".replace(".docx", "")}_${feedback.referee.name}_${feedback.referee.title}.pdf`;
            // link.download = fileName;
            link.click();
        
            // Clean up
            URL.revokeObjectURL(link.href);
            setDownloadLoading(false);
            }
        };
        

  return (
    <>
      
      <div className="ref-main-bg">
      <div className="ref-main-wrap">
        {/* Referee Info */}
        <div className="ref-section">
          <div className="ref-section-title">
            <UserRoundCheck size={19} style={{marginRight: 8}}/>
            Referee Information
          </div>
          <div className="ref-row">
            <div className="ref-label" style={{
                  fontSize: "18px",
                  marginBottom: "0px",
                  textTransform: "capitalize"
            }}>{feedback.referee.name}</div>
            <div className="refMail"><Mail size={16} className="ref-icon" /> {feedback.referee.email}</div>
          </div>
          <div className="ref-row">
            <div><User size={16} className="ref-icon" /> {feedback.referee.title}</div>
            <div><Phone size={16} className="ref-icon" /> {feedback.referee.phone}</div>
          </div>
          <div className="ref-row">
            <div><ListCheck size={16} className="ref-icon" /> Relationship: {feedback.referee.relationship}</div>
            <div><Clock4 size={16} className="ref-icon" /> Completed: {feedback.referee.completed}</div>
          </div>
          <div className="ref-row">
            <div> <Building size={16} className="ref-icon" /> {refereeDetailed?.data?.referee_feedback?.companyWorked} - {refereeDetailed?.data?.referee_feedback?.candidateRelation}</div>
            <div><Users size={16} className="ref-icon" /> Worked together : {refereeDetailed?.data?.referee_feedback?.from_month} - {refereeDetailed?.data?.referee_feedback?.from_year} To {refereeDetailed?.data?.referee_feedback?.to_month} - {refereeDetailed?.data?.referee_feedback?.to_year}</div>
          </div>
        </div>

        {/* Performance & Rehire */}
        <div className="ref-section">
          <div className="ref-section-title">
            <Star size={19} style={{marginRight: 8}}/> Reference Responses
          </div>
          <div className="ref-rating-row">
            <span className="ref-label" style={{ fontWeight: 500 }}>
              Overall Performance Rating
            </span>
            <span>
              {
                // Get the actual rating
                [...Array(10)].map((_, i) =>
                  i < Number(refereeDetailed?.data?.referee_feedback?.overall_rating?.[0] ?? 0) ? (
                    <Star
                      key={`filled-${i}`}
                      size={17}
                      style={{ color: '#fbbf24', verticalAlign: 'middle' }}
                      fill="#fbbf24"
                    />
                  ) : (
                    <Star
                      key={`empty-${i}`}
                      size={17}
                      style={{ color: '#e5e7eb', verticalAlign: 'middle' }}
                    />
                  )
                )
              }
              <span className="ref-rating" style={{ marginLeft: 4 }}>
                {refereeDetailed?.data?.referee_feedback?.overall_rating?.[0] ?? 0}/10
              </span>
            </span>
          </div>

          {refereeDetailed?.data?.referee_feedback?.overall_rating?.[1]&&(<>
          <div className="ref-row">
            <span className="ref-label">Would you rehire this candidate?</span>
            {refereeDetailed?.data?.referee_feedback.overall_rating[1]=="yes" ?
              <span className="ref-pill-pillyes"><CheckCircle size={15} style={{marginRight:4}}/>Yes</span>:
              <span className="ref-pill-pillno"><XCircle size={15} style={{marginRight:4}}/>No</span>
            }
          </div>
          </>)}
          
        </div>

        {/* All Sections */}
        <div className="ref-section-group">
          <div className="ref-block">
            <div className="ref-block-title">
              Question 1 :{` `}
              How would you describe the candidate's ability to handle deadlines and pressure in a real work environment? (Please share an example if possible.)
            </div>
            <div className="ref-block-content">{refereeDetailed?.data?.referee_feedback["Question 1"]}</div>
          </div>
          <div className="ref-block">
            <div className="ref-block-title">
              Question 2 :{` `}
              Was the candidate punctual and reliable in completing tasks or attending work/meetings? Did you face any concerns in this area?
            </div>
            <div className="ref-block-content">{refereeDetailed?.data?.referee_feedback["Question 2"]}</div>
          </div>
          <div className="ref-block">
            <div className="ref-block-title">
              Question 3 :{` `}
              Can you recall a time when the candidate took initiative or went above and beyond their responsibilities? What was the outcome?
            </div>
            <div className="ref-block-content">{refereeDetailed?.data?.referee_feedback["Question 3"]}</div>
          </div>
          <div className="ref-block">
            <div className="ref-block-title">
              Question 4 :{` `}
              If you had the opportunity, would you hire or work with this candidate again? Please explain your reasoning?
            </div>
            <div className="ref-block-content">{refereeDetailed?.data?.referee_feedback["Question 4"]}</div>
          </div>
          <div className="ref-block">
            <div className="ref-block-title">
              Question 5 :{` `}
              {/* <FaQuestion size={14} style={{ marginRight: 7, color: "#475569", verticalAlign: "middle" }} /> */}
              Have you ever observed the candidate managing conflicts or disagreements within a team? How did they approach it?
            </div>
            <div className="ref-block-content">{refereeDetailed?.data?.referee_feedback["Question 5"]}</div>
          </div>
          {/* <div className="ref-block">
            <div className="ref-block-title">
              <Timer size={17} style={{ marginRight: 7, color: "#0ea5e9", verticalAlign: "middle" }} />
              Reliability and punctuality
            </div>
            <div className="ref-block-content">{feedback.reliability}</div>
          </div> */}
          {refereeDetailed?.data?.referee_feedback?.additional_comments&&(<>
          <div className="ref-block">
            <div className="ref-block-title">
              <FaRegCommentDots size={17} style={{ marginRight: 7, color: "#475569", verticalAlign: "middle" }} />
              Additional Comments
            </div>
            <div className="ref-block-content">{refereeDetailed?.data?.referee_feedback?.additional_comments}</div>
          </div>
          <div className="ref-block">
            <div className="ref-block-title">
              <Award size={17} style={{ marginRight: 7, color: "#475569", verticalAlign: "middle" }} />
              Final Recommendations
            </div>
            <div className="ref-block-content">
              {(() => {
                const rec = refereeDetailed?.data?.referee_feedback?.final_recommendation?.trim().toLowerCase();
                switch (rec) {
                  case "strongly recommend":
                    return <ThumbsUp size={17} style={{ marginRight: 5, marginTop: -3, verticalAlign: "middle" }} color="#22c55e" />;
                  case "recommend":
                    return <CheckCircle size={17} style={{ marginRight: 5, marginTop: -3, verticalAlign: "middle" }} color="#2563eb" />;
                  case "neutral":
                    return <MinusCircle size={17} style={{ marginRight: 5, marginTop: -3, verticalAlign: "middle" }} color="#fbbf24" />;
                  case "do not recommend":
                    return <ThumbsDown size={17} style={{ marginRight: 5, marginTop: -3, verticalAlign: "middle" }} color="#dc2626" />;
                  default:
                    return null;
                }
              })()}
{`  `}{refereeDetailed?.data?.referee_feedback?.final_recommendation}</div>
          </div>
          </>)}
          
        </div>

        {/* <div className="ref-section" style={{marginTop:24}}>
          <div className="ref-section-title ref-internal-title">
            <Notebook size={16} style={{marginRight:6}}/> Internal Notes
          </div>
          <div className="ref-internal">
            {feedback.internal}
          </div>
        </div> */}

        {/* Action Buttons */}
        <div className="ref-actions">
          <button className="ref-btn" onClick={()=>{getPdfReport()}}>
             {downloadLoading?(
                  <>
                    <Loader size={14} className="downloadLoading"/>{"  "}
                    Downloading ...
                  </>
                  ):(
                  <>
                    <Download size={14} /> {"  "}
                    Download Summary Report
                  </>
                )}
            
            </button>
          {/* <button className="ref-btn ref-btn-download">Download PDF</button> */}
          <button className="ref-btn ref-btn-secondary" onClick={()=>{setProfileClicked(true);setCenterViewType("")}}>Close</button>
        </div>
      </div>
    </div>
      
    </>
  );
};

export default InterviewHistory;
