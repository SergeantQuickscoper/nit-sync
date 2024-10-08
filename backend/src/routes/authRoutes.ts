import express from "express"
import authControllers from "../controllers/authControllers.js";

const router = express.Router();

router.get("/", authControllers.helloWorld)
export default router;