import express from "express";
import 'dotenv/config';
import http from 'http';
import authRoutes from './routes/authRoutes.js';
import timetableRoutes from './routes/timetableRoutes.js'
import { Server } from "socket.io";
import { setupSocketHandlers } from "./routes/socketRoutes.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server)

setupSocketHandlers(io)

app.use(express.json())
app.use(authRoutes);
app.use(timetableRoutes);

export { io };

server.listen(process.env.PORT, () => console.log("Server is live on PORT " + process.env.PORT));
