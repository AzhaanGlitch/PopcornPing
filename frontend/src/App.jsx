import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Hero from './components/Hero';
import Dashboard from './components/Dashboard';
import VideoRoom from './components/VideoRoom';
import ProtectedRoute from './components/ProtectedRoute';
import Snippets from './components/Snippets';
import Footer from './components/Footer';
import Login from './components/Login';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <>
                  <Hero />
                  <Snippets />
                  <Footer />
                </>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/room/:roomId"
              element={
                <ProtectedRoute>
                  <VideoRoom />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;