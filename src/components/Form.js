import React, { useState } from 'react';
import axios from "axios";
import inputFields from '../utils/job_description_questions.json';
import prompt from '../utils/prompt.json';
import Markdown from 'react-markdown'

const Form = () => {
    const [formData, setFormData] = useState({});
    const [responseText, setResponseText] = useState('');
    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        let promptText = prompt['prompt'];

        if (Object.keys(formData).length === 0) {
            inputFields.forEach((question) => {
                promptText += `\n${question['title']}: ${question['sample_response']}`;
            });
        }
        promptText += prompt['add_prompt']
        const apiUrl = 'http://localhost:3001/api/';
        const testDisplayUrl = 'http://localhost:3001/api/';

        try {
            // const response = await axios.post(apiUrl, { prompt: promptText});
            const response = await axios.get(testDisplayUrl);
            setResponseText(response.data.responseText);
        } catch (error) {
            console.error(error);
        }
        
    }        
    return (
        <div className="app">
            <h1>Job Description Builder</h1>
            <p>Generate a job description with <a href="https://gemini.google.com">Google Gemini</a> in few seconds.</p>
            <form onSubmit={handleSubmit}>
            {inputFields.map((item) => (
                
                <div key={item.id}>
                <h2>{item.title}</h2>
                <p>Description: {item.description}</p>
                <p>Enhancing Response Tips: {item.additional_info}</p>
                <p>Purpose: {item.purpose}</p>
              
                    <textarea
                        type="text"
                        name={`${item.id}-input`}
                        value={formData[`${item.id}-input`] || ''}
                        onChange={handleInputChange}
                        placeholder={`Sample Response: ${item.sample_response}`}
                    />
                
                </div>
                
            ))}
            <button type="submit">Create Job Description</button>
            </form>
            <Markdown className="jd">{responseText}</Markdown>
        </div>
    );
};

export default Form;