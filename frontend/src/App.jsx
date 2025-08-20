import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import CreateEvent from "./pages/CreateEvent.jsx";
import EventDetail from "./pages/EventDetail.jsx";
import EditEvent from "./pages/EditEvent.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/create-event" element={<CreateEvent />} />
            <Route path="/event/:id" element={<EventDetail />} />
            <Route path="/edit-event/:id" element={<EditEvent />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
          <Toaster position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
