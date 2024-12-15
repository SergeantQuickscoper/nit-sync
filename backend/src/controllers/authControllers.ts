import authServices from "../services/authServices";

class authControllers{

    async signup(req, res){
        try {
            const {email} = req.body;
            if(!authServices.isValidEmail(email)){
                throw Error("An invalid email was entered!")
            }
            
            if(await authServices.alreadyExistsMain(email)){
                throw Error("This email has already been registered")
            }

            if(await authServices.alreadyExists(email)){
                authServices.resendOTP(email)
                res.send({
                    success: true,
                    message: "OTP has been resent!",
                })

                return;
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
            res.status(400).send({
                success: false,
                message : error.message
            })
        }
    }
    
    async resendOTP(req, res){
        try {
            const {email} = req.body;
            if(await authServices.checkUserVerified(email) == undefined){
                throw Error("User doesn't exist!");
            }
            if(await authServices.checkUserVerified(email)){
                throw Error("User is already verified");
            }
            authServices.resendOTP(email)
            res.send({
                success: true,
                message: "OTP has been resent!",
            })
        } catch (error) {
            res.status(400).send({
                success: false,
                message : error.message
            })
        }
    }


    async verifyOTP(req, res){
        try {
            //use JWT instead??
            const {email, otp} = req.body;
            if(await authServices.checkUserVerified(email)){
                throw Error("User is already verified");
            }

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
            res.status(400).send({
                success: false,
                message : error.message
            })
        }

    }

    async completeAccount(req, res){
        try {
            const {email, password, confirmPassword, firstName, lastName} = req.body;
            if(!(await authServices.checkUserVerified(email))){
                throw Error("User isn't verified")
            }

            //TODO implement password conditions like you cant have a space in the password? maybe do a client side check or something like that.
            if(password != confirmPassword){
                throw Error("Passwords do not match")
            }

            if(await authServices.alreadyExistsMain(email)){
                throw Error("User already exists!")
            }

            await authServices.createUser(email, password, firstName, lastName);

            const userJWT = await authServices.generateJWT(email)

            const {education_level, first_year, branch, section } = await authServices.getUser(email)

            let yearOrd = Number(first_year);
            let year;

            //TODO make this better ffs and move to services!!!
            // lmfao will have to update this every year?????
            if (2024 - yearOrd == 0){
                year = "1st"
            }
            else if(2024 - yearOrd == 1){
                year = "2nd"
            }
            else if(2024 - yearOrd == 2){
                year = "3rd"    
            }
            else if(2024 - yearOrd == 3){
                year = "4th"
            }

            res.send({
                success: true,
                message: "That's it you're all set! Your section has been detected as:  " + education_level + " " + year + " Year " + branch + " " + section,
                jwt: userJWT
            })


        } catch (error) {
            res.status(400).send({
                success: false, 
                message: error.message
            })
        }
    }

    async login(req, res){
        try {
            const {email, password} = req.body;
            if(!(await authServices.alreadyExistsMain(email))){
                throw Error("You haven't registered yet!")
            }

            if(!(await authServices.loginUser(email, password))){
                throw Error("Invalid credentials.")
            }

            const userJWT = await authServices.generateJWT(email)
            const isCR = await authServices.isCR(email);

            res.send({
                success: true,
                message: "Your credentials have been verified. Welcome " + email,
                jwt: userJWT,
                isCR: isCR
            })



        } catch (error) {
            res.status(400).send({
                success: false, 
                message: error.message
            })
        }

        
    }

    //ts shit takes time why??????????
    async reqPasswordResetOTP(req, res){
        try {
            const {email} = req.body

            if(!(await authServices.alreadyExistsMain(email))){
                throw Error("User isn't even registered yet.")
            }
    
            await authServices.handlePassResetToken(email);

            res.send({
                success: true,
                message: "A password reset email has been sent to your registered email address"
            })
        } catch (error) {
            res.status(400).send({
                success: false, 
                message: error.message
            })
        }
    
    }

    
    async verifyPassToken(req, res){
        try {
            const {email, otp} = req.body;
            
            if(!(await authServices.alreadyExistsMain(email))){
                throw Error("User isn't even registered yet.")
            }

            if(!(await authServices.verifyPassOTP(email, otp))){
                throw Error("Invalid password reset token")
            }

            res.send({
                success: "true", 
                message: "You are good to go to change the password."
            })

        } catch (error) {
            res.status(400).send({
                success: false, 
                message: error.message
            })
        }
    }

    async changePass(req, res){
        try {
            const {email, newPass, confNewPass} = req.body;

            if(!newPass || !confNewPass || !email){
                throw Error("Invalid Input, requires an email, newPass and confNewPass")
            }
            
            if(newPass != confNewPass){
                throw Error("The passwords do not match!")
            }

            await authServices.changePass(email , newPass);

            res.send({
                success: true,
                message: "Your password is changed."
            })

        } catch (error) {

            res.status(400).send({
                success: false, 
                message: error.message
            })

        }
    }

    

}

const authControllerObj = new authControllers()

export default authControllerObj;