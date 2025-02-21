import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './Components/Register';
import Login from './Components/Login';
import Status from './Pages/Status';
import Donate from './Components/Donate';
import Home from './Pages/Home';
import Footer from './Components/Footer';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/*' element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/status" element={<Status />} />
        <Route path="/donate" element={<Donate />} />
      </Routes>
      <Footer/>
    </Router>
  );
};

export default App;
