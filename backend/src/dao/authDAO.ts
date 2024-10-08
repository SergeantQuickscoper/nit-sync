import db from "../db/db";

class authDAO{
    async emailAlreadyExists(email):Promise<boolean>{
        const query = await db.select("email").from("user_auth").where("email", email)

        return !(query.length==0);
    }

}

export default new authDAO();