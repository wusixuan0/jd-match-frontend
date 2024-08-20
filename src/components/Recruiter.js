import React from 'react';
import FormAndResult from './FormAndResult.js';

const Recruiter = () => {
  return (
    <div className="upload-page">
      <h2>AI-Powered Recruitment Platform</h2>

      <h3>Find Top Talent Faster with Our Intelligent Candidate Selection Algorithm</h3>
      <ul><li>Upload your job description and get AI-powered recommendations of the best-fit candidates from our database.</li>
      </ul>
      
      <p><b>View our <a href="https://carbonated-waxflower-92e.notion.site/Demo-9ea47725809840f1949759fee9792907?pvs=4">Demo</a></b> and learn more about our platform and features.</p>
      <ul>
      <li><b>Efficient Hiring:</b> Streamline your recruitment process and save time with our intelligent selection system. </li>

      <li><b>Quality Candidates:</b> Access a pool of pre-screened and qualified candidates actively seeking new opportunities.</li>
      <li><b>Advanced AI Technologies:</b> Powered by the latest models from Google Gemini, Langchain, Faiss, and more.</li>
      </ul>
      <div>Coming Soon:</div>
      <ul>
      <li>Advanced candidate search and filtering options</li>
      <li>Integration with your existing Applicant Tracking System (ATS)</li>
      </ul>



      <FormAndResult fileCategory={"jd"}/>
    </div>
  );
};

export default Recruiter;