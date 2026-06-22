const Message = require('../models/Message');
const User = require('../models/User');

const connectedUsers = new Map(); // userId -> socketId

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`⚡ Socket connected: ${socket.id}`);

    // Register user
    socket.on('register_user', async (userId) => {
      connectedUsers.set(userId, socket.id);
      socket.userId = userId;
      await User.findByIdAndUpdate(userId, { lastSeen: new Date() });
      io.emit('online_users', Array.from(connectedUsers.keys()));
      console.log(`👤 User ${userId} registered`);
    });

    // Join chat room
    socket.on('join_room', (roomId) => {
      socket.join(roomId);
      console.log(`🏠 Socket ${socket.id} joined room ${roomId}`);
    });

    // Send message
    socket.on('send_message', async (data) => {
      try {
        const { room, content, type, fileUrl } = data;
        const message = await Message.create({
          room,
          sender: socket.userId,
          content,
          type: type || 'text',
          fileUrl,
        });
        await message.populate('sender', 'name avatar');
        io.to(room).emit('receive_message', message);
      } catch (err) {
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Typing indicator
    socket.on('user_typing', (data) => {
      socket.to(data.room).emit('user_typing', { userId: socket.userId, isTyping: data.isTyping });
    });

    // Video call signaling
    socket.on('call_user', (data) => {
      const targetSocket = connectedUsers.get(data.to);
      if (targetSocket) {
        io.to(targetSocket).emit('incoming_call', {
          from: socket.userId,
          channelName: data.channelName,
          callerName: data.callerName,
        });
      }
    });

    socket.on('call_accepted', (data) => {
      const targetSocket = connectedUsers.get(data.to);
      if (targetSocket) {
        io.to(targetSocket).emit('call_accepted', { channelName: data.channelName });
      }
    });

    socket.on('call_rejected', (data) => {
      const targetSocket = connectedUsers.get(data.to);
      if (targetSocket) {
        io.to(targetSocket).emit('call_rejected');
      }
    });

    socket.on('call_ended', (data) => {
      const targetSocket = connectedUsers.get(data.to);
      if (targetSocket) {
        io.to(targetSocket).emit('call_ended');
      }
    });

    // Match notifications
    socket.on('match_notification', (data) => {
      const targetSocket = connectedUsers.get(data.to);
      if (targetSocket) {
        io.to(targetSocket).emit('match_accepted', data);
      }
    });

    // Disconnect
    socket.on('disconnect', async () => {
      if (socket.userId) {
        connectedUsers.delete(socket.userId);
        await User.findByIdAndUpdate(socket.userId, { lastSeen: new Date() });
        io.emit('online_users', Array.from(connectedUsers.keys()));
        console.log(`👋 User ${socket.userId} disconnected`);
      }
    });
  });
};
