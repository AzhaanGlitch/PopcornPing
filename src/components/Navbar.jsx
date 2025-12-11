import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginModal from './LoginModal';
import SignupModal from './SignupModal';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      <nav className="fixed w-full top-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              {/* Add your logo image here */}
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">PP</span>
              </div>
              <span className="text-white text-xl font-semibold">PopcornPing</span>
            </Link>

            <div className="flex items-center space-x-6">
              {user ? (
                <>
                  <Link to="/dashboard" className="text-gray-300 hover:text-white transition">
                    Dashboard
                  </Link>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.username} className="w-8 h-8 rounded-full" />
                      ) : (
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-semibold">
                            {user.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <span className="text-white text-sm">{user.username}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setShowLogin(true)}
                    className="text-gray-300 hover:text-white transition"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setShowSignup(true)}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition"
                  >
                    Start Free Trial
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} onSignup={() => { setShowLogin(false); setShowSignup(true); }} />}
      {showSignup && <SignupModal onClose={() => setShowSignup(false)} onLogin={() => { setShowSignup(false); setShowLogin(true); }} />}
    </>
  );
};

export default Navbar;