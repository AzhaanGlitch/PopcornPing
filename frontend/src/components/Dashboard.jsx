import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { roomAPI } from '../utils/api';

// --- Icons (Inline SVGs to ensure compatibility) ---
const VideoIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>
);
const PlusIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/><path d="M12 5v14"/></svg>
);
const SettingsIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
);
const CopyIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
);
const LockIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
);
const MicOffIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="1" x2="23" y1="1" y2="23"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12"/><path d="M15 9.34V4a3 3 0 0 0-5.94-.6"/><path d="M17 16.95A7 7 0 0 1 5 12v-2"/><path d="M12 19v4"/><path d="M8 23h8"/></svg>
);
const TestTubeIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 7 6.82 21.18a2.83 2.83 0 0 1-3.99-.01v0a2.83 2.83 0 0 1 0-4L17 3"/><path d="m16 2 6 6"/><path d="M12 16H4"/></svg>
);
const ClockIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);
const TrashIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
);

const Dashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [roomName, setRoomName] = useState('');
  
  // New State for Features
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [muteOnEntry, setMuteOnEntry] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRooms();
    // Clock Timer
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await roomAPI.getUserRooms();
      setRooms(response.data.rooms);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Assuming your backend can handle these new flags, otherwise they are just UI for now
      const response = await roomAPI.createRoom({ 
        name: roomName,
        settings: {
          passwordProtected: isPasswordProtected,
          muteOnEntry: muteOnEntry
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

  const handleJoinRoom = (roomId) => {
    navigate(`/room/${roomId}`);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
    alert("Copied to clipboard!");
  };

  const handleDeleteRoom = async (e, roomId) => {
    e.stopPropagation(); // Prevent triggering the row click
    if(window.confirm("Are you sure you want to end this room?")) {
        // Add delete logic here if API supports it
        // await roomAPI.deleteRoom(roomId);
        // fetchRooms();
        alert("End room functionality to be connected to API");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-purple-500/30">
        
      {/* --- Top Navigation Bar --- */}
      <nav className="border-b border-gray-800 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="font-bold text-white">P</span>
               </div>
               <span className="text-xl font-bold tracking-tight">Dashboard</span>
            </div>
            
            <div className="flex items-center gap-6">
               {/* Time Display */}
               <div className="hidden md:flex items-center gap-2 text-gray-400 text-sm">
                  <ClockIcon className="w-4 h-4" />
                  <span>
                    {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span>|</span>
                  <span>
                    {currentTime.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                  </span>
               </div>

               {/* User Profile */}
               <div className="flex items-center gap-3 pl-6 border-l border-gray-800">
                  <div className="text-right hidden sm:block">
                     <p className="text-sm font-medium text-white">{user?.username || 'Guest'}</p>
                     <p className="text-xs text-gray-500">Pro Plan</p>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-purple-400 font-bold">
                     {user?.username?.[0]?.toUpperCase() || 'U'}
                  </div>
               </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* --- Welcome Section --- */}
        <div className="mb-10">
           <h1 className="text-3xl font-bold mb-2">
             Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">{user?.username}</span>!
           </h1>
           <p className="text-gray-400">Ready to collaborate? Start a new scene or jump back in.</p>
        </div>

        {/* --- Main Grid Layout --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          
          {/* 1. Create Room Card (Left Column - Spans 2) */}
          <div className="lg:col-span-2">
            <div className="h-full bg-gray-900/50 border border-gray-800 rounded-2xl p-8 relative overflow-hidden group">
               {/* Background Glow */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-purple-900/20 blur-[80px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
               
               <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                     <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20 text-purple-400">
                        <VideoIcon className="w-6 h-6" />
                     </div>
                     <h2 className="text-xl font-bold">Create New Room</h2>
                  </div>

                  <form onSubmit={handleCreateRoom} className="space-y-6">
                     {/* Room Name Input */}
                     <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400 ml-1">Room Name</label>
                        <input
                           type="text"
                           value={roomName}
                           onChange={(e) => setRoomName(e.target.value)}
                           placeholder="e.g. Weekly Design Sync"
                           className="w-full h-12 px-4 bg-black border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                        />
                     </div>

                     {/* Room Settings Toggles */}
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Password Toggle */}
                        <div 
                           onClick={() => setIsPasswordProtected(!isPasswordProtected)}
                           className={`cursor-pointer p-4 rounded-xl border transition-all duration-200 flex items-center gap-3 ${
                              isPasswordProtected 
                                 ? 'bg-purple-900/20 border-purple-500/50' 
                                 : 'bg-black border-gray-800 hover:border-gray-700'
                           }`}
                        >
                           <div className={`p-2 rounded-lg ${isPasswordProtected ? 'bg-purple-500 text-white' : 'bg-gray-800 text-gray-400'}`}>
                              <LockIcon className="w-4 h-4" />
                           </div>
                           <div>
                              <p className={`text-sm font-medium ${isPasswordProtected ? 'text-white' : 'text-gray-300'}`}>Private Room</p>
                              <p className="text-xs text-gray-500">Require password</p>
                           </div>
                        </div>

                        {/* Mute Toggle */}
                        <div 
                           onClick={() => setMuteOnEntry(!muteOnEntry)}
                           className={`cursor-pointer p-4 rounded-xl border transition-all duration-200 flex items-center gap-3 ${
                              muteOnEntry 
                                 ? 'bg-blue-900/20 border-blue-500/50' 
                                 : 'bg-black border-gray-800 hover:border-gray-700'
                           }`}
                        >
                           <div className={`p-2 rounded-lg ${muteOnEntry ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-400'}`}>
                              <MicOffIcon className="w-4 h-4" />
                           </div>
                           <div>
                              <p className={`text-sm font-medium ${muteOnEntry ? 'text-white' : 'text-gray-300'}`}>Mute on Entry</p>
                              <p className="text-xs text-gray-500">Quiet start</p>
                           </div>
                        </div>
                     </div>

                     {/* Action Buttons */}
                     <div className="pt-2 flex flex-col sm:flex-row gap-4">
                        <button
                           type="submit"
                           disabled={loading}
                           className="flex-1 h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-purple-900/20 flex items-center justify-center gap-2"
                        >
                           {loading ? (
                             <span className="animate-pulse">Creating...</span>
                           ) : (
                             <>
                               <PlusIcon className="w-5 h-5" />
                               <span>Create Room</span>
                             </>
                           )}
                        </button>
                        
                        <button
                           type="button"
                           className="h-12 px-6 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium rounded-xl transition-colors flex items-center gap-2 border border-gray-700"
                           onClick={() => alert("Launching Audio/Video Test...")}
                        >
                           <TestTubeIcon className="w-4 h-4" />
                           <span className="hidden sm:inline">Test A/V</span>
                        </button>
                     </div>
                  </form>
               </div>
            </div>
          </div>

          {/* 2. Stats & Quick Actions (Right Column) */}
          <div className="space-y-6">
             
             {/* Stats Card */}
             <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                <div className="flex justify-between items-start mb-4">
                   <div>
                      <p className="text-sm text-gray-400">Active Rooms</p>
                      <h3 className="text-3xl font-bold text-white mt-1">{rooms.length}</h3>
                   </div>
                   <div className="p-2 bg-green-500/10 text-green-400 rounded-lg">
                      <span className="flex h-3 w-3 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                      </span>
                   </div>
                </div>
                <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                   <div className="bg-green-500 h-full rounded-full" style={{ width: `${Math.min(rooms.length * 20, 100)}%` }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                   {rooms.length > 0 ? 'Systems operational' : 'No active sessions'}
                </p>
             </div>

             {/* Quick Invite Card */}
             <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6">
                <h4 className="text-sm font-semibold text-gray-300 mb-3">Quick Invite</h4>
                <p className="text-xs text-gray-500 mb-4">Copy your personal meeting link to invite people instantly.</p>
                <div className="flex gap-2">
                   <input 
                      readOnly 
                      value={`popcornping.com/${user?.username}`} 
                      className="flex-1 bg-black border border-gray-800 text-gray-400 text-xs px-3 rounded-lg focus:outline-none"
                   />
                   <button 
                      onClick={() => copyToClipboard(`https://popcornping.com/${user?.username}`)}
                      className="p-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-gray-300 transition-colors"
                      title="Copy Link"
                   >
                      <CopyIcon className="w-4 h-4" />
                   </button>
                </div>
             </div>

          </div>
        </div>

        {/* --- Active Rooms Section --- */}
        <div className="border-t border-gray-800 pt-10">
           <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Your Active Rooms</h2>
              <button onClick={fetchRooms} className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
                 Refresh List
              </button>
           </div>

           {rooms.length === 0 ? (
              <div className="text-center py-16 bg-gray-900/30 border border-gray-800 border-dashed rounded-2xl">
                 <div className="inline-flex p-4 bg-gray-800 rounded-full mb-4 text-gray-500">
                    <VideoIcon className="w-6 h-6" />
                 </div>
                 <h3 className="text-lg font-medium text-white mb-1">No active rooms</h3>
                 <p className="text-gray-500 text-sm">Create a new room above to get started.</p>
              </div>
           ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                 {rooms.map((room) => (
                    <div
                       key={room._id}
                       onClick={() => handleJoinRoom(room.roomId)}
                       className="group bg-gray-900/40 border border-gray-800 hover:border-purple-500/50 rounded-xl p-5 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-purple-900/10 hover:-translate-y-1 relative overflow-hidden"
                    >
                       <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                             onClick={(e) => handleDeleteRoom(e, room.roomId)}
                             className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors"
                             title="End Room"
                          >
                             <TrashIcon className="w-4 h-4" />
                          </button>
                       </div>

                       <div className="flex items-start justify-between mb-4">
                          <div>
                             <h3 className="font-semibold text-white group-hover:text-purple-400 transition-colors truncate max-w-[180px]">
                                {room.name || "Untitled Room"}
                             </h3>
                             <p className="text-xs text-gray-500 font-mono mt-1">ID: {room.roomId}</p>
                          </div>
                          <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                       </div>
                       
                       <div className="flex items-center justify-between mt-6">
                          <div className="flex -space-x-2">
                             {/* Participant avatars (Placeholder) */}
                             {[...Array(Math.min(3, room.participants?.length || 1))].map((_, i) => (
                                <div key={i} className="w-7 h-7 rounded-full bg-gray-700 border-2 border-black flex items-center justify-center text-[10px] text-white font-medium">
                                   {String.fromCharCode(65 + i)}
                                </div>
                             ))}
                             {(room.participants?.length || 0) > 3 && (
                                <div className="w-7 h-7 rounded-full bg-gray-800 border-2 border-black flex items-center justify-center text-[10px] text-gray-400 font-medium">
                                   +{room.participants.length - 3}
                                </div>
                             )}
                          </div>
                          
                          <div className="flex gap-2">
                             <button 
                                onClick={(e) => { e.stopPropagation(); copyToClipboard(room.roomId); }}
                                className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-xs text-gray-300 rounded-lg transition-colors border border-gray-700"
                             >
                                Copy ID
                             </button>
                             <button className="px-3 py-1.5 bg-white text-black hover:bg-gray-200 text-xs font-semibold rounded-lg transition-colors">
                                Join
                             </button>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           )}
        </div>
        
        {/* --- Meeting History / Snippets Placeholder --- */}
        <div className="mt-12">
            <h3 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">Recent Snippets</h3>
            <div className="bg-gray-900/30 border border-gray-800 rounded-xl p-6 text-center">
                <p className="text-gray-500 text-sm">No recent snippets or recordings found.</p>
            </div>
        </div>

      </main>
    </div>
  );
};

export default Dashboard;