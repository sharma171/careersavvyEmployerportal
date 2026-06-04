import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import "../css/interview.css";
import { FaUser } from "react-icons/fa";
import CsavvyContentLoader from "../../components/Dashboard/CsavvyPageLoad";
import { BsCameraVideo } from "react-icons/bs";
import { BiTimeFive } from "react-icons/bi";
import { FiCalendar } from "react-icons/fi";
import { RiQuestionAnswerLine } from "react-icons/ri";
import SystemCheckPopup from "./sytemCheck/systemCheckPopup";
import { setDocId, setLinkInterviewQuestions } from "../../../store/actions/actions";
import { MessageSquare } from "lucide-react";
const Interview = () => {
    const location = useLocation();
  const [token, setToken] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [loader, setLoader] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [textInterviewReady, setTextInterviewReady] = useState(false);
  const navigate = useNavigate();
  const [interviewDetails, setInterviewDetails] = useState([]);
  const [interviewType, setInterviewType] = useState("audio");
  const [interviewInitalised, setInterviewInitalised] = useState(false);
  const [interviewStartData, setInterviewStartData] = useState([]);
  const dispatch = useDispatch();
   const { docId, linkInterviewQuestions } = useSelector((state) => state.profile);
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenFromUrl = queryParams.get('token');

    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      validateInterviewToken(tokenFromUrl);
      localStorage.removeItem("LinkToken");
      localStorage.setItem("LinkToken", tokenFromUrl);
      setTimeout(()=>{
        // generateInterviewToken(tokenFromUrl);
        // generateVideoInterviewToken(tokenFromUrl);
        // endtextoanswer();
        // endVideoanswer();
      },3000)
    }
  }, [location.search]);

  useEffect(()=>{
    if(interviewInitalised==true){
      if(interviewType=="audio"){
        generateInterviewToken(token);
      }
      else {
        // generateVideoInterviewToken(token);
      }
    }
  },[interviewInitalised])

  useEffect(()=>{
    localStorage.removeItem("LinkInterviewId");
    localStorage.removeItem("LinkInterviewDetails");
    localStorage.removeItem("LinkInterviewType");
    localStorage.removeItem("LinkInterviewStartData");
    localStorage.removeItem("Linktoken");
    if (docId) localStorage.setItem("LinkInterviewId", docId);
    if (token) localStorage.setItem("Linktoken", token);
    if (interviewStartData) {localStorage.setItem("LinkInterviewStartData", JSON.stringify(interviewStartData))};
    if (interviewDetails) {localStorage.setItem("LinkInterviewDetails", JSON.stringify(interviewDetails));}
    if (interviewType) localStorage.setItem("LinkInterviewType", interviewType);
  },[interviewType, interviewDetails, interviewStartData, docId, token])
const generateInterviewToken = async (token) => {
  setLoader("Initalizing Interview");
  setTextInterviewReady(false);
    try {
      const listQuery = 
      {
        action: 'start_token_text',
        token: token
      };

      const response = await fetch('https://generate-text-interview-v10-737421501165.us-east1.run.app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(listQuery),
      });
      const data = await response.json();
      console.log('Token validation response:', data);
      dispatch(setDocId(data.session_id));
      dispatch(setLinkInterviewQuestions(data.first_question));
      setInterviewStartData(data);
      setLoader("");
      setTimeout(()=>{
        setTextInterviewReady(true);
      },700)
    } catch (error) {
      console.error('Error validating token:', error);
      setLoader(error);
    }
    finally{
      setTimeout(()=>{
        setLoader("")
      },2000)
    }
  };



  const validateInterviewToken = async (tokenToValidate) => {
    setLoader("Loading Interview Details");
    try {
      const listQuery = 
      {
        action: 'validate-interview-token',
        token: tokenToValidate
      };

      const response = await fetch('https://send-interview-invites-recruiter-v10-737421501165.us-east1.run.app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(listQuery),
      });

      const data = await response.json();

      // Optional: update state based on response
      if (data && data.valid === true) {
        setIsValid(true);
        setInterviewDetails(data);
        setInterviewType(data.interview_config.interview_type);
        setInterviewInitalised(true);
        setLoader("");
      } else {
        // Handle invalid token
        setIsValid(false);
        console.log(data.message);
        setLoader(data.message)

        setTimeout(()=>{
          setLoader("");
          navigate("/")
        },2000)
        
      }

    } catch (error) {
      console.error('Error validating token:', error);
      setLoader(error);
      setTimeout(()=>{
        setLoader("");
      },2000)
    }
    finally{
      setTimeout(()=>{
        setLoader("")
      },2000)
    }
  };

  return (
    <>

    {loader!=="" &&(<>
      <div className="dashboard-container full-screen">
        <CsavvyContentLoader loaderText={loader}/>
      </div>
    </>)}
        <div className="w-oLogininterview">
            <div className="interview-container">
                <div className="interview-card">
                    <div className="icon-wrapper">
                    {interviewDetails?.interview_config?.interview_type=="video"?(<>
                    <BsCameraVideo size={40} color="#3b82f6" />
                    </>):(<>
                    <MessageSquare size={40} color="#3b82f6" />
                    </>)}
                    
                    </div>
                    {console.log("Interview Details", interviewDetails)}

                    <h2 className="interview-title">Welcome to Your {interviewDetails?.interview_config?.interview_type=="video"?"Video":"Text"} Interview</h2>
                    {/* <p className="interview-subtitle">
                    Senior Frontend Developer at TechCorp Inc.
                    </p> */}

                    <div className="greeting">
                    <FaUser className="user-icon" />
                    <span>Hello, {interviewDetails?.interview_config?.candidate_name}!</span>
                    </div>

                    <p className="interview-desc">
                    Thank you for your interest in this position. You're about to start your {interviewDetails?.interview_config?.interview_type=="video"?"video":"text"} interview.
                    </p>

                    <div className="info-boxes">
                    <div className="info-box">
                        <RiQuestionAnswerLine className="info-icon" />
                        <p className="info-label">Questions</p>
                        <div>
                        <p className="info-value">10+</p>
                        </div>
                    </div>

                    <div className="info-box">
                        <BiTimeFive className="info-icon" />
                        <div>
                        <p className="info-label">Est. Duration</p>
                        <p className="info-value">15–30 min</p>
                        </div>
                    </div>

                    <div className="info-box">
                        <FiCalendar className="info-icon" />
                        <p className="info-label">Link Expires</p>
                        <div>
                        <p className="info-value">48h</p>
                        </div>
                    </div>
                    </div>

                    <div className="instruction-box">
                    <p className="instruction-title">
                      <span className="excl">!</span>
                        <strong>Important Instructions:</strong>
                    </p>
                    <ul className="instruction-list">
                      {interviewDetails?.interview_config?.interview_type=="video"?(
                        <>
                          <li>Each question has a time limit - please answer within the allotted time.</li>
                          <li>Once you move to the next question, you cannot go back.</li>
                          <li>The interview will auto-submit once all questions are answered.</li>
                          <li className="highlight">
                          This link can be used only once and will expire after submission.
                          </li>
                        </>
                        ):(
                        <>
                        <li>Each question has a time limit - please answer within the allotted time.</li>
                          <li>You can type your responses in the provided text area.</li>
                          <li>The interview will auto-submit once all questions are answered.</li>
                          <li className="highlight">
                          This link can be used only once and will expire after submission.
                          </li>
                        </>
                      )}
                        
                    </ul>
                    </div>

                    {/* <button className="system-check-btn" onClick={()=>{submitVideoanswer()}}>Submit Video Answer</button>
                    <button className="system-check-btn" onClick={()=>{submitTextanswer()}}>Submit Text Answer</button> */}
                    {interviewType=="audio"?(<>
                    <button className="system-check-btn" onClick={()=>{setShowPopup(true)}}>Continue to System Check</button>
                    </>):(<>
                    <button className="system-check-btn" onClick={()=>{navigate("/interview-Video-exam")}}>Continue to System Check</button>
                    </>)}
                </div>
            </div>
             <SystemCheckPopup visible={showPopup} setShowPopup={setShowPopup} interviewType={interviewType} setInterviewType={setInterviewType} interviewDetails={interviewDetails} textInterviewReady={textInterviewReady} setTextInterviewReady={setTextInterviewReady} token={token} onClose={() => setShowPopup(false)} />
        </div>
    </>
  )
}

export default Interview