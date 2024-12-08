import express from "express";
import 'dotenv/config';
import http from 'http';
import authRoutes from './routes/authRoutes.js';
import timetableRoutes from './routes/timetableRoutes.js'
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

app.use(express.json())
app.use(authRoutes);
app.use(timetableRoutes);

server.listen(process.env.PORT, () => console.log("Server is live on PORT " + process.env.PORT));
