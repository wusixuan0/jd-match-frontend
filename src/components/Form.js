import React, { useState } from 'react';
import axios from "axios";
import inputFields from '../utils/job_description_questions.json';
import prompt from '../utils/prompt.json';
import Markdown from 'react-markdown'

const Form = () => {
    const [formData, setFormData] = useState({});
    const [responseText, setResponseText] = useState('');
    const [warning, setWarning] = useState('');

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setWarning('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        let promptText = prompt['prompt'];
        const apiUrl = 'http://localhost:3001/api/';
        
        if (Object.keys(formData).length == 0) {
        
            inputFields.forEach((question) => {
                promptText += `\n${question['title']}: ${question['sample_response']}`;
            });

            promptText += prompt['add_prompt']

            try {
                const response = await axios.get(apiUrl);
                setResponseText(response.data.responseText);
            } catch (error) {
                console.error(error);
            }
        } else if (Object.keys(formData).length < inputFields.length) {
            setWarning('Please fill out all fields.');
        } else {
            inputFields.forEach((question) => {
                const userAnswer = formData[`${question.id}-input`] || '';
                promptText += `\n${question['title']}: ${userAnswer}`;
            });
            promptText += prompt['add_prompt']
            
            try {
                const response = await axios.post(apiUrl, { prompt: promptText});
                setResponseText(response.data.responseText);
            } catch (error) {
                console.error(error);
            }
        }
        
    }        
    return (
        <div className="app">
            <h1>Job Description Builder</h1>
            <p>Generate a job description with <a href="https://gemini.google.com">Google Gemini</a> in few seconds.</p>
            <div><a href="https://github.com/wusixuan0/recruit_stream/blob/main/README.md">description</a> <a href="https://github.com/wusixuan0/recruit_stream">front end</a> <a href="https://github.com/wusixuan0/recruit_express_server">back end</a></div>
            <ul>
                <li><strong>Handle No Input:</strong> If you haven't filled in any fields, it will submit the sample response displayed in the text box to generate a job description at the bottom.</li>
                <li><strong>Incomplete Fields:</strong> If you've filled out some but not all of the 11 required fields, it shows a message to fill all fields.</li>
                <li><strong>Complete Submission:</strong> Once all fields are filled, it will submit your responses to Google Gemini API to generate a job description.</li>
            </ul>
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
            {warning && <p className="warning">{warning}</p>}
            </form>
            
            {responseText && <Markdown className="jd">{responseText}</Markdown>}
        </div>
    );
};

export default Form;