import db from "../db/db";

//TODO Throw all errors to the controller layer the way it is rn is ridiculous

class authDAO{
    async emailAlreadyExists(email):Promise<boolean>{
        const query = await db.select("new_email").from("email_verification").where("new_email", email)
        return !(query.length==0);
    }

    async emailAlreadyExistsMain(email):Promise<boolean>{
        const query = await db.select("email").from("user_auth").where("email", email)
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

    async isCR(email){
        try {
            const query = await db.select('role').from('user_auth').where('email', email);
            return query[0];
        } catch (error) {
            throw error;
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

    async checkUserVerified(email):Promise<any>{
        try {
            const query = await db.select("is_verified").from("email_verification").where("new_email", email)
            return query[0];
        } catch (error) {
            console.log("Database Error")
            console.log(error.message)
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

    async createUser(email, password, firstName, lastName, rollNo, firstYear, branch, educationLevel, classRollNo, section){
        try {

            const entry = {
                email: email,
                password: password,
                first_name: firstName,
                last_name: lastName,
                roll_no: rollNo.toUpperCase(),
                branch: branch.toUpperCase(),
                section: section.toUpperCase(),
                first_year: firstYear,
                education_level: educationLevel,
                class_roll_no: classRollNo
            }

            await db.table("user_auth").insert(entry);
            


        } catch (error) {
            throw error;
        }
    }

    async getUser(email){
        try {
            const query = await db.select("*").from("user_auth").where("email", email);
            return query[0]
        } catch (error) {
            throw error;
        }
        
    }

    async storeUserPasswordResetToken(email, token){
        try {
            //TODO token expiry??
            await db.table("user_auth").update({pass_reset_token : token}).where("email", email)
        } catch (error) {
            
        }
        
        
    }

    async getUserPassResetToken(email){
        try {
            const query = await db.select("pass_reset_token").from("user_auth").where("email", email)
            return query[0];
        } catch (error) {
            throw error;
        }
    }

    async setCanChangePass(email, state:boolean){
        try {
            await db.table("user_auth").update({can_change_pass : state}).where("email", email)
        } catch (error) {
            throw error;
        }
    }

    async changePass(email, newPass){
        try {
            await db.table("user_auth").update({password: newPass, can_change_pass: false, pass_reset_token: null}).where("email", email);
        } catch (error) {
            throw error;
        }
    }

    async findCRID(userEmail){
        try {
            //some error handling is required for null returns (aka cases where the cr doesnt exist for a particular class)
            const query = await db.select('*').from('user_auth').where('email', userEmail) 
            const {branch, section, first_year} = query[0];
            const cr = await db.select('uid').from('user_auth').where('role', 'cr').andWhere('branch', branch).andWhere('section', section).andWhere('first_year', first_year);
            return cr[0];
        } catch (error) {
            
        }
    }

    async emailToUID(userEmail){
        try {
            const data = await db.select('uid').from('user_auth').where('email', userEmail);
            console.log(data)
            return data[0];
        } catch (error) {
            throw error;
        }
    }

    async saveTokenToEmail(email, token){
        try {
            const query = await db.select('notification_device_token', token).from('user_auth').where("email", email);
            console.log("IN DAO", token)
            let notArray = [];
            //some comparison logic to avoid pushing duplicate tokens into the array.
            notArray.push(token);
            await db.table("user_auth").update({notification_device_token: notArray}).where("email", email);
        } catch (error) {
            throw error;
        }
    }

    async getStudentsOfCR(uid){
        try {
            const query = await db.select("*").from("user_auth").where("uid", uid);
            const {branch, section, first_year} = query[0];
            const studentList = await db.select('uid', 'email', 'first_name', 'last_name', 'roll_no', 'notification_device_token').from('user_auth').where('role', 'student').andWhere('branch', branch).andWhere('section', section).andWhere('first_year', first_year);
            console.log(studentList);
            return studentList
        } catch (error) {
            throw error;
        }
    }

    async getStudentsOfCRInSubject(uid, subjectID){
        try {
            const query = await db.select("*").from("user_auth").where("uid", uid);
            const {branch, section, first_year} = query[0];
            const usersInSubject = await db.select("uid").from("user_subject_selection").where("subject_id", subjectID);
            const studentsList = [];
            for(let i of usersInSubject){
                const tempStud = await db.select('uid', 'email', 'first_name', 'last_name', 'roll_no', 'notification_device_token').from('user_auth').where('role', 'student').andWhere('branch', branch).andWhere('section', section).andWhere('first_year', first_year).andWhere('uid', i.uid);
                studentsList.push(tempStud[0]);
            }

            return studentsList;

        } catch (error) {
            throw error;
        }
    }

    async unsubscribeNotif(email, token){
        try {
            const query = await db.select('notification_device_token', token).from('user_auth').where("email", email);
            let notArray = [];
            for(let i of query){
                if(i.notification_device_token != token){
                    notArray.push(i.notifDeviceToken);
                }
            }
            await db.table("user_auth").update({notification_device_token: notArray}).where("email", email);
        } catch (error) {
            throw error;
        }
    }
}



export default new authDAO();