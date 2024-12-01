import timetableDAO from "../dao/timetableDAO";
import authDAO from "../dao/authDAO";
import jwt from "jsonwebtoken";

class timetableServices{

    async validateCRandGetID(token){
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            //TODO validate the iat parameter later 
            //TODO check for in past, check for non negative value etc. etc.


            //check if decoded.email is a CR and get his class
            const {uid, role} = await authDAO.getUser(decoded.email)

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

        } catch (error) {
            throw error;
        }
    }

    async getSubjectsByClass(userJWT){
        try {

            const user = await this.validateCRandGetID(userJWT);
            console.log(user)
            //if cr doesnt exist for a particular user this will return an error so during
            //the phase of finding all the crs we need to accomodate for this bug.
            const {uid} = await authDAO.findCRID(user);      
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
        } catch (error) {
            throw error;
        }
    }
}

const timetableServicesObj = new timetableServices();
export default timetableServicesObj;