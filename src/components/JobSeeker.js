import React, { useState } from 'react';
import UploadPDF from './UploadPDF.js'

const JobSeeker = () => {
    return (
        <div className="upload-page">
            <h2>AI-Powered Job Match</h2>
            <p><b>Instantly discover personalized job matches tailored to your resume, powered by Google's Gemini, OpenSearch and more.</b> View my <a href="https://carbonated-waxflower-92e.notion.site/Demo-for-Current-Release-9ea47725809840f1949759fee9792907?pvs=4">Project Demo</a>, <a href="https://carbonated-waxflower-92e.notion.site/b978cea7fa9a4f2ab72558e9ff101ddf?pvs=4">Detail Explanation and Future Release</a>, and Code for <a href="https://github.com/wusixuan0/jd-match-api">Backend</a> and <a href="https://github.com/wusixuan0/jd-match-frontend">Frontend</a></p>
            <p>Upload your resume to get top 5 recommendations. Your resume won't be stored unless you opt-in for email notifications via the Preferences tab.</p>
            <p>Available job titles in this tool are: Data Engineer, Data Scientist, Machine Learning Engineer, Software Engineer, Data Analyst, Business Intelligence Analyst, Paid Search, Paid Media, and Paid Social.</p>
            <p>Available locations are: Toronto, Vancouver, Montreal, Calgary.</p>
            <p>Version 1 directly leverages Gemini API by Google to assess, match, and rank job descriptions. Version 2 combines similarity search (using Faiss by Facebook AI) with embeddings and Gemini API.</p>

            <UploadPDF />
        </div>    
    

    );
};
export default JobSeeker;