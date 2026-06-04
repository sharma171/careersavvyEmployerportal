import React from 'react';
import './style/processionPopup.css';
import { Loader2 } from 'lucide-react';

const ApplicationProcessing = ({ visible }) => {
  if (!visible) return null;

  return (
    <div className="processing-overlay">
      <div className="processing-popup">
        
        <div className="processing-message">
          <h3> <Loader2 className="spinner-icon me-2" size={20} />Processing Application</h3>
          <p>Application is being analyzed by our AI system. Try again after 60 Seconds</p>
            <div className="progress-bar-wrapper">
            <div className="progress-bar" />
            </div>
        </div>
      </div>
    </div>
  )
}

export default ApplicationProcessing