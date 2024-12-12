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

    async getSubjectsUserJoined(uid){
        try {
            const query = db.select("*").from('user_subject_selection').where("uid", uid);
            return query;
        } catch (error) {
            throw error;
        }
    }

    async getEventsForASubject(subjectID){
        try {
            const query = db.select("*").from("events").where("subject_id", subjectID);
            return query; 
        } catch (error) {
            throw error;
        }
    }

    //TODO some more funcs to fill out here

    //wonder how deleting a subject works when people are part of (ON DELETE CASCADE???)
    async deleteSubjectByID(uid, subject_id){
        try {
            const check = await db.select("*").from('subjects').where('subject_id', subject_id).andWhere('created_by', uid);
            if(check.length == 0){
                throw Error("Specified Subject doesnt exist or wasnt created by you")
            }

            await db.table('subjects').del().where('subject_id', subject_id).andWhere('created_by', uid);

        } catch (error) {
            throw error;
        }
    }

    async deleteEventByID(uid, event_id){
        try {
            const check = await db.select("*").from('events').where('event_id', event_id).andWhere('created_by', uid);
            if(check.length == 0){
                throw Error("Specified Event doesnt exist or wasnt created by you")
            }

            await db.table('events').del().where('events', event_id).andWhere('created_by', uid);

        } catch (error) {
            throw error;
        }
    }

    async leaveSubject(uid, subject_id){
        try {
            const check = await db.select("*").from('user_subject_selection').where('subject_id', subject_id).andWhere('uid', uid);
            if(check.length == 0){
                throw Error("You haven't joined this subject")
            }

            await db.table('user_subject_selection').del().where('subject_id', ).andWhere('uid', uid);

        } catch (error) {
            throw error;
        }
    }

    async leaveEvent(uid, event_id){
        try {
            const check = await db.select("*").from('user_event_attendance').where('event_id', event_id).andWhere('uid', uid);
            if(check.length == 0){
                throw Error("You haven't joined this subject")
            }

            await db.table('user_event_attendance').del().where('event_id', event_id).andWhere('uid', uid);

        } catch (error) {
            throw error;
        }
    }

    async getJoinedSubjects(uid){
        try {
            const query = await db.select("*").from("user_subject_selection").where("uid", uid)
            console.log(query)
            return query;
        } catch (error) {
            throw error;
        }
    }

    async getAttendedEvents(uid){
        try {
            const query = await db.select("*").from("user_event_attendance").where("uid", uid)
            return query;
        } catch (error) {
            throw error;
        }
    }
}

const timetableDAOObj = new timetableDAO();
export default timetableDAOObj;