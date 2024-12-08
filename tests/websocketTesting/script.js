import { io } from "socket.io-client";

const socket = io("http://localhost:8080", {
    auth: {
        jwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRyMjRjc2IwYjIwQHN0dWRlbnQubml0dy5hYy5pbiIsImlhdCI6MTczMjk2MjcwNH0.fj6BTNTdWT7U8pR0ZAZrRJjU3151KGpZY5WOwMeBKkY"
    }
});

socket.on('connect', () => {
    console.log('Connected to server');
    socket.emit('message', 'Hello from client!');
  })
  
  socket.on('message', (data) => {
    console.log('Received message:', data);
  })
  
  socket.on('connect_error', (error) => {
    console.error('Connection error:', error.message);
  });
  
  socket.on('disconnect', () => {
    console.log('Disconnected from server');
  })