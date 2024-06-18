import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Form from './components/Form.js';

function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index element={<Form />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
export default App;
