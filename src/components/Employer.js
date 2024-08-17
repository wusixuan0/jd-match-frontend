import React from 'react';
import FormAndResult from './FormAndResult.js';

const Employer = () => {
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

      <p><b>Powered by Google's Gemini, Faiss and more.</b></p>

      <ul>
      <li>View our Employer <a href="https://carbonated-waxflower-92e.notion.site/Demo-9ea47725809840f1949759fee9792907?pvs=4">Demo</a> and learn more about our platform and features</li>
      <li>Currently focusing on tech roles in Toronto, Vancouver, Montreal, and Calgary. Expanding soon!</li>
      </ul>
      <FormAndResult/>
    </div>
  );
};

export default Employer;