import React, { useState } from 'react';
import UploadPDF from './UploadPDF.js';
import Results from './Results.js';

const Employer = () => {
  const [responseList, setResponseList] = useState([]);
  const [logs, setLogs] = useState([]);
  const [transactionId, setTransactionId] = useState(null);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const handleFormSubmit = () => {
      setIsFormSubmitted(true);
  };

  const handleUploadSuccess = (data) => {
      setResponseList(data.ranked_jds);
      setTransactionId(data.transaction_id);
  };
  return (
    <div className="upload-page">
      <h2>AI-Powered Recruitment Platform</h2>

      <h3>Find Top Talent Faster with Personalized Candidate Matching</h3>

      <p>Upload your job openings and get AI-powered recommendations of the best-fit candidates from our database. We respect candidate privacy.</p>

      <p><b>Efficient Hiring:</b> Streamline your recruitment process and save time with our intelligent matching system. </p>

      <p><b>Quality Candidates:</b> Access a pool of pre-screened and qualified candidates actively seeking new opportunities.</p>

      <div>Coming Soon:</div>
      <ul>
      <li>Advanced candidate search and filtering options</li>
      <li>Integration with your existing Applicant Tracking System (ATS)</li>
      </ul>

      <p><b>Powered by Google's Gemini, OpenSearch and more.</b></p>

      <ul>
      <li>View our Employer <a href="https://carbonated-waxflower-92e.notion.site/Demo-9ea47725809840f1949759fee9792907?pvs=4">Demo</a> and learn more about our platform and features</li>
      <li>Currently focusing on tech roles in Toronto, Vancouver, Montreal, and Calgary. Expanding soon!</li>
      </ul>
      <UploadPDF 
            onUploadSuccess={handleUploadSuccess}
            onFormSubmit={handleFormSubmit}
        />
    </div>
  );
};

export default Employer;