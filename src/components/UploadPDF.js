import React, { useState } from 'react';
import axios from 'axios';
import Markdown from 'react-markdown'
import { createClient } from '@supabase/supabase-js'

const PDFUploadForm = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [responseList, setResponseList] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (event) => {
    setPdfFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!pdfFile) {
      return;
    }

    // add REACT_APP_API_URL= to .env
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
        <h2>Resume Match</h2>
        <b>Project Overview: </b>
        <p>A end-to-end LLM solution for job match that takes a user's resume PDF as input and returns the top 5 best-matching job descriptions from a dataset of 51,863 job listings stored in OpenSearch, scraped from Google Jobs.</p>
        <p>Instruction: Upload resume PDF to get top 5 job posts</p>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
        />
        <button type="submit">Upload</button>
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