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

    //TODO some more funcs to fill out here
    
    async deleteSubjectByID(subject_id){

    }

    async deleteEventByID(event_id){

    }


}

const timetableDAOObj = new timetableDAO();
export default timetableDAOObj;