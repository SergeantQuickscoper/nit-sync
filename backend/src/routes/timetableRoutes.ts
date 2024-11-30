import express from 'express';
import timeTableControllers from '../controllers/timetableControllers';

const router = express.Router();

router.post("/createSubject", timeTableControllers.createSubject);

export default router;