import authServices from "../services/authServices";

class authControllers{
    helloWorld(req, res){
        res.send("Hello World!")
    }

    async signup(req, res){
        try {
            const {email} = req.body;
            if(!authServices.isValidEmail(email)){
                throw Error("An invalid email was entered!")
            }
            

            if(await authServices.alreadyExists(email)){
                throw Error("The entered email is already registered!")
            }

            res.send("The Email you have sent is: " + email)
        } catch (error) {
            res.status(400).send(error.message)
        }
    }
}

const authControllerObj = new authControllers()

export default authControllerObj;