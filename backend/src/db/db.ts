import knex from "knex"
import knexconfig from "./knexfile.js"


//WTF is a dependency injection??? 
//Make this an environement variable instead of hardcoding it. 
const db = knex(knexconfig.development);

export default db;