import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import Peer from 'simple-peer';
import { roomAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

// Icons
const MicIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
);
const MicOffIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="1" x2="23" y1="1" y2="23" stroke="currentColor"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" stroke="currentColor"/><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" stroke="currentColor"/><line x1="12" x2="12" y1="19" y2="23" stroke="currentColor"/></svg>
);
const VideoIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>
);
const VideoOffIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M10.66 5H14a2 2 0 0 1 2 2v2.34l1 1L22 7v10"/><path d="M16 16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2l10 10Z"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
);
const MonitorIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>
);
const PhoneOffIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91"/><line x1="22" x2="2" y1="2" y2="22"/></svg>
);
const CopyIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
);

const VideoRoom = () => {
  const { roomId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [peers, setPeers] = useState([]);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [roomInfo, setRoomInfo] = useState(null);
  const [showCopied, setShowCopied] = useState(false);
  
  const socketRef = useRef();
  const userVideo = useRef();
  const peersRef = useRef([]);
  const streamRef = useRef();
  const screenStreamRef = useRef();

  useEffect(() => {
    fetchRoomInfo();
    initializeMedia();

    return () => {
      console.log("Component unmounting. Running cleanup.");
      cleanupConnection(); 
    };
  }, []); 

  // Comprehensive cleanup function 
  const cleanupConnection = () => {
    
    if (userVideo.current) {
      userVideo.current.srcObject = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop(); 
        console.log(`Stopped ${track.kind} track`);
      });
      streamRef.current = null;
    }

    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log(`Stopped screen share ${track.kind} track`);
      });
      screenStreamRef.current = null;
    }
    
    peersRef.current.forEach(({ peer }) => {
      if (peer) {
        peer.destroy();
      }
    });
    peersRef.current = [];
    setPeers([]);
    
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  };

  const fetchRoomInfo = async () => {
    try {
      const response = await roomAPI.getRoom(roomId);
      setRoomInfo(response.data.room);
      await roomAPI.joinRoom(roomId);
    } catch (error) {
      console.error('Error fetching room:', error);
      alert('Room not found or expired');
      navigate('/dashboard');
    }
  };

  const initializeMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      
      streamRef.current = stream;
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
      }

      socketRef.current = io(process.env.REACT_APP_SOCKET_URL);
      
      socketRef.current.emit('join-room', roomId, user.id);

      socketRef.current.on('user-connected', (userId) => {
        const peer = createPeer(userId, socketRef.current.id, stream);
        peersRef.current.push({
          peerID: userId,
          peer,
        });
        setPeers((users) => [...users, { peerID: userId, peer }]);
      });

      socketRef.current.on('offer', (offer, id) => {
        const peer = addPeer(offer, id, stream);
        peersRef.current.push({
          peerID: id,
          peer,
        });
        setPeers((users) => [...users, { peerID: id, peer }]);
      });

      socketRef.current.on('answer', (answer, id) => {
        const item = peersRef.current.find((p) => p.peerID === id);
        if (item) {
          item.peer.signal(answer);
        }
      });

      socketRef.current.on('ice-candidate', (candidate, id) => {
        const item = peersRef.current.find((p) => p.peerID === id);
        if (item) {
          item.peer.signal(candidate);
        }
      });

      socketRef.current.on('user-disconnected', (userId) => {
        const peerObj = peersRef.current.find((p) => p.peerID === userId);
        if (peerObj) {
          peerObj.peer.destroy();
        }
        const peers = peersRef.current.filter((p) => p.peerID !== userId);
        peersRef.current = peers;
        setPeers(peers);
      });
    } catch (error) {
      console.error('Error accessing media devices:', error);
      alert('Please allow camera and microphone access');
    }
  };

  const createPeer = (userToSignal, callerID, stream) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on('signal', (signal) => {
      socketRef.current.emit('offer', signal, roomId);
    });

    return peer;
  };

  const addPeer = (incomingSignal, callerID, stream) => {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on('signal', (signal) => {
      socketRef.current.emit('answer', signal, roomId);
    });

    peer.signal(incomingSignal);

    return peer;
  };

  const toggleMute = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsMuted(!audioTrack.enabled);
    }
  };

  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoOff(!videoTrack.enabled);
    }
  };

  const shareScreen = async () => {
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        
        screenStreamRef.current = screenStream;
        
        const videoTrack = screenStream.getVideoTracks()[0];
        
        peersRef.current.forEach(({ peer }) => {
          const sender = peer._pc.getSenders().find((s) => s.track?.kind === 'video');
          if (sender) {
            sender.replaceTrack(videoTrack);
          }
        });

        if (userVideo.current) {
          userVideo.current.srcObject = screenStream;
        }

        videoTrack.onended = () => {
          stopScreenShare();
        };

        setIsScreenSharing(true);
        socketRef.current.emit('screen-share-started', roomId);
      } catch (error) {
        console.error('Error sharing screen:', error);
      }
    } else {
      stopScreenShare();
    }
  };

  const stopScreenShare = () => {
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(track => track.stop());
    }

    const videoTrack = streamRef.current.getVideoTracks()[0];
    
    peersRef.current.forEach(({ peer }) => {
      const sender = peer._pc.getSenders().find((s) => s.track?.kind === 'video');
      if (sender) {
        sender.replaceTrack(videoTrack);
      }
    });

    if (userVideo.current) {
      userVideo.current.srcObject = streamRef.current;
    }

    setIsScreenSharing(false);
    socketRef.current.emit('screen-share-stopped', roomId);
  };

  const copyRoomLink = () => {
    const roomLink = `${window.location.origin}/room/${roomId}`;
    navigator.clipboard.writeText(roomLink);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  // Function called when user clicks the "Leave" button
  const leaveRoom = async () => {
    // Cleanup all connections first
    cleanupConnection();
    
    // Navigate back to dashboard
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-black flex flex-col relative overflow-hidden">
      
      {/* Background Gradient Effects (omitted for brevity) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-900/10 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-900/10 blur-[150px] rounded-full"></div>
      </div>

      {/* Header (omitted for brevity) */}
      <div className="relative z-10 border-b border-gray-800/50 backdrop-blur-sm bg-black/30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src="/logo.png" 
                alt="PopcornPing" 
                className="h-8 w-8"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div>
                <h1 className="text-lg font-semibold text-white tracking-wide">
                  {roomInfo?.name || 'Video Room'}
                </h1>
                <p className="text-xs text-gray-500">Room: {roomId}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={copyRoomLink}
                className="px-4 py-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-gray-300 hover:text-white rounded-lg transition-all text-sm border border-gray-800 flex items-center gap-2"
              >
                <CopyIcon className="w-4 h-4" />
                {showCopied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Video Grid */}
      <div className="relative flex-1 p-6 z-10">
        <div className={`h-full ${peers.length > 0 ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'flex items-center justify-center'}`}>
          
          {/* Your Video */}
          <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-2xl overflow-hidden border border-gray-800/50 shadow-2xl aspect-video">
            <video
              ref={userVideo}
              autoPlay
              muted
              playsInline
              style={{ transform: 'scaleX(-1)' }} 
              className="w-full h-full object-cover"
            />
            
            {/* User Label and Indicators (omitted for brevity) */}
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-gray-700/50">
              <span className="text-white text-sm font-medium">You {isScreenSharing && '(Sharing)'}</span>
            </div>
            
            {isVideoOff && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-3xl font-bold">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
              </div>
            )}

            {isMuted && (
              <div className="absolute top-4 right-4 bg-red-500/90 backdrop-blur-md p-2 rounded-lg">
                <MicOffIcon className="w-4 h-4 text-white" />
              </div>
            )}
          </div>

          {/* Peer Videos */}
          {peers.map((peer, index) => (
            <Video key={index} peer={peer.peer} peerID={peer.peerID} />
          ))}
        </div>
      </div>

      {/* Controls Bar (omitted for brevity) */}
      <div className="relative z-10 border-t border-gray-800/50 backdrop-blur-sm bg-black/30">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-center gap-4">
            
            {/* Mute Button (omitted for brevity) */}
            <button
              onClick={toggleMute}
              className={`p-4 rounded-full transition-all ${
                isMuted 
                  ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30' 
                  : 'bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-gray-800'
              }`}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? (
                <MicOffIcon className="w-5 h-5 text-white" />
              ) : (
                <MicIcon className="w-5 h-5 text-white" />
              )}
            </button>

            {/* Video Button (omitted for brevity) */}
            <button
              onClick={toggleVideo}
              className={`p-4 rounded-full transition-all ${
                isVideoOff 
                  ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30' 
                  : 'bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-gray-800'
              }`}
              title={isVideoOff ? 'Turn On Camera' : 'Turn Off Camera'}
            >
              {isVideoOff ? (
                <VideoOffIcon className="w-5 h-5 text-white" />
              ) : (
                <VideoIcon className="w-5 h-5 text-white" />
              )}
            </button>

            {/* Screen Share Button (omitted for brevity) */}
            <button
              onClick={shareScreen}
              className={`p-4 rounded-full transition-all ${
                isScreenSharing 
                  ? 'bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-600/30' 
                  : 'bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-gray-800'
              }`}
              title={isScreenSharing ? 'Stop Sharing' : 'Share Screen'}
            >
              <MonitorIcon className="w-5 h-5 text-white" />
            </button>

            <div className="w-px h-10 bg-gray-800 mx-2"></div>

            {/* Leave Button - Calls the cleanup function and navigates */}
            <button
              onClick={leaveRoom}
              className="px-6 py-4 bg-red-600 hover:bg-red-700 text-white rounded-full transition-all font-medium shadow-lg shadow-red-600/30 flex items-center gap-2"
            >
              <PhoneOffIcon className="w-5 h-5" />
              Leave
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Peer Video Component 
const Video = ({ peer, peerID }) => {
  const ref = useRef();
  const [hasVideo, setHasVideo] = useState(true);

  useEffect(() => {
    peer.on('stream', (stream) => {
      ref.current.srcObject = stream;
      
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        setHasVideo(videoTrack.enabled);
        videoTrack.onended = () => setHasVideo(false);
      }
    });
  }, [peer]);

  return (
    <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-2xl overflow-hidden border border-gray-800/50 shadow-2xl aspect-video">
      <video 
        ref={ref} 
        autoPlay 
        playsInline 
        style={{ transform: 'scaleX(1)' }} 
        className="w-full h-full object-cover" 
      />
      
      {/* Peer Label and Placeholder (omitted for brevity) */}
      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-gray-700/50">
        <span className="text-white text-sm font-medium">Participant</span>
      </div>

      {!hasVideo && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white text-3xl font-bold">P</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoRoom;