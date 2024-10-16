import authDAO from "../dao/authDAO";
import crypto from "crypto"
import jwt from "jsonwebtoken"
import transporter from "../utils/nodemailerTransporter";

//TODO Throw all errors to the controller layer the way it is rn is ridiculous
class authServices{

    isValidEmail(email):boolean{
        if(email.split("@")[1] == "student.nitw.ac.in"){
            return true;
        }

        return false;
    }

    async alreadyExists(email):Promise<boolean>{
        //TODO call function from DAO to check if email is in data base
        const result = await authDAO.emailAlreadyExists(email)
        return result;
    }

    generateEmailVerifToken():number{
        const otp = crypto.randomInt(100000, 999999)
        return otp;
    }

    generateJWT(userEmail):any{
        const token = jwt.sign({email: userEmail}, process.env.JWT_SECRET)
        return token;
    }

    async sendOTPmail(email, otp){
        try {
            const info = await transporter.sendMail({
                from: '"Don Chacko" <dr24csb0b20@student.nitw.ac.in>',
                to: email, 
                subject: "Verify your NITSync Email", 
                html: "<p>Your NITSync OTP is: <b>" + otp + "</b></p>", 
              });
        } catch (error) {
            console.log(error.message)
        }
        
    }

    async createUserPreVerify(email, otp){
        try {
            this.sendOTPmail(email, otp)
            await authDAO.createPreVerificationUser(email, otp)

        } catch (error) {
            console.log(error.message)
        }
        
    }

    async resendOTP(email){
        try {
            const {verification_token} = await authDAO.getUserOTP(email)
            this.sendOTPmail(email, verification_token)
        } catch (error) {
            console.log("Error resending OTP")
        }
    }
    async verifyUser(email, otp):Promise<boolean>{
        try {
            const {verification_token} = await authDAO.getUserOTP(email)
            if(otp == verification_token){
                authDAO.verifyUser(email)
                return true;
            }
            else{
                return false;
            }

        } 
        catch (error) 
        {
            console.log("Error setting user to verified")
        }
    }

    async checkUserVerified(email):Promise<boolean>{
        try {
          const {is_verified} = await authDAO.checkUserVerified(email);
          return is_verified;
        } catch (error) {
            console.log("Error checking verification (user probably doesnt exist)")
        }
          
    }
}

const authServicesObj = new authServices ();

export default authServicesObj;