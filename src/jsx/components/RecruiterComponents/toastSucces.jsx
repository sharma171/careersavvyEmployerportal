import React, { useEffect } from 'react';
import './css/toastpopup.css?ver0.5';
import { Ban } from 'lucide-react'; // or your icon


const Toast = ({ message, type ,setType, setMessage }) => {
      useEffect(() => {
    if (message && message !== '') {
      const timer = setTimeout(() => {
        setMessage('');
        setType('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, setMessage, setType]);

  const isArrayMessage =
    Array.isArray(message) ||
    (typeof message === 'object' && message?.topName && message?.para);
  return (
    <>
     {message ? (
        <div className={`toast-container toastSuccessMessage ${type}`}>
          {isArrayMessage ? (
            <div className="report-popup">
              <div className="report-icon">
                <Ban size={24} color="#B91C1C" />
              </div>
              <div className="report-message">
                <h4>{message.topName || 'Report Unavailable'}</h4>
                <p>{message.para || 'No interview summary available to generate the report'}</p>
              </div>
              {/* <button className="okay-btn" onClick={() => setMessage("")}>
                Okay
              </button> */}
            </div>
          ) : (
            <>
              <div className="toast-icon">
                {type === 'success' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" height="20" width="20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                  </svg>
                ) : (
                  '❌'
                )}
              </div>
              <div className="toast-message">{message}</div>
            </>
          )}
        </div>
      ) : null}
    </>
   
  );
};

export default Toast;
