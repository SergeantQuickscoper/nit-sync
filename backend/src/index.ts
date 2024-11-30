import express from "express";
import 'dotenv/config';
import authRoutes from './routes/authRoutes.js';
import timetableRoutes from './routes/timetableRoutes.js'

const app = express();

app.use(express.json())
app.use(authRoutes);
app.use(timetableRoutes);

app.listen(process.env.PORT, () => console.log("Server is live on PORT " + process.env.PORT));
