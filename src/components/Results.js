import React, { useState } from 'react';
import Markdown from 'react-markdown';
import EmailSubscription from './EmailSubscription.js';
import Feedback from './Feedback.js';

const Results = ({ responseList, logs, transactionId }) => {
    const [activeTab, setActiveTab] = useState('logs');
    const [subscribeStatus, setSubscribeStatus] = useState('');
    
    const handleSubscribeStatus = (email_id) => {
        setSubscribeStatus(email_id);
    };

    const jobPosts = Object.values(responseList);

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
        lineHeight: '1.5'
    };

    return (
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
                {jobPosts.length > 0 && (
                    <button
                        style={tabButtonStyle(activeTab === 'email')}
                        onClick={() => setActiveTab('email')}
                    >
                        Email Subscription
                    </button>
                )}
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
                    </>
                )}

                {jobPosts.map((jd, index) => (
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
                      <EmailSubscription transactionId={transactionId} handleSubscribeStatus={handleSubscribeStatus} />
                      <Feedback transactionId={transactionId} responseList={responseList} subscribeStatus={subscribeStatus} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Results;