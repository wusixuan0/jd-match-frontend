import React, { useState } from 'react';
import axios from 'axios';

const EmailSubscription = ({ transactionId, handleSubscribeStatus }) => {
    const [frequency, setFrequency] = useState('Daily');
    const [email, setEmail] = useState('');
    const [isSubscribing, setIsSubscribing] = useState(false);
    const [error, setError] = useState('');
    const [subscriptionMessage, setSubscriptionMessage] = useState('');

    const handleFrequencyChange = (event) => {
        setFrequency(event.target.value);
    };
  
    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handleEmailSubmit = async (event) => {
        event.preventDefault();
        setIsSubscribing(true);
        setError('');
        setSubscriptionMessage('');

        const EMAIL_SUBSCRIBE_URL = process.env.REACT_APP_EMAIL_SUBSCRIBE_URL || 'http://127.0.0.1:8000/api/subscribe/';

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
            handleSubscribeStatus(response?.data?.email_id);
            setSubscriptionMessage('Successfully subscribed!');
        } catch (error) {
            setError(error?.response?.data?.error || 'An error occurred while subscribing');
        } finally {
            setIsSubscribing(false);
        }
    };

    return (
        <div>
            <h3>Email Subscription</h3>
            <p>Love these job recommendations? We can send you the latest, most relevant opportunities straight to your inbox.</p>
            <p>By providing your email, we'll also save a copy of your resume and send you personalized job matches at your preferred frequency. If you prefer not to subscribe or have us save your resume, you can still access recommendations. We won't store any of your data. Simply copy and paste the application links!</p>
            <form onSubmit={handleEmailSubmit} className='email-form'>
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
                        required
                    />
                </div>

                <button type="submit" className="submit-button" style={{height: "37px"}} disabled={isSubscribing}>
                    {isSubscribing ? 'Subscribing...' : 'Subscribe'}
                </button>
            </form>
            {error && <div className="error">{error}</div>}
            {subscriptionMessage && <div className="success">{subscriptionMessage}</div>}
        </div>
    );
};

export default EmailSubscription;