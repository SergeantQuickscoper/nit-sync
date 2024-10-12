import authDAO from "../dao/authDAO";
import crypto from "crypto"
import jwt from "jsonwebtoken"

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

    async generateEmailVerifToken(){
        const otp = crypto.randomInt(100000, 999999)
        return otp;
    }

    generateJWT(email){
        // TODO complete this out or use sessions
        const token = jwt.sign()
    }

    async createUserPreVerify(email, otp){
        // Verification email sending logic
        await authDAO.createPreVerificationUser(email, otp)
    }
}

const authServicesObj = new authServices ();

export default authServicesObj;