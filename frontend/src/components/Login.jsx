import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// --- Icons (Lucide React) ---
const ChevronLeftIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m15 18-6-6 6-6"/></svg>
);
const AtSignIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"/></svg>
);
const GoogleIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M12.479,14.265v-3.279h11.049c0.108,0.571,0.164,1.247,0.164,1.979c0,2.46-0.672,5.502-2.84,7.669 C18.744,22.829,16.051,24,12.483,24C5.869,24,0.308,18.613,0.308,12S5.869,0,12.483,0c3.659,0,6.265,1.436,8.223,3.307L18.392,5.62 c-1.404-1.317-3.307-2.341-5.913-2.341C7.65,3.279,3.873,7.171,3.873,12s3.777,8.721,8.606,8.721c3.132,0,4.916-1.258,6.059-2.401 c0.927-0.927,1.537-2.251,1.777-4.059L12.479,14.265z" /></svg>
);

// --- Background Animation Component ---
function FloatingPaths({ position }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    color: `rgba(255, 255, 255, ${0.1 + i * 0.03})`,
    width: 0.5 + i * 0.03,
  }));

  return (
    <div className="pointer-events-none absolute inset-0">
      <svg
        className="h-full w-full text-white"
        viewBox="0 0 696 316"
        fill="none"
      >
        <title>Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.1 + path.id * 0.03}
            initial={{ pathLength: 0.3, opacity: 0.6 }}
            animate={{
              pathLength: 1,
              opacity: [0.3, 0.6, 0.3],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'linear',
            }}
          />
        ))}
      </svg>
    </div>
  );
}

// --- Main Login Page Component ---
export default function Login() {
  const navigate = useNavigate();
  const { login, googleLogin } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle Email/Password Login
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Login
  const handleGoogleLogin = async () => {
    try {
      await googleLogin();
      navigate('/dashboard');
    } catch (err) {
      setError('Google login failed.');
    }
  };

  return (
    <main className="relative md:h-screen md:overflow-hidden lg:grid lg:grid-cols-2 bg-black text-white">
      
      {/* --- Left Column: Art & Testimonials --- */}
      <div className="relative hidden h-full flex-col border-r border-gray-800 p-10 lg:flex overflow-hidden">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Logo */}
        <div className="z-10 flex items-center gap-2">
          {/* Using your logo image logic here if available, else fallback to icon */}
          <img 
            src="/logo.png" 
            alt="PopcornPing" 
            className="h-8 w-8 object-contain"
            onError={(e) => { e.target.style.display = 'none'; }} 
          />
          <span className="text-xl font-bold tracking-wide">PopcornPing</span>
        </div>

        {/* Testimonial */}
        <div className="z-10 mt-auto max-w-lg">
          <blockquote className="space-y-4">
            <p className="text-xl font-medium leading-relaxed text-gray-200">
              &ldquo;This platform has revolutionized how we conduct creative reviews. The screen sharing quality is unmatched.&rdquo;
            </p>
          </blockquote>
        </div>

        {/* Animated Background Paths */}
        <div className="absolute inset-0 z-0">
          <FloatingPaths position={1} />
          <FloatingPaths position={-1} />
        </div>
      </div>

      {/* --- Right Column: Auth Form --- */}
      <div className="relative flex min-h-screen flex-col justify-center p-8 md:p-12 lg:p-16">
        
        {/* Background Glow Effects (Right Side) */}
        <div aria-hidden="true" className="absolute inset-0 isolate -z-10 overflow-hidden">
          <div className="absolute top-0 right-0 h-[500px] w-[500px] bg-purple-900/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 h-[400px] w-[400px] bg-blue-900/10 blur-[100px] rounded-full translate-x-1/3 translate-y-1/3" />
        </div>

        {/* Back to Home Button */}
        <button 
          onClick={() => navigate('/')}
          className="absolute top-8 left-8 md:left-12 inline-flex items-center text-sm font-medium text-gray-400 hover:text-white transition-colors"
        >
          <ChevronLeftIcon className="w-4 h-4 mr-2" />
          Home
        </button>

        {/* Form Container */}
        <div className="mx-auto w-full max-w-sm space-y-8">
          
          {/* Mobile Logo (Visible only on small screens) */}
          <div className="flex items-center gap-2 lg:hidden mb-8">
             <span className="text-xl font-bold">PopcornPing</span>
          </div>

          {/* Headers */}
          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Sign In or Join Now!
            </h1>
            <p className="text-gray-400 text-sm">
              Login or create your PopcornPing account.
            </p>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3">
            <button 
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-2 bg-white text-black hover:bg-gray-200 h-12 rounded-md font-medium transition-colors"
            >
              <GoogleIcon className="w-5 h-5" />
              Continue with Google
            </button>
          </div>

          {/* Separator */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-black px-2 text-gray-500">Or</span>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-md">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-400 ml-1">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full h-11 bg-gray-900 border border-gray-800 rounded-md pl-10 pr-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/20 transition-all placeholder:text-gray-600"
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                    <AtSignIcon className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-400 ml-1">Password</label>
                <div className="relative">
                   <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full h-11 bg-gray-900 border border-gray-800 rounded-md pl-4 pr-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/20 transition-all placeholder:text-gray-600"
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-white text-black font-semibold rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? 'Processing...' : 'Continue With Email'}
            </button>
          </form>

        </div>
      </div>
    </main>
  );
}