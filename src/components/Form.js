import React, { useState } from "react";
import axios from "axios";
import inputFields from '../utils/job_description_questions.json';
import prompt from '../utils/prompt.json';

const Form = () => {
    const [formData, setFormData] = useState({});
    
    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    const handleSubmit = async (e) => {
        let promptText = prompt['prompt'];

        if (Object.keys(formData).length === 0) {
            inputFields.forEach((question) => {
                promptText += `\n${question['title']}: ${question['sample_response']}`;
            });
        }

        e.preventDefault();
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
        </div>
        // <div className='app'>
            
        //     <form onSubmit={handleSubmit}>
        //         <label htmlFor='title'>Enter your full name</label>
        //         <input
        //             type='text'
        //             // required
        //             name='title'
        //             // id='fullName'
        //             value={formData.title}
        //             onChange={handleInputChange}
        //             placeholder="Enter your name"
        //         />
                


        //         <button>Create Job Description</button>
        //     </form>
        // </div>
    );
};

export default Form;