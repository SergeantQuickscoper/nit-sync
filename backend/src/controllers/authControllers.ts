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

            const otp = await authServices.generateEmailVerifToken()
        

            // TODO Check for Error here too ( though it will guaranteed work if the previous steps are correct)
            await authServices.createUserPreVerify(email, otp)

            const userJWT = authServices.generateJWT(email);

            res.send({
                success: true,
                message: "The email has been registered, and is awaiting verification",
                jwt: userJWT
            })
            
        } catch (error) {
            res.status(400).send({message : error.message})
        }
    }
    
    async resendOTP(req, res){
        try {
            
        } catch (error) {
            
        }
    }


    async verifyOTP(req, res){
        try {
            //use JWT instead??
            const {email, otp} = req.body;
            if(await authServices.verifyUser(email, otp)){
                res.send({
                    success: true,
                    message: "The email " + email + " has sucessfully been verified!"
                });
            }
            else{
                throw Error("Invalid OTP entered");
            }

            
        } catch (error) {
            res.status(400).send({message : error.message})
        }

    }

    async completeAccount(req, res){
    }
}

const authControllerObj = new authControllers()

export default authControllerObj;