import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import JobSeeker from './components/JobSeeker.js';
import Employer from './components/Employer.js';

function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<JobSeeker />} />
          <Route path="/employer" element={<Employer />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
export default App;
