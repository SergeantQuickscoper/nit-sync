import timetableDAO from "../dao/timetableDAO";
import authDAO from "../dao/authDAO";
import jwt, { JwtPayload } from "jsonwebtoken";
import cron from "node-cron"
import { connectedUsers } from "../routes/socketRoutes";
import { io } from "../index"; //socketIO object
import { admin } from "../index"; // firebase admin sdk objedt
class timetableServices{

    async validateCRandGetID(token){
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
            
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

    async getCRsStudents(uid){
        //gets information that seemed necessary for notifications
        const studentsList = await authDAO.getStudentsOfCR(uid);
        return studentsList;

    }

    async getCRsStudentsInSubject(uid, subjectID){
        const studentsList = await authDAO.getStudentsOfCRInSubject(uid, subjectID);
        return studentsList;

    }

    async createSubject(token, subjectName, description){
        try {

            const uid = await this.validateCRandGetID(token)

            //query create the mentioned subject in the afforementioned class
            await timetableDAO.createSubject(uid, subjectName, description);

            //emit a server-update event to all connectedUsers in the class (CURRENTLY SENDS TO EVERYONE NEEDS FIX BEFORE PROD)
            io.emit("subjectUpdate")
            //push notifications to users of the CR
            const studentsList =  await this.getCRsStudents(uid);
            const tokensList = [];
            for(let i of studentsList){
                if(i.notification_device_token){
                    for(let j of i.notification_device_token) tokensList.push(j);
                }
            }

            console.log("TOKENS LIST: ", tokensList)
            await admin.messaging().sendEachForMulticast({
                tokens: tokensList,
                notification: {
                    title: JSON.stringify("New Subject Added: " + subjectName),
                    body: JSON.stringify("If you are part of this subject make sure to click join to recieve updates on it")
                },
                data: {
                  //foreground payload
                },
                apns: {
                  payload: {
                    aps: {
                      // Required for background/quit data-only messages on iOS
                      // Note: iOS frequently will receive the message but decline to deliver it to your app.
                      //           This is an Apple design choice to favor user battery life over data-only delivery
                      //           reliability. It is not under app control, though you may see the behavior in device logs.
                      'content-available': true,
                      // Required for background/quit data-only messages on Android
                      priority: 'high',
                    },
                  },
                },
              });


        } catch (error) {
            throw error;
        }
    }

    async getSubjectsByClass(userJWT){
        try {
            const decoded = jwt.verify(userJWT, process.env.JWT_SECRET) as JwtPayload; 
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

    async getReoccuringEventView(token){
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
            const {uid} = await authDAO.findCRID(decoded.email);
            const query = await timetableDAO.getReoccuringEventView(uid)
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
            io.emit("eventUpdate")

            //push notifications to all subject users CREATE NEW FUNCTION FOR GETTING CRS STUDENTS WITHIN A SUBJECT
            const studentsList =  await this.getCRsStudentsInSubject(uid, subjectID);
            const tokensList = [];
            for(let i of studentsList){
                if(i.notification_device_token){
                    for(let j of i.notification_device_token) tokensList.push(j);
                }
            }
            const startDate = new Date(startTime)
            console.log("TOKENS LIST: ", tokensList)
            await admin.messaging().sendEachForMulticast({
                tokens: tokensList,
                notification: {
                    title: "New " + eventType + ": " + eventName,
                    body: "On" + startDate.toDateString()
                },
                data: {
                  //foreground payload
                },
                apns: {
                  payload: {
                    aps: {
                      // Required for background/quit data-only messages on iOS
                      // Note: iOS frequently will receive the message but decline to deliver it to your app.
                      //           This is an Apple design choice to favor user battery life over data-only delivery
                      //           reliability. It is not under app control, though you may see the behavior in device logs.
                      'content-available': true,
                      // Required for background/quit data-only messages on Android
                      priority: 'high',
                    },
                  },
                },
              });



        } catch (error) {
            throw error;
        }
    }

    async joinSubject(token, subjectID){
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
            const {uid} = await authDAO.emailToUID(decoded.email) ;
            await timetableDAO.joinSubject(uid, subjectID);
        } catch (error) {
            throw error;
        }
        
    }

    async attendEvent(token, event_id){
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
            const {uid} = await authDAO.emailToUID(decoded.email) ;
            await timetableDAO.attendEvent(uid, event_id);
        } catch (error) {
            throw error;
        }
    }

    async getEventsOnDay(token, day){
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
            const {uid} = await authDAO.emailToUID(decoded.email) ;
            const userSubjectList = await timetableDAO.getSubjectsUserJoined(uid);
            let subjectEventObj = {};
            let count  = 0;
            for(let i of userSubjectList){
                const subjectName = userSubjectList[count].subject_id;
                subjectEventObj[subjectName] = await timetableDAO.getEventsForASubjectOnDay(subjectName, day)
                count++;
            }

            return subjectEventObj;

        } catch (error) {
            throw error;
        }
        
    }

    async getTotalEventsOfSubjectsUserIsPartOf(token){
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
            const {uid} = await authDAO.emailToUID(decoded.email);
            const userSubjectList = await timetableDAO.getSubjectsUserJoined(uid);
            let subjectEventObj = {};
            let count  = 0;
            for(let i of userSubjectList){
                const subjectName = userSubjectList[count].subject_id;
                subjectEventObj[subjectName] = await timetableDAO.getEventsForASubject(subjectName)
                count++;
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

            //emit a server-update event to all connectedUsers in the class
            io.emit("subjectUpdate")

        } catch (error) {
            
        }
    }

    async deleteEvent(token, subjectID){
        try {
            const uid = await this.validateCRandGetID(token)
            await timetableDAO.deleteEventByID(uid, subjectID)
            io.emit("eventUpdate")

            const studentsList =  await this.getCRsStudentsInSubject(uid, subjectID);
            const eventInfo = await timetableDAO.getEventInfo(subjectID);
            const tokensList = [];
            for(let i of studentsList){
                if(i.notification_device_token){
                    for(let j of i.notification_device_token) tokensList.push(j);
                }
            }
            console.log("TOKENS LIST: ", tokensList)
            const startTime = new Date(eventInfo.start_time)
            await admin.messaging().sendEachForMulticast({
                tokens: tokensList,
                notification: {
                    title: eventInfo.event_name + eventInfo.event_type + "at" + startTime.toLocaleString('en-GB')  + " has been cancelled!",
                    body: "Woohoo!"
                },
                data: {
                  //foreground payload
                },
                apns: {
                  payload: {
                    aps: {
                      // Required for background/quit data-only messages on iOS
                      // Note: iOS frequently will receive the message but decline to deliver it to your app.
                      //           This is an Apple design choice to favor user battery life over data-only delivery
                      //           reliability. It is not under app control, though you may see the behavior in device logs.
                      'content-available': true,
                      // Required for background/quit data-only messages on Android
                      priority: 'high',
                    },
                  },
                },
              });
            
        } catch (error) {
            throw error;
        }
    }

    async leaveSubject(token, subject_id){
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
            const {uid} = await authDAO.emailToUID(decoded.email);
            await timetableDAO.leaveSubject(uid, subject_id);
        } catch (error) {
            throw error;
        }
    }

    async leaveEvent(token, event_id){
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
            const {uid} = await authDAO.emailToUID(decoded.email);
            await timetableDAO.deleteEventByID(uid, event_id);
        } catch (error) {
            throw error;
        }
    }

    async getJoinedSubjects(token){
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
            const {uid} = await authDAO.emailToUID(decoded.email);
            return await timetableDAO.getJoinedSubjects(uid);
        } catch (error) {
            throw error;
        }
    }

    async getAttendedEvents(token){
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
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
            io.emit("reoccuringEventUpdate")
        } catch (error) {
            throw error;
        }
    }

    async deleteReoccuringEvent(token, reoccuring_event_id){
        try {
            const uid= await this.validateCRandGetID(token);
            await timetableDAO.deleteReoccuringEvent(uid, reoccuring_event_id)
            io.emit("reoccuringEventUpdate")
        } catch (error) {
            throw error;
        }
    }
    //call in main
    notifCronJob(){
        cron.schedule("*/5 * * * *", async() => {
            //query events and get events to send notifications for
            const eventsList = await timetableDAO.getUpcomingEvents(5); //5 minutes for now

            //for each event get users and send required notification
            for(let k of eventsList){
                const studentsList =  await this.getCRsStudentsInSubject(k.created_by, k.subject_id);
                const tokensList = [];
                for(let i of studentsList){
                    if(i.notification_device_token){
                        for(let j of i.notification_device_token) tokensList.push(j);
                    }
                }
                //could do some math here to track how much time left until the class
                const startDate = new Date(k.startTime)
                console.log("TOKENS LIST: ", tokensList)
                await admin.messaging().sendEachForMulticast({
                    tokens: tokensList,
                    notification: {
                        title: "You have an upcoming class",
                        body: k.event_name + " " + k.event_type +  " " + startDate.toTimeString().split(' ')[0]
                    },
                    data: {
                    //foreground payload
                    },
                    apns: {
                    payload: {
                        aps: {
                        // Required for background/quit data-only messages on iOS
                        // Note: iOS frequently will receive the message but decline to deliver it to your app.
                        //           This is an Apple design choice to favor user battery life over data-only delivery
                        //           reliability. It is not under app control, though you may see the behavior in device logs.
                        'content-available': true,
                        // Required for background/quit data-only messages on Android
                        priority: 'high',
                            },
                        },
                        },
                    });
                }
        })
    }
}

const timetableServicesObj = new timetableServices();
export default timetableServicesObj;