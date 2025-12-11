import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Icons
const CloseIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
);
const GoogleIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12.479,14.265v-3.279h11.049c0.108,0.571,0.164,1.247,0.164,1.979c0,2.46-0.672,5.502-2.84,7.669 C18.744,22.829,16.051,24,12.483,24C5.869,24,0.308,18.613,0.308,12S5.869,0,12.483,0c3.659,0,6.265,1.436,8.223,3.307L18.392,5.62 c-1.404-1.317-3.307-2.341-5.913-2.341C7.65,3.279,3.873,7.171,3.873,12s3.777,8.721,8.606,8.721c3.132,0,4.916-1.258,6.059-2.401 c0.927-0.927,1.537-2.251,1.777-4.059L12.479,14.265z" />
  </svg>
);
const AtSignIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"/></svg>
);
const LockIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
);

const LoginModal = ({ onClose, onSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ email, password });
      onClose();
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    googleLogin();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      {/* Container echoing the AuthPage styling */}
      <div className="relative w-full max-w-md bg-black border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
        
        {/* Background Gradients from provided code */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
           <div className="absolute top-0 right-0 h-[300px] w-[300px] bg-purple-900/20 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3" />
           <div className="absolute bottom-0 left-0 h-[300px] w-[300px] bg-blue-900/10 blur-[100px] rounded-full -translate-x-1/3 translate-y-1/3" />
        </div>

        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition z-20">
          <CloseIcon className="w-5 h-5" />
        </button>

        <div className="relative z-10 p-8">
          
          {/* Header */}
          <div className="flex flex-col space-y-1 mb-6 text-center md:text-left">
            <h1 className="text-2xl font-bold tracking-wide text-white">Sign In</h1>
            <p className="text-gray-400 text-sm">
              Welcome back to PopcornPing.
            </p>
          </div>

          {/* Google Button */}
          <div className="space-y-2 mb-6">
            <button
              onClick={handleGoogleLogin}
              type="button"
              className="w-full flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 border border-gray-700 bg-gray-900 hover:bg-gray-800 hover:text-white text-gray-200 transition-colors"
            >
              <GoogleIcon className="w-4 h-4 mr-2" />
              Continue with Google
            </button>
          </div>

          {/* Separator */}
          <div className="flex w-full items-center justify-center mb-6">
            <div className="bg-gray-800 h-px w-full" />
            <span className="text-gray-500 px-2 text-xs uppercase">OR</span>
            <div className="bg-gray-800 h-px w-full" />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-md text-red-500 text-sm">
              {error}
            </div>
          )}

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
               <div className="relative">
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex h-10 w-full rounded-md border border-gray-700 bg-black px-3 py-2 pl-9 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                  />
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                    <AtSignIcon className="w-4 h-4" />
                  </div>
               </div>
            </div>

            <div className="space-y-2">
               <div className="relative">
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="flex h-10 w-full rounded-md border border-gray-700 bg-black px-3 py-2 pl-9 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                  />
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                    <LockIcon className="w-4 h-4" />
                  </div>
               </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <button
              onClick={onSignup}
              className="text-purple-400 hover:text-purple-300 font-medium underline underline-offset-4"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;