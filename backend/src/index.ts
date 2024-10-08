import express from "express";
import 'dotenv/config';
import authRoutes from './routes/authRoutes.js';

const app = express();

app.use(express.json())
app.use(authRoutes);

app.listen(process.env.PORT, () => console.log("Server is live on PORT " + process.env.PORT));
