import jwt from 'jsonwebtoken';

const userSocketMap = new Map(); // userId -> socketId

export const initializeSocket = (io) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.userId}`);
    
    // Store user socket mapping
    userSocketMap.set(socket.userId, socket.id);

    // Emit online status
    socket.broadcast.emit('userOnline', { userId: socket.userId });

    // Join user's personal room
    socket.join(socket.userId);

    // Handle typing
    socket.on('typing', ({ chatId, receiverId }) => {
      socket.to(receiverId).emit('userTyping', {
        chatId,
        userId: socket.userId
      });
    });

    socket.on('stopTyping', ({ chatId, receiverId }) => {
      socket.to(receiverId).emit('userStopTyping', {
        chatId,
        userId: socket.userId
      });
    });

    // Handle messages
    socket.on('sendMessage', (data) => {
      const { receiverId, message } = data;
      socket.to(receiverId).emit('receiveMessage', message);
    });

    // Handle message seen
    socket.on('messageSeen', ({ chatId, messageId, senderId }) => {
      socket.to(senderId).emit('messageSeenUpdate', { chatId, messageId });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userId}`);
      userSocketMap.delete(socket.userId);
      socket.broadcast.emit('userOffline', { userId: socket.userId });
    });
  });
};

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap.get(receiverId);
};

export { userSocketMap };
