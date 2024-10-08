import authDAO from "../dao/authDAO";

class authServices{

    isValidEmail(email):boolean{
        console.log(email.split("@"))
        if(email.split("@")[1] == "student.nitw.ac.in"){
            return true;
        }

        return false;
    }

    async alreadyExists(email):Promise<boolean>{
        //TODO call function from DAO to check if email is in data base
        const result = await authDAO.emailAlreadyExists(email)
        console.log(result)
        return result;
    }

}

const authServicesObj = new authServices ();

export default authServicesObj;