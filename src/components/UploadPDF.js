import React, { useState } from 'react';
import axios from 'axios';
import Markdown from 'react-markdown'

const PDFUploadForm = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [responseList, setResponseList] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event) => {
    setPdfFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!pdfFile) return;

    setIsLoading(true);
    setResponseList('');
    setError('');

    const API_BASE_URL = process.env.REACT_APP_API_URL;

    if (API_BASE_URL) {
      console.log("API URL found", API_BASE_URL)
    } else {
      console.log("API URL not found")
    }

    try {
      const formData = new FormData();
      formData.append('file', pdfFile);
      const response = await axios.post(API_BASE_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const ranked_jds=response?.data?.ranked_jds
      setResponseList(ranked_jds);
      setIsLoading(false);
    } catch (error) {
      setError(error?.response?.data?.error);
    }
  };

  const NestedJSON = ({ data }) => {
    const filteredData = { ...data };
    delete filteredData?.description;
    return (
      <pre>{JSON.stringify(data, null, 2)}</pre>
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <h2>AI-Powered Job Match Solution</h2>
        <b>Project Overview: </b>
        <p>This solution leverages Large Language Models (LLMs) to streamline the job search process. It takes a user's resume in PDF format as input and analyzes it to extract key skills, experiences, and career goals. The extracted information is then compared against a vast dataset of 51,863 job listings stored in OpenSearch, which have been collected from Google Jobs.  The system then identifies and returns the top 5 job descriptions that are the best match for the user's profile.</p>
        <div> 
          <a href="https://github.com/wusixuan0/jd-match-api">back end</a> <a href="https://github.com/wusixuan0/jd-match-frontend">front end</a> <a href="https://carbonated-waxflower-92e.notion.site/b978cea7fa9a4f2ab72558e9ff101ddf?pvs=4">notion</a> 
          
        </div>
        <p>Instruction: Upload resume PDF to get top 5 job posts</p>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
        />
        <button type="submit"
         className="upload-button"
         disabled={isLoading || !pdfFile}
        >
          {isLoading ? 'Uploading...' : 'Upload'}
        </button>
      </div>
      {error}
      <ul>
      {Object.values(responseList).map((jd) => (
        
        <div key={jd?._id}>
          <Markdown>{jd?._source?.description}</Markdown>
          <NestedJSON data={jd?._source} />
        </div>
      ))}
      </ul>
    </form>
  );
};

export default PDFUploadForm;