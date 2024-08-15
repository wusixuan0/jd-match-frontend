import React, { useState } from 'react';
import axios from 'axios';
import Markdown from 'react-markdown'

const PDFUploadForm = () => {
    const [pdfFile, setPdfFile] = useState(null);
    const [version, setVersion] = useState('version2');
    const [modelName, setModelName] = useState('gemini-1.5-flash');
    const [responseList, setResponseList] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [logs, setLogs] = useState([]);
    const [activeTab, setActiveTab] = useState('logs');
    const [transactionId, setTransactionId] = useState(null);
    const [frequency, setFrequency] = useState('Daily');
    const [email, setEmail] = useState('');
    const [isSubscribing, setIsSubscribing] = useState(false);
    const [isSendingFeedback, setIsSendingFeedback] = useState(false);
    const handleFrequencyChange = (event) => {
        setFrequency(event.target.value);
    };
  
    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };
    const handleFeedbackSubmit = async (event) => {
    };
    const handleEmailSubmit = async (event) => {
        event.preventDefault();
        setIsSubscribing(true);
        const EMAIL_SUBSCRIBE_URL = process.env.REACT_APP_EMAIL_SUBSCRIBE_URL  || 'http://127.0.0.1:8000/api/subscribe/';
        if (EMAIL_SUBSCRIBE_URL) {
            console.log("Email Subscribe URL ", EMAIL_SUBSCRIBE_URL)
        } else {
            console.log("Email Subscribe URL not found")
        }
        try {
            const formData = new FormData();
            formData.append('transaction_id', transactionId);
            formData.append('email', email);
            formData.append('frequency', frequency);
            const response = await axios.post(EMAIL_SUBSCRIBE_URL, formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setIsSubscribing(false);
        } catch (error) {
            setError(error?.response?.data?.error);
        }
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
    const tabEmailStyle = (isActive) => ({
        padding: '10px 20px',
        border: 'none',
        background: isActive ? '#f0f0f0' : 'transparent',
        cursor: 'pointer',
        borderBottom: isActive ? '2px solid #007bff' : 'none',
        whiteSpace: 'nowrap',
        
        fontWeight: isActive ? 'bold' : 'normal',
        color: isActive ? '#007bff' : 'inherit',
        textDecoration: 'underline',
        transition: 'all 0.2s ease',
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
            <form onSubmit={handleSubmit}>
                <select value={version} 
                    onChange={(e) => setVersion(e.target.value)}
                    className="version-select"
                >
                    <option value="version1">Version 1</option>
                    <option value="version2">Version 2</option>
                </select>
                <select value={modelName} 
                    onChange={(e) => setModelName(e.target.value)}
                    className="version-select"
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

            {(logs.length > 0 || jobPosts.length > 0) && 
            <div>
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
                    { jobPosts.length > 0 && <button
                        style={tabButtonStyle(activeTab === 'email')}
                        onClick={() => setActiveTab('email')}
                        >Email Subscription</button>
                    }
                    
                </div>

                <div style={contentStyle}>
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

                    { activeTab === 'email' && (
                        <div>
                            <h3>Email Subscription</h3>
                            <p>Love these job recommendations? We can send you the latest, most relevant opportunities straight to your inbox. 
                            </p>
                            <p>By providing your email, we'll also save a copy of your resume and send you personalized job matches at your preferred frequency. If you prefer not to subscribe or have us save your resume, you can still access recommendations. We won't store any of your data. Simply copy and paste the application links!</p>
                            <p>You can unsubscribe anytime – the link will be at the top of each email. You can also remove your resume from our database using the link provided in each email. We promise to never spam you.</p>
                            <p>Need to update your resume? No problem!  Unsubscribe and remove your old resume using the link in your email, then upload your new one and resubscribe!</p>

                            <form onSubmit={handleEmailSubmit}>
                                <div className="frequency-options">
                                    <label>
                                        <input
                                        type="radio"
                                        value="Daily"
                                        checked={frequency === 'Daily'}
                                        onChange={handleFrequencyChange}
                                        />
                                        Daily
                                    </label>
                                    <label>
                                        <input
                                        type="radio"
                                        value="Weekly"
                                        checked={frequency === 'Weekly'}
                                        onChange={handleFrequencyChange}
                                        />
                                        Weekly
                                    </label>
                                    <label>
                                        <input
                                        type="radio"
                                        value="Bi Weekly"
                                        checked={frequency === 'Bi Weekly'}
                                        onChange={handleFrequencyChange}
                                        />
                                        Bi Weekly
                                    </label>
                                </div>

                                <div className="email-input">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={handleEmailChange}
                                    placeholder="Enter your email address"
                                />
                                </div>

                                <button type="submit" className="submit-button subcribe">       {isSubscribing ? 'Subscribing...' : 'Subscribe'}</button>
                            </form>

                            <h3>Feedback</h3>
                            <p>Your feedback helps improve our algorithm. Tell us what you think!</p>
                            
                            <form onSubmit={handleFeedbackSubmit}>
                                <>I plan to apply for one or more of these jobs.</>
                                { jobPosts.map((job, index) => ( 
                                    <div key={job?._id}>
                                        <input 
                                        type="checkbox" 
                                        // checked={checked} 
                                        // onChange={() => handleCheckboxChange(index)} 
                                        />
                                        <label> Job {index + 1}
                                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🏅'} Job {index + 1}
                                        </label>
                                    </div>
                                ))}

                                <p>(Optional) Please rank the recommendations from most liked to least liked (1 being the most liked).</p>

                                
                                <button type="submit" className="submit-button subcribe">       {isSubscribing ? 'Subscribing...' : 'Send Feeback'}</button>
                            </form>
                        </div>
                    )}

                </div>
                <div>

                </div>
            </div>}






        </div>
    );
};

export default PDFUploadForm;