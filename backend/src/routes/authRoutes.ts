import express from "express"
import authControllers from "../controllers/authControllers.js";

const router = express.Router();

router.get("/", authControllers.helloWorld)

router.post("/signup", authControllers.signup);
router.post("/resendOTP", authControllers.resendOTP);
router.post("/verifyuser", authControllers.verifyOTP);
router.post("/completeaccount", authControllers.completeAccount)
router.post("/login", authControllers.login)
router.post("/reqpassresetOTP", authControllers.reqPasswordResetOTP)
router.post("/verifypassOTP", authControllers.verifyPassToken)
router.post("/changepass", authControllers.changePass)
export default router;