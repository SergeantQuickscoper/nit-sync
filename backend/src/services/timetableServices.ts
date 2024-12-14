import timetableDAO from "../dao/timetableDAO";
import authDAO from "../dao/authDAO";
import jwt from "jsonwebtoken";
import { connectedUsers } from "../routes/socketRoutes";
import { io } from "../index";
class timetableServices{

    async validateCRandGetID(token){
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            //TODO validate the iat parameter later 
            //TODO check for in past, check for non negative value etc. etc.


            //check if decoded.email is a CR and get his class
            const {uid, role} = await authDAO.getUser(decoded.email)
            console.log(decoded.email)

            if(role != "cr"){
                throw Error("Unauthorized Subject creation")
            }

            return uid;

        } catch (error) {
            throw error;
        }
    }

    async createSubject(token, subjectName, description){
        try {

            const uid = await this.validateCRandGetID(token)

            //query create the mentioned subject in the afforementioned class
            await timetableDAO.createSubject(uid, subjectName, description);

            //emit a server-update event to all connectedUsers in the class
            io.emit("subjectUpdate")
            console.log("Subject was updated")

            //push notifications to all subject users


        } catch (error) {
            throw error;
        }
    }

    async getSubjectsByClass(userJWT){
        try {
            const decoded = jwt.verify(userJWT, process.env.JWT_SECRET);
            //if cr doesnt exist for a particular user this will return an error so during
            //the phase of finding all the crs we need to accomodate for this bug.
            const {uid} = await authDAO.findCRID(decoded.email);      
            const query = await timetableDAO.getSubjects(uid)
            // maybe could do some parsing here instead of passing all the info
            return query;

        } catch (error) {
            throw error;
        }
        
    }

    async createEvent(token, eventName, description, subjectID, eventType, startTime, endTime){
        try {
            const uid = await this.validateCRandGetID(token);
            await timetableDAO.createEvent(uid, eventName, description, startTime, endTime, eventType, subjectID);

            //emit a server-update event to all connectedUsers in the subject 


            //push notifications to all subject users



        } catch (error) {
            throw error;
        }
    }

    async joinSubject(token, subjectID){
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decoded.email)
            const {uid} = await authDAO.emailToUID(decoded.email);
            await timetableDAO.joinSubject(uid, subjectID);
        } catch (error) {
            throw error;
        }
        
    }

    async attendEvent(token, event_id){
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const {uid} = await authDAO.emailToUID(decoded.email);
            await timetableDAO.attendEvent(uid, event_id);
        } catch (error) {
            throw error;
        }
    }

    async getTotalEventsOfSubjectsUserIsPartOf(token){
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const {uid} = await authDAO.emailToUID(decoded.email);
            const userSubjectList = await timetableDAO.getSubjectsUserJoined(uid);
            let subjectEventObj = {};
            let count  = 0;
            for(let i of userSubjectList){
                const subjectName = userSubjectList[count].subject_id;
                subjectEventObj[subjectName] = await timetableDAO.getEventsForASubject(subjectName)
            }

            return subjectEventObj;

        } catch (error) {
            throw error;
        }
    }

    async deleteSubject(token, subjectID){
        try {
            const uid = await this.validateCRandGetID(token)
            await timetableDAO.deleteSubjectByID(uid, subjectID)
        } catch (error) {
            
        }
    }

    async deleteEvent(token, subjectID){
        try {
            const uid = await this.validateCRandGetID(token)
            await timetableDAO.deleteEventByID(uid, subjectID)
        } catch (error) {
            
        }
    }

    async leaveSubject(token, subject_id){
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const {uid} = await authDAO.emailToUID(decoded.email);
            await timetableDAO.leaveSubject(uid, subject_id);
        } catch (error) {
            throw error;
        }
    }

    async leaveEvent(token, event_id){
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const {uid} = await authDAO.emailToUID(decoded.email);
            await timetableDAO.deleteEventByID(uid, event_id);
        } catch (error) {
            throw error;
        }
    }

    async getJoinedSubjects(token){
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const {uid} = await authDAO.emailToUID(decoded.email);
            return await timetableDAO.getJoinedSubjects(uid);
        } catch (error) {
            throw error;
        }
    }

    async getAttendedEvents(token){
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const {uid} = await authDAO.emailToUID(decoded.email);
            return await timetableDAO.getAttendedEvents(uid);
        } catch (error) {
            throw error;
        }
    }

    async createReoccuringEvent(token, eventName, description, subjectID, eventType, startTime, endTime, day){
        try {
            const uid = await this.validateCRandGetID(token);
            await timetableDAO.createReoccuringEvent(uid, eventName, description, startTime, endTime, eventType, subjectID, day);
        } catch (error) {
            throw error;
        }
    }
}

const timetableServicesObj = new timetableServices();
export default timetableServicesObj;