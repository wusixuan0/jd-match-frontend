import React, { useState } from 'react';
import axios from 'axios';

const Feedback = ({ transactionId, responseList, mailID }) => {
    const [applied, setApplied] = useState([]);
    const [rankings, setRankings] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const jobPosts = Object.values(responseList);

    const handleCheckboxChange = (index) => {
        setApplied(prev => {
            if (prev.includes(index)) {
                return prev.filter(i => i !== index);
            } else {
                return [...prev, index];
            }
        });
    };

    const handleRankingChange = (index, value) => {
        setRankings(prev => ({
            ...prev,
            [index]: parseInt(value)
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setError('');

        const FEEDBACK_URL = process.env.REACT_APP_FEEDBACK_URL || 'http://127.0.0.1:8000/api/feedback/';

        try {
            const formData = {
                transaction_id: transactionId,
                applied: applied,
                rankings: rankings,
                email_id: mailID,
            };
            const response = await axios.post(FEEDBACK_URL, formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            setMessage('Feedback submitted successfully!', response.data);
        } catch (error) {
            setError(error?.response?.data?.error || 'An error occurred while submitting feedback');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h3>Feedback</h3>
            <div>Your feedback helps improve our algorithm. Tell us what you think!</div>

            <form onSubmit={handleSubmit}>
                <p>I plan to apply for one or more of these jobs:</p>
                {jobPosts.map((job, index) => (
                    <div key={job?._id}>
                        <input
                            type="checkbox"
                            checked={applied.includes(index)}
                            onChange={() => handleCheckboxChange(index)}
                        />
                        <label>
                            Job {index + 1}
                            {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "🏅"}
                        </label>
                    </div>
                ))}

                <div>(Optional) Please rank the recommendations from most liked to least liked (1 being the most liked).</div>
                {jobPosts.map((job, index) => (
                    <div key={job?._id}>
                        <label htmlFor={`rank-${index}`}>
                            Job {index + 1}
                            {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "🏅"}:
                        </label>
                        <select 
                            id={`rank-${index}`} 
                            className='feedback'
                            value={rankings[index] || ''}
                            style={{width: "150px"}}
                            onChange={(e) => handleRankingChange(index, e.target.value)}
                        >
                            <option value="">Select Rank</option>
                            {Array.from({ length: jobPosts.length }, (_, i) => (
                                <option key={i + 1} value={i + 1}>
                                    {i + 1}
                                </option>
                            ))}
                        </select>
                    </div>
                ))}

                <button 
                    type="submit" 
                    className="submit-button"  
                    style={{height: "40px"}}
                    disabled={isLoading}
                >
                    {isLoading ? 'Sending...' : 'Send Feedback'}
                </button>
            </form>

            {error && <div style={{color: 'red'}}>{error}</div>}
            {message && <div className="success">{message}</div>}
        </div>
    );
};

export default Feedback;