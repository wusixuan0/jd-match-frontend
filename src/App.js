import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import UploadPDF from './components/UploadPDF.js';

function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes>
        <Route index element={<UploadPDF />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
export default App;
