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
}

const timetableDAOObj = new timetableDAO();
export default timetableDAOObj;