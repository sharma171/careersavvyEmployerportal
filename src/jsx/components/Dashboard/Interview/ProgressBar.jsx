import React from 'react';
import './ProgressBar.css';

const ProgressBar = ({ progress = 15 }) => {
  return (
    <div className="progress-container">
      <div
        className="progress-fill"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;