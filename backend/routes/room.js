const express = require('express');
const Room = require('../models/Room');
const { isAuthenticated } = require('../middleware/auth');

const router = express.Router();

// Generate random room ID
const generateRoomId = () => {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
};

// Create a new room
router.post('/create', isAuthenticated, async (req, res) => {
  try {
    const { name } = req.body;
    
    const roomId = generateRoomId();
    
    const room = await Room.create({
      roomId,
      name: name || `${req.user.username}'s Room`,
      host: req.user._id,
      participants: [req.user._id],
    });
    
    res.status(201).json({
      room: {
        id: room._id,
        roomId: room.roomId,
        name: room.name,
        host: room.host,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating room', error: error.message });
  }
});

// Get room details
router.get('/:roomId', isAuthenticated, async (req, res) => {
  try {
    const room = await Room.findOne({ roomId: req.params.roomId })
      .populate('host', 'username email avatar')
      .populate('participants', 'username email avatar');
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    if (!room.isActive) {
      return res.status(410).json({ message: 'Room is no longer active' });
    }
    
    res.json({ room });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching room', error: error.message });
  }
});

// Join a room
router.post('/:roomId/join', isAuthenticated, async (req, res) => {
  try {
    const room = await Room.findOne({ roomId: req.params.roomId });
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    if (!room.isActive) {
      return res.status(410).json({ message: 'Room is no longer active' });
    }
    
    if (!room.participants.includes(req.user._id)) {
      room.participants.push(req.user._id);
      await room.save();
    }
    
    res.json({ message: 'Joined room successfully', roomId: room.roomId });
  } catch (error) {
    res.status(500).json({ message: 'Error joining room', error: error.message });
  }
});

// End a room (only host can do this)
router.post('/:roomId/end', isAuthenticated, async (req, res) => {
  try {
    const room = await Room.findOne({ roomId: req.params.roomId });
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    if (room.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the host can end the room' });
    }
    
    room.isActive = false;
    await room.save();
    
    res.json({ message: 'Room ended successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error ending room', error: error.message });
  }
});

// Get user's rooms
router.get('/user/rooms', isAuthenticated, async (req, res) => {
  try {
    const rooms = await Room.find({
      $or: [
        { host: req.user._id },
        { participants: req.user._id }
      ],
      isActive: true,
    }).populate('host', 'username email');
    
    res.json({ rooms });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rooms', error: error.message });
  }
});

module.exports = router;