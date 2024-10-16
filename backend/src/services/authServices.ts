import authDAO from "../dao/authDAO";
import crypto from "crypto"
import jwt from "jsonwebtoken"
import transporter from "../utils/nodemailerTransporter";
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

    async createUserPreVerify(email, otp){
        try {
            const info = await transporter.sendMail({
                from: '"Don Chacko" <dr24csb0b20@student.nitw.ac.in>', // sender address
                to: email, 
                subject: "Verify your NITSync Email", // Subject line
                html: "<p>Your NITSync OTP is: <b>" + otp + "</b></p>", // html body
              });
            
            await authDAO.createPreVerificationUser(email, otp)
        } catch (error) {
            throw Error(error.message)
        }
        
    }
}

const authServicesObj = new authServices ();

export default authServicesObj;