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

    async isCR(email){
        try {
            const {role} = await authDAO.isCR(email);
            if(role.toLowerCase() == 'cr'){
                return true;
            }
            else{
                return false;
            }
        } catch (error) {
            throw error;
        }
    }       

    //bad code quality combine two funcs in future?
    async alreadyExistsMain(email){
        const result = await authDAO.emailAlreadyExistsMain(email)
        return result;
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

    async sendOTPmail(email, otp, subject){
        try {
            const info = await transporter.sendMail({
                from: '"Don Chacko" <dr24csb0b20@student.nitw.ac.in>',
                to: email, 
                subject: subject, 
                html: "<p>Your NITSync OTP is: <b>" + otp + "</b></p>", 
              });
        } catch (error) {
            console.log(error.message)
        }
        
    }

    async createUserPreVerify(email, otp){
        try {
            this.sendOTPmail(email, otp, "Verify your NITSync Email")
            await authDAO.createPreVerificationUser(email, otp)

        } catch (error) {
            console.log(error.message)
        }
        
    }

    async resendOTP(email){
        try {
            const {verification_token} = await authDAO.getUserOTP(email)
            this.sendOTPmail(email, verification_token, "Verify your NITSync Email")
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

    //TODO bcrypt this shit 
    async createUser(email, password, firstName, lastName){
        try {
            const rollNo = (email.split("@")[0]).slice(2);
            const firstYear = "20" + rollNo.slice(0, 2);
            const branch = rollNo.slice(2, 4); //branches in roll no sucks so will have to probably maeke a switch case for this at some point 
            const section = rollNo[6];
            let educationLevel; //i hate this

            if(rollNo[4].toLowerCase() == "b"){
                educationLevel = "B. Tech"
            }
            else{
                educationLevel = "Not B. Tech" // Update in future for M. Tech and PhD
            }
            const classRollNo = rollNo.slice(-2)

            
            await authDAO.createUser(email, password, firstName, lastName, rollNo, firstYear, branch, educationLevel, classRollNo, section);

        } catch (error) {
            throw error;
        }
    }

    async handlePassResetToken(email){
        try {
            const token = await this.generateEmailVerifToken();
            await authDAO.storeUserPasswordResetToken(email, token);
            await this.sendOTPmail(email, token, "Reset Password OTP");
        } catch (error) {
            throw error;
        }
        
    }

    async getUser(email){
        try {

            return await authDAO.getUser(email);

        } catch (error) {
            throw error;
        }
        return await authDAO.getUser(email);
    }

    async loginUser(email, enteredPass):Promise<boolean>{
        try {
            const {password} = await this.getUser(email);


            if(enteredPass != password){
                return false;
            }

            return true;

        } catch (error) {
            throw error;
        }

    }

    async verifyPassOTP(email, otp){
        try {
            const {pass_reset_token} = await authDAO.getUserPassResetToken(email);
            //TODO expiry logic 
            if(!pass_reset_token){
                throw Error("No password reset token requested!")
            }

            if(otp == pass_reset_token){
                authDAO.setCanChangePass(email, true)
                return true;
            }
            else{
                return false;
            }

        } catch (error) {
            throw error;
        }
        
    }

    async changePass(email, pass){
        try {
            
            const {can_change_pass} = await authDAO.getUser(email);
            
            if(can_change_pass == false){
                throw Error("User is not allowed to change pass")
            }

            await authDAO.changePass(email, pass)


        } catch (error) {
            throw error;
        }
    }

    async getUserData(token){
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            return await authDAO.getUser(decoded.email);
        } catch (error) {
            throw error;
        }
    }
    
}



const authServicesObj = new authServices ();

export default authServicesObj;