import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import DailyQuiz from "./pages/DailyQuiz";
import CreateQuiz from "./pages/CreateQuiz";
import BrowseQuizzes from "./pages/BrowseQuizzes"; // Naya component import karein
import PlayCustomQuiz from "./pages/PlayCustomQuiz";
import Result from "./pages/Result";
import Profile from "./pages/Profile";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App(){
  return (
    <div className="min-h-screen text-white">
      <Navbar />
      <main className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/daily" element={<ProtectedRoute><DailyQuiz/></ProtectedRoute>} />
          <Route path="/create" element={<ProtectedRoute><CreateQuiz/></ProtectedRoute>} />
          <Route path="/browse" element={<BrowseQuizzes/>} /> {/* Naya route add karein */}
          <Route path="/play-custom/:id" element={<PlayCustomQuiz/>} /> {/* Route fix karein */}
          <Route path="/play/:id" element={<PlayCustomQuiz/>} /> {/* Backup route */}
          <Route path="/result/:attemptId" element={<Result/>} />
          <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
        </Routes>
      </main>
    </div>
  );
}