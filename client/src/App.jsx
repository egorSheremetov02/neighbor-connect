import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './Pages/Home';
import LoginForm from './Components/LoginForm/LoginForm';
import RegistrationForm from './Components/RegistrationForm/RegistrationForm';
import { AuthProvider } from "./auth/index"; 

const App = () => {
  return (
    <AuthProvider>
      <Router basename="/">
          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegistrationForm />} />
          </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
