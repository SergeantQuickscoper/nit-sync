import jwt from "jsonwebtoken"

export const connectedUsers = {}; //inshallah this one connectedUsers Objects scales

export function setupSocketHandlers(io) {
    // authenticate JWTs
    io.use((socket, next) => {
      const token = socket.handshake.auth?.jwt;
  
      if (!token) {
        return next(new Error('Authentication error: Token required'));
      }
  
      try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        socket.user = user.email; 
        next();
      } catch (err) {
        next(new Error('Authentication error: Invalid token'));
      }
    });
  
    io.on('connection', (socket) => {
      const user = socket.user;
      console.log('User connected:', user);
  
      connectedUsers[user] = {
        socketId: socket.id,
      };
  
      console.log('Connected Users:', connectedUsers);

      socket.on('disconnect', () => {
        console.log('User disconnected:', user);
        delete connectedUsers[user];
        console.log('Updated Users:', connectedUsers);
      });
    });
  }

  