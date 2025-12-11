import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-6 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* --- Top Section: Logo & Social Icons --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          
          {/* Logo & Company Name */}
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            {/* Logo Image from Public Directory */}
            <img 
              src="/logo.png" 
              alt="PopcornPing Logo" 
              className="w-8 h-8 object-contain"
            />
            <span className="text-xl font-bold tracking-wide">PopcornPing</span>
          </div>

          {/* Founder & Co-Founder Links */}
          <div className="flex flex-col sm:flex-row gap-8 text-right">
            
            {/* Founder Block */}
            <div className="flex flex-col items-start md:items-end">
              <span className="text-gray-500 font-semibold text-xs uppercase tracking-wider mb-2">Founder</span>
              <div className="flex gap-3">
                {/* GitHub Icon */}
                <a href="https://github.com/founder-id" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="Founder Github">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                  </svg>
                </a>
                {/* LinkedIn Icon */}
                <a href="https://linkedin.com/in/founder-id" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="Founder LinkedIn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </a>
              </div>
            </div>

            {/* Co-Founder Block */}
            <div className="flex flex-col items-start md:items-end">
              <span className="text-gray-500 font-semibold text-xs uppercase tracking-wider mb-2">Co-Founder</span>
              <div className="flex gap-3">
                 {/* GitHub Icon */}
                 <a href="https://github.com/cofounder-id" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="Co-Founder Github">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                  </svg>
                </a>
                {/* LinkedIn Icon */}
                <a href="https://linkedin.com/in/cofounder-id" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="Co-Founder LinkedIn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* --- Bottom Section: Single Line Left Aligned --- */}
        <div className="text-sm text-gray-500">
          <span>© 2025 PopcornPing. All rights reserved.</span>
        </div>

      </div>
    </footer>
  );
};

export default Footer;