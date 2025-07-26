import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import HomePage from "./HomePage";
import LoginPage from "./LoginPage";
import KursPage from "./KursPage";
import RegisterPage from "./RegisterPage";
import Breadcrumbs from "./Breadcrumbs";
import KurseviPage from "./KurseviPage";


function App() {
  return (
    <Router>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/register">Register</Link></li>
        </ul>
      </nav>
      <Breadcrumbs/>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/kursevi/:id" element={<KursPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/kursevi" element={<KurseviPage />} />

      </Routes>
    </Router>
  );
}

export default App;
