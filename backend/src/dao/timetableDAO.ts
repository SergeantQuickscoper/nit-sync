import db from "../db/db";

class timetableDAO{

    semStart = new Date("2024-12-16"); //mark manually
    lastWorkingDay = new Date("2025-04-15") // mark manually

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
    async createEvent(author, eventName, description, start_time, end_time, eventType, subjectID, reoccuring_event_id=null){
        try {
            await db.table('events').insert({"event_name" : eventName, "subject_id" : subjectID, "event_desc" : description, "event_type" : eventType, "start_time" : start_time, "end_time" : end_time, "created_by" : author, "reoccuring_event_id": reoccuring_event_id})
        } catch (error) {
            throw error;
        }
    }

    //TODO potential security issues??? couldnt theoretically anyone who knows the ids join and delete whatever subject they like? somehow need to ensure that this stays private
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

    async getEventsForASubjectOnDay(subjectID, day){
        try {
            const currDay = new Date(day)
            currDay.setHours(0, 0, 0, 0)
            let nextDay = new Date(day)
            nextDay.setTime(nextDay.getTime() + 24 * 60 * 60 * 1000)
            nextDay.setHours(0, 0, 0, 0)
            const query = await db.select("*").from("events").where("subject_id", subjectID).andWhereBetween("start_time", [currDay.toISOString(), nextDay.toISOString()]);
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

            await db.table('events').del().where('event_id', event_id).andWhere('created_by', uid);

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

            await db.table('user_subject_selection').del().where('subject_id', subject_id ).andWhere('uid', uid);

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

    async createReoccuringEvent(author, eventName, description, start_time, end_time, eventType, subjectID, day){
        day = day.toLowerCase();
        try {
            //BEFORE INSERTING DO AN OVERLAP CHECK HERE

            const [reoccurID] = await db.table('reoccuring_events').insert({"reoccuring_event_name" : eventName, "subject_id" : subjectID, "reoccuring_event_desc" : description, "reoccuring_event_type" : eventType, "start_time" : start_time, "end_time" : end_time, "created_by" : author, "reoccuring_day": day}).returning('reoccuring_event_id');
            await db.table('reoccuring_event_view').insert({"reoccuring_event_view_name" : eventName, "subject_id" : subjectID, "reoccuring_event_view_desc" : description, "reoccuring_event_view_type" : eventType, "start_time" : start_time, "end_time" : end_time, "created_by" : author, "reoccuring_day": day, "reoccuring_event_id" : reoccurID.reoccuring_event_id});
            //side effect which calculates every day the event occurs and adds it to (loop through every day in the semester???????? could be useful to calculate attendance)
            this.updateEventsWithReoccuringEvents(author, eventName, description, start_time, end_time, eventType, subjectID, day, reoccurID.reoccuring_event_id)
        } catch (error) {
            throw error;
        }
    }

    //trust 
    async updateEventsWithReoccuringEvents(author, eventName, description, start_time, end_time, event_Type, subjectID, day, reoccuring_event_id){
        const daysOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

        
        // need a sem start, and need a classwork end date, and list of public holidays (set in stone)
        const semStart = new Date("2024-12-16"); //mark manually
        const lastWorkingDay = new Date("2025-04-15") // mark manually

        // loop through each day, excluding set holidays, this probably requires alot of manual handling (set job?) AND GIVE USER an OPTION TO update every event from the sem beginning to the end
        for(let i = new Date(); i < lastWorkingDay; i.setDate(i.getDate() + 1))
            //insert into events table the required event
            if(day.toLowerCase() == daysOfWeek[i.getUTCDay()]){
                const currentDatePart = i.toISOString().split("T")[0];
                const startTimePart = start_time.split("T")[1]; 
                const endTimePart = end_time.split("T")[1];

                const newStartTime = currentDatePart + "T" + startTimePart;
                const newEndTime = currentDatePart + "T" + endTimePart;

                this.createEvent(author, eventName, description, newStartTime, newEndTime, event_Type, subjectID, reoccuring_event_id)
            }
        
        //
        
    }   

    async deleteReoccuringEvent(author, reoccuringEventID){
        // so a new table 
        //delete the view on the weekly timetable
        try {
            const check = await db.select("*").from("reoccuring_event_view").where("created_by", author).andWhere("reoccuring_event_view_id", reoccuringEventID);
            if(check.length == 0){
                throw Error("Specified Event doesnt exist or wasnt created by you");
            }
            const foreignForEvents = check[0].reoccuring_event_id;
            await db.table("reoccuring_event_view").del().where("created_by", author).andWhere("reoccuring_event_view_id", reoccuringEventID);
            const currDate = new Date();
            await db.table("events").del().where("reoccuring_event_id", foreignForEvents).andWhere("created_by", author).andWhereBetween("start_time", [currDate, this.lastWorkingDay]);
            console.log("Deleting events");
        } catch (error) {
            throw error;
        }   

        //side effect delete every event AFTER the current date..
        

    }

    async getEventInfo(eventID){
        try {
            const info = await db.select("event_name", "event_type", "start_time", "subject_id").from("events").where("event_id", eventID);
            return info[0];
        } catch (error) {
            throw error;
        }
    }

    async getReoccuringEventView(author){
        try {
            const query = await db.select("*").from("reoccuring_event_view").where("created_by", author);
            return query;
        } catch (error) {
            throw error;
        }
    }

    async getUpcomingEvents(minutes){
        try {
            const currTime = new Date();
            const rangeTime = new Date();
            rangeTime.setMinutes(currTime.getMinutes() + minutes)
            const query = await db.select("*").from("events").whereBetween("start_time", [currTime, rangeTime]).andWhere("notification_count", 0);
            await db.table("events").update({notification_count : 1}).whereBetween("start_time", [currTime, rangeTime]).andWhere("notification_count", 0);
            return query;
        } catch (error) {
            throw error;
        }
    }

}

const timetableDAOObj = new timetableDAO();
export default timetableDAOObj;