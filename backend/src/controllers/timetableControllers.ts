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

    async getEventsInSubject(req, res){

    }
}

const timetableControllerObj = new timeTableControllers()

export default timetableControllerObj;