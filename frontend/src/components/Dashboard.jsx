import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { roomAPI } from '../utils/api';
import Navbar from './Navbar'; 

// --- Icons ---
const CopyIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
);
const LinkIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
);
const LockIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
);
const MicIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
);
const TrashIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
);
const ClockIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);
const VideoIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>
);
const TrendingUpIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
);

// --- Components ---
const Toggle = ({ enabled, onChange }) => (
  <button
    onClick={() => onChange(!enabled)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
      enabled ? 'bg-white' : 'bg-gray-800'
    }`}
  >
    <span
      className={`${
        enabled ? 'translate-x-6 bg-black' : 'translate-x-1 bg-gray-500'
      } inline-block h-4 w-4 transform rounded-full transition-transform`}
    />
  </button>
);

const Dashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState(''); 
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [waitingRoom, setWaitingRoom] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRooms();
    generateNewCode();
  }, []);

  const generateNewCode = () => {
    const code = `J-${Math.floor(100 + Math.random() * 900)}K-${Math.floor(10 + Math.random() * 90)}D`;
    setGeneratedCode(code);
  };

  const fetchRooms = async () => {
    try {
      const response = await roomAPI.getUserRooms();
      setRooms(response.data.rooms);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const handleCreateRoom = async () => {
    setLoading(true);
    const roomName = `Room ${generatedCode}`; 
    try {
      const response = await roomAPI.createRoom({ 
        name: roomName,
        settings: {
          passwordProtected: isPasswordProtected,
          muteOnEntry: waitingRoom
        }
      });
      navigate(`/room/${response.data.room.roomId}`);
    } catch (error) {
      console.error('Error creating room:', error);
      alert('Failed to create room');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const handleDeleteRoom = async (e, roomId) => {
    e.stopPropagation(); 
    if(window.confirm("End this session?")) {
        try {
          await roomAPI.endRoom(roomId);
          fetchRooms();
          alert("Room ended successfully");
        } catch (error) {
          console.error("Error ending room:", error);
        }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-gray-700">
      
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* --- LEFT COLUMN --- */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Active Rooms & Create Button */}
            <div className="bg-[#111] border border-[#222] rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-8">
              
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-gray-400 text-sm uppercase tracking-wider font-bold">Active Rooms</h2>
                    <button onClick={fetchRooms} className="text-xs text-gray-500 hover:text-white transition-colors">
                        Refresh
                    </button>
                </div>

                <div className="flex-1 space-y-3 pr-2 overflow-y-auto max-h-[200px] custom-scrollbar">
                    {rooms.length > 0 ? (
                    rooms.map((room) => (
                        <div key={room._id} className="group flex items-center justify-between p-3 bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] hover:border-gray-500 transition-all cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#222] border border-[#333] flex items-center justify-center">
                                    <span className="text-gray-500 text-[10px] font-bold">RM</span>
                                </div>
                                <div className="max-w-[120px] sm:max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
                                    <h3 className="font-medium text-gray-200 text-sm truncate">{room.name}</h3>
                                </div>
                            </div>
                            <button 
                                onClick={(e) => handleDeleteRoom(e, room.roomId)}
                                className="text-gray-600 hover:text-red-400 transition-colors p-1"
                            >
                                <TrashIcon className="w-4 h-4" />
                            </button>
                        </div>
                    ))
                    ) : (
                    <div className="flex flex-col items-center justify-center h-full min-h-[120px] text-gray-600 border border-dashed border-[#222] rounded-xl bg-[#151515]">
                        <p className="text-sm">No active rooms</p>
                    </div>
                    )}
                </div>
              </div>

              <div className="w-full md:w-64 flex-shrink-0">
                  <button 
                    onClick={handleCreateRoom}
                    disabled={loading}
                    className="w-full h-full min-h-[160px] rounded-2xl bg-gradient-to-b from-[#2a2a2a] to-black border border-gray-700 shadow-lg flex flex-col items-center justify-center gap-3 group hover:border-white/40 transition-all"
                  >
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black group-hover:scale-110 transition-transform">
                            {loading ? (
                                <div className="animate-spin w-5 h-5 border-2 border-black border-t-transparent rounded-full"></div>
                            ) : (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                            )}
                        </div>
                        <div className="text-center">
                            <span className="block text-white font-bold text-lg">Create Room</span>
                            <span className="text-gray-500 text-xs">Private Session</span>
                        </div>
                  </button>
              </div>
            </div>

            {/* Share Your Code */}
            <div className="bg-[#111] border border-[#222] rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-3 text-center md:text-left w-full">
                 <h2 className="text-lg text-gray-300 font-medium">Share Your Code</h2>
                 <div>
                    <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-600 tracking-tight block">
                       {generatedCode}
                    </span>
                 </div>
                 
                 <div className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">
                    <button 
                      onClick={() => copyToClipboard(generatedCode)}
                      className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] rounded-lg text-xs text-gray-400 hover:text-white border border-[#333] transition-colors"
                    >
                       <CopyIcon className="w-3 h-3" /> Copy Code
                    </button>
                    <button 
                       onClick={() => copyToClipboard(`${window.location.origin}/room/${generatedCode}`)}
                       className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] rounded-lg text-xs text-gray-400 hover:text-white border border-[#333] transition-colors"
                    >
                       <LinkIcon className="w-3 h-3" /> Copy Link
                    </button>
                 </div>
              </div>
              
              <div className="w-full md:w-auto flex-shrink-0">
                 <button 
                    onClick={handleCreateRoom}
                    className="w-full md:w-48 py-4 bg-white hover:bg-gray-200 text-black font-bold text-lg rounded-xl shadow-lg transition-all"
                 >
                    Start Meeting
                 </button>
              </div>
            </div>

          </div>

          {/* --- RIGHT COLUMN --- */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Room Configuration */}
            <div className="bg-[#111] border border-[#222] rounded-3xl p-8 flex flex-col justify-center min-h-[240px]">
               <h2 className="text-gray-400 text-sm mb-6 font-bold uppercase tracking-wider">Room Configuration</h2>
               
               <div className="space-y-6">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <LockIcon className="w-5 h-5 text-gray-500" />
                        <div className="flex flex-col">
                            <span className="text-white text-sm font-medium">Require Password</span>
                        </div>
                     </div>
                     <Toggle enabled={isPasswordProtected} onChange={setIsPasswordProtected} />
                  </div>
                  
                  <div className="h-px bg-[#222] w-full"></div>

                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <MicIcon className="w-5 h-5 text-gray-500" />
                        <div className="flex flex-col">
                            <span className="text-white text-sm font-medium">Waiting Room</span>
                        </div>
                     </div>
                     <Toggle enabled={waitingRoom} onChange={setWaitingRoom} />
                  </div>
               </div>
            </div>

            {/* Meeting Analytics */}
            <div className="bg-[#111] border border-[#222] rounded-3xl p-8">
               <h2 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Statistics</h2>
               <p className="text-[11px] text-gray-600 mb-6">Your meeting activity</p>

               <div className="space-y-4">
                 <div className="flex items-center justify-between">
                   <span className="text-sm text-gray-400">Active Rooms</span>
                   <span className="text-2xl font-bold text-white">{rooms.length}</span>
                 </div>
                 
                 <div className="flex items-center justify-between">
                   <span className="text-sm text-gray-400">Total Created</span>
                   <span className="text-2xl font-bold text-white">{rooms.length}</span>
                 </div>

                 {rooms.length > 0 && (
                   <div className="mt-4 pt-4 border-t border-[#222]">
                     <div className="flex items-center justify-between text-xs">
                       <span className="text-gray-500">Status</span>
                       <span className="flex items-center gap-1 text-green-400">
                         <TrendingUpIcon className="w-3 h-3" />
                         Active
                       </span>
                     </div>
                   </div>
                 )}
               </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;