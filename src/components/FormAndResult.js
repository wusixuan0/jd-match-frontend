import React, { useState } from 'react';
import axios from 'axios';
import Markdown from 'react-markdown'
import EmailSubscription from './EmailSubscription.js';
import Feedback from './Feedback.js';

const FormAndResult = () => {
    const [pdfFile, setPdfFile] = useState(null);
    const [version, setVersion] = useState('version2');
    const [modelName, setModelName] = useState('gemini-1.5-flash');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // response
    const [responseList, setResponseList] = useState('');
    const [logs, setLogs] = useState([]);
    const [activeTab, setActiveTab] = useState('logs');
    const [transactionId, setTransactionId] = useState(null);

    // email
    const [frequency, setFrequency] = useState('Daily');
    const [email, setEmail] = useState('');
    const [isSubscribing, setIsSubscribing] = useState(false);
    const [isSendingFeedback, setIsSendingFeedback] = useState(false);

    const [mailID, setmailID] = useState('');
    const HandleSubscribeSetEmailID = (email_id) => {
        setmailID(email_id);
    };
  


    
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
            formData.append('model_name', modelName);
            const response = await axios.post(API_BASE_URL, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const ranked_jds=response?.data?.ranked_jds;
            const transaction_id=response?.data?.transaction_id;
            setResponseList(ranked_jds);
            setTransactionId(transaction_id);
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

    const processLog = (log) => {
        if (log.startsWith('>>>')) {
          return <h3>{log.slice(3)}</h3>;
        } else if (log.startsWith('<<<')) {
          return <h3>{log.slice(3)}<hr className="dashed"></hr></h3>;
        } else {
          return <div>{log}</div>;
        }
      };

    const tabStyle = {
        display: 'flex',
        borderBottom: '1px solid #ccc',
        marginBottom: '20px',
        overflowX: 'auto',
    };

    const tabButtonStyle = (isActive) => ({
        padding: '10px 20px',
        border: 'none',
        background: isActive ? '#f0f0f0' : 'transparent',
        cursor: 'pointer',
        borderBottom: isActive ? '2px solid #007bff' : 'none',
        whiteSpace: 'nowrap',
    });

    const contentStyle = {
        padding: '20px',
        backgroundColor: '#f9f9f9',
        borderRadius: '0 0 5px 5px',
        lineHeight : '1.5'
    };

    const jobPosts = Object.values(responseList);

    return (
        <div>
            {/* Start of PDF Upload Form */}
            <form onSubmit={handleSubmit} className='pdf-form'>
                <select value={version} 
                    onChange={(e) => setVersion(e.target.value)}
                    className="version-select v-select"
                >
                    <option value="version1">Version 1</option>
                    <option value="version2">Version 2</option>
                </select>
                <select value={modelName} 
                    onChange={(e) => setModelName(e.target.value)}
                    className="version-select model-select"
                >
                    <option value="gemini-1.5-flash">gemini-1.5-flash (recommend)</option>
                    <option value="gemini-1.5-pro">gemini-1.5-pro (my API key usage is limited)</option>
                    <option value="gemini-1.5-pro-exp-0801">gemini-1.5-pro-exp-0801</option>
                </select>
                <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                />
                <button type="submit"
                    className="submit-button pdf-input"
                    disabled={isLoading || !pdfFile}
                >
                    {isLoading ? 'Uploading...' : 'Upload'}
                </button>
            </form>
            {/* End of PDF Upload Form */}

            {(responseList.length > 0) && (
                <p style={{backgroundColor: "lightyellow"}}>Stay Ahead of the Game: Get recommendations on your preferred frequency with our email job alert service via the Email Subscription Tab.</p>
            )}

            {(logs.length > 0 || jobPosts.length > 0) && 
            <div>
                {/* Start of Tab Button */}
                <div style={tabStyle}>
                    <button 
                    style={tabButtonStyle(activeTab === 'logs')}
                    onClick={() => setActiveTab('logs')}
                    >
                    Server Logs
                    </button>
                    {jobPosts.map((job, index) => (
                        <button
                            key={job?._id}
                            style={tabButtonStyle(activeTab === index)}
                            onClick={() => setActiveTab(index)}
                        >
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🏅'} Job {index + 1}
                        </button>
                    ))}
                    { 
                    jobPosts.length > 0 && <button
                    style={tabButtonStyle(activeTab === 'email')} 
                    onClick={() => setActiveTab('email')}
                    >Email Subscription</button>
                    }
                    
                </div>
                {/* End of Tab Button */}

                {/* Start of Tab Content */}
                <div style={contentStyle}>


                    {/* Logs Tab Content */}
                    {activeTab === 'logs' && (
                    <>
                        {logs.length > 0 && <h3>Server Logs</h3>}
                        {logs.map((log, index) => (
                        <div className='logs' key={index}>
                            {processLog(log)}
                        </div>
                        ))}
                        {error}
                    </>
                    )}

                    { jobPosts.map((jd, index) => (
                        activeTab === index && (
                            <div key={jd?._id}>
                                <h2>
                                    {index === 0 ? '🥇 Number 1 Match:' :
                                    index === 1 ? '🥈 Number 2 Match:' :
                                    index === 2 ? '🥉 Number 3 Match:' : `🏅 Number ${index + 1} Match:`}
                                </h2>
                                <div><strong>{jd?._source?.title}</strong></div>
                                <div>{jd?._source?.companyName}</div>
                                <div>{jd?._source?.location}</div>
                                <Markdown>{jd?._source?.description}</Markdown>
                                <h3>Application Links And More Info</h3>
                                <NestedJSON data={jd?._source} />
                            </div>
                        )
                    ))}

                    {activeTab === 'email' && (
                        <div>
                          <EmailSubscription transactionId={transactionId} HandleSubscribeSetEmailID={HandleSubscribeSetEmailID} />
                          <Feedback 
                          transactionId={transactionId} 
                          responseList={responseList} 
                          mailID={mailID} />
                        </div>
                    )}
                </div>
                {/* End of Tab Content */}
            </div>}
        </div>
    );
};

export default FormAndResult;