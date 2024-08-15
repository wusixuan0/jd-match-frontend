import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UploadPDF = ({ onUploadSuccess, onLogUpdate }) => {
    const [pdfFile, setPdfFile] = useState(null);
    const [version, setVersion] = useState('version2');
    const [modelName, setModelName] = useState('gemini-1.5-flash');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const WS_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:8000/ws/logs/';
        const socket = new WebSocket(WS_URL);

        socket.onopen = () => {
            console.log('WebSocket is connected.');
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('Received log:', data.log);
            onLogUpdate(data.log);
        };

        socket.onclose = () => {
            console.log('WebSocket is closed.');
        };

        return () => {
            socket.close();
        };
    }, [onLogUpdate]);

    const handleFileChange = (event) => {
        setPdfFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!pdfFile) return;

        setIsLoading(true);
        setError('');

        const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api/match/';
        const formData = new FormData();
        formData.append('file', pdfFile);
        formData.append('version', version);
        formData.append('model_name', modelName);
        
        try {
            const response = await axios.post(API_BASE_URL, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            onUploadSuccess(response.data);
            console.log(response.data);
            setIsLoading(false);
        } catch (error) {
            setError(error?.response?.data?.error || 'An error occurred');
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className='pdf-form'>
            <select 
                value={version} 
                onChange={(e) => setVersion(e.target.value)}
                className="version-select"
            >
                <option value="version1">Version 1</option>
                <option value="version2">Version 2</option>
            </select>
            <select 
                value={modelName} 
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
            <button 
                type="submit"
                className="submit-button pdf-input"
                disabled={isLoading || !pdfFile}
            >
                {isLoading ? 'Uploading...' : 'Upload'}
            </button>
            {error && <div className="error">{error}</div>}
        </form>
    );
};

export default UploadPDF;