import React, { useState } from 'react';
import axios from 'axios';
import Markdown from 'react-markdown'

const PDFUploadForm = () => {
    const [pdfFile, setPdfFile] = useState(null);
    const [version, setVersion] = useState('version2');
    const [responseList, setResponseList] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [logs, setLogs] = useState([]);

    const handleFileChange = (event) => {
        setPdfFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!pdfFile) return;
        
        const WS_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:8000/ws/logs/';

        if (WS_URL) {
            console.log("socket URL ", WS_URL)
        } else {
            console.log("socket URL not found")
        }

        let socket = new WebSocket(WS_URL);
        socket.onopen = () => {
            console.log('WebSocket is connected.');
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('Received log:', data.log);
            setLogs(prevLogs => [...prevLogs, data.log]);
        };

        socket.onclose = () => {
            console.log('WebSocket is closed.');
        };

        setIsLoading(true);
        setResponseList('');
        setError('');
        setLogs([]);

        const API_BASE_URL = process.env.REACT_APP_API_URL  || 'http://127.0.0.1:8000/api/match/';

        if (API_BASE_URL) {
            console.log("API URL found", API_BASE_URL)
        } else {
            console.log("API URL not found")
        }

        try {
            const formData = new FormData();
            formData.append('file', pdfFile);
            formData.append('version', version);
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
        return (<pre>{JSON.stringify(data, null, 2)}</pre>);
    };

    return (
        <div className="upload-page">
            
            <h2>AI-Powered Job Match Solution</h2>
            <b>Project Overview: </b>
            <p>This solution leverages Large Language Models (LLMs) to streamline the job search process. It takes a user's resume in PDF format as input and analyzes it to extract key skills, experiences, and career goals. The extracted information is then compared against a vast dataset of 51,863 job listings stored in OpenSearch, which have been collected from Google Jobs.  The system then identifies and returns the top 5 job descriptions that are the best match for the user's profile.</p>
            <a href="https://carbonated-waxflower-92e.notion.site/b978cea7fa9a4f2ab72558e9ff101ddf?pvs=4">Demo, Detailed Explanation, and Future Release</a>
            <div> 
                View My Code: <a href="https://github.com/wusixuan0/jd-match-api">Backend</a> <a href="https://github.com/wusixuan0/jd-match-frontend">Frontend</a>  
            </div>
            <p>Instruction: Upload resume PDF to get top 5 job posts.</p>
            <div>Version 1: Google Gemini to assess, match, and rank job descriptions</div>
            <p>Version 2: Combines semantic search with embeddings and Gemini. More versions to come. See link for future release. </p>
            <form onSubmit={handleSubmit}>

                <select value={version} 
                    onChange={(e) => setVersion(e.target.value)}
                    className="version-select"
                >
                    <option value="version1">Version 1</option>
                    <option value="version2">Version 2</option>
                </select>
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
            </form>
            {logs.length > 0 && <h3>Server Logs</h3>}
                {logs.map((log, index) => (
                    <div className='logs' key={index}>{log}</div>
                ))}
            {error}
            {responseList && <h3> Your Top 5 Job Recommendations </h3>}
            <ul>
                { Object.values(responseList).map((jd, index) => (
                    <div key={jd?._id}>
                        <h2>
                            {index === 0 ? '🥇 Number 1 Match:' : 
                            index === 1 ? '🥈 Number 2 Match:' : 
                            index === 2 ? '🥉 Number 3 Match:' : `🏅 Number ${index + 1} Match:`}
                        </h2>
                        <div>{jd?._source?.title}</div>
                        <div>{jd?._source?.companyName}</div>
                        <div>{jd?._source?.location}</div>
                        <Markdown>{jd?._source?.description}</Markdown>
                        <h2>Application Links And More Info for                            
                            {index === 0 ? '🥇 Number 1 Match:' : 
                            index === 1 ? '🥈 Number 2 Match:' : 
                            index === 2 ? '🥉 Number 3 Match:' : `🏅 Number ${index + 1} Match:`}</h2> 
                        <NestedJSON data={jd?._source} />
                    </div>
                )) }
            </ul>
        </div>
    );
};

export default PDFUploadForm;