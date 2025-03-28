import express from 'express';
import timeTableControllers from '../controllers/timetableControllers';


const router = express.Router();

router.post("/createSubject", timeTableControllers.createSubject);
router.post("/getSubjects", timeTableControllers.getSubjects);
router.post("/getEventsOnDay", timeTableControllers.getTotalEventsOfSubjectOnDay)
router.post("/getTotalEventsOfSubjectsUserIsPartOf", timeTableControllers.getTotalEventsOfSubjectsUserIsPartOf)
router.post("/getJoinedSubjects", timeTableControllers.getJoinedSubjects)
router.post('/getAttendedEvents', timeTableControllers.getAttenededEvents)
router.post("/joinSubject", timeTableControllers.joinSubject)
router.post("/attendEvent", timeTableControllers.attendEvent)
router.post("/createEvent", timeTableControllers.createEvent)
router.post("/deleteSubject", timeTableControllers.deleteSubject)
router.post("/leaveSubject", timeTableControllers.leaveSubject)
router.post("/deleteEvent", timeTableControllers.deleteEvent)
router.post("/leaveEvent", timeTableControllers.leaveEvent)
router.post("/createReoccuringEvent", timeTableControllers.createReoccuringEvent)
router.post("/deleteReoccuringEvent", timeTableControllers.deleteReoccuringEvent)
router.post("/getReoccuringEventView", timeTableControllers.getReoccuringEventView)

export default router;