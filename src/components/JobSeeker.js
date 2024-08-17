import React from 'react';
import FormAndResult from './FormAndResult.js';

const JobSeeker = () => {
    return (
        <div className="upload-page">
            <h2>AI-Personalized Job Search Platform</h2>
            <h3>Upload your resume to get top 5 job recommendations from the last 7 days in your area. We value your privacy - your resume won't be stored unless you subscribe for email job alerts.</h3>
            <p><b>Privacy First:</b> We understand your concerns. We are working on adding a pdf editor to automatically remove personal sensitive information from your resume before uploading (with nltk libary). </p>

            <div>Powered by Google Gemini, OpenSearch, Faiss and more.</div>
            <ul>
                <li>View my <a href="https://carbonated-waxflower-92e.notion.site/Demo-for-Current-Release-9ea47725809840f1949759fee9792907?pvs=4">Project Demo</a>, <a href="https://carbonated-waxflower-92e.notion.site/b978cea7fa9a4f2ab72558e9ff101ddf?pvs=4">Detail Explanation and Future Release</a>, and Code for <a href="https://github.com/wusixuan0/jd-match-api">Backend</a> and <a href="https://github.com/wusixuan0/jd-match-frontend">Frontend</a></li>
                <li>Available job titles: Data Engineer, Data Scientist, Machine Learning Engineer, Software Engineer, Data Analyst, Business Intelligence Analyst, Paid Search, Paid Media, and Paid Social.</li>
                <li>Available locations: Toronto, Vancouver, Montreal, Calgary.</li>
                <li>Version 1 leverages Gemini API. Version 2 combines similarity search with embeddings and Gemini API.</li>
                <li>Choose one of the newest Google Gemini models.</li>
                
            </ul>
            <FormAndResult></FormAndResult>
        </div>    
    );
};

export default JobSeeker;