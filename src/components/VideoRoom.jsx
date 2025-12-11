import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import Peer from 'simple-peer';
import { roomAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const VideoRoom = () => {
  const { roomId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [peers, setPeers] = useState([]);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [roomInfo, setRoomInfo] = useState(null);
  
  const socketRef = useRef();
  const userVideo = useRef();
  const peersRef = useRef([]);
  const streamRef = useRef();
  const screenStreamRef = useRef();

  useEffect(() => {
    fetchRoomInfo();
    initializeMedia();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

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

  const leaveRoom = async () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-white">
              {roomInfo?.name || 'Video Room'}
            </h1>
            <p className="text-sm text-gray-400">Room ID: {roomId}</p>
          </div>
          <button
            onClick={leaveRoom}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
          >
            Leave Room
          </button>
        </div>
      </div>

      {/* Video Grid */}
      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full">
          {/* Your Video */}
          <div className="relative bg-gray-800 rounded-xl overflow-hidden aspect-video">
            <video
              ref={userVideo}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 bg-gray-900/80 backdrop-blur-sm px-3 py-1 rounded-lg">
              <span className="text-white text-sm font-medium">You</span>
            </div>
            {isVideoOff && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    {user?.username.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Peer Videos */}
          {peers.map((peer, index) => (
            <Video key={index} peer={peer.peer} />
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-800 border-t border-gray-700 px-6 py-4">
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={toggleMute}
            className={`p-4 rounded-full transition ${
              isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              {isMuted ? (
                <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
              ) : (
                <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
              )}
            </svg>
          </button>

          <button
            onClick={toggleVideo}
            className={`p-4 rounded-full transition ${
              isVideoOff ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              {isVideoOff ? (
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              ) : (
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
              )}
            </svg>
          </button>

          <button
            onClick={shareScreen}
            className={`p-4 rounded-full transition ${
              isScreenSharing ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

const Video = ({ peer }) => {
  const ref = useRef();

  useEffect(() => {
    peer.on('stream', (stream) => {
      ref.current.srcObject = stream;
    });
  }, [peer]);

  return (
    <div className="relative bg-gray-800 rounded-xl overflow-hidden aspect-video">
      <video ref={ref} autoPlay playsInline className="w-full h-full object-cover" />
    </div>
  );
};

export default VideoRoom;