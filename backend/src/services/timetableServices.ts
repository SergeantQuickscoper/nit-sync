import timetableDAO from "../dao/timetableDAO";
import authDAO from "../dao/authDAO";
import jwt from "jsonwebtoken";

class timetableServices{
    async createSubject(token, subjectName, description){
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            //TODO validate the iat parameter later 
            //TODO check for in past, check for non negative value etc. etc.

            //check if decoded.email is a CR and get his class
            const {uid, role} = await authDAO.getUser(decoded.email)
            if(role != "cr"){
                throw Error("Unauthorized Subject creation")
            }

            //query create the mentioned subject in the afforementioned class
            await timetableDAO.createSubject(uid, subjectName, description);

        } catch (error) {
            throw error;
        }
    }

    async getSubjectsByClass(user){
        const {uid} = await authDAO.findCRID(user);      
        console.log(uid)
    }
}

const timetableServicesObj = new timetableServices();
export default timetableServicesObj;