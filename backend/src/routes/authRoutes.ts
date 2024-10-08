import express from "express"
import authControllers from "../controllers/authControllers.js";

const router = express.Router();

router.get("/", authControllers.helloWorld)

router.post("/signup", authControllers.signup);

//TODO implement below controllers
/** router.get("/signup", authControllers.signup);

router.get("/signup", authControllers.signup);

router.get("/signup", authControllers.signup);

**/
export default router;