import React from 'react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="min-h-screen bg-black relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="/background.jpg" 
            alt="Background" 
            className="w-full h-full object-cover opacity-60"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>
        </div>

        {/* Animated glowing orbs */}
        <div className="absolute inset-0">
          {/* Large central glow */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-purple-600/20 rounded-full blur-[130px] animate-pulse-slow"></div>
          
          {/* Floating glowing orbs */}
          <div className="absolute top-20 left-20 w-48 h-48 bg-blue-500/30 rounded-full blur-[80px] animate-float-slow"></div>
          <div className="absolute top-40 right-32 w-40 h-40 bg-purple-500/25 rounded-full blur-[80px] animate-float-slower"></div>
          <div className="absolute bottom-32 left-40 w-56 h-56 bg-pink-500/20 rounded-full blur-[90px] animate-float-slowest"></div>
          <div className="absolute bottom-20 right-20 w-44 h-44 bg-cyan-500/25 rounded-full blur-[80px] animate-float-slow"></div>
          <div className="absolute top-1/3 left-1/4 w-36 h-36 bg-indigo-500/30 rounded-full blur-[70px] animate-float-slower"></div>
          <div className="absolute top-2/3 right-1/3 w-52 h-52 bg-violet-500/20 rounded-full blur-[85px] animate-float-slowest"></div>
        </div>

        {/* Animation Styles */}
        <style jsx>{`
          @keyframes float-slow {
            0%, 100% { transform: translate(0, 0); }
            50% { transform: translate(30px, -30px); }
          }
          @keyframes float-slower {
            0%, 100% { transform: translate(0, 0); }
            50% { transform: translate(-25px, 35px); }
          }
          @keyframes float-slowest {
            0%, 100% { transform: translate(0, 0); }
            50% { transform: translate(20px, 40px); }
          }
          @keyframes pulse-slow {
            0%, 100% { opacity: 0.2; transform: translate(-50%, -50%) scale(1); }
            50% { opacity: 0.3; transform: translate(-50%, -50%) scale(1.1); }
          }
          .animate-float-slow { animation: float-slow 15s ease-in-out infinite; }
          .animate-float-slower { animation: float-slower 20s ease-in-out infinite; }
          .animate-float-slowest { animation: float-slowest 25s ease-in-out infinite; }
          .animate-pulse-slow { animation: pulse-slow 8s ease-in-out infinite; }
        `}</style>

        {/* Header Navigation */}
        <header className="relative z-20 flex items-center justify-between px-12 py-8">
          <div className="flex items-center">
            <img 
              src="/logo.png" 
              alt="PopcornPing Logo" 
              className="h-10 w-10"
              onError={(e) => {
                e.target.outerHTML = '<div class="h-10 w-10 flex items-center justify-center text-white text-xl font-bold">P</div>';
              }}
            />
          </div>
          
          <nav className="flex items-center space-x-12">
            <a href="#overview" className="text-gray-400 hover:text-white transition text-sm tracking-wider">
              Overview
            </a>
            <a href="#snippets" className="text-gray-400 hover:text-white transition text-sm tracking-wider">
              Snippets
            </a>
            <button 
              onClick={() => navigate('/login')}
              className="text-gray-400 hover:text-white transition text-sm tracking-wider"
            >
              Login
            </button>
          </nav>
        </header>

        {/* Main Content */}
        <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-100px)]">
          {/* Center Content */}
          <div className="text-center max-w-4xl px-4">
            <h1 className="text-6xl md:text-7xl font-bold tracking-wider text-white mb-8 whitespace-nowrap" style={{ letterSpacing: '0.5em', fontWeight: 700 }}>
              POPCORNPING
            </h1>
            
            <p className="text-gray-300 text-base md:text-lg tracking-wide mb-16 font-light leading-relaxed max-w-2xl mx-auto" style={{ letterSpacing: '0.05em' }}>
              Never miss a note, idea or connection. Video call with screen sharing made simple.
            </p>

            <button 
              onClick={() => navigate('/login')}
              className="px-12 py-4 border border-white text-white rounded-full hover:bg-white hover:text-black transition text-xs font-normal tracking-wider uppercase"
              style={{ letterSpacing: '0.2em' }}
            >
              Start Your Scene
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;