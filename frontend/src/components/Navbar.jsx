import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Collection of default avatars for random selection
const DEFAULT_AVATARS = [
  "https://api.dicebear.com/7.x/avataaars/svg?seed=PopcornPing",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Precious"
];

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const getAvatarUrl = () => {
    if (user && user.avatar && user.avatar.trim() !== '') {
      return user.avatar;
    }
    
    // Select a consistent "random" avatar based on the user's identity
    // This ensures the avatar stays the same for the user session instead of flickering on every render
    const uniqueSeed = user?.email || user?.username || 'default';
    let hash = 0;
    for (let i = 0; i < uniqueSeed.length; i++) {
      hash = uniqueSeed.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % DEFAULT_AVATARS.length;
    
    return DEFAULT_AVATARS[index];
  };

  // Get display name
  const getDisplayName = () => {
    if (!user) return 'User';
    return user.username || user.name || 'User';
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
                {getDisplayName()}
              </span>
              {/* Email from AuthContext */}
              <span className="text-[10px] text-gray-300 uppercase tracking-widest">
                {user.email}
              </span>
            </div>

            {/* Dynamic Avatar */}
            <div className="h-10 w-10 rounded-full border border-white/30 bg-white/10 flex items-center justify-center overflow-hidden">
              <img 
                src={getAvatarUrl()} 
                alt="Profile" 
                className="h-full w-full object-cover" 
                onError={(e) => {
                  // Fallback if image fails to load
                  console.error('Avatar failed to load, using default');
                  e.target.src = DEFAULT_AVATARS[0];
                }}
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