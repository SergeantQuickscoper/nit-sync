import timetableServices from "../services/timetableServices";

class timeTableControllers{
    async createSubject(req, res){
        try {
            const {jwt, subjectName, description} = req.body;
            if(!jwt || !subjectName || !description){
                throw Error("Not all parameters have been provided");
            }

            await timetableServices.createSubject(jwt, subjectName, description)
            await timetableServices.getSubjectsByClass("test2@student.nitw.ac.in");
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
}

const timetableControllerObj = new timeTableControllers()

export default timetableControllerObj;