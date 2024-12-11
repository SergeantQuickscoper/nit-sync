import express from 'express';
import timeTableControllers from '../controllers/timetableControllers';


const router = express.Router();

router.post("/createSubject", timeTableControllers.createSubject);
router.post("/getSubjects", timeTableControllers.getSubjects);
router.post("/getTotalEventsOfSubjectsUserIsPartOf", timeTableControllers.getTotalEventsOfSubjectsUserIsPartOf)
router.post("/joinSubject", timeTableControllers.joinSubject)
router.post("/attendEvent", timeTableControllers.attendEvent)
router.post("/createEvent", timeTableControllers.createEvent)
router.post("/deleteSubject", timeTableControllers.deleteSubject)
router.post("/leaveSubject", timeTableControllers.leaveSubject)
router.post("/deleteEvent", timeTableControllers.deleteEvent)
router.post("/leaveEvent", timeTableControllers.leaveEvent)

export default router;