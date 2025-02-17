import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminPortal from "./pages/AdminPortal";
import UserPortal from "./pages/UserPortal";
import SeminarPortal from "./pages/SeminarPortal";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<AdminPortal />} />
        <Route path="/user" element={<UserPortal />} />
        <Route path="/seminar-portal" element={<SeminarPortal />} />
      </Routes>
    </Router>
  );
};

export default App;
