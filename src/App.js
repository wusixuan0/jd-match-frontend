import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import JobSeeker from './components/JobSeeker.js';
import Recruiter from './components/Recruiter.js';

function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<JobSeeker />} />
          <Route path="/recruitment" element={<Recruiter />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
export default App;
