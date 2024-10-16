import db from "../db/db";

class authDAO{
    async emailAlreadyExists(email):Promise<boolean>{
        const query = await db.select("new_email").from("email_verification").where("new_email", email)
        return !(query.length==0);
    }

    async createPreVerificationUser(email, otp){
        
        const currentTime = new Date();
        const verificationExp = new Date(currentTime.getTime() + 60 * 60 * 1000) // 1 hour from current time 
        
        const entry = {
            new_email : email,
            verification_token : otp,
            verification_token_expires_at : verificationExp.toISOString(), 
            is_verified : false
        }

        try {
            await db.table("email_verification").insert(entry);
        } catch (error) {
            //TODO make this error handling better 
            console.log("Database Error")
        }
        

    }

    async getUserOTP(email):Promise<any>{
        try {
            //check for if email doesnt exist???
            const query = await db.select("verification_token").from("email_verification").where("new_email", email);
            return query[0];

        } catch (error) {
            console.log("Database Error")
        }
        
    }

    async verifyUser(email){
        try {

            await db.table("email_verification").update({is_verified: true}).where("new_email", email);

        } catch (error) {
            console.log("Database Error")
            console.log(error.message)
        }
    }

}

export default new authDAO();