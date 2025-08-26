import React from 'react';
import './CoachFeedback.css';

interface CoachFeedbackProps {
  advice: string;
  isLoading: boolean;
  error?: string;
}

export const CoachFeedback: React.FC<CoachFeedbackProps> = ({ advice, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="coach-feedback loading">
        <div className="coach-header">
          <h3>🤔 Coach is analyzing...</h3>
        </div>
        <div className="coach-content">
          <div className="loading-spinner"></div>
          <p>Evaluating your last move...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="coach-feedback error">
        <div className="coach-header">
          <h3>❌ Coach Error</h3>
        </div>
        <div className="coach-content">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!advice) {
    return null;
  }

  return (
    <div className="coach-feedback">
      <div className="coach-header">
        <h3>🎯 Coach's Feedback</h3>
      </div>
      <div className="coach-content">
        <p className="advice-text">{advice}</p>
      </div>
    </div>
  );
};
