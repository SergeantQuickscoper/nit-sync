import express from "express"
import authControllers from "../controllers/authControllers.js";

const router = express.Router();

router.get("/", authControllers.helloWorld)

router.post("/signup", authControllers.signup);
router.post("/resendOTP", authControllers.resendOTP);
router.post("/verifyuser", authControllers.verifyOTP);
export default router;