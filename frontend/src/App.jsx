import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import Dashboard from "./pages/Dashboard";
import PostJob from "./pages/PostJob";
import MyApplications from "./pages/MyApplications";
import Profile from "./pages/Profile";

const App = () => {
  return (
    <>
      <Navbar />

      <Routes>

        {/* ================= PUBLIC ROUTES ================= */}

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/jobs" element={<Jobs />} />

        <Route
          path="/jobs/:id"
          element={<JobDetails />}
        />

        {/* ================= RECRUITER ROUTE ================= */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["recruiter"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/post-job"
          element={
            <ProtectedRoute allowedRoles={["recruiter"]}>
              <PostJob />
            </ProtectedRoute>
          }
        />

        {/* ================= CANDIDATE ROUTE ================= */}

        <Route
          path="/my-applications"
          element={
            <ProtectedRoute allowedRoles={["candidate"]}>
              <MyApplications />
            </ProtectedRoute>
          }
        />

        {/* ================= BOTH CANDIDATE + RECRUITER ================= */}

        <Route
          path="/profile"
          element={
            <ProtectedRoute
              allowedRoles={["candidate", "recruiter"]}
            >
              <Profile />
            </ProtectedRoute>
          }
        />

      </Routes>
    </>
  );
};

export default App;