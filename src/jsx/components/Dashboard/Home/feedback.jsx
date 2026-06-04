import React, { useState } from 'react';

export default function Feedback({userEmail, feedbackPopup, setFeedbackPopup}) {
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const feedbackData = {
      email: userEmail,
      request_type: 'Feedback',
      feedback_text: feedback,
      app_name: 'mockinterview-portal'
    };

    try {
      const response = await fetch('https://us-east1-foursssolutions.cloudfunctions.net/all_user_query_forms_v2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Response:', result);
      setSubmitted(true);
      setTimeout(()=>{setFeedbackPopup("")}, 3000)
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setError('Failed to submit feedback. Please try again.');
    }
  };
  function closePopup() {
    setFeedbackPopup("");
  }

  return (
    <div className="feedback-popup position-fixed bottom-0 end-0 m-4 p-4 shadow-lg bg-white rounded" style={{minWidth:"350px", position:'relative'}}>
      <div className="closeIcon" style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            transform: 'rotate(45deg)',
            padding: '10px',
            fontSize: '15px',
            lineHeight: '9px',
            color: 'white',
            borderRadius: '40px',
            textAlign: 'center',
            background: 'rgb(54 31 108)',
            cursor: 'pointer'
      }} onClick={closePopup}>+</div>
      <h3 className="text-primary fs-24 mb-3">Share your Feedback</h3>
      {submitted ? (
        <div className="text-success">
          <i className="fas fs-20 fa-check-circle me-2"></i>Thank you for your feedback!
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="feedbackInput" className="fs-20 form-label">we value your feedback</label>
            <textarea
              id="feedbackInput"
              className="form-control"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Write your feedback here..."
              required
              rows="4"
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            <i className="fas fa-paper-plane me-2"></i>Submit
          </button>
          {error && <div className="text-danger mt-2">{error}</div>}
        </form>
      )}
    </div>
  );
}
