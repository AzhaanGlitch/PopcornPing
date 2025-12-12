import React from 'react';
import { useNavigate } from 'react-router-dom';
// Ensure this path matches your file structure
import { useAuth } from '../context/AuthContext'; 

// This is the dummy image that will show for EVERY user
const DUMMY_PROFILE_IMG = "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix";

const Navbar = () => {
  const navigate = useNavigate();
  // Get data directly from your custom AuthProvider
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <header className="relative z-20 flex items-center justify-between px-12 py-8 w-full">
      {/* Left: Logo Section */}
      <div 
        className="flex items-center cursor-pointer" 
        onClick={() => navigate('/')}
      >
        <img 
          src="/logo.png" 
          alt="PopcornPing Logo" 
          className="h-10 w-10"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.parentNode.innerHTML = '<div class="h-10 w-10 flex items-center justify-center text-white text-xl font-bold border border-white rounded-full">P</div>';
          }}
        />
        {/* Logo Text: Pure White */}
        <span className="ml-4 text-white font-bold tracking-[0.2em] text-sm uppercase">
          PopcornPing
        </span>
      </div>
      
      {/* Right: User Dashboard Details */}
      {user ? (
        <div className="flex items-center gap-6">
          
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              {/* Name from AuthContext */}
              <span className="text-white text-sm font-semibold tracking-wider">
                {user.name || user.username || 'User'}
              </span>
              {/* Email from AuthContext */}
              <span className="text-[10px] text-gray-300 uppercase tracking-widest">
                {user.email}
              </span>
            </div>

            {/* Fixed Dummy Avatar for Everyone */}
            <div className="h-10 w-10 rounded-full border border-white/30 bg-white/10 flex items-center justify-center overflow-hidden">
              <img 
                src={DUMMY_PROFILE_IMG} 
                alt="Profile" 
                className="h-full w-full object-cover" 
              />
            </div>
          </div>

          <div className="h-6 w-px bg-white/20"></div>

          <button 
            onClick={handleLogout}
            className="text-xs text-white hover:text-gray-300 transition-colors uppercase tracking-widest"
          >
            Sign Out
          </button>
        </div>
      ) : (
        /* Fallback: Login Button if context is empty */
        <button 
          onClick={() => navigate('/login')}
          className="text-gray-400 hover:text-white transition text-sm tracking-wider"
        >
          Login
        </button>
      )}
    </header>
  );
};

export default Navbar;