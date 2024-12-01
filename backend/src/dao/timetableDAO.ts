import db from "../db/db";

class timetableDAO{
    async createSubject(author, subjectName, subjectDescription){
        try {
            const check = await db.select('*').from('subjects').where('subject_name', subjectName).andWhere('created_by', author);
            if(!(check.length == 0)){
                throw Error("Author has already made a subject with the name " + subjectName)
            }
            await db.table('subjects').insert({"subject_name" : subjectName, "description": subjectDescription, "created_by": author})
        } catch (error) {
            throw error;
        }
        
    }

    async getSubjects(crID){
        const query = await db.select("*").from('subjects').where('created_by', crID);
        return query;
    }

    //TODO possible vulnerability here technically any cr could change the events of other crs if they know the subjectID??? some validation func shud fix this bs
    async createEvent(author, eventName, description, start_time, end_time, eventType, subjectID){
        try {
            await db.table('events').insert({"event_name" : eventName, "subject_id" : subjectID, "event_desc" : description, "event_type" : eventType, "start_time" : start_time, "end_time" : end_time, "created_by" : author})
        } catch (error) {
            throw error;
        }
    }

    //TODO potential security issues??? couldnt theoretically anyone who knows the ids join and delete whatever subject they like? somehow need to ensure that this stays fucking private
    async joinSubject(uid, subjectID){
        try {
            const check = await db.select('*').from('user_subject_selection').where("uid", uid).andWhere('subject_id', subjectID);

            if(!(check.length == 0)){
                throw Error("You have already joined this subject")
            }

            await db.table('user_subject_selection').insert({"uid": uid, "subject_id": subjectID})

        } catch (error) {
            throw error;
        }
    }

    async attendEvent(uid, event_id){
        try {
            const check = await db.select('*').from("user_event_attendance").where('uid', uid).andWhere("event_id", event_id);

            if(!(check.length == 0)){
                throw Error("You have already joined this event")
            }

            await db.table("user_event_attendance").insert({"uid": uid, "event_id": event_id})

        } catch (error) {
            throw error;
        }
    }

    //TODO some more funcs to fill out here

    async deleteSubjectByID(subject_id){

    }

    async deleteEventByID(event_id){

    }

    async leaveSubject(){

    }

    async leaveEvent(){

    }
}

const timetableDAOObj = new timetableDAO();
export default timetableDAOObj;