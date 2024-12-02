import timetableServices from "../services/timetableServices";

class timeTableControllers{
    async createSubject(req, res){
        try {
            const {jwt, subjectName, description} = req.body;
            if(!jwt || !subjectName || !description){
                throw Error("Not all parameters have been provided");
            }

            await timetableServices.createSubject(jwt, subjectName, description)
            res.send({
                sucess: true, 
                message: subjectName + " has been successfully created"
            })

        } catch (error) {
            res.status(400).send({
                success: false,
                message: error.message
            })
        }
        
    }

    async getSubjects(req, res){
        try {
            const {jwt} = req.body;
            if(!jwt){
                throw Error("JWT not provided")
            }

            const subjectList = await timetableServices.getSubjectsByClass(jwt)

            res.send({
                sucess: true, 
                message: "Subject list sucessfully fetched",
                subjectArray: subjectList
            })

        } catch (error) {
            res.status(400).send({
                success: false,
                message: error.message
            })
        }
    }

    async getTotalEventsOfSubjectsUserIsPartOf(req, res){
        try {
            const {jwt} = req.body;
            if(!jwt){
                throw Error("No jwt")
            }
            const subjectEventsObj = await timetableServices.getTotalEventsOfSubjectsUserIsPartOf(jwt)
            console.log(subjectEventsObj)
            res.send({
                success: true,
                message: "Successfully fetched available events",
                subjectEventsObject: subjectEventsObj
            })
            
        } catch (error) {
            res.status(400).send({
                success: false,
                message: error.message
            })
        }
    }

    async joinSubject(req, res){
        try {
            const {jwt, subjectID} = req.body;

            if(!jwt || !subjectID){
                throw Error("Not all parameters have been provided");
            }

            await timetableServices.joinSubject(jwt, subjectID);

            res.send({
                sucess: true, 
                message: "Subject has been joined",
            })

        } catch (error) {
            res.status(400).send({
                success: false,
                message: error.message
            })
        }
    }

    async attendEvent(req, res){
        try {
            const {jwt, eventID} = req.body;

            if(!jwt || !eventID){
                throw Error("Not all parameters have been provided");
            }

            await timetableServices.attendEvent(jwt, eventID);

            res.send({
                sucess: true, 
                message: "Event has been marked as attended",
            })
            
        } catch (error) {
            res.status(400).send({
                success: false,
                message: error.message
            })
        }
    }

    async createEvent(req, res){
        try {
            const {jwt, eventName, description, subjectID, eventType, startTime, endTime} = req.body;
            //check for if all conditions not passed

            await timetableServices.createEvent(jwt, eventName, description, subjectID, eventType, startTime, endTime);

            res.send({
                success: true,
                message: "Event succesffully created"
            })
        } catch (error) {
            res.status(400).send({
                success: false, 
                message: error
            })
        }
    }

    async deleteSubject(req, res){
        try {
            const {jwt, subjectID} = req.body;
            await timetableServices.deleteSubject(jwt, subjectID)

            res.send({
                success: true,
                message: "Subject has been successfully deleted"
            })

        } catch (error) {
            res.status(400).send({
                success: false, 
                message: error.message
            })
        }
    }

    async deleteEvent(req, res){
        try {
            const {jwt, eventID} = req.body;
            await timetableServices.deleteEvent(jwt, eventID)

            res.send({
                success: true,
                message: "Event has been successfully deleted"
            })

        } catch (error) {
            res.status(400).send({
                success: false, 
                message: error.message
            })
        }
    }

    async leaveSubject(req, res){
        try {
            const {jwt, subjectID} = req.body;
            await timetableServices.leaveSubject(jwt, subjectID)

            res.send({
                success: true,
                message: "You have left the subject"
            })

        } catch (error) {
            res.status(400).send({
                success: false, 
                message: error.message
            })
        }
    }

    async leaveEvent(req, res){
        try {
            const {jwt, eventID} = req.body;
            await timetableServices.leaveEvent(jwt, eventID)

            res.send({
                success: true,
                message: "You have left the event"
            })

        } catch (error) {
            res.status(400).send({
                success: false, 
                message: error.message
            })
        }
    }

}

const timetableControllerObj = new timeTableControllers()

export default timetableControllerObj;