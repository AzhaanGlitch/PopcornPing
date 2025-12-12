import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Hero = () => {
  const navigate = useNavigate();

  // --- Animation Variants ---

  // 1. Cinematic Background Entry (Zoom out + Unblur)
  const bgVariants = {
    hidden: { scale: 1.2, opacity: 0, filter: 'blur(10px)' },
    visible: {
      scale: 1,
      opacity: 1,
      filter: 'blur(0px)',
      transition: { duration: 2, ease: 'easeOut' },
    },
  };

  // 2. Title Letter Stagger (3D Flip Effect)
  const titleContainerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.5 },
    },
  };

  const letterVariants = {
    hidden: { y: 50, opacity: 0, rotateX: -90 },
    visible: {
      y: 0,
      opacity: 1,
      rotateX: 0,
      transition: { type: 'spring', damping: 12, stiffness: 100 },
    },
  };

  // 3. Floating Content Fade Up
  const contentVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: 'easeOut', delay: 1.2 }, // Delays until title finishes
    },
  };

  // 4. Orb Pop-in Effect
  const orbVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (customDelay) => ({
      scale: 1,
      opacity: [0, 0.4, 0.2], // Flash slightly then settle
      transition: { 
        duration: 1.5, 
        ease: 'easeOut', 
        delay: customDelay,
        times: [0, 0.6, 1]
      },
    }),
  };

  const titleText = "POPCORNPING".split("");

  return (
    <>
      <div className="min-h-screen bg-black relative overflow-hidden font-sans">
        
        {/* --- 1. Background Image Layer --- */}
        <motion.div
          className="absolute inset-0 z-0"
          variants={bgVariants}
          initial="hidden"
          animate="visible"
        >
          <img
            src="/background.jpg"
            alt="Cinema Background"
            className="w-full h-full object-cover opacity-50"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90"></div>
        </motion.div>

        {/* --- 2. Animated Glowing Orbs --- */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {/* Central Orb */}
          <motion.div 
            custom={0.5}
            variants={orbVariants}
            initial="hidden"
            animate="visible"
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse-slow"
          />
          {/* Floating Orbs */}
          <motion.div custom={0.8} variants={orbVariants} initial="hidden" animate="visible" className="absolute top-20 left-20 w-48 h-48 bg-blue-500/20 rounded-full blur-[80px] animate-float-slow" />
          <motion.div custom={1.0} variants={orbVariants} initial="hidden" animate="visible" className="absolute bottom-32 right-20 w-64 h-64 bg-pink-500/10 rounded-full blur-[100px] animate-float-slower" />
        </div>

        {/* --- CSS for Continuous Float Animations --- */}
        <style jsx>{`
          @keyframes float-slow {
            0%, 100% { transform: translate(0, 0); }
            50% { transform: translate(20px, -20px); }
          }
          @keyframes float-slower {
            0%, 100% { transform: translate(0, 0); }
            50% { transform: translate(-15px, 25px); }
          }
          .animate-float-slow { animation: float-slow 10s ease-in-out infinite; }
          .animate-float-slower { animation: float-slower 15s ease-in-out infinite; }
        `}</style>

        {/* --- 3. Header Navigation (Slide Down) --- */}
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'circOut' }}
          className="relative z-20 flex items-center justify-between px-6 md:px-12 py-8"
        >
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <img 
              src="/logo.png" 
              alt="Logo" 
              className="h-10 w-10 object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
              onError={(e) => {
                e.target.style.display = 'none'; 
                e.target.parentNode.innerHTML = '<span class="text-2xl">🍿</span>';
              }}
            />
          </div>
          
          <nav className="flex items-center space-x-8 md:space-x-12">
            <a href="#overview" className="text-gray-400 hover:text-white transition-colors text-sm font-medium tracking-widest uppercase hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
              Overview
            </a>
            <a href="#snippets" className="text-gray-400 hover:text-white transition-colors text-sm font-medium tracking-widest uppercase hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
              Snippets
            </a>
            <button 
              onClick={() => navigate('/login')}
              className="px-6 py-2 border border-white/20 text-white rounded-full hover:bg-white hover:text-black transition-all duration-300 text-sm tracking-wider uppercase backdrop-blur-sm"
            >
              Login
            </button>
          </nav>
        </motion.header>

        {/* --- 4. Main Hero Content --- */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-150px)] text-center px-4">
          
          {/* 3D Staggered Title */}
          <motion.div
            className="flex flex-wrap justify-center overflow-hidden mb-6"
            variants={titleContainerVariants}
            initial="hidden"
            animate="visible"
          >
            {titleText.map((char, index) => (
              <motion.span
                key={index}
                variants={letterVariants}
                className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 inline-block"
                style={{ 
                  textShadow: '0 10px 30px rgba(255, 255, 255, 0.1)',
                  marginRight: char === ' ' ? '1rem' : '2px' // Handle spaces if any
                }}
              >
                {char}
              </motion.span>
            ))}
          </motion.div>

          {/* Subtitle & CTA */}
          <motion.div
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center"
          >
            <p className="text-gray-300 text-lg md:text-xl font-light tracking-wide max-w-2xl mb-12 leading-relaxed drop-shadow-lg">
              Never miss a note, idea, or connection. <br className="hidden md:block" />
              <span className="text-white font-medium">Video calling with screen sharing made simple.</span>
            </p>

            {/* Magnetic/Glow Button */}
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(124, 58, 237, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
              className="group relative px-12 py-5 bg-white text-black rounded-full font-bold tracking-[0.2em] uppercase overflow-hidden shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all"
            >
              <span className="relative z-10">Start Your Scene</span>
              {/* Button Fill Animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            </motion.button>
          </motion.div>

        </div>

        {/* Scroll Indicator (Optional Polish) */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <div className="w-[1px] h-12 bg-gradient-to-b from-gray-500 to-transparent"></div>
        </motion.div>

      </div>
    </>
  );
};

export default Hero;