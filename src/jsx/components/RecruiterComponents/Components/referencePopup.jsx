import React, {  useState, useEffect, } from "react";
import './style/referencePopup.css?ver0.2';
import candidatestyles from '../css/JobPostModal.module.css';
import { FaUserFriends } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { FaUser, FaEnvelope, FaPhone, FaClock, FaCalendarAlt } from 'react-icons/fa';
import { FaCheckCircle } from 'react-icons/fa';


const references = [
  {
    name: 'Sarah Wilson',
    role: 'Direct Manager',
    email: 'sarah.wilson@techcorp.com',
    phone: '(555) 123-4567',
    knownDuration: '2.5 years',
    submittedAt: 'May 25, 2025 at 04:00 PM',
    recommendation: 'Strongly Recommend'
  },
  {
    name: '',
    role: '',
    email: '',
    phone: '',
    knownDuration: '',
    submittedAt: '',
    recommendation: ''
  },
  {
    name: '',
    role: '',
    email: '',
    phone: '',
    knownDuration: '',
    submittedAt: '',
    recommendation: ''
  }
];

export const ReferencePopup = ({setPopupType,popupType}) => {
  const [activeTab, setActiveTab] = useState(0);
  const activeRef = references[activeTab];

  return (
    <div className="ref-container">
      <div className="ref-header">
        <h2 className="ref-title">Reference Check Results</h2>
        <IoMdClose className="ref-close-icon" onClick={()=>{setPopupType("")}} />
      </div>

      <div className="ref-details">
        <h3 className="ref-name">John Smith</h3>
        <p className="ref-role">Senior Frontend Developer</p>
        <div className="ref-completed">
          <svg xmlns="http://www.w3.org/2000/svg" className="ref-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          <span>3 References Completed</span>
        </div>
      </div>

      <div className="ref-tabs">
        <div className={candidatestyles.fwidthTabs}>
            <div className={`navBar ${candidatestyles.navBar}`}>
                    {[1, 2, 3].map((tab) => (
                    <button
                        key={tab}
                        className={`${candidatestyles.navigationLink} ${activeTab=='CandiatesList' ? candidatestyles.navigationLinkActive : ""} tabButton`}
                        onClick={() => setActiveTab(tab)}
                    >
                        Referee {tab}
                    </button>
                    ))}
            </div>
        </div>

        <div className="referee-card">
            <div className="referee-heading">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-user h-4 w-4 icon"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                <h4>Referee 1 Details</h4>
            </div>

            <div className="referee-info">
                <h3 className="referee-name">Sarah Wilson</h3>
                <p className="referee-title">Direct Manager</p>
                <div className="referee-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-mail h-3 w-3 text-muted-foreground icon"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
                <span>sarah.wilson@techcorp.com</span>
                </div>
                <div className="referee-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-phone h-3 w-3 text-muted-foreground icon"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                <span>(555) 123-4567</span>
                </div>
                <div className="referee-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-clock h-3 w-3 text-muted-foreground icon"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                <span>Known for 2.5 years</span>
                </div>
                <div className="referee-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-calendar h-3 w-3 icon"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg>
                <span style={{fontSize:"12px"}}>Submitted on May 25, 2025 at 04:00 PM</span>
                </div>
            </div>
        </div>
        <div className="recommendation-card">
            <h4 className="recommendation-title">Final Recommendation</h4>
            <div className="recommendation-badge">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-circle-check-big h-4 w-4 check-icon"><path d="M21.801 10A10 10 0 1 1 17 3.335"></path><path d="m9 11 3 3L22 4"></path></svg>
                <span>Strongly Recommend</span>
            </div>
        </div>
        <div className="feedback-card">
            <h3 className="feedback-header">Feedback</h3>

            <div className="feedback-question-block">
                <p className="feedback-question">
                How would you describe the candidate's ability to handle deadlines and pressure in a real work environment? (Please share an example if possible.)
                </p>
                <div className="feedback-answer">
                "John consistently meets deadlines even under high pressure. During our Q4 product launch, he managed to deliver three critical features ahead of schedule while maintaining code quality. He has excellent time management skills and communicates proactively when he anticipates any delays."
                </div>
            </div>

            <div className="feedback-question-block">
                <p className="feedback-question">
                Can you recall a time when the candidate took initiative or went above and beyond their responsibilities? What was the outcome?
                </p>
                <div className="feedback-answer">
                "John identified performance bottlenecks in our main application without being asked and spent his own time researching solutions. He presented a detailed optimization plan that reduced page load times by 40%. This initiative directly improved user satisfaction scores."
                </div>
            </div>

            <div className="feedback-question-block">
                <p className="feedback-question">
                If you had the opportunity, would you hire or work with this candidate again? Please explain your reasoning.
                </p>
                <div className="feedback-answer">
                "Absolutely, I would hire John again without hesitation. He brings technical expertise, strong work ethic, and positive team dynamics. His contributions significantly improved our development processes and team productivity."
                </div>
            </div>
        </div>

        <div className="secuirityalert">
            <span className="text"><strong>Security Note:</strong> This reference feedback was submitted via a secure, one-time link by the referee and cannot be edited once submitted.</span>
        </div>
        
      </div>
    </div>
    

    //   <div className="tab-row">
    //     {['Referee 1', 'Referee 2', 'Referee 3'].map((label, idx) => (
    //       <button
    //         key={idx}
    //         className={`tab-button ${activeTab === idx ? 'active' : ''}`}
    //         onClick={() => setActiveTab(idx)}
    //       >
    //         {label}
    //       </button>
    //     ))}
    //   </div>

    //   <div className="reference-card">
    //     <h4 className="card-title">👤 Referee {activeTab + 1} Details</h4>
    //     {activeRef.name ? (
    //       <>
    //         <p className="ref-name">{activeRef.name}</p>
    //         <p className="ref-role">{activeRef.role}</p>
    //         <p>📧 {activeRef.email}</p>
    //         <p>📞 {activeRef.phone}</p>
    //         <p>⏱ Known for {activeRef.knownDuration}</p>
    //         <p>📅 Submitted on {activeRef.submittedAt}</p>
    //       </>
    //     ) : (
    //       <p className="placeholder">No referee details available.</p>
    //     )}
    //   </div>

    //   <div className="reference-card">
    //     <h4 className="card-title">Final Recommendation</h4>
    //     {activeRef.recommendation ? (
    //       <span className="recommend-badge">✅ {activeRef.recommendation}</span>
    //     ) : (
    //       <p className="placeholder">No recommendation provided.</p>
    //     )}
    //   </div>
    // </div>
  );
}
